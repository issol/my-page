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
  deleteProPaymentFile,
  downloadPersonalInfoFile,
  getProPaymentFile,
  uploadProPaymentFile,
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
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'
import { pro_payment } from '@src/shared/const/permission-class'
import { useQueryClient } from 'react-query'

type Props = {
  id: number
  userRole: string
}

export default function PaymentInfo({ id, userRole }: Props) {
  const ability = useContext(AbilityContext)
  const { user } = useRecoilValue(authState)

  const User = new pro_payment(user?.id!)
  const isAccountManager = ability.can('read', 'account_manage')
  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)

  const [taxEdit, setTaxEdit] = useState(false)

  const clipboard = useClipboard()

  const onCopy = (info: string) => {
    clipboard.copy(info)
    toast.success('The text has been copied to your clipboard.', {
      duration: 2000,
    })
  }

  const queryClient = useQueryClient()
  const invalidatePaymentInfo = () =>
    queryClient.invalidateQueries({ queryKey: 'get-payment-info' })

  const { data } = useGetUserPaymentInfo(id, isAccountManager)

  const replaceDots = (value: string) => {
    if (!value) return '-'
    return value.replaceAll('*', '•')
  }

  function downloadFile(file: FileItemType) {
    if (!file?.id) return
    getProPaymentFile(file.id).then(res => {
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
    if (!files) return
    files.forEach(file => downloadFile(file))
  }

  function uploadFiles(files: File[]) {
    files.forEach(file => {
      const formData = new FormData()
      formData.append('file', file)
      uploadProPaymentFile('additional', formData)
    })
    setTimeout(() => {
      invalidatePaymentInfo()
    }, 1500)
  }

  function onDeleteFile(file: FileItemType) {
    if (file.id) {
      deleteProPaymentFile(file.id!)
        .then(() => invalidatePaymentInfo())
        .catch(() => onError())
    }
  }

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='6px'>
        <Grid item xs={12} md={4} lg={4}>
          <PersonalInfo
            onCopy={onCopy}
            info={data?.billingMethod}
            replaceDots={replaceDots}
            downloadFile={downloadFile}
            files={data?.files || []}
            isAccountManager={isAccountManager}
          />
          <Card sx={{ padding: '24px', mt: '24px' }}>
            <FileInfo
              fileList={
                data?.files.filter(i => i.positionType === 'additional') || []
              }
              title='Additional files'
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
              isReadable={isAccountManager}
              isUpdatable={isAccountManager}
              isDeletable={isAccountManager}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8} lg={8}>
          <BillingMethod
            onCopy={onCopy}
            info={data?.billingMethod}
            bankInfo={data?.bankInfo}
            corrBankInfo={data?.correspondentBankInfo}
            isAccountManager={isAccountManager}
            replaceDots={replaceDots}
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
          <Tax
            proId={id}
            info={{
              taxInfo: data?.taxInfo ?? null,
              taxRate: data?.taxRate ?? null,
            }}
            edit={taxEdit}
            setEdit={setTaxEdit}
            isUpdatable={isAccountManager}
          />
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
