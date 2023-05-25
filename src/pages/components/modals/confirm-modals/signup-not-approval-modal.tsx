import AlertIcon from '@src/@core/components/alert-icon'
import CircularProgress from '@mui/material/CircularProgress'
import { SmallModalContainer } from '@src/@core/components/modal'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  onClose: () => void
}
export default function SignupNotApprovalModal({ onClose }: Props) {
  return (
    <SmallModalContainer>
      {/* <AlertIcon type='error' /> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '68px',
          height: '68px',
          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF;',
          borderRadius: '68px',
        }}
      >
        <CircularProgress 
          style={{ color: '#666CFF' }}
          size={35}
          thickness={5}
        />
      </Box>
      <Typography variant='h6' textAlign='center' mt='10px' gap='20px'>
        Sign up approval for <span style={{ color: '#666CFF' }}>GloZ</span>{' '} is in
        <br />
        progress.
      </Typography>
      <Typography variant='body1'>
        <br />
        You can sign in once approved.
      </Typography>
      <Box display='flex' gap='20px' justifyContent='center' mt='26px'>
        <Button variant='contained' onClick={onClose}>
          Okey
        </Button>
      </Box>
    </SmallModalContainer>
  )
}
