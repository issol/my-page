import { Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styled from 'styled-components'

import Icon from 'src/@core/components/icon'

export default function Tax() {
  return (
    <Card sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant='body2'>Tax</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:currency-usd' style={{ opacity: '0.7' }} />
          <LabelTitle>Tax info:</LabelTitle>
          <Label>Korean person</Label>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        mt='24px'
      >
        <Typography variant='body2'>Payment</Typography>
        <PaymentSectionBox>
          <SquareChip color='purple'>Domestic bank transfer</SquareChip>
        </PaymentSectionBox>
        <PaymentSectionBox>
          <SquareChip color='blue'>International wire</SquareChip>
        </PaymentSectionBox>
        <PaymentSectionBox>
          <SquareChip color='orange'>US ACH</SquareChip>
        </PaymentSectionBox>
      </Box>
    </Card>
  )
}

const LabelTitle = styled.label`
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`
const Label = styled.label`
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`

const PaymentSectionBox = styled.section`
  padding: 20px;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`
const SquareChip = styled.span<{ color: 'purple' | 'blue' | 'orange' }>`
  padding: 3px 4px;
  font-weight: 400;
  font-size: 0.813rem;
  line-height: 18px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    ${({ color }) =>
      color === 'purple'
        ? '#666cff'
        : color === 'blue'
        ? '#26C6F9'
        : '#FDB528'};
  color: ${({ color }) =>
    color === 'purple' ? '#666CFF' : color === 'blue' ? '#26C6F9' : '#FDB528'};
  border-radius: 4px;
`
