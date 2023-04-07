import { Grid } from '@mui/material'

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
import BillingAddress from './billing-address'

// ** actions
import { useGetUserPaymentInfo } from '@src/queries/payment-info.query'
import { downloadPersonalInfoFile } from '@src/apis/payment-info.api'

import logger from '@src/@core/utils/logger'
import FallbackSpinner from '@src/@core/components/spinner'
import { useEffect } from 'react'

type Props = {
  id: number
}

export default function PaymentInfo({ id }: Props) {
  const ability = useContext(AbilityContext)
  const isAccountManager = ability.can('read', 'account_manage')

  const clipboard = useClipboard()

  const [isManagerRequest, setIsManagerRequest] = useState(false)

  const { data, refetch } = useGetUserPaymentInfo(id, isManagerRequest)

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

  function fetchFile(fileName: string) {
    downloadPersonalInfoFile(id, fileName)
      .then(res => {
        logger.info(`${fileName} file download has been succeed : `, res)
        const url = window.URL.createObjectURL(res)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${fileName}`)
        document.body.appendChild(link)
        link.click()
      })
      .catch(err =>
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        ),
      )
  }

  function downloadFile(name: string) {
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

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6} mt='6px'>
        <Grid item xs={12} md={4} lg={4}>
          <PersonalInfo
            onCopy={onCopy}
            info={data?.userInfo!}
            isAccountManager={isAccountManager}
            replaceDots={replaceDots}
            downloadFile={downloadFile}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <BillingMethod
            info={data!}
            isAccountManager={isAccountManager}
            replaceDots={replaceDots}
            getDetail={getDetail}
          />
          <BillingAddress
            info={data?.billingAddress!}
            replaceDots={replaceDots}
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
