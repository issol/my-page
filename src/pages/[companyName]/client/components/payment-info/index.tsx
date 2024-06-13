import { Suspense, useContext, useEffect, useState } from 'react'

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
import FileInfo from '@src/@core/components/file-info'

// ** hooks
import useModal from '@src/hooks/useModal'
import { Resolver, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** types & schema
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'

// ** third parties
import { toast } from 'react-hot-toast'

// ** apis
import {
  useGetClientBillingAddress,
  useGetClientNotes,
  useGetClientPaymentFile,
  useGetClientPaymentInfo,
} from '@src/queries/payment/client-payment.query'
import {
  deleteClientPaymentFile,
  getClientPaymentFileFromServer,
  uploadClientPaymentFile,
} from '@src/apis/payment/client-payment.api'
import { updateClientAddress } from '@src/apis/client.api'

// ** context
import { AbilityContext } from '@src/layouts/components/acl/Can'

import { client } from '@src/shared/const/permission-class'
import SelectOffice from './select-office'
import NotesToClient from './notes-to-client'
import { ClientDetailType } from '@src/types/client/client'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
}

export default function PaymentInfo({ clientId, clientInfo }: Props) {
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const [editAddress, setEditAddress] = useState(false)

  const ability = useContext(AbilityContext)
  // const auth = useRecoilValueLoadable(authState)
  const user = useRecoilValueLoadable(authState)

  const User = new client(clientId)

  const isAccountManager = ability.can('read', 'account_manage')
  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  console.log(isAccountManager)

  const { data: fileList } = useGetClientPaymentFile(clientId)
  const { data: billingAddress } = useGetClientBillingAddress(
    clientId,
    isAccountManager,
  )
  const { data: paymentInfo, isLoading } = useGetClientPaymentInfo(
    clientId,
    isAccountManager,
  )
  const { data: notesToClient } = useGetClientNotes(clientId)

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
    resolver: yupResolver(
      clientBillingAddressSchema,
    ) as Resolver<ClientAddressType>,
  })

  useEffect(() => {
    if (billingAddress) {
      resetBillingAddressForm()
    }
  }, [billingAddress])

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

  const downloadAllFile = (files: FileItemType[] | null) => {
    if (files?.length) {
      files.forEach(item => {
        onFileClick(item)
      })
    }
  }

  function uploadFiles(files: File[]) {
    if (files.length) {
      const promiseArr = files.map(i => {
        const formData = new FormData()
        formData.append('file', i)
        return uploadClientPaymentFile(clientId, formData)
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
  const replaceDots = (value: string) => {
    if (!value) return '-'
    return value.replaceAll('*', '•')
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

  console.log(paymentInfo)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <Box display='flex' flexDirection='column' gap='24px'>
          {/* office details */}
          <Suspense>
            {paymentInfo === null ? (
              <SelectOffice isUpdatable={isUpdatable} clientId={clientId} />
            ) : (
              <OfficeDetails
                paymentInfo={paymentInfo!}
                clientId={clientId}
                isEnrolledClient={clientInfo.isEnrolledClient}
                isUpdatable={isUpdatable}
              />
            )}
          </Suspense>

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
              <BillingAddress
                billingAddress={{
                  baseAddress: replaceDots(billingAddress?.baseAddress ?? ''),
                  city: replaceDots(billingAddress?.city ?? ''),
                  country: replaceDots(billingAddress?.country ?? ''),
                  detailAddress: replaceDots(
                    billingAddress?.detailAddress ?? '',
                  ),
                  state: replaceDots(billingAddress?.state ?? ''),
                  zipCode: replaceDots(
                    billingAddress?.zipCode?.toString() ?? '',
                  ),
                }}
              />
            </CardContent>
          </Card>
          <Suspense>
            {paymentInfo === null ? null : (
              <NotesToClient
                notesToClient={notesToClient!}
                clientId={clientId}
                user={user.getValue()}
                clientAuthorId={clientInfo.authorId}
                isEnrolledClient={clientInfo.isEnrolledClient}
              />
            )}
          </Suspense>
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
              onFileClick={onFileClick}
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