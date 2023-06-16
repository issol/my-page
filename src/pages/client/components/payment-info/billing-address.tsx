import { Box, Grid, Typography } from '@mui/material'
import styled from 'styled-components'

/* TODO:
실데이터로 수정
prop type 수정 (부모에게 데이터 받아오기)
*/
export default function BillingAddress() {
  function renderInfo(label: string, value: string | undefined) {
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
        {renderInfo('Street 1', 'Street')}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Street 2', 'Street')}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('City', 'city')}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('State', '-')}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Country', 'Country')}
      </Grid>
      <Grid item xs={6}>
        {renderInfo('Zip code', '234')}
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
