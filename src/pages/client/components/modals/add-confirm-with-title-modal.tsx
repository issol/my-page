import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  message: string
  title?: string
  onClose: () => void
  onClick: () => void
}
export default function AddConfirmModal({
  message,
  title,
  onClose,
  onClick,
}: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type='successful' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {message}
        </Typography>
        {title ? <TitleTypography fontWeight={'bold'}>{title}</TitleTypography> : null}
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onClick()
              onClose()
            }}
          >
            Add
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
