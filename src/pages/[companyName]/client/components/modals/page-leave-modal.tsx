import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from './add-confirm-with-title-modal'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  onClose: () => void
  onClick: () => void
}
export default function PageLeaveModal({ onClose, onClick }: Props) {
  return (
    <SmallModalContainer style={{ minWidth: '440px' }}>
      <AlertIcon type='error' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        Are you sure you want to leave this page? Changes you made may not be
        saved.
      </Typography>

      <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
        <Button variant='outlined' onClick={onClose}>
          Stay on this page
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            onClick()
            onClose()
          }}
        >
          Leave this page
        </Button>
      </Box>
    </SmallModalContainer>
  )
}
