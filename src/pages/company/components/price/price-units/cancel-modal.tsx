import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'

type Props = {
  onCancelBasePrice: () => void
  onClose: () => void
}
export default function CancelModal({ onCancelBasePrice, onClose }: Props) {
  return (
    <SmallModalContainer>
      <AlertIcon type='error' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        Are you sure you want to cancel the base price setting? The associated
        price units will be deleted.
      </Typography>
      <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
        <Button variant='outlined' onClick={onClose}>
          No
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            onCancelBasePrice()
            onClose()
          }}
        >
          Cancel
        </Button>
      </Box>
    </SmallModalContainer>
  )
}
