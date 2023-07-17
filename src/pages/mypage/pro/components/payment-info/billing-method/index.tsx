import {
  Box,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import {
  ProPaymentType,
  proPaymentMethodPairs,
} from '@src/types/payment-info/pro/billing-method.type'
import { Fragment } from 'react'

type Props = {
  billingMethod: ProPaymentType | null
  setBillingMethod: (v: ProPaymentType | null) => void
}
export default function BillingMethod({
  billingMethod,
  setBillingMethod,
}: Props) {
  function renderLabel(label: string) {
    const regex = /^(.+?)(\(.+?\))$/
    const match = label.match(regex)

    if (match) {
      const title = match[1].trim()
      const subtitle = match[2].trim().slice(1, -1)
      return (
        <Box display='flex' flexDirection='column'>
          <Typography>{title}</Typography>
          <Typography variant='body2'>({subtitle})</Typography>
        </Box>
      )
    } else {
      return <Typography>{label}</Typography>
    }
  }

  return (
    <Fragment>
      <Box display='flex' gap='20px'>
        {proPaymentMethodPairs.map(method => (
          <CustomRadio key={method.value}>
            <Radio
              value={method.value}
              onChange={e => setBillingMethod(e.target.value as ProPaymentType)}
              checked={method.value === billingMethod}
            />
            {renderLabel(method.label)}
          </CustomRadio>
        ))}
      </Box>
    </Fragment>
  )
}

const CustomRadio = styled(Box)`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  padding-left: 5px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.22);
`
