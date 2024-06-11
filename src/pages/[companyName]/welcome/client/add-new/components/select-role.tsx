import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  Radio,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

import { ClientClassificationType } from '@src/context/types'

type Props = {
  clientType: ClientClassificationType | null
  setClientType: (n: ClientClassificationType | null) => void
  setStep: (n: 1 | 2) => void
}
export default function SelectClientRole({
  clientType,
  setClientType,
  setStep,
}: Props) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display='flex' justifyContent='center' mb={6}>
        <Typography variant='h4'>Select your type</Typography>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center'>
        <Box display='flex' gap='40px'>
          <Card>
            <CustomCardContent>
              <img
                src='/images/client/corporate.png'
                width={200}
                height={200}
                alt='corporate client'
                aria-hidden
              />
              <InputLabel htmlFor='corporate' sx={{ textAlign: 'center' }}>
                <Typography color='primary'>Corporate client</Typography>
              </InputLabel>

              <Radio
                id='corporate'
                value='corporate'
                name='clients'
                onChange={e =>
                  setClientType(e.target.value as ClientClassificationType)
                }
                checked={clientType === 'corporate'}
                inputProps={{ 'aria-label': 'corporate client' }}
              />
            </CustomCardContent>
          </Card>
          <Card>
            <CustomCardContent>
              <img
                src='/images/client/corporate_non_korean.png'
                width={200}
                height={200}
                alt='corporate_client_non_korean'
                aria-hidden
              />
              <InputLabel
                htmlFor='corporate_non_korean'
                sx={{ textAlign: 'center' }}
              >
                <Typography color='primary'>
                  Corporate client
                  <br />
                  (Non-Korean)
                </Typography>
              </InputLabel>

              <Radio
                id='corporate_non_korean'
                value='corporate_non_korean'
                name='clients'
                onChange={e =>
                  setClientType(e.target.value as ClientClassificationType)
                }
                checked={clientType === 'corporate_non_korean'}
                inputProps={{ 'aria-label': 'corporate non korean client' }}
              />
            </CustomCardContent>
          </Card>
          <Card>
            <CustomCardContent>
              <img
                src='/images/client/individual.png'
                width={200}
                height={200}
                alt='individual'
                aria-hidden
              />
              <InputLabel htmlFor='individual' sx={{ textAlign: 'center' }}>
                <Typography color='primary'>Individual client</Typography>
              </InputLabel>

              <Radio
                id='individual'
                value='individual'
                name='clients'
                onChange={e =>
                  setClientType(e.target.value as ClientClassificationType)
                }
                checked={clientType === 'individual'}
                inputProps={{ 'aria-label': 'individual client' }}
              />
            </CustomCardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' mt={6}>
        <Button
          variant='contained'
          disabled={!clientType}
          onClick={() => setStep(2)}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}

const CustomCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`
