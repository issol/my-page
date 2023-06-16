import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import OfficeDetails from './office-details'
import BillingAddress from './billing-address'
import { useState } from 'react'
import { Icon } from '@iconify/react'

type Props = {
  clientId: number
}

export default function PaymentInfo({ clientId }: Props) {
  const [editAddress, setEditAddress] = useState(false)
  return (
    <Grid container spacing={6}>
      <Grid item xs={9}>
        <OfficeDetails clientId={clientId} />
      </Grid>
      <Grid item xs={9}>
        <Card>
          <CardHeader
            title={
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='h6'>Billing Address</Typography>
                <IconButton onClick={() => setEditAddress(!editAddress)}>
                  <Icon icon='mdi:pencil-outline' />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            <BillingAddress /* clientId={clientId}  */ />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
