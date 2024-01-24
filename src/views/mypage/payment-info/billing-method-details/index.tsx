import { Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import {
  BankInfo,
  BillingMethodUnionType,
  CorrespondentBankInfo,
  KoreaDomesticTransferSoloType,
  KoreaDomesticTransferType,
  ProPaymentType,
  TransferWiseFormType,
  proPaymentMethodPairs,
} from '@src/types/payment-info/pro/billing-method.type'

// ** Custom Components Imports
import CustomChip from '@src/@core/components/mui/chip'

import { styled } from '@mui/system'
import { Icon } from '@iconify/react'
import { downloadStateFile } from '@src/shared/helpers/file-download.helper'

type Props = {
  billingMethod: ProPaymentType | null
  info: BillingMethodUnionType | undefined
  bankInfo: BankInfo | undefined
  corrBankInfo: CorrespondentBankInfo | undefined | null
}

export default function BillingMethodDetail({
  billingMethod,
  info,
  bankInfo,
  corrBankInfo,
}: Props) {
  function renderDetails() {
    if (!info) return null
    switch (billingMethod) {
      case 'internationalWire':
      case 'wise':
      case 'us_ach':
      case 'paypal':
        const transferData = info as TransferWiseFormType
        return (
          <BorderBox>
            <Box display='flex' flexDirection='column' gap='10px'>
              <Typography fontWeight={600}>
                Personal (Social security) ID
              </Typography>
              <Typography variant='body2'>
                {transferData?.personalId}
              </Typography>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography fontWeight={600}>Copy of ID</Typography>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<Icon icon='ic:baseline-download' />}
                  onClick={() => downloadStateFile(transferData?.copyOfId!)}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </BorderBox>
        )
      case 'koreaDomesticTransfer':
        //@ts-ignore
        const isSolo = !info?.copyOfBankStatement
        if (isSolo) {
          const koreanSoloData = info as KoreaDomesticTransferSoloType
          return (
            <>
              <BorderBox>
                <Box display='flex' flexDirection='column' gap='10px'>
                  <Typography fontWeight={600}>
                    Business Registration Number
                  </Typography>
                  <Typography variant='body2'>
                    {koreanSoloData?.businessNumber}
                  </Typography>
                  <Typography fontWeight={600}>Business Name</Typography>
                  <Typography variant='body2'>
                    {koreanSoloData?.businessName}
                  </Typography>

                  <Typography fontWeight={600}>
                    Copy of Business Registration Certificate
                  </Typography>
                  <Button
                    sx={{ width: '116px' }}
                    size='small'
                    variant='outlined'
                    startIcon={<Icon icon='ic:baseline-download' />}
                    onClick={() =>
                      downloadStateFile(koreanSoloData.copyOfRrCard!)
                    }
                  >
                    Download
                  </Button>
                </Box>
              </BorderBox>
            </>
          )
        }
        const koreanData = info as KoreaDomesticTransferType

        return (
          <>
            <BorderBox>
              <Box display='flex' flexDirection='column' gap='10px'>
                <Typography fontWeight={600}>
                  Resident registration number
                </Typography>
                <Typography variant='body2'>{koreanData?.rrn}</Typography>
                <Typography fontWeight={600}>
                  Copy of Resident Registration Card
                </Typography>
                <Button
                  sx={{ width: '116px' }}
                  size='small'
                  variant='outlined'
                  startIcon={<Icon icon='ic:baseline-download' />}
                  onClick={() => downloadStateFile(koreanData.copyOfRrCard!)}
                >
                  Download
                </Button>
              </Box>
            </BorderBox>
            <BorderBox mt={6}>
              <Box display='flex' flexDirection='column' gap='10px'>
                <Typography fontWeight={600}>Copy of bank statement</Typography>
                <Button
                  sx={{ width: '116px' }}
                  size='small'
                  variant='outlined'
                  startIcon={<Icon icon='ic:baseline-download' />}
                  onClick={() =>
                    downloadStateFile(koreanData.copyOfBankStatement!)
                  }
                >
                  Download
                </Button>
              </Box>
            </BorderBox>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={8}>
        <Box
          sx={
            info && {
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid rgba(76, 78, 100, 0.12)',
            }
          }
        >
          {!info?.type ? null : info?.type === 'paypal' ? (
            <>
              <Box display='flex' alignItems='center' gap='8px'>
                <Typography fontWeight={600}>PayPal</Typography>
                <img src='/images/misc/icon_paypal.png' alt='PayPal' />
              </Box>
              <Grid item xs={6}>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 600 }}>
                    Email address
                  </Typography>
                  {/* @ts-ignore */}
                  <Typography variant='body2'>{info?.email}</Typography>
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
                      {bankInfo?.accountNumber ? bankInfo?.accountNumber : '-'}
                    </Typography>
                  </ContentGrid>
                  <ContentGrid>
                    <Typography sx={{ fontWeight: 600 }}>
                      Routing number
                    </Typography>
                    <Typography variant='body2'>
                      {bankInfo?.routingNumber ? bankInfo?.routingNumber : '-'}
                    </Typography>
                  </ContentGrid>
                  <ContentGrid>
                    <Typography sx={{ fontWeight: 600 }}>SWIFT code</Typography>
                    <Typography variant='body2'>
                      {bankInfo?.swiftCode ? bankInfo?.swiftCode : '-'}
                    </Typography>
                  </ContentGrid>
                  <ContentGrid>
                    <Typography sx={{ fontWeight: 600 }}>IBAN</Typography>
                    <Typography variant='body2'>
                      {bankInfo?.iban ? bankInfo?.iban : '-'}
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
                        ? corrBankInfo?.accountNumber
                        : '-'}
                    </Typography>
                  </ContentGrid>
                  <ContentGrid>
                    <Typography sx={{ fontWeight: 600 }}>
                      SWIFT code / BIC
                    </Typography>
                    <Typography variant='body2'>
                      {corrBankInfo?.swiftCode ? corrBankInfo?.swiftCode : '-'}
                    </Typography>
                  </ContentGrid>
                  <ContentGrid>
                    <Typography sx={{ fontWeight: 600 }}>IBAN</Typography>
                    <Typography variant='body2'>
                      {corrBankInfo?.iban ? corrBankInfo?.iban : '-'}
                    </Typography>
                  </ContentGrid>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Grid>
      <Grid item xs={4}>
        {renderDetails()}
      </Grid>
    </Grid>
  )
}

const ContentGrid = styled('div')`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`

const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`
