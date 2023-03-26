import { Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import logger from '@src/@core/utils/logger'
import { UserPaymentInfoType } from '@src/apis/payment-info.api'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

import styled from 'styled-components'
import { ContentGrid } from '.'

type Props = {
  info: UserPaymentInfoType
  isAccountManager: boolean
  replaceDots: (value: string) => string
  getDetail: () => void
}

export default function BillingMethod({
  info,
  isAccountManager,
  replaceDots,
  getDetail,
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
            <Button
              variant='outlined'
              color='secondary'
              disabled={!isAccountManager || !info.type}
              onClick={getDetail}
            >
              Detail
            </Button>
          </Box>
        }
      />
      {!info.type ? (
        <div></div>
      ) : info.type === 'PayPal' ? (
        <BankBox>
          <Box display='flex' alignItems='center' gap='8px'>
            <Typography variant='h6'>PayPal</Typography>
            <img src='/images/misc/icon_paypal.png' alt='PayPal' />
          </Box>
          <Grid item xs={6}>
            <ContentGrid>
              <Typography sx={{ fontWeight: 'bold' }}>Email address</Typography>
              <Typography variant='body2'>
                {replaceDots(info.bankInfo?.email ?? '')}
              </Typography>
            </ContentGrid>
          </Grid>
        </BankBox>
      ) : (
        <BankBox>
          <Box display='flex' alignItems='center' gap='8px'>
            <Typography sx={{ fontWeight: 'bold' }}>
              {info.bankInfo?.accountName}
            </Typography>
            <CustomChip
              rounded
              label={info?.type}
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
                <Typography sx={{ fontWeight: 'bold' }}>
                  Account number
                </Typography>
                <Typography variant='body2'>
                  {replaceDots(info.bankInfo?.accountNumber ?? '')}
                </Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Routing number
                </Typography>
                <Typography variant='body2'>
                  {replaceDots(info.bankInfo?.routingNumber ?? '')}
                </Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>SWIFT code</Typography>
                <Typography variant='body2'>
                  {replaceDots(info.bankInfo?.swiftCode ?? '')}
                </Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>IBN number</Typography>
                <Typography variant='body2'>
                  {replaceDots(info.bankInfo?.ibnNumber ?? '')}
                </Typography>
              </ContentGrid>
            </Grid>

            <Grid item xs={6} sx={{ paddingLeft: '24px' }}>
              <Typography variant='body2' color='primary'>
                Corespondent bank info
              </Typography>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Account number
                </Typography>
                <Typography variant='body2'>
                  {replaceDots(info.correspondentBankInfo?.accountNumber ?? '')}
                </Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>
                  SWIFT code / BIC
                </Typography>
                <Typography variant='body2'>
                  {replaceDots(
                    info.correspondentBankInfo?.bankIdentifierCode ?? '',
                  )}
                </Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Others</Typography>
                <Typography variant='body2'>
                  {replaceDots(info.correspondentBankInfo?.others ?? '')}
                </Typography>
              </ContentGrid>
            </Grid>
          </Grid>
        </BankBox>
      )}
    </Card>
  )
}

const BankBox = styled(Box)`
  margin: 0 18px 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`
