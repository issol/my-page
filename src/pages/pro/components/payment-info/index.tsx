import { Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { IconButton, Tooltip } from '@mui/material'

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
    <Grid container spacing={6}>
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
