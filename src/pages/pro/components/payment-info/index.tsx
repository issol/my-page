import { Grid } from '@mui/material'

// ** context
import { useContext } from 'react'
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

type Props = {
  id: number
}

export default function PaymentInfo({ id }: Props) {
  const ability = useContext(AbilityContext)

  const clipboard = useClipboard()

  const { data } = useGetUserPaymentInfo(id)

  const isAccountManager = ability.can('read', 'account_manage')

  const onCopy = (info: string) => {
    clipboard.copy(info)
    toast.success('The source code has been copied to your clipboard.', {
      duration: 2000,
    })
  }

  const replaceDots = (value: string) => {
    if (!value) return '-'
    return value.replaceAll('*', '●')
  }

  return (
    <Grid container spacing={6} mt='6px'>
      <Grid item xs={4}>
        <PersonalInfo
          onCopy={onCopy}
          info={data?.userInfo!}
          isAccountManager={isAccountManager}
          replaceDots={replaceDots}
        />
      </Grid>
      <Grid item xs={8}>
        <BillingMethod
          info={data!}
          isAccountManager={isAccountManager}
          replaceDots={replaceDots}
        />
        <BillingAddress
          info={data?.billingAddress!}
          replaceDots={replaceDots}
        />
      </Grid>
    </Grid>
  )
}

export const ContentGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`
