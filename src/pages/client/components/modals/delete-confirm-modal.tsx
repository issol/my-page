import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  message: string
  title?: string
  onClose: () => void
  onDelete: () => void
}
export default function DeleteConfirmModal({
  message,
  title,
  onClose,
  onDelete,
}: Props) {
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
        {title ? (
          <TitleTypography
            mt='8px'
            variant='body2'
            fontSize='1rem'
            fontWeight='bold'
          >
            {title}
          </TitleTypography>
        ) : null}

        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            Delete
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
