import {
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
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
  onCopy: (info: string) => void
  info: BillingMethodUnionType | undefined
  bankInfo: BankInfo | undefined
  corrBankInfo: CorrespondentBankInfo | undefined | null
  isAccountManager: boolean
  replaceDots: (value: string) => string
}

export default function BillingMethod({
  onCopy,
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

                <Box display='flex' alignItems='center'>
                  <Typography variant='body2'>
                    {/* @ts-ignore */}
                    {replaceDots(info?.email)}
                  </Typography>
                  {/* @ts-ignore */}
                  {isAccountManager && info?.email && (
                    //@ts-ignore
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
                <Typography variant='body2' color='primary'>
                  Bank info.
                </Typography>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Account number
                  </Typography>
                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {bankInfo?.accountNumber
                        ? replaceDots(bankInfo?.accountNumber)
                        : '-'}
                    </Typography>
                    {isAccountManager && bankInfo?.accountNumber && (
                      <IconButton
                        onClick={() => onCopy(bankInfo?.accountNumber ?? '')}
                      >
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Routing number
                  </Typography>
                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {bankInfo?.routingNumber
                        ? replaceDots(bankInfo?.routingNumber)
                        : '-'}
                    </Typography>
                    {isAccountManager && bankInfo?.routingNumber && (
                      <IconButton
                        onClick={() => onCopy(bankInfo?.routingNumber ?? '')}
                      >
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
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

                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {bankInfo?.iban ? replaceDots(bankInfo?.iban) : '-'}
                    </Typography>
                    {isAccountManager && bankInfo?.iban && (
                      <IconButton onClick={() => onCopy(bankInfo?.iban ?? '')}>
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
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
                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {corrBankInfo?.accountNumber
                        ? replaceDots(corrBankInfo?.accountNumber)
                        : '-'}
                    </Typography>
                    {isAccountManager && corrBankInfo?.accountNumber && (
                      <IconButton
                        onClick={() =>
                          onCopy(corrBankInfo?.accountNumber ?? '')
                        }
                      >
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    SWIFT code / BIC
                  </Typography>
                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {corrBankInfo?.swiftCode
                        ? replaceDots(corrBankInfo?.swiftCode)
                        : '-'}
                    </Typography>
                    {isAccountManager && corrBankInfo?.swiftCode && (
                      <IconButton
                        onClick={() => onCopy(corrBankInfo?.swiftCode ?? '')}
                      >
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>IBAN</Typography>
                  <Box display='flex' alignItems='center'>
                    <Typography variant='body2'>
                      {corrBankInfo?.iban
                        ? replaceDots(corrBankInfo?.iban)
                        : '-'}
                    </Typography>
                    {isAccountManager && corrBankInfo?.iban && (
                      <IconButton
                        onClick={() => onCopy(corrBankInfo?.iban ?? '')}
                      >
                        <Icon icon='mdi:content-copy' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                </ContentGrid>
              </Grid>
            </Grid>
          </>
        )}
      </BorderBox>
    </Card>
  )
}
