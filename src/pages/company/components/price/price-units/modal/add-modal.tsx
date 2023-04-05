import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  title: string
  onAdd: () => void
  onClose: () => void
}
export default function AddModal({ title, onAdd, onClose }: Props) {
  return (
    <SmallModalContainer>
      <AlertIcon type='successful' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        Are you sure you want to add this price unit?
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
