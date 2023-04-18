import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  clientName: string
  onAdd: () => void
  onClose: () => void
}
export default function ConfirmCreateClientModal({
  clientName,
  onAdd,
  onClose,
}: Props) {
  return (
    <SmallModalContainer>
      <AlertIcon type='successful' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        Are you sure you want to add this client?
      </Typography>
      <TitleTypography
        variant='body1'
        textAlign='center'
        fontWeight='bold'
        mt='10px'
      >
        {clientName}
      </TitleTypography>
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
  )
}
