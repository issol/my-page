import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'

import { TitleTypography } from '@src/@core/styles/typography'
import { SmallModalContainer } from '@src/pages/client/components/modals/add-confirm-with-title-modal'
import { PriceUnitType } from '@src/types/common/standard-price'

type Props = {
  row: PriceUnitType
  onDelete: (row: PriceUnitType) => void
  onClose: () => void
}
export default function DeleteModal({ row, onDelete, onClose }: Props) {
  // console.log(row)
  const message = !row.isBase
    ? 'Are you sure you want to delete this price unit?'
    : 'Are you sure you want to delete this base price unit? The associated price units will also be deleted.'
  return (
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
        {row.title}
      </TitleTypography>
      <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            onDelete(row)
            onClose()
          }}
        >
          Delete
        </Button>
      </Box>
    </SmallModalContainer>
  )
}
