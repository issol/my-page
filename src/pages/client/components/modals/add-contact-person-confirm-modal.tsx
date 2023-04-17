import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'

type Props = {
  open: boolean
  onAdd: () => void
  onClose: () => void
}
export default function AddContactPersonConfirmModal({
  open,
  onAdd,
  onClose,
}: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={open}
    >
      <SmallModalContainer>
        <AlertIcon type='successful' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to add this contact person?
        </Typography>
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onAdd()
              onClose()
            }}
          >
            Add
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
