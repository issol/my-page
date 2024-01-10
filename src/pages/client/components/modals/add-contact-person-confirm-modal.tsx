import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'

interface AddContactPersonConfirmModalProps {
  formMode: 'create' | 'update'
  open: boolean
  onAdd: () => void
  onClose: () => void
}

const AddContactPersonConfirmModal = ({
  formMode,
  open,
  onAdd,
  onClose,
}: AddContactPersonConfirmModalProps) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={open}
    >
      <SmallModalContainer>
        <AlertIcon type='successful' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {formMode === 'create' &&
            'Are you sure you want to add this contact person?'}
          {formMode === 'update' &&
            'Are you sure you want to save all changes?'}
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
            {formMode === 'create' && 'Add'}
            {formMode === 'update' && 'Save'}
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}

export default AddContactPersonConfirmModal
