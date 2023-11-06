import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { useGetClientRequestStatus } from '@src/queries/requests/client-request.query'
import {
  FullDateTimezoneHelper,
  convertDateByTimezone,
  convertUTCISOStringToLocalTimezoneISOString,
} from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { RequestDetailType } from '@src/types/requests/detail.type'
import { StyledNextLink } from '@src/@core/components/customLink'
import { RequestStatusType } from '@src/types/requests/common.type'
import { UserDataType, UserRoleType } from '@src/context/types'
import { convertLanguageCodeToPair } from 'src/shared/helpers/language.helper'

type Props = {
  data: RequestDetailType | undefined
  user: UserDataType | null
  currentRole: UserRoleType | null
  openReasonModal: () => void
  onStatusChange: (status: RequestStatusType) => void
}
export default function RequestDetailCard({
  data,
  user,
  currentRole,
  openReasonModal,
  onStatusChange,
}: Props) {
  const { data: statusList, isLoading } = useGetClientRequestStatus()

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Request date</CustomTypo>
          <CustomTypo variant='body2'>
            {FullDateTimezoneHelper(
              data?.requestedAt,
              data?.contactPerson?.timezone?.code,
            )}
          </CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Status</CustomTypo>
          {data?.status === 'Request created' ? (
            <FormControl fullWidth>
              <Autocomplete
                loading={isLoading}
                options={
                  statusList?.filter(
                    status => status.label === 'In preparation',
                  ) || []
                }
                size='small'
                getOptionLabel={option => option.label}
                value={
                  !statusList || !data?.status
                    ? null
                    : statusList?.find(item =>
                        data?.status?.includes(item.label),
                      )
                }
                limitTags={1}
                onChange={(e, v) => {
                  if (v?.label) onStatusChange(v?.label as RequestStatusType)
                }}
                id='status'
                renderInput={params => (
                  <TextField {...params} placeholder='Status' />
                )}
                clearIcon={null}
              />
            </FormControl>
          ) : (
            <Box display='flex' alignItems='center' gap='8px'>
              {!data?.status ? null : ClientRequestStatusChip(data?.status)}
              {data?.status === 'Canceled' && (
                <IconButton sx={{ padding: 0 }} onClick={openReasonModal}>
                  <Icon icon='material-symbols:help-outline' />
                </IconButton>
              )}
            </Box>
          )}
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Client</CustomTypo>
          <StyledNextLink
            href={`/client/detail/${data?.client?.clientId}`}
            color='black'
            style={{ textDecoration: 'underline' }}
          >
            {data?.client?.name}
          </StyledNextLink>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Contact person</CustomTypo>
          <CustomTypo variant='body2'>
            {getLegalName({
              firstName: data?.contactPerson?.firstName!,
              middleName: data?.contactPerson?.middleName,
              lastName: data?.contactPerson?.lastName!,
            })}
            {data?.contactPerson?.jobTitle
              ? ` / ${data?.contactPerson?.jobTitle}`
              : ''}
          </CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {data?.items?.map((item, idx) => {
        const numbering = idx + 1 > 9 ? `${idx}.` + 1 : `0${idx + 1}.`
        return (
          <Grid item xs={12} key={item.id}>
            <ItemBox>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography variant='h6'>
                    {numbering} {item.name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Category</CustomTypo>
                    <Box display='flex'>
                      <JobTypeChip
                        size='small'
                        type={item.category}
                        label={item.category}
                      />
                    </Box>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Service type</CustomTypo>
                    <Box display='flex'>
                      {item.serviceType?.map(i => (
                        <ServiceTypeChip size='small' key={i} label={i} />
                      ))}
                    </Box>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Unit</CustomTypo>
                    <CustomTypo variant='body2'>{item?.unit ?? '-'}</CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Quantity</CustomTypo>
                    <CustomTypo variant='body2'>
                      {item?.quantity ?? '-'}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Language pair</CustomTypo>
                    <CustomTypo variant='body2'>
                      {convertLanguageCodeToPair(
                        item?.sourceLanguage,
                        item?.targetLanguage,
                      )}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Desired due date</CustomTypo>
                    <CustomTypo variant='body2'>
                      {FullDateTimezoneHelper(
                        item.desiredDueDate,
                        item?.desiredDueTimezone?.code!
                      )}
                      {/* {
                        convertDateByTimezone(
                          item.desiredDueDate,
                          item.desiredDueTimezone.code,
                          auth.getValue().timezone.code!
                        )
                      } */}
                      {/* {
                        convertUTCISOStringToLocalTimezoneISOString(
                          item.desiredDueDate,
                          user?.timezone.code!,
                        )!
                      } */}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
              </Grid>
            </ItemBox>
          </Grid>
        )
      })}
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`

const ItemBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  background: #f5f5f5;
`
