import { Grid } from '@mui/material'

// ** Hooks
import useClipboard from 'src/@core/hooks/useClipboard'

import styled from 'styled-components'
import { toast } from 'react-hot-toast'
import PersonalInfo from './personal-info'
import BillingMethod from './billing-method'
import BillingAddress from './billing-address'
import { useGetUserPaymentInfo } from '@src/queries/payment-info.query'

type Props = {
  id: number
}

export default function PaymentInfo({ id }: Props) {
  const clipboard = useClipboard()

  const { data } = useGetUserPaymentInfo(id)

  const onCopy = () => {
    // clipboard.copy(codeToCopy())
    toast.success('The source code has been copied to your clipboard.', {
      duration: 2000,
    })
  }

  return (
    <Grid container spacing={6} mt='6px'>
      <Grid item xs={4}>
        <PersonalInfo onCopy={onCopy} info={data?.userInfo!} />
      </Grid>
      <Grid item xs={8}>
        <BillingMethod info={data!} />
        <BillingAddress info={data?.billingAddress!} />
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
