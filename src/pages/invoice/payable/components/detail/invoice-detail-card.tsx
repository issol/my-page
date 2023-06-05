import { Icon } from '@iconify/react'
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material'
import styled from 'styled-components'

/* TODO: 실 데이터로 채우기 */
export default function InvoiceDetailCard() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Typography variant='h6'>Invoice detail</Typography>
        <IconButton /* onClick={() => setEdit(true)} */>
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Invoice date</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Status</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Pro</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Tax info</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Tax rate</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Payment due</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Payment date</CustomTypo>
          <CustomTypo variant='body2'>dsdf</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box>
          <CustomTypo fontWeight={600}>Invoice description</CustomTypo>
          <CustomTypo variant='body2'>sdfdf</CustomTypo>
        </Box>
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  /* grid-template-columns: repeat(2, 1fr); */
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`
