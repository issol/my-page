import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  message: string
  title?: string
  onClose: () => void
}
export default function InfoConfirmModal({ message, onClose, title }: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type='error' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {message}
        </Typography>
        <TitleTypography
          variant='body1'
          textAlign='center'
          fontWeight='bold'
          mt='10px'
        >
          {title}
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
