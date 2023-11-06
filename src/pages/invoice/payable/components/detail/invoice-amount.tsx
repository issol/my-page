import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

import { formatCurrency, getCurrencyMark } from '@src/shared/helpers/price.helper'

import { InvoicePayableDetailType } from '@src/types/invoice/payable.type'

type Props = {
  data: InvoicePayableDetailType | undefined
}

export default function InvoiceAmount({ data }: Props) {
  // const currency = getCurrencyMark(data?.currency)
  function renderRow(
    label: string,
    price: number,
    icon = true,
    color?: string,
  ) {
    return (
      <FlexBox justifyContent='space-between' width='360px'>
        <FlexBox>
          {!icon ? null : <Icon icon='bi:square-fill' color={color} />}
          <Typography variant='body2'>{label}</Typography>
        </FlexBox>
        <Typography variant='body2' fontSize='1rem' fontWeight={600}>
          {label === 'Tax' ? (Math.sign(price) === 1 ? '+' : '-') : ''}&nbsp;
          {/* {`${data?.currency!} ${price.toLocaleString()}`} */}
          {formatCurrency(Math.abs(price), data?.currency!)}
        </Typography>
      </FlexBox>
    )
  }
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={5}>
        <Card sx={{ background: 'rgba(102, 108, 255, 0.7)' }}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '34px 0 24px',
            }}
          >
            <Box>
              <Typography color='#ffffff' variant='body2'>
                Total
              </Typography>
              <Typography color='#ffffff' fontSize={34} fontWeight={600}>
                {/* {`${currency} ${data?.totalPrice?.toLocaleString()}`} */}
                {formatCurrency(data?.totalPrice!, data?.currency!)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={7}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <FlexBox flexDirection='column' width='360px'>
              {renderRow('Subtotal', data?.subtotal ?? 0, true, '#B3B6FF')}

              {renderRow(
                'Tax',
                data?.taxRate ? Math.abs(data.subtotal * (data?.taxRate / 100)) : 0,
                true,
                '#666CFF',
              )}
              <Divider
                sx={{
                  width: '100%',
                  marginTop: '0 !important',
                  marginBottom: '0 !important',
                }}
              />
              {renderRow('In total', data?.totalPrice ?? 0, false)}
            </FlexBox>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const FlexBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`
