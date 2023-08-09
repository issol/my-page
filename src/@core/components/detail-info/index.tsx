import { Box, Grid, Typography } from '@mui/material'
import styled from 'styled-components'

type Props = {
  label: string
  value: string | number | null | undefined
}
export default function DetailInfoField({ label, value }: Props) {
  return (
    <Grid item xs={12}>
      <LabelContainer>
        <Typography fontWeight={600}>{label}</Typography>
        <Typography variant='body2'>{value ?? '-'}</Typography>
      </LabelContainer>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
export const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`
