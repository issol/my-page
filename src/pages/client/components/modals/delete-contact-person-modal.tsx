import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'

type Props = {
  open: boolean
  onDelete: () => void
  onClose: () => void
}
export default function DeleteContactPersonModal({
  open,
  onDelete,
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
          Are you sure you want to delete this contact person?
        </Typography>
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            Delete
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
