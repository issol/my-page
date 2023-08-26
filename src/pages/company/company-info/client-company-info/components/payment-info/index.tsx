import { useContext, useEffect, useMemo, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import styled from 'styled-components'

// ** components
import FileInfo from '@src/@core/components/file-info'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import PaymentMethodForm from './payment-method-form'

// ** types
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'

// ** contexts
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** ability
import { client_payment } from '@src/shared/const/permission-class'

// ** third parties
import { isEmpty } from 'lodash'
import { toast } from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid'

// ** apis
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import {
  createClientPaymentInfo,
  deleteClientPaymentFile,
  getClientPaymentFileFromServer,
  uploadClientPaymentFile,
} from '@src/apis/payment/client-payment.api'
import {
  useGetClientBillingAddress,
  useGetClientPaymentFile,
  useGetClientPaymentInfo,
} from '@src/queries/payment/client-payment.query'
import { updateClientAddress } from '@src/apis/client.api'

// ** types & schema
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import {
  ClientPaymentFormType,
  OfficeTaxType,
  OfficeType,
  PayPalFormType,
  PaymentMethodUnionType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'

// ** helpers
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { getCurrentRole } from '@src/shared/auth/storage'
import { BorderBox } from '@src/@core/components/detail-info'
import PaymentMethodDetail from './payment-method-detail'

export default function CompanyPaymentInfo() {
  const isUserRoleGeneral = getCurrentRole()?.type === 'General'
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const ability = useContext(AbilityContext)
  const { user, company } = useRecoilValue(authState)

  const User = new client_payment(user?.id!)
  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  const isAccountManager = ability.can('read', 'account_manage')

  const { data: paymentInfo } = useGetClientPaymentInfo(
    company?.clientId!,
    isAccountManager,
  )
  const { data: billingAddress } = useGetClientBillingAddress(
    company?.clientId!,
    isAccountManager,
  )
  const { data: fileList } = useGetClientPaymentFile(company?.clientId!)

  const [editInfo, setEditInfo] = useState(false)
  const [editAddress, setEditAddress] = useState(false)

  // TODO: Notes from LSP에 보여줄 파일을 fetch해서 setSavedFiles, setFileSize해주기
  const [savedFiles, setSavedFiles] = useState<FileItemType[]>([])
  const [fileSize, setFileSize] = useState(0)

  const isLSPReviewedPaymentMethod = useMemo(
    () => !!paymentInfo?.office,
    [paymentInfo],
  )

  const office: OfficeType | null = useMemo(() => {
    if (!paymentInfo) return null
    return paymentInfo?.office
  }, [paymentInfo])

  const {
    control,
    getValues,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<ClientAddressType>({
    defaultValues: {
      addressType: 'billing',
      baseAddress: '',
      detailAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    mode: 'onChange',
    resolver: yupResolver(clientBillingAddressSchema),
  })

  function resetBillingAddressForm() {
    reset(billingAddress)
  }

  useEffect(() => {
    resetBillingAddressForm()
  }, [billingAddress])

  function openDiscardModal(onClick: any) {
    openModal({
      type: 'discardAlert',
      children: (
        <DiscardModal
          onClick={() => {
            onClick()
            closeModal('discardAlert')
          }}
          onClose={() => closeModal('discardAlert')}
        />
      ),
    })
  }

  function onDeleteFile(file: FileItemType) {
    if (file.id) {
      openModal({
        type: 'deleteFile',
        children: (
          <CustomModal
            vary='error'
            title='Are you sure you want to delete this file?'
            subtitle={file.fileName}
            onClick={() => {
              closeModal('deleteFile')
              deleteClientPaymentFile(company?.clientId!, file.id!)
                .then(() => {
                  toast.success('Success', {
                    position: 'bottom-left',
                  })
                  queryClient.invalidateQueries({
                    queryKey: 'get/client/payment/file',
                  })
                })
                .catch(e => onError())
            }}
            onClose={() => closeModal('deleteFile')}
            rightButtonText='Delete'
          />
        ),
      })
    }
  }

  function uploadFiles(files: File[]) {
    if (files.length && company?.clientId) {
      const promiseArr = files.map(i => {
        const formData = new FormData()
        formData.append('file', i)
        return uploadClientPaymentFile(company?.clientId, formData)
      })

      Promise.all(promiseArr)
        .then(() => {
          toast.success('Success', {
            position: 'bottom-left',
          })
          queryClient.invalidateQueries({ queryKey: 'get/client/payment/file' })
        })
        .catch(e => onError())
    }
  }

  function downloadNotesFromLSPFile(file: FileItemType) {
    if (!file) return
    //TODO: S3FileType.RESUME는 임시로 넣어둔 값. Client의 file위치가 정해지면 S3FileType에 값 추가하고, 해당 값으로 교체하기
    getDownloadUrlforCommon(S3FileType.RESUME, file.filePath).then(res => {
      const previewFile = {
        url: res.url,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
      }
      fetch(previewFile.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.fileName}.${file.fileExtension}`
          document.body.appendChild(a)
          a.click()
          setTimeout((_: any) => {
            window.URL.revokeObjectURL(url)
          }, 60000)
          a.remove()
        })
        .catch(error => onError())
    })
  }

  function onFileClick(file: FileItemType) {
    if (!file?.id) return
    getClientPaymentFileFromServer(file.id).then(res => {
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      a.href = url
      a.download = file.fileName
      document.body.appendChild(a)
      a.click()
      setTimeout((_: any) => {
        window.URL.revokeObjectURL(url)
      }, 60000)
      a.remove()
    })
  }

  function downloadAllFiles(files: FileItemType[] | null) {
    if (!files) return
    files.forEach(file => onFileClick(file))
  }

  const updatePaymentInfo = useMutation(
    (form: ClientPaymentFormType) => createClientPaymentInfo(form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'get/client/payment' })
      },
      onError: () => onError(),
    },
  )

  function onSavePaymentInfo(
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentData: PaymentMethodUnionType,
    taxData: OfficeTaxType,
  ) {
    if (!company?.clientId) return
    const existData = paymentInfo
    let data = {
      clientId: company.clientId,
      office,
      paymentMethod,
      paymentData,
      taxData,
    }
    if (office === 'Korea') {
      const taxData = data.taxData as PayPalFormType
      data = {
        ...data,
        taxData: {
          recipientEmail: taxData.email,
        },
      }
    }
    updatePaymentInfo.mutate(
      !existData ? data : { ...data, paymentId: existData.id },
    )
    setEditInfo(false)
  }

  const updateBillingaddress = useMutation(
    (form: ClientAddressType) => updateClientAddress({ data: [form] }),
    {
      onSuccess: () => {
        toast.success('Success', {
          position: 'bottom-left',
        })
        queryClient.invalidateQueries({ queryKey: 'get/client/billingAddress' })
      },
      onError: () => onError(),
    },
  )

  function onSaveBillingAddress() {
    const data = getValues()
    setEditAddress(false)
    updateBillingaddress.mutate({ ...data, id: billingAddress?.id! })
  }

  const savedFileList = savedFiles?.map((file: FileItemType) => (
    <Box key={uuidv4()} mt={4}>
      <FileBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={file.fileName}>
              <FileName variant='body1'>{file.fileName}</FileName>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file?.fileSize ?? 0)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => downloadNotesFromLSPFile(file)}>
          <Icon icon='mdi:download' fontSize={24} />
        </IconButton>
      </FileBox>
    </Box>
  ))

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }
  return (
    <Grid container spacing={6}>
      {editInfo || editAddress ? null : (
        <>
          <Grid item xs={8} display='flex' flexDirection='column' gap='24px'>
            <Card style={{ padding: '24px' }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={4}
              >
                <Typography variant='h6'>Payment info</Typography>
                {isUpdatable && isLSPReviewedPaymentMethod && (
                  <IconButton onClick={() => setEditInfo(true)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                )}
              </Box>
              {!isLSPReviewedPaymentMethod || office === null ? (
                <AlertBox>
                  The LSP is currently reviewing the payment method.
                </AlertBox>
              ) : (
                <PaymentMethodDetail
                  office={office}
                  paymentInfo={paymentInfo}
                />
              )}
            </Card>
            <Card style={{ padding: '24px' }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={4}
              >
                <Typography variant='h6'>Billing address</Typography>
                {isUpdatable && (
                  <IconButton onClick={() => setEditAddress(true)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                )}
              </Box>
              <BillingAddress billingAddress={billingAddress} />
            </Card>
            <Card sx={{ padding: '24px' }}>
              <Grid item xs={12}>
                <Box display='flex' gap='20px' alignItems='center'>
                  <Box display='flex' flexDirection='column'>
                    <Typography variant='h6'>Notes from LSP</Typography>
                    <Typography variant='caption'>
                      {formatFileSize(fileSize).toLowerCase()}/ 50 mb
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <Button
                      variant='outlined'
                      disabled={!savedFiles.length}
                      sx={{
                        height: '34px',
                      }}
                      startIcon={<Icon icon='mdi:download' fontSize={18} />}
                      onClick={() => downloadAllFiles(savedFiles)}
                    >
                      Download all
                    </Button>
                  </Box>
                </Box>
              </Grid>
              {savedFiles.length ? (
                <>
                  <Grid item xs={12}>
                    <Box
                      display='grid'
                      gridTemplateColumns='repeat(3,1fr)'
                      gap='16px'
                    >
                      {savedFileList}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </>
              ) : (
                '-'
              )}
              <Divider />
              <Grid item xs={12} mt={4}>
                <BorderBox>
                  <Typography variant='body2'>
                    {/* TODO: 밑에는 임시 텍스트로, LSP가 등록한 메시지를 넣어주어야 함. 만약 메시지가 없다면 하이픈'-' 표시 */}
                    Please check our address : 3325 Wilshire Blvd Ste 626 Los
                    Angeles CA 90010
                  </Typography>
                </BorderBox>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ padding: '24px' }}>
              <FileInfo
                title='Files'
                fileList={fileList || []}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg'],
                  'text/csv': ['.cvs'],
                  'application/pdf': ['.pdf'],
                  'text/plain': ['.txt'],
                  'application/vnd.ms-powerpoint': ['.ppt'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    ['.docx'],
                }}
                onFileClick={onFileClick}
                onDownloadAll={downloadAllFiles}
                onFileDrop={uploadFiles}
                onDeleteFile={onDeleteFile}
                isReadable={!isUserRoleGeneral}
                isUpdatable={
                  isUpdatable &&
                  isLSPReviewedPaymentMethod &&
                  !isUserRoleGeneral
                }
                isDeletable={isDeletable && !isUserRoleGeneral}
              />
            </Card>
          </Grid>
        </>
      )}
      {!editInfo ? null : (
        <Grid item xs={12}>
          {office === null ? null : (
            <Card style={{ padding: '24px' }}>
              <PaymentMethodForm
                office={office}
                cancel={() => setEditInfo(false)}
                onSave={onSavePaymentInfo}
                paymentInfo={paymentInfo}
                openDiscardModal={openDiscardModal}
              />
            </Card>
          )}
        </Grid>
      )}
      {!editAddress ? null : (
        <Grid item xs={12}>
          <Card style={{ padding: '24px' }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography variant='h6'>Billing address</Typography>
              </Grid>
              <ClientBillingAddressesForm control={control} errors={errors} />
              <Grid
                item
                xs={12}
                display='flex'
                justifyContent='center'
                gap='1rem'
              >
                <Button
                  variant='outlined'
                  onClick={() => {
                    if (isEmpty(dirtyFields)) {
                      setEditAddress(false)
                    } else {
                      openDiscardModal(() => {
                        setEditAddress(false)
                        resetBillingAddressForm()
                      })
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  disabled={!isValid}
                  onClick={onSaveBillingAddress}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

const AlertBox = styled(Box)`
  padding: 20px;
  color: #fdb528;
  background: rgb(101, 76, 26);
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88) 0%,
      rgba(255, 255, 255, 0.88) 100%
    ),
    #fdb528;
  border-radius: 10px;
`

const FileBox = styled(Box)`
  display: flex;
  margin-bottom: 8px;
  width: 100%;
  justify-content: space-between;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
`

const FileName = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`
