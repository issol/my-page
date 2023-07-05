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
import OfficeDetails from './office-details'
import BillingAddress from './billing-address'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import useModal from '@src/hooks/useModal'
import ClientBillingAddressesForm from '../forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { toast } from 'react-hot-toast'
import { FileItemType } from '@src/@core/components/swiper/file-swiper'
import { FilePostType } from '@src/apis/client-guideline.api'
import FileInfo from '@src/@core/components/files'

type Props = {
  clientId: number
}

/*
TODO:
1. BillingAddress에 실데이터 표기하기
2. BillingAddressForm에 form reset할 데이터 프롭으로 보내주기
3. billing address 저장 mutation붙이기
4. fileList는 서버에서 불러온 값으로 교체하기
5. uploadFiles함수 완성하기
6. file delete함수 완성하기
7. FileInfo의 isUpdatable, isDeletable은 ability check로 수정하기
*/

export default function PaymentInfo({ clientId }: Props) {
  const { openModal, closeModal } = useModal()
  const [editAddress, setEditAddress] = useState(false)
  const fileList: FileItemType[] = [
    {
      filePath: '7686/resume/pro-task디테일.png',
      fileName: 'pro-task디테일',
      fileExtension: 'png',
      fileSize: 200,
      url: 'https://enough-upload-dev.gloground.com/7686/resume/pro-task%E1%84%83%E1%85%B5%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%AF.png?Expires=1687169890&Key-Pair-Id=K3KY6G7GJ7W3IB&Signature=Et3zazpLpZtRRSmn4YBzhuL~Fx2Hwo7SuXaeFUeydpGxVkwHUAM~wZ3-dD7Z09g2syNWNvSNnL2IiVFBGOGV9jifUeScvK3sjkgQw48AKR9UCYKP9L7q3MTkWSSs-a97XNeLFaF~yXH6sZlpJw0y9vOmHJ10cmu~Uq7R9bY91qKd45GhDmdIOirH-cYI~BkjRrqSyy8kXDMhI03Gdyt6NoX4gaXwgZhUAbwA8YGfJiQjyXiHWtrFHM-ROWOTzJFrutIqGrnBbQaTNFORazK~eHKtFbVqumTgUvV~0LovacDbyLHjLvxynC3OZw7tcR4MGcguHdw0xk84ZJCtsbrdfw__',
    },
    {
      url: '',
      filePath: '',
      fileName: 'test2',
      fileSize: 400,
      fileExtension: 'pdf',
    },
    {
      url: '',
      filePath: '',
      fileName: 'test2',
      fileExtension: 'pdf',
    },
    {
      url: '',
      filePath: '',
      fileName: 'test2',
      fileExtension: 'pdf',
    },
    {
      url: '',
      filePath: '',
      fileName: 'test2',
      fileExtension: 'pdf',
    },
    {
      url: '',
      filePath: '',
      fileName: 'test2',
      fileExtension: 'pdf',
    },
  ]

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientAddressType>({
    defaultValues: { addressType: 'billing' },
    mode: 'onChange',
    resolver: yupResolver(clientBillingAddressSchema),
  })

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
              .catch(error =>
                toast.error(
                  'Something went wrong while uploading files. Please try again.',
                  {
                    position: 'bottom-left',
                  },
                ),
              )
          },
        )
      })
    }
  }

  function uploadFiles(files: File[]) {
    // if (files.length) {
    //   const fileInfo: Array<FilePostType> = []
    //   const paths: string[] = files?.map(file =>
    //     //TODO: 보낼 값은 백엔드에 문의하기
    //     // getFilePath(
    //     //   [
    //     //     data.client.value,
    //     //     data.category.value,
    //     //     data.serviceType.value,
    //     //     'V1',
    //     //   ],
    //     //   file.name,
    //     // ),
    //   )
    //   const promiseArr = paths.map((url, idx) => {
    //     return getUploadUrlforCommon(S3FileType.CLIENT_PAYMENT, url).then(
    //       res => {
    //         fileInfo.push({
    //           name: files[idx].name,
    //           size: files[idx]?.size,
    //           fileUrl: url,
    //         })
    //         return uploadFileToS3(res.url, files[idx])
    //       },
    //     )
    //   })
    //   Promise.all(promiseArr)
    //     .then(res => {
    //       //TODO: mutation함수 추가하기
    //       // finalValue.files = fileInfo
    //       // guidelineMutation.mutate(finalValue)
    //     })
    //     .catch(err =>
    //       toast.error(
    //         'Something went wrong while uploading files. Please try again.',
    //         {
    //           position: 'bottom-left',
    //         },
    //       ),
    //     )
    // }
  }

  function onDeleteFile(file: FileItemType) {
    //
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
              <BillingAddress /* clientId={clientId}  */ />
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Files */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <FileInfo
              fileList={fileList}
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
              isUpdatable={false}
              isDeletable={false}
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
              <Button variant='outlined' onClick={() => setEditAddress(false)}>
                Cancel
              </Button>
              <Button variant='contained' disabled={!isValid}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
