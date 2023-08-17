import { useContext, useEffect, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import { Box, Button, Card, Grid, IconButton, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import styled from 'styled-components'

// ** components
import FileInfo from '@src/@core/components/file-info'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'

// ** types
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'

// ** ability
import { client_payment } from '@src/shared/const/permission-class'

// ** third parties
import { isEmpty } from 'lodash'
import { toast } from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'

// ** apis
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'

// ** types & schema
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { S3FileType } from '@src/shared/const/signedURLFileType'

// ** helpers
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import {
  ClientPaymentFormType,
  OfficeTaxType,
  OfficeType,
  PaymentMethodUnionType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'
import { useGetClientPaymentInfo } from '@src/queries/payment/client-payment.query'
import PaymentMethodForm from './payment-method-form'
import { useMutation, useQueryClient } from 'react-query'
import { createClientPaymentInfo } from '@src/apis/payment/client-payment.api'

export default function CompanyPaymentInfo() {
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const ability = useContext(AbilityContext)
  const { user, company } = useContext(AuthContext)

  const User = new client_payment(user?.id!)
  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  const { data: paymentInfo, isLoading } = useGetClientPaymentInfo(
    company?.clientId!,
  )

  const [editInfo, setEditInfo] = useState(false)
  const [editAddress, setEditAddress] = useState(false)

  //TODO: 임시 값. LSP가 payment info 리뷰가 끝났는지 여부를 판단할 수 있는 값(서버에서 fetch한)을 기준으로 검사하도록 수정해야 함.
  const isLSPReviewedPaymentMethod = true

  //['Japan', 'Korea', 'Singapore', 'US']
  const office: OfficeType = 'US'

  // TODO: 서버에서 fetch한 값으로 교체하기
  const billingAddress: ClientAddressType = {
    addressType: 'billing',
    baseAddress: '서울 특별시 마포구',
    detailAddress: '동교동 123',
    state: '',
    city: '서울',
    country: '대한민국',
    zipCode: '123456',
  }

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
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

  //TODO: 수정: billing address정보를 fetch한 데이터로 reset해주기.
  function resetBillingAddressForm() {
    reset(billingAddress)
  }

  useEffect(() => {
    resetBillingAddressForm()
  }, [])

  function onCancelSave() {
    if (editInfo) {
      //TODO: 함수완성하기
    } else {
      if (isEmpty(dirtyFields)) {
        setEditAddress(false)
      } else {
        openDiscardModal(() => {
          setEditAddress(false)
          resetBillingAddressForm()
        })
      }
    }
  }

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
              //TODO: delete api연결하기
              closeModal('deleteFile')
            }}
            onClose={() => closeModal('deleteFile')}
            rightButtonText='Delete'
          />
        ),
      })
    }
  }

  function uploadFiles(files: File[]) {
    const fileInfo: Array<{ name: string; size: number; fileKey: string }> = []

    //TODO: getFilePath의 인자는 임시로 넣어둠. 서버에 저장할 file path가 정해지면 해당 값으로 만들어주기.
    const paths: string[] = files?.map(file => getFilePath([''], file.name))
    const promiseArr = paths.map((url, idx) => {
      //TODO: S3FileType.RESUME는 임시로 넣어둔 값. Client의 file위치가 정해지면 S3FileType에 값 추가하고, 해당 값으로 교체하기
      return getUploadUrlforCommon(S3FileType.RESUME, url).then(res => {
        fileInfo.push({
          name: files[idx].name,
          size: files[idx]?.size,
          fileKey: url,
        })
        return uploadFileToS3(res.url, files[idx])
      })
    })

    Promise.all(promiseArr)
      .then(res => {
        //TODO: file upload가 완료된 후의 작업 추가하기
      })
      .catch(() => onError())
  }

  function downloadFile(file: FileItemType) {
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

  function downloadAllFile(files: FileItemType[] | null) {
    if (!files) return
    files.forEach(file => downloadFile(file))
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
    const existData = paymentInfo?.find(info => info.office === office)
    const data = {
      clientId: company.clientId,
      office,
      paymentMethod,
      paymentData,
      taxData,
    }

    updatePaymentInfo.mutate(
      !existData ? data : { ...data, paymentId: existData.id },
    )
    setEditInfo(false)
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
      {editInfo || editAddress ? null : (
        <>
          <Grid item xs={8} display='flex' flexDirection='column' gap='24px'>
            <Card style={{ padding: '24px' }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography variant='h6'>Payment info</Typography>
                {isUpdatable && isLSPReviewedPaymentMethod && (
                  <IconButton onClick={() => setEditInfo(true)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                )}
              </Box>
              {!isLSPReviewedPaymentMethod ? (
                <AlertBox>
                  The LSP is currently reviewing the payment method.
                </AlertBox>
              ) : null}
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
            <Card style={{ padding: '24px' }}>
              <Typography variant='h6'>Notes from LSP</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ padding: '24px' }}>
              <FileInfo
                title='Files'
                //TODO: 서버에서 받아온 파일 정보로 교체하기
                fileList={[]}
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
                fileType={''}
                onDownloadAll={downloadAllFile}
                onFileDrop={uploadFiles}
                onDeleteFile={onDeleteFile}
                isUpdatable={isUpdatable && isLSPReviewedPaymentMethod}
                isDeletable={isDeletable}
              />
            </Card>
          </Grid>
        </>
      )}
      {!editInfo ? null : (
        <Grid item xs={12}>
          <Card style={{ padding: '24px' }}>
            <PaymentMethodForm
              office={office}
              cancel={() => setEditInfo(false)}
              onSave={onSavePaymentInfo}
              paymentInfo={paymentInfo}
            />
          </Card>
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
                <Button variant='outlined' onClick={onCancelSave}>
                  Cancel
                </Button>
                <Button variant='contained' disabled={!isValid}>
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
  margin-top: 20px;
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
