// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import styled from '@emotion/styled'

// ** components
import RequestDetailCard from './components/detail/request-detail'
import FileItem from '@src/@core/components/fileItem'
import CanceledReasonModal from './components/modal/canceled-reason-modal'
import { StyledNextLink } from '@src/@core/components/customLink'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import CancelRequestModal from './components/modal/cancel-request-modal'

// ** apis
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { updateRequest } from '@src/apis/requests/client-request.api'

// ** hooks
import { useRouter } from 'next/router'
import { MouseEvent, useContext, useEffect, useMemo, useState } from 'react'
import useModal from '@src/hooks/useModal'
import { useMutation, useQueryClient } from 'react-query'

// ** values
import { S3FileType } from '@src/shared/const/signedURLFileType'

// ** toast
import { toast } from 'react-hot-toast'

// ** permission
import { lpm_request } from '@src/shared/const/permission-class'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { getCurrentRole } from '@src/shared/auth/storage'

// ** types
import { RequestDetailType } from '@src/types/requests/detail.type'
import { FileType } from '@src/types/common/file.type'
import { RequestStatusType } from '@src/types/requests/common.type'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { BookOnline } from '@mui/icons-material'
import { getStaleDuration, hasObjValues } from '@src/shared/helpers/data.helper'

export default function RequestDetail() {
  const router = useRouter()
  const { id } = router.query

  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()

  const User = new lpm_request(auth.getValue().user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  const isCreatable = ability.can('create', User)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const MAXIMUM_FILE_SIZE = FILE_SIZE.QUOTE_SAMPLE_FILE

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { data, dataUpdatedAt } = useGetClientRequestDetail(Number(id))

  // 변경된 linkedQuote, linkedOrder 정보를 캐시로 인해 못가져오는 케이스가 있어 컴포넌트 전역에 refetch를 추가함
  // 데이터가 패칭된지 2초 ~ 60초 사이일 경우에만 refetch 처리를 하고 그 외에는 컴포넌트 로딩시 리엑트 쿼리가 데이터를 가져오도록 함
  useEffect(() => {
    const staleDuration = getStaleDuration(dataUpdatedAt)
    if (staleDuration < 60 * 1000 && staleDuration > 2000) {
      queryClient.invalidateQueries({ queryKey: 'request/client/detail' })
    }
  }, [])

  const fileSize = useMemo(() => {
    if (data?.sampleFiles) {
      return data.sampleFiles.reduce(
        (res, { fileSize }) => (res += fileSize),
        0,
      )
    }
    return 0
  }, [data])

  const downloadFile = (file: FileType) => {
    const url = file?.file?.substring(1) || ''
    getDownloadUrlforCommon(S3FileType.REQUEST, url).then((res: any) => {
      fetch(res.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.name}`
          document.body.appendChild(a)
          a.click()
          setTimeout((_: any) => {
            window.URL.revokeObjectURL(url)
          }, 60000)
          a.remove()
        })
        .catch(err => onError())
    })
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  function downloadAllFiles() {
    const sampleFiles = data?.sampleFiles
    if (sampleFiles?.length) {
      sampleFiles.forEach(file => {
        const fileParam: FileType = {
          name: file.fileName,
          file: file.filePath,
          size: file.fileSize,
        }
        downloadFile(fileParam)
      })
    }
  }

  const cancelMutation = useMutation(
    ({
      id,
      form,
    }: {
      id: number
      form: Omit<RequestDetailType, 'lsp'> & { lspId: string }
    }) => updateRequest(id, form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'request/client/detail' })
        queryClient.invalidateQueries({ queryKey: 'request/client/list' })
      },
      onError: () => onError(),
    },
  )

  function onStatusChange(status: RequestStatusType) {
    openModal({
      type: 'statusChange',
      children: (
        <CustomModal
          //title='Are you sure you want to change the status to [In preparation]? It cannot be unchanged.'
          title={
            <Box>
              Are you sure you want to change the status to
              <Typography
                variant='body2'
                fontWeight={600}
                component={'span'}
                fontSize={16}
              >
                &nbsp;[In preparation]
              </Typography>
              ? It cannot be unchanged.
            </Box>
          }
          onClose={() => closeModal('statusChange')}
          onClick={() => {
            if (data !== undefined) {
              cancelMutation.mutate({
                id: Number(id),
                form: {
                  ...data,
                  lspId: data.lsp.id,
                  status: status,
                },
              })
            }
            closeModal('statusChange')
          }}
          vary='successful'
          rightButtonText='Change'
        />
      ),
    })
  }

  function mutateCancel(form: { option: string; reason?: string }) {
    closeModal('cancelRequest')
    if (data !== undefined) {
      cancelMutation.mutate({
        id: Number(id),
        form: {
          ...data,
          lspId: data.lsp.id,
          status: 'Canceled',
          canceledReason: {
            from: 'lsp',
            reason: form.option,
            message: form.reason ?? '',
          },
        },
      })
    }
  }

  function openReasonModal() {
    openModal({
      type: 'reason',
      children: (
        <Dialog open={true} onClose={() => closeModal('reason')}>
          <DialogContent style={{ width: '360px', padding: '20px' }}>
            <CanceledReasonModal
              data={data?.canceledReason}
              onClose={() => closeModal('reason')}
              onClick={mutateCancel}
            />
          </DialogContent>
        </Dialog>
      ),
    })
  }

  function onCancelRequest() {
    openModal({
      type: 'cancelRequest',
      children: (
        <Dialog open={true} onClose={() => closeModal('cancelRequest')}>
          <DialogContent style={{ width: '482px', padding: '20px' }}>
            <CancelRequestModal
              onClose={() => closeModal('cancelRequest')}
              onClick={mutateCancel}
            />
          </DialogContent>
        </Dialog>
      ),
    })
  }

  function isNotCancelable() {
    if (!isDeletable) return true
    const status = data?.status
    return (
      status === 'Changed into order' ||
      status === 'Changed into quote' ||
      status === 'Canceled'
    )
  }

  function createNextStep(type: 'quote' | 'order') {
    switch (type) {
      case 'quote':
        openModal({
          type: 'requestNextStep',
          children: (
            <CustomModal
              title='Are you sure you want to create a quote with this request?'
              onClose={() => closeModal('requestNextStep')}
              onClick={() => {
                router.push({
                  pathname: `/quotes/add-new/`,
                  query: { requestId: id },
                })
                closeModal('requestNextStep')
              }}
              vary='successful'
              rightButtonText='Create'
            />
          ),
        })

        return
      case 'order':
        openModal({
          type: 'requestNextStep',
          children: (
            <CustomModal
              title='Are you sure you want to create an order with this request?'
              onClose={() => closeModal('requestNextStep')}
              onClick={() => {
                router.push({
                  pathname: `/orders/add-new/`,
                  query: { requestId: id },
                })
                closeModal('requestNextStep')
              }}
              vary='successful'
              rightButtonText='Create'
            />
          ),
        })

        return
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{ background: '#fff', borderRadius: '8px', padding: '16px' }}
        >
          <Box display='flex' alignItems='center' gap='8px'>
            <Box display='flex' alignItems='center' gap='8px'>
              <IconButton onClick={() => router.push('/quotes/lpm/requests/')}>
                <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
              </IconButton>
              <img
                src='/images/icons/request-icons/airplane.png'
                aria-hidden
                alt='request detail'
              />
              <Typography variant='h6'>{data?.corporationId}</Typography>
            </Box>
            {data?.linkedQuote || data?.linkedOrder ? (
              <div>
                <IconButton
                  aria-label='more'
                  aria-haspopup='true'
                  onClick={handleClick}
                >
                  <Icon icon='mdi:dots-vertical' />
                </IconButton>
                <Menu
                  keepMounted
                  id='link menu'
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  open={Boolean(anchorEl)}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                    },
                  }}
                >
                  {data?.linkedQuote && (
                    <MenuItem onClick={handleClose}>
                      <StyledNextLink
                        href={`/quotes/detail/${data?.linkedQuote.id}`}
                        color='secondary'
                      >
                        Linked quote : <u>{data?.linkedQuote.corporationId}</u>
                      </StyledNextLink>
                    </MenuItem>
                  )}
                  {data?.linkedOrder && (
                    <MenuItem onClick={handleClose}>
                      <StyledNextLink
                        href={`/orders/order-list/detail/${data?.linkedOrder.id}`}
                        color='black'
                      >
                        Linked order : <u>{data?.linkedOrder.corporationId}</u>
                      </StyledNextLink>
                    </MenuItem>
                  )}
                </Menu>
              </div>
            ) : null}
          </Box>
          <Box display='flex' gap='16px'>
            <Button
              variant='outlined'
              onClick={() => createNextStep('quote')}
              disabled={
                data?.status === 'Changed into quote' ||
                data?.status === 'Canceled' ||
                hasObjValues(data?.linkedQuote)
              }
            >
              Create quote
            </Button>
            <Button
              variant='outlined'
              onClick={() => createNextStep('order')}
              disabled={
                data?.status === 'Changed into order' ||
                data?.status === 'Canceled' ||
                hasObjValues(data?.linkedOrder)
              }
            >
              Create order
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <RequestDetailCard
            data={data}
            user={auth.getValue().user}
            currentRole={currentRole}
            openReasonModal={openReasonModal}
            onStatusChange={onStatusChange}
          />
        </Card>
        {currentRole?.type === 'General' ? null : (
          <Grid item xs={4} mt='24px'>
            <Card sx={{ padding: '24px' }}>
              <Button
                fullWidth
                variant='outlined'
                color='error'
                disabled={isNotCancelable()}
                onClick={onCancelRequest}
              >
                Cancel this request
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
      <Grid item xs={3}>
        <Box display='flex' flexDirection='column' gap='24px'>
          <Box sx={{ width: '100%' }}>
            <Card>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Box display='flex' justifyContent='space-between'>
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    Sample files
                  </Typography>
                  <Typography variant='body2'>
                    {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
                {!data?.sampleFiles?.length ? (
                  '-'
                ) : (
                  <Button
                    variant='outlined'
                    fullWidth
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles()}
                  >
                    Download all
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  padding: '0 20px',
                  overflow: 'scroll',
                  marginBottom: '12px',
                  height: '306px',

                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {data?.sampleFiles?.map(
                  (file: {
                    id?: number
                    filePath: string
                    fileName: string
                    fileExtension: string
                    fileSize: number
                  }) => {
                    return (
                      <Box key={file.id}>
                        <FileItem
                          file={{
                            name: file.fileName,
                            size: file?.fileSize,
                            file: file.filePath,
                          }}
                          onClick={downloadFile}
                        />
                      </Box>
                    )
                  },
                )}
              </Box>
            </Card>
          </Box>
          <Card sx={{ padding: '24px' }}>
            <Typography fontWeight='bold'>Notes</Typography>
            <Typography variant='body2' mt='24px'>
              {data?.notes ? data?.notes : '-'}
            </Typography>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

RequestDetail.acl = {
  subject: 'lpm_request',
  action: 'read',
}
