import { Card, CardHeader, Grid, IconButton, Typography } from '@mui/material'

// ** context
import { Suspense, useContext, useState } from 'react'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** Hooks
import useClipboard from '@src/@core/hooks/useClipboard'

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
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { pro_payment } from '@src/shared/const/permission-class'
import { useQueryClient } from 'react-query'
import { Box } from '@mui/system'
import Icon from '@src/@core/components/icon'

type Props = {
  id: number
  userRole: string
}

const PaymentInfo = ({ id, userRole }: Props) => {
  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)

  const User = new pro_payment(auth.getValue().user?.id!)
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

  const downloadFile = (file: FileItemType) => {
    if (!file?.id) return

    getProPaymentFile(file.id).then(res => {
      const url = window.URL.createObjectURL(res)
      const anchorElement = document.createElement('a')

      anchorElement.href = url
      anchorElement.download = file.fileName

      document.body.appendChild(anchorElement)
      anchorElement.click()

      setTimeout((_: any) => {
        window.URL.revokeObjectURL(url)
      }, 60000)

      anchorElement.remove()
    })
  }

  const downloadAllFile = (files: FileItemType[] | null) => {
    if (!files) return
    files.forEach(file => downloadFile(file))
  }

  const uploadFiles = (files: File[]) => {
    files.forEach(file => {
      const formData = new FormData()
      formData.append('file', file)
      uploadProPaymentFile('additional', formData)
    })
    setTimeout(() => {
      invalidatePaymentInfo()
    }, 1500)
  }

  const onDeleteFile = (file: FileItemType) => {
    if (file.id) {
      deleteProPaymentFile(file.id!)
        .then(() => invalidatePaymentInfo())
        .catch(() => onError())
    }
  }

  const onError = () => {
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
              onCopy={onCopy}
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
  display: grid;
  grid-template-columns: 134px 1fr;
  align-items: center;
  gap: 12px 16px;

  & > div {
    line-height: 24px;
    height: 24px;
  }
`

interface CopyTextRowProps {
  title: string
  value?: string
  isCopyButton: boolean
  onCopy: (info: string) => void
}

export const CopyTextRow = ({
  title,
  value,
  isCopyButton,
  onCopy,
}: CopyTextRowProps) => {
  return (
    <>
      <Typography fontWeight={600}>{title}</Typography>
      <Box display='flex' alignItems='center'>
        <Typography variant='body2'>{value ? value : '-'}</Typography>
        {isCopyButton && (
          <IconButton onClick={() => onCopy(value ?? '')}>
            <Icon icon='mdi:content-copy' fontSize={20} />
          </IconButton>
        )}
      </Box>
    </>
  )
}

export default PaymentInfo
