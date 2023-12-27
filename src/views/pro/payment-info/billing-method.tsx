import { Card, CardHeader, Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from '@src/@core/components/icon'
import CustomChip from '@src/@core/components/mui/chip'
import { ContentGrid, CopyTextRow } from './index'
import {
  BankInfo,
  BillingMethodUnionType,
  CorrespondentBankInfo,
  proPaymentMethodPairs,
} from '@src/types/payment-info/pro/billing-method.type'
import { BorderBox } from '@src/@core/components/detail-info'

interface BillingMethodProps {
  onCopy: (info: string) => void
  info: BillingMethodUnionType | undefined
  bankInfo: BankInfo | undefined
  corrBankInfo: CorrespondentBankInfo | undefined | null
  isAccountManager: boolean
  replaceDots: (value: string) => string
}

const BillingMethod = ({
  onCopy,
  info,
  bankInfo,
  corrBankInfo,
  isAccountManager,
  replaceDots,
}: BillingMethodProps) => {
  return (
    <Card>
      <CardHeader title='Billing Method (Account)' sx={{ paddingBottom: 0 }} />
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

                <Box display='flex' alignItems='center'>
                  <Typography variant='body2'>
                    {'email' in info && replaceDots(info?.email ?? '')}
                  </Typography>
                  {isAccountManager && 'email' in info && (
                    <IconButton onClick={() => onCopy(info?.email ?? '')}>
                      <Icon icon='mdi:content-copy' fontSize={20} />
                    </IconButton>
                  )}
                </Box>
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
                <Typography variant='body2' color='primary' mb={3}>
                  Bank info.
                </Typography>

                <ContentGrid>
                  <CopyTextRow
                    title='Account number'
                    value={bankInfo?.accountNumber}
                    isCopyButton={
                      (isAccountManager && !!bankInfo?.accountNumber) || false
                    }
                    onCopy={() => onCopy(bankInfo?.accountNumber ?? '')}
                  />
                  <CopyTextRow
                    title='Routing number'
                    value={bankInfo?.routingNumber}
                    isCopyButton={
                      (isAccountManager && !!bankInfo?.routingNumber) || false
                    }
                    onCopy={() => onCopy(bankInfo?.routingNumber ?? '')}
                  />
                  <CopyTextRow
                    title='SWIFT code'
                    value={bankInfo?.swiftCode}
                    isCopyButton={
                      (isAccountManager && !!bankInfo?.swiftCode) || false
                    }
                    onCopy={() => onCopy(bankInfo?.swiftCode ?? '')}
                  />

                  <CopyTextRow
                    title='IBAN number'
                    value={bankInfo?.iban}
                    isCopyButton={
                      (isAccountManager && !!bankInfo?.iban) || false
                    }
                    onCopy={() => onCopy(bankInfo?.iban ?? '')}
                  />
                </ContentGrid>
              </Grid>

              <Grid item xs={6} pl={6}>
                <Typography variant='body2' color='primary' mb={3}>
                  Corespondent bank info
                </Typography>
                <ContentGrid>
                  <CopyTextRow
                    title='Account number'
                    value={corrBankInfo?.accountNumber}
                    isCopyButton={
                      (isAccountManager && !!corrBankInfo?.accountNumber) ||
                      false
                    }
                    onCopy={() => onCopy(corrBankInfo?.accountNumber ?? '')}
                  />
                  <CopyTextRow
                    title='SWIFT code / BIC'
                    value={corrBankInfo?.swiftCode}
                    isCopyButton={
                      (isAccountManager && !!corrBankInfo?.swiftCode) || false
                    }
                    onCopy={() => onCopy(corrBankInfo?.swiftCode ?? '')}
                  />

                  <CopyTextRow
                    title='Others'
                    value={corrBankInfo?.iban}
                    isCopyButton={
                      (isAccountManager && !!corrBankInfo?.iban) || false
                    }
                    onCopy={() => onCopy(corrBankInfo?.iban ?? '')}
                  />
                </ContentGrid>
              </Grid>
            </Grid>
          </>
        )}
      </BorderBox>
    </Card>
  )
}

export default BillingMethod
