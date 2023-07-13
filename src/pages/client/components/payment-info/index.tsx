import { useContext, useEffect, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import OfficeDetails from './office-details'
import BillingAddress from './billing-address'
import ClientBillingAddressesForm from '../forms/client-billing-address'
import FileInfo from '@src/@core/components/files'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** types & schema
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { FileItemType } from '@src/@core/components/swiper/file-swiper'

// ** third parties
import { toast } from 'react-hot-toast'

// ** apis
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import {
  useGetClientBillingAddress,
  useGetClientPaymentFile,
} from '@src/queries/payment/client-payment.query'
import {
  deleteClientPaymentFile,
  updateClientBillingAddress,
  uploadClientPaymentFile,
} from '@src/apis/payment/client-payment.api'
import { useGetCompanyInfo } from '@src/queries/company/company-info.query'

// ** context
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { AuthContext } from '@src/context/AuthContext'

import { client } from '@src/shared/const/permission-class'

type Props = {
  clientId: number
}

export default function PaymentInfo({ clientId }: Props) {
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const [editAddress, setEditAddress] = useState(false)

  const ability = useContext(AbilityContext)
  const { user } = useContext(AuthContext)

  const User = new client(user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  const { data: fileList } = useGetClientPaymentFile(clientId)
  const { data: billingAddress } = useGetClientBillingAddress(clientId)
  const { data: companyInfo, refetch } = useGetCompanyInfo(user?.company!)

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
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

  useEffect(() => {
    if (billingAddress) {
      resetBillingAddressForm()
    }
  }, [billingAddress])

  const downloadAllFile = (file: FileItemType[] | null) => {
    if (file) {
      file.map(value => {
        getDownloadUrlforCommon(S3FileType.CLIENT_PAYMENT, value.filePath).then(
          res => {
            const previewFile = {
              url: res.url,
              fileName: value.fileName,
              fileExtension: value.fileExtension,
            }
            fetch(previewFile.url, { method: 'GET' })
              .then(res => {
                return res.blob()
              })
              .then(blob => {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${value.fileName}.${value.fileExtension}`
                document.body.appendChild(a)
                a.click()
                setTimeout((_: any) => {
                  window.URL.revokeObjectURL(url)
                }, 60000)
                a.remove()
                // onClose()
              })
              .catch(error => onError())
          },
        )
      })
    }
  }

  function uploadFiles(files: File[]) {
    if (files.length) {
      const promiseArr = files.map(i => uploadClientPaymentFile(clientId, i))

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

  function onDeleteFile(file: FileItemType) {
    deleteClientPaymentFile(clientId, file.id!)
      .then(() => {
        toast.success('Success', {
          position: 'bottom-left',
        })
        queryClient.invalidateQueries({ queryKey: 'get/client/payment/file' })
      })
      .catch(e => onError())
  }

  const updateBillingaddress = useMutation(
    (form: ClientAddressType) =>
      updateClientBillingAddress(companyInfo?.id!, form),
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
    updateBillingaddress.mutate(data)
  }

  function resetBillingAddressForm() {
    if (billingAddress) {
      reset({
        addressType: 'billing',
        baseAddress: billingAddress?.baseAddress ?? '',
        detailAddress: billingAddress?.detailAddress ?? '',
        city: billingAddress?.city ?? '',
        state: billingAddress?.state ?? '',
        country: billingAddress?.country ?? '',
        zipCode: billingAddress?.zipCode ?? '',
      })
    }
  }

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
      <Grid item xs={12} md={8}>
        <Box display='flex' flexDirection='column' gap='24px'>
          {/* office details */}
          <OfficeDetails clientId={clientId} />

          {/* billing address */}
          <Card>
            <CardHeader
              title={
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h6'>Billing Address</Typography>
                  <IconButton onClick={() => setEditAddress(!editAddress)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                </Box>
              }
            />
            <CardContent>
              <BillingAddress billingAddress={billingAddress} />
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Files */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <FileInfo
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
              fileType={S3FileType.CLIENT_PAYMENT}
              onDownloadAll={downloadAllFile}
              onFileDrop={uploadFiles}
              onDeleteFile={onDeleteFile}
              isUpdatable={isUpdatable}
              isDeletable={isDeletable}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* billing address form */}
      <Dialog open={editAddress} maxWidth='md'>
        <DialogContent sx={{ padding: '50px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>Billing Address</Typography>
            </Grid>
            <ClientBillingAddressesForm control={control} errors={errors} />
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  setEditAddress(false)
                  resetBillingAddressForm()
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
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
