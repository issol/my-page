import { Button, Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

import styled from 'styled-components'
export default function ContractForm() {
  return (
    <Grid xs={12} container>
      <Card sx={{ width: '100%', margin: '0 96px', padding: '80px' }}>
        <Typography variant='h5' sx={{ textAlign: 'center' }}>
          Contract forms
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
          }}
          mt='24px'
        >
          {/* NDA */}
          <StyledBox>
            <img
              width={58}
              height={58}
              src='/images/icons/etc/icon-keyboad.png'
              alt='NDA'
            />
            <Typography
              variant='h5'
              sx={{ textAlign: 'center', margin: '12px 0' }}
            >
              NDA
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              Pros will sign the NDA before taking the certification test.
            </Typography>
            <Box display='flex' gap='8px' mt='12px'>
              <Button variant='outlined'>KOR</Button>
              <Button variant='outlined'>ENG</Button>
            </Box>
          </StyledBox>
          {/* Privacy */}
          <StyledBox>
            <img
              width={58}
              height={58}
              src='/images/icons/etc/icon-suitcase.png'
              alt='NDA'
            />
            <Typography
              variant='h5'
              sx={{ textAlign: 'center', margin: '12px 0' }}
            >
              Privacy contract
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              Pros will sign the Privacy contract after being onboarded.
            </Typography>
            <Box display='flex' gap='8px' mt='12px'>
              <Button variant='outlined'>KOR</Button>
              <Button variant='outlined'>ENG</Button>
            </Box>
          </StyledBox>
          {/* Freelancer */}
          <StyledBox>
            <img
              width={58}
              height={58}
              src='/images/icons/etc/icon-user.png'
              alt='NDA'
            />
            <Typography
              variant='h5'
              sx={{ textAlign: 'center', margin: '12px 0' }}
            >
              Freelancer contract
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              Pros will sign the Freelancer contract after being onboarded.
            </Typography>
            <Box display='flex' gap='8px' mt='12px'>
              <Button variant='outlined'>KOR</Button>
              <Button variant='outlined'>ENG</Button>
            </Box>
          </StyledBox>
        </Box>
      </Card>
    </Grid>
  )
}

ContractForm.acl = {
  action: 'update',
  subject: 'onboarding',
}

const StyledBox = styled(Box)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`
