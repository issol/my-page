import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  open: boolean
  clientName: string
  onClose: () => void
}
export default function CannotDeleteClientModal({
  open,
  clientName,
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
          This client cannot be deleted because it’s already registered on other
          pages.
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
          <Button variant='contained' onClick={onClose}>
            Okay
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
