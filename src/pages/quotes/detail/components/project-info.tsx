// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { JobTypeChip } from '@src/@core/components/chips/chips'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import styled from 'styled-components'

// ** values
import { QuotesStatus } from '@src/shared/const/status/statuses'

type Props = {
  setEditMode: (v: boolean) => void
}

export default function QuotesProjectInfoDetail({ setEditMode }: Props) {
  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        mb={4}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography variant='h6'>TODO title</Typography>
        <IconButton onClick={() => setEditMode(true)}>
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
      </Grid>

      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Quote date</CustomTypo>
          <CustomTypo variant='body2'>TODO quote date</CustomTypo>
        </LabelContainer>
      </Grid>

      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Status</CustomTypo>
          <Autocomplete
            autoHighlight
            fullWidth
            options={QuotesStatus}
            // onChange={(e, v) => {
            //   onChange(v?.value ?? '')
            // }}
            // value={
            //   !value
            //     ? defaultValue
            //     : QuotesStatus.find(item => item.value === value)
            // }
            renderInput={params => (
              <TextField
                {...params}
                // error={Boolean(errors.status)}
                placeholder='Status'
                size='small'
                sx={{ maxWidth: '300px' }}
              />
            )}
          />
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontSize={14} fontWeight={600}>
            Work name
          </CustomTypo>
          <CustomTypo variant='body2'>TODO workname</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Category</CustomTypo>
          <Box>
            <JobTypeChip size='small' label='Webnovel' type='Webnovel' />
          </Box>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontSize={14} fontWeight={600}>
            Service type
          </CustomTypo>
          <Box display='flex' alignItems='center' gap='8px'>
            {['test', 'test2'].map((item, idx) => (
              <ServiceTypeChip key={idx} label={item} size='small' />
            ))}
          </Box>
        </LabelContainer>
      </Grid>

      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Area of expertise</CustomTypo>
          <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Quote deadline</CustomTypo>
          <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
          <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Estimated delivery date</CustomTypo>
          <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Project due date</CustomTypo>
          <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <CustomTypo fontWeight={600} mb={6}>
          Project description
        </CustomTypo>
        <CustomTypo variant='body2'>TODO romanticlkfj</CustomTypo>
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
