import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// TODO: 실데이터로 교체하기
export default function InvoiceAmount() {
  function renderRow(
    label: string,
    price: string,
    icon = true,
    color?: string,
  ) {
    return (
      <FlexBox justifyContent='space-between' width='360px'>
        <FlexBox>
          {!icon ? null : <Icon icon='bi:square-fill' color={color} />}
          <Typography variant='body2'>{label}</Typography>
        </FlexBox>
        <Typography variant='body2' fontSize='1rem' fontWeight={600}>
          {price}
        </Typography>
      </FlexBox>
    )
  }
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={5}>
        <Card sx={{ background: 'rgba(102, 108, 255, 0.7)' }}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '34px 0 24px',
            }}
          >
            <Box>
              <Typography color='#ffffff' variant='body2'>
                Total
              </Typography>
              <Typography color='#ffffff' fontSize={34} fontWeight={600}>
                ₩ 234,000
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={7}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <FlexBox flexDirection='column' width='360px'>
              {renderRow('Subtotal', '₩ 305,000', true, '#B3B6FF')}
              {renderRow('Tax', '-₩ 305,000', true, '#666CFF')}
              <Box width='360px'>
                <Divider />
              </Box>
              {renderRow('In total', '₩ 305,000', false)}
            </FlexBox>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const FlexBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`
