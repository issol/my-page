import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from './add-confirm-with-title-modal'
import Dialog from '@mui/material/Dialog'

interface CloseConfirmModalProps {
  message: string
  onClose: () => void
  onClick: () => void
}

const CloseConfirmModal = ({
  message,
  onClose,
  onClick,
}: CloseConfirmModalProps) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type='error' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {message}
        </Typography>

        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onClick()
              onClose()
            }}
          >
            Discard
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}

export default CloseConfirmModal
