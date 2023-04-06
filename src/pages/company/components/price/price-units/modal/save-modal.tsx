import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'

type Props = {
  open: boolean
  onSave: (() => void) | undefined
  onClose: () => void
}
export default function SaveModal({ open, onSave, onClose }: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-save-dialog'
      open={open}
    >
      <SmallModalContainer>
        <AlertIcon type='successful' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to save all changes?
        </Typography>
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onSave && onSave()
              // onClose()
            }}
          >
            Save
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
