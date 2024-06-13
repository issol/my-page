// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import parse from 'html-react-parser'

// ** components
import RequestDetailCard from './components/detail/request-detail'
import FileItem from '@src/@core/components/fileItem'
import CancelRequestModal from './components/modal/cancel-request-modal'
import CanceledReasonModal from './components/modal/canceled-reason-modal'
import { StyledNextLink } from '@src/@core/components/customLink'

// ** apis
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import { getDownloadUrlforCommon } from '@src/apis/common.api'

// ** hooks
import { useRouter } from 'next/router'
import { MouseEvent, useContext, useMemo, useState } from 'react'
import useModal from '@src/hooks/useModal'
import { useMutation, useQueryClient } from 'react-query'

// ** values
import { S3FileType } from '@src/shared/const/signedURLFileType'

// ** toast
import { toast } from 'react-hot-toast'

// ** permission
import { client_request } from '@src/shared/const/permission-class'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { updateRequest } from '@src/apis/requests/client-request.api'

// ** types
import { RequestDetailType } from '@src/types/requests/detail.type'
import { FileType } from '@src/types/common/file.type'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { useGetStatusList } from '@src/queries/common.query'

export default function RequestDetail() {
  const router = useRouter()
  const { id } = router.query

  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)

  const User = new client_request(auth.getValue().user?.id!)

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

  const { data } = useGetClientRequestDetail(Number(id))
  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('RequestClient')

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
      fetch(res, { method: 'GET' })
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
        return queryClient.invalidateQueries({
          queryKey: 'request/client/detail',
        })
      },
      onError: () => onError(),
    },
  )

  function mutateCancel(form: { option: string; reason?: string }) {
    closeModal('cancelRequest')
    if (data !== undefined) {
      cancelMutation.mutate({
        id: Number(id),
        form: {
          ...data,
          lspId: data.lsp.id,
          status: 50005,
          canceledReason: {
            from: 'client',
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
    const status = data?.status
    return status && status >= 50003
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          gap='8px'
          sx={{ background: '#fff', borderRadius: '8px', padding: '16px' }}
        >
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.push('/quotes/requests/')}>
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
                      color='black'
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
      </Grid>
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          {data ? (
            <RequestDetailCard
              data={data}
              openReasonModal={openReasonModal}
              statusList={statusList ?? []}
            />
          ) : null}
        </Card>
        {isDeletable ? (
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
        ) : null}
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
            <Typography
              variant='body2'
              mt='24px'
              sx={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {data?.notes ? parse(data?.notes) : '-'}
            </Typography>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

RequestDetail.acl = {
  subject: 'client_request',
  action: 'read',
}