import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  isBasePrice: boolean
  title: string
  onDelete: () => void
  onClose: () => void
}
export default function DeleteModal({
  isBasePrice,
  title,
  onDelete,
  onClose,
}: Props) {
  const message = !isBasePrice
    ? 'Are you sure you want to delete this price unit?'
    : 'Are you sure you want to delete this base price unit? The associated price units will also be deleted.'
  return (
    <SmallModalContainer>
      <AlertIcon type='error' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        {message}
      </Typography>
      <TitleTypography variant='body1' textAlign='center' fontWeight='bold'>
        {title}
      </TitleTypography>
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
  )
}
