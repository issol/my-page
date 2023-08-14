import { Card, CardHeader, Grid, Typography } from '@mui/material'

// ** context
import { Suspense, useContext, useState } from 'react'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** Hooks
import useClipboard from 'src/@core/hooks/useClipboard'

import styled from 'styled-components'
import { toast } from 'react-hot-toast'

// ** components
import PersonalInfo from './personal-info'
import BillingMethod from './billing-method'
import BillingAddressDetail from '@src/pages/client/components/payment-info/billing-address'

// ** actions
import {
  useGetTaxCodeList,
  useGetUserPaymentInfo,
} from '@src/queries/payment-info.query'
import {
  FileNameType,
  downloadPersonalInfoFile,
} from '@src/apis/payment-info.api'

import logger from '@src/@core/utils/logger'
import FallbackSpinner from '@src/@core/components/spinner'
import { useEffect } from 'react'
import Tax from './tax'
import FileInfo from '@src/@core/components/file-info'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { useGetProOverview } from '@src/queries/pro/pro-details.query'

type Props = {
  id: number
  userRole: string
}

export default function PaymentInfo({ id, userRole }: Props) {
  const ability = useContext(AbilityContext)
  const isAccountManager = ability.can('read', 'account_manage')
  const [taxEdit, setTaxEdit] = useState(false)

  const clipboard = useClipboard()

  const [isManagerRequest, setIsManagerRequest] = useState(false)

  const { data, refetch } = useGetUserPaymentInfo(id, isManagerRequest)
  const { data: userInfo, isError, isFetched } = useGetProOverview(Number(id!))
  const { data: taxCodes } = useGetTaxCodeList()
  const taxInfo = taxCodes?.find(i => i.statusCode === data?.taxCode)

  const onCopy = (info: string) => {
    clipboard.copy(info)
    toast.success('The text has been copied to your clipboard.', {
      duration: 2000,
    })
  }

  const replaceDots = (value: string) => {
    if (!value) return '-'
    return value.replaceAll('*', '●')
  }

  function fetchFile(fileName: FileNameType) {
    downloadPersonalInfoFile(id, fileName)
      .then()
      .catch(err => {
        // console.log(err)
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        )
      })
  }

  function downloadFile(name: FileNameType) {
    fetchFile(name)
  }

  useEffect(() => {
    if (isManagerRequest) {
      refetch()
    }
  }, [isManagerRequest])

  function getDetail() {
    setIsManagerRequest(true)
  }

  const downloadAllFile = (file: FileItemType[] | null) => {
    if (file) {
      file.map(value => {
        getDownloadUrlforCommon(
          S3FileType.PRO_PAYMENT_INFO,
          value.filePath,
        ).then(res => {
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
        })
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
    // TODO API 연결
  }

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='6px'>
        <Grid item xs={12} md={4} lg={4}>
          {/* <PersonalInfo
            onCopy={onCopy}
            info={userInfo}
            isAccountManager={isAccountManager}
            replaceDots={replaceDots}
            downloadFile={downloadFile}
          /> */}
          {userRole === 'LPM' ? (
            <Card sx={{ padding: '24px', mt: '24px' }}>
              <FileInfo
                fileList={data?.files ?? []}
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
                fileType={S3FileType.PRO_PAYMENT_INFO}
                onDownloadAll={downloadAllFile}
                onFileDrop={uploadFiles}
                onDeleteFile={onDeleteFile}
                isUpdatable={false}
                isDeletable={false}
              />
            </Card>
          ) : null}
        </Grid>

        <Grid item xs={12} md={8} lg={8}>
          <BillingMethod
            info={data!}
            isAccountManager={isAccountManager}
            replaceDots={replaceDots}
            getDetail={getDetail}
          />

          <Card style={{ marginTop: '24px', padding: '24px' }}>
            <Typography variant='h6' mb={6}>
              Billing address
            </Typography>
            <BillingAddressDetail
              billingAddress={{
                baseAddress: replaceDots(
                  data?.billingAddress?.baseAddress ?? '',
                ),
                city: replaceDots(data?.billingAddress?.city ?? ''),
                country: replaceDots(data?.billingAddress?.country ?? ''),
                detailAddress: replaceDots(
                  data?.billingAddress?.detailAddress ?? '',
                ),
                state: replaceDots(data?.billingAddress?.state ?? ''),
                zipCode: replaceDots(
                  data?.billingAddress?.zipCode?.toString() ?? '',
                ),
              }}
            />
          </Card>
          {/* TODO: taxInfo스키마 결정되면 수정하기 */}
          {/* {userRole === 'LPM' ? (
            <Tax
              info={{
                taxInfo: taxInfo?.info,
                taxRate: taxInfo?.rate,
              }}
              edit={taxEdit}
              setEdit={setTaxEdit}
            />
          ) : null} */}
        </Grid>
      </Grid>
    </Suspense>
  )
}

export const ContentGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`
