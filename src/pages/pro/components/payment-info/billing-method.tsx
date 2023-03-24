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
}

export default function BillingMethod({ info }: Props) {
  logger.debug(info)
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
            <Button variant='outlined' color='secondary'>
              Detail
            </Button>
          </Box>
        }
      />
      {info.type === 'PayPal' ? (
        <BankBox></BankBox>
      ) : (
        <BankBox>
          <Box display='flex' alignItems='center' gap='8px'>
            <Typography sx={{ fontWeight: 'bold' }}>
              {info.bankInfo?.accountName}
            </Typography>
            <CustomChip
              rounded
              label='International wire'
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
                <Typography variant='body2'>123●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Routing number
                </Typography>
                <Typography variant='body2'>123●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>SWIFT code</Typography>
                <Typography variant='body2'>123●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>IBN number</Typography>
                <Typography variant='body2'>123●●●●●</Typography>
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
                <Typography variant='body2'>123●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>
                  SWIFT code / BIC
                </Typography>
                <Typography variant='body2'>BOF●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Others</Typography>
                <Typography variant='body2'>123●●●●●</Typography>
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
