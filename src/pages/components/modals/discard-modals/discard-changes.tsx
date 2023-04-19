import { Box, Button, Dialog, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'

type Props = {
  onClose: () => void
  onDiscard: () => void
}
export default function DiscardChangesModal({ onClose, onDiscard }: Props) {
  return (
    <Dialog open={true}>
      <SmallModalContainer style={{ padding: '20px 30px' }}>
        <AlertIcon type='error' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to discard all changes?
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
