import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'

type Props = {
  open: boolean
  onDiscard: () => void
  onClose: () => void
}
export default function DiscardContactPersonModal({
  open,
  onDiscard,
  onClose,
}: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={open}
    >
      <SmallModalContainer>
        <AlertIcon type='error' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to discard this contact person?
        </Typography>
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onDiscard()
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
