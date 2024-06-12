import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'

import { TitleTypography } from '@src/@core/styles/typography'
import Dialog from '@mui/material/Dialog'
import { SmallModalContainer } from 'src/pages/[companyName]/client/components/modals/add-confirm-with-title-modal'

type Props = {
  open: boolean
  title: string
  onAdd: (() => void) | undefined
  onClose: () => void
}
export default function AddModal({ open, title, onAdd, onClose }: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={open}
    >
      <SmallModalContainer>
        <AlertIcon type='successful' />
        <Typography variant='body1' textAlign='center' mt='10px'>
          Are you sure you want to add this price unit?
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
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onAdd && onAdd()
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
