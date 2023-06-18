import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import OfficeDetails from './office-details'
import BillingAddress from './billing-address'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import useModal from '@src/hooks/useModal'
import ClientBillingAddressesForm from '../forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import ClientPaymentFiles from './forms/file-upload'

type Props = {
  clientId: number
}

/*
TODO:
1. BillingAddress에 실데이터 표기하기
2. BillingAddressForm에 form reset할 데이터 프롭으로 보내주기
3. billing address 저장 mutation붙이기
*/
export default function PaymentInfo({ clientId }: Props) {
  const { openModal, closeModal } = useModal()
  const [editAddress, setEditAddress] = useState(false)

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientAddressType>({
    defaultValues: { addressType: 'billing' },
    mode: 'onChange',
    resolver: yupResolver(clientBillingAddressSchema),
  })

  return (
    <Grid container spacing={6}>
      {/* office details */}
      <Grid item xs={9}>
        <OfficeDetails clientId={clientId} />
      </Grid>

      {/* billing address */}
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

      <Grid item xs={3}>
        <Card>
          <ClientPaymentFiles />
        </Card>
      </Grid>
      {/* billing address form */}
      <Dialog open={editAddress} maxWidth='md'>
        <DialogContent sx={{ padding: '50px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>Billing Address</Typography>
            </Grid>
            <ClientBillingAddressesForm control={control} errors={errors} />
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' onClick={() => setEditAddress(false)}>
                Cancel
              </Button>
              <Button variant='contained' disabled={!isValid}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
