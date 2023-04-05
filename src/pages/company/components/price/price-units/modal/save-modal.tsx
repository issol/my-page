import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  onSave: () => void
  onClose: () => void
}
export default function SaveModal({ onSave, onClose }: Props) {
  return (
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
            onSave()
            onClose()
          }}
        >
          Save
        </Button>
      </Box>
    </SmallModalContainer>
  )
}
