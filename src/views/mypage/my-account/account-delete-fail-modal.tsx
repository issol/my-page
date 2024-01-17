import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
import { CurrencyType } from '@src/types/common/standard-price'
import styled from '@emotion/styled'
type Props = {
  onClose: () => void
  reason: {
    corporationIds: string[]
    totalPrice: number
    currency: CurrencyType
  }
}
export default function AccountDeleteFailedModal({ onClose, reason }: Props) {
  return (
    <CustomBox>
      <Box display='flex' flexDirection='column' gap='16px' alignItems='center'>
        <AlertIcon type='error' />
        <Typography variant='h6'>Account deletion is not possible.</Typography>
        <ul>
          <li>
            <Typography variant='body2'>
              Unfinished job: {reason.corporationIds.join(',')}
            </Typography>
          </li>
          <li>
            <Typography variant='body2'>
              {getCurrencyMark(reason.currency)}
              {reason.totalPrice.toLocaleString()} of unsettled payment
            </Typography>
          </li>
        </ul>
        <Typography fontWeight={600} sx={{ display: 'block' }}>
          Please complete any unfinished jobs or invoices before requesting the
          deletion.
        </Typography>
        <Button variant='contained' onClick={onClose} sx={{ mt: '10px' }}>
          Okay
        </Button>
      </Box>
    </CustomBox>
  )
}

const CustomBox = styled(Box)`
  width: 362px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
`
