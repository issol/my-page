import { Box, Grid, Typography } from '@mui/material'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import styled from 'styled-components'

type Props = {
  billingAddress: ClientAddressType | undefined
}
export default function BillingAddress({ billingAddress }: Props) {
  function renderInfo(label: string, value: string | null | undefined) {
    return (
      <LabelContainer>
        <Typography fontWeight={600}>{label}</Typography>
        <Typography variant='body2'>{value ?? '-'}</Typography>
      </LabelContainer>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        {renderInfo('Street 1', billingAddress?.baseAddress)}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Street 2', billingAddress?.detailAddress)}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('City', billingAddress?.city)}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('State', billingAddress?.state)}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Country', billingAddress?.country)}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Zip code', billingAddress?.zipCode)}
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
