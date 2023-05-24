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
import { ProjectInfoType } from '@src/types/common/quotes.type'
import { Fragment } from 'react'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'

type Props = {
  project: ProjectInfoType | undefined
  setEditMode: (v: boolean) => void
}

// TODO : status 변경 api 붙이기
export default function QuotesProjectInfoDetail({
  project,
  setEditMode,
}: Props) {
  return (
    <Fragment>
      {!project ? null : (
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            mb={4}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>{project.projectName}</Typography>
            <IconButton onClick={() => setEditMode(true)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Quote date</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateHelper(project.quoteDate)}
              </CustomTypo>
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
                value={
                  QuotesStatus.find(item => item.value === project.status) ||
                  null
                }
                renderInput={params => (
                  <TextField
                    {...params}
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
              <CustomTypo variant='body2'>{project.workName}</CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Category</CustomTypo>
              <Box>
                {!project.category ? (
                  '-'
                ) : (
                  <JobTypeChip
                    size='small'
                    label={project.category}
                    type={project.category}
                  />
                )}
              </Box>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontSize={14} fontWeight={600}>
                Service type
              </CustomTypo>
              <Box display='flex' alignItems='center' gap='8px'>
                {project.serviceType?.map((item, idx) => (
                  <ServiceTypeChip key={idx} label={item} size='small' />
                ))}
              </Box>
            </LabelContainer>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Area of expertise</CustomTypo>
              <CustomTypo variant='body2'>
                {project.expertise ?? '-'}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Quote deadline</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateTimezoneHelper(
                  project.quoteDeadline,
                  project.quoteDeadlineTimezone,
                )}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateTimezoneHelper(
                  project.quoteExpiryDate,
                  project.quoteExpiryDateTimezone,
                )}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Estimated delivery date</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateTimezoneHelper(
                  project.estimatedDeliveryDate,
                  project.estimatedDeliveryDateTimezone,
                )}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Project due date</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateTimezoneHelper(
                  project.projectDueAt,
                  project.projectDueTimezone,
                )}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <CustomTypo fontWeight={600} mb={6}>
              Project description
            </CustomTypo>
            <CustomTypo variant='body2'>
              {project.projectDescription}
            </CustomTypo>
          </Grid>
        </Grid>
      )}
    </Fragment>
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
