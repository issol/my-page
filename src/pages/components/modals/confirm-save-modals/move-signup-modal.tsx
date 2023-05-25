import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  onClose: () => void
  onConfirm: () => void
}
export default function MoveSignupModal({ onClose, onConfirm }: Props) {
  return (
    <SmallModalContainer>
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
        <AlertIcon type='error' />
      </Box>
      <Typography variant='body1'>
        Your account has not been registered yet.
        <br />
        Would you like to go to the sign-up page?
      </Typography>
      <Box display='flex' gap='20px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Confirm
          </Button>
      </Box>
    </SmallModalContainer>
  )
}
