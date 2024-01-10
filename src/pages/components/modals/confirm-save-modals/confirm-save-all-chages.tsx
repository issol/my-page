import { Box, Button, Dialog, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/pages/client/components/modals/add-confirm-with-title-modal'

type Props = {
  onClose: () => void
  onSave: () => void
}
export default function ConfirmSaveAllChanges({ onClose, onSave }: Props) {
  return (
    <Dialog open={true}>
      <SmallModalContainer style={{ padding: '20px 30px' }}>
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
              onSave()
              onClose()
            }}
          >
            Save
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
