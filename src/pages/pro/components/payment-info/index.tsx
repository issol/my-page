import {
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { IconButton, Tooltip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks
import useClipboard from 'src/@core/hooks/useClipboard'

import styled from 'styled-components'
import { toast } from 'react-hot-toast'

export default function PaymentInfo() {
  const clipboard = useClipboard()

  const handleClick = () => {
    // clipboard.copy(codeToCopy())
    toast.success('The source code has been copied to your clipboard.', {
      duration: 2000,
    })
  }

  return (
    <Grid container spacing={6} mt='6px'>
      <Grid item xs={4}>
        <Card>
          <CardHeader title='Personal Info' />
          <CardBox>
            <img
              src='/images/cards/social-number.png'
              alt='social security number'
              aria-label='social security number'
              width={115}
              height={70}
            />
            <Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>
              Social Security number
            </Typography>
            <Typography variant='body2'>
              123-4567890
              <IconButton onClick={handleClick}>
                <Icon icon='mdi:content-copy' fontSize={20} />
              </IconButton>
            </Typography>
            <Button variant='outlined' sx={{ marginTop: '15px' }}>
              Download
            </Button>
          </CardBox>

          <CardBox>
            <img
              src='/images/cards/business-license.png'
              alt='social security number'
              aria-label='social security number'
              width={115}
              height={70}
            />
            <Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>
              W8/ W9/ Business license
            </Typography>

            <Button variant='outlined' sx={{ marginTop: '15px' }}>
              Download
            </Button>
          </CardBox>
        </Card>
      </Grid>
      <Grid item xs={8}>
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
                  startIcon={<Icon icon='material-symbols:upload-rounded' />}
                >
                  Export payment info
                </Button>
              </Box>
            }
          />
          <BankBox>
            <Box display='flex' alignItems='center' gap='8px'>
              <Typography sx={{ fontWeight: 'bold' }}>ABC Bank</Typography>
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
                  <Typography sx={{ fontWeight: 'bold' }}>
                    SWIFT code
                  </Typography>
                  <Typography variant='body2'>123●●●●●</Typography>
                </ContentGrid>
                <ContentGrid>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    IBN number
                  </Typography>
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
        </Card>

        {/* Billing address */}
        <Card style={{ marginTop: '24px' }}>
          <CardHeader title='Billing address' />

          <Grid container mt={6} margin='0 20px 20px'>
            <Grid item xs={6}>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Street 1</Typography>
                <Typography variant='body2'>●●●●●</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>City</Typography>
                <Typography variant='body2'>San Jose</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Country</Typography>
                <Typography variant='body2'>United States</Typography>
              </ContentGrid>
            </Grid>

            <Grid item xs={6} sx={{ paddingLeft: '24px' }}>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Street 2</Typography>
                <Typography variant='body2'>-</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>State</Typography>
                <Typography variant='body2'>California</Typography>
              </ContentGrid>
              <ContentGrid>
                <Typography sx={{ fontWeight: 'bold' }}>Zip code</Typography>
                <Typography variant='body2'>●●●●●</Typography>
              </ContentGrid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

const CardBox = styled(Box)`
  margin: 0 18px 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`

const BankBox = styled(Box)`
  margin: 0 18px 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`
const ContentGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`
