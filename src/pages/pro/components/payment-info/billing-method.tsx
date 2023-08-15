import { Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import logger from '@src/@core/utils/logger'
import { ProPaymentInfoType } from '@src/apis/payment-info.api'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import styled from 'styled-components'
import { ContentGrid } from '.'
import {
  BankInfo,
  BillingMethodUnionType,
  CorrespondentBankInfo,
  ProPaymentType,
  proPaymentMethodPairs,
} from '@src/types/payment-info/pro/billing-method.type'
import { BorderBox } from '@src/@core/components/detail-info'

type Props = {
  info: BillingMethodUnionType | undefined
  bankInfo: BankInfo | undefined
  corrBankInfo: CorrespondentBankInfo | undefined | null
  isAccountManager: boolean
  replaceDots: (value: string) => string
}

export default function BillingMethod({
  info,
  bankInfo,
  corrBankInfo,
  isAccountManager,
  replaceDots,
}: Props) {
  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>Billing Method (Account)</Typography>
          </Box>
        }
      />
      <BorderBox sx={{ margin: '24px' }}>
        {!info?.type ? null : info?.type === 'paypal' ? (
          <>
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography fontWeight={600}>PayPal</Typography>
              <img src='/images/misc/icon_paypal.png' alt='PayPal' />
            </Box>
            <Grid item xs={6}>
              <ContentGrid>
                <Typography sx={{ fontWeight: 600 }}>Email address</Typography>
                <Typography variant='body2'>
                  {/* @ts-ignore */}
                  {replaceDots(info?.email)}
                </Typography>
              </ContentGrid>
            </Grid>
          </>
        ) : (
          <>
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography sx={{ fontWeight: 600 }}>
                {bankInfo?.bankName}
              </Typography>
              <CustomChip
                rounded
                label={
                  proPaymentMethodPairs.find(i => i.value === info?.type)
                    ?.label || ''
                }
                skin='light'
                color='info'
                size='small'
              />
            </Box>
            <Grid container mt={6}>
              <Grid
                item
                xs={6}
                sx={{ borderRight: '1px solid rgba(76, 78, 100, 0.12)' }}
              >
                <Typography variant='body2' color='primary'>
                  Bank info.
                </Typography>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Account number
                  </Typography>
                  <Typography variant='body2'>
                    {bankInfo?.accountNumber
                      ? replaceDots(bankInfo?.accountNumber)
                      : '-'}
                  </Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Routing number
                  </Typography>
                  <Typography variant='body2'>
                    {bankInfo?.routingNumber
                      ? replaceDots(bankInfo?.routingNumber)
                      : '-'}
                  </Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>SWIFT code</Typography>
                  <Typography variant='body2'>
                    {bankInfo?.swiftCode
                      ? replaceDots(bankInfo?.swiftCode)
                      : '-'}
                  </Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>IBAN</Typography>
                  <Typography variant='body2'>
                    {bankInfo?.iban ? replaceDots(bankInfo?.iban) : '-'}
                  </Typography>
                </ContentGrid>
              </Grid>

              <Grid item xs={6} sx={{ paddingLeft: '24px' }}>
                <Typography variant='body2' color='primary'>
                  Corespondent bank info
                </Typography>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Routing number
                  </Typography>
                  <Typography variant='body2'>
                    {corrBankInfo?.accountNumber
                      ? replaceDots(corrBankInfo?.accountNumber)
                      : '-'}
                  </Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    SWIFT code / BIC
                  </Typography>
                  <Typography variant='body2'>
                    {corrBankInfo?.swiftCode
                      ? replaceDots(corrBankInfo?.swiftCode)
                      : '-'}
                  </Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>IBAN</Typography>
                  <Typography variant='body2'>
                    {corrBankInfo?.iban ? replaceDots(corrBankInfo?.iban) : '-'}
                  </Typography>
                </ContentGrid>
              </Grid>
            </Grid>
          </>
        )}
      </BorderBox>
    </Card>
  )
}
