import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
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
import { v4 as uuidv4 } from 'uuid'
import { useGetClientRequestStatus } from '@src/queries/requests/client-request.query'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'

import { styled } from '@mui/system'

import { RequestDetailType } from '@src/types/requests/detail.type'
import { StyledNextLink } from '@src/@core/components/customLink'
import { RequestStatusType } from '@src/types/requests/common.type'
import { UserDataType, UserRoleType } from '@src/context/types'
import {
  convertLanguageCodeToPair,
  convertLanguageCodeToPairMultipleTarget,
} from 'src/shared/helpers/language.helper'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  data: RequestDetailType
  user: UserDataType | null
  currentRole: UserRoleType | null
  openReasonModal: () => void
  onStatusChange: (status: RequestStatusType) => void
  statusList: {
    value: number
    label: string
  }[]
  statusListLoading: boolean
}
export default function RequestDetailCard({
  data,
  user,
  currentRole,
  openReasonModal,
  onStatusChange,
  statusList,
  statusListLoading,
}: Props) {
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const label = statusList?.find(i => i.value === data.status)?.label

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <LabelContainer style={{ alignItems: 'center' }}>
          <CustomTypo fontWeight={600}>Request date</CustomTypo>
          <CustomTypo
            variant='body2'
            sx={{ height: '40px', alignItems: 'center', display: 'flex' }}
          >
            {convertTimeToTimezone(
              data?.requestedAt,
              user?.timezone,
              timezone.getValue(),
            )}
          </CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer style={{ alignItems: 'center' }}>
          <CustomTypo fontWeight={600}>Status</CustomTypo>
          {data?.status === 50001 ? (
            <FormControl fullWidth>
              <Autocomplete
                loading={statusListLoading}
                options={
                  statusList?.filter(status => status.value === 50002) || []
                }
                size='small'
                getOptionLabel={option => option.label}
                value={
                  !statusList || !data?.status
                    ? null
                    : statusList?.find(item => data?.status === item.value)
                }
                limitTags={1}
                onChange={(e, v) => {
                  if (v) onStatusChange(v.value as RequestStatusType)
                }}
                id='status'
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    placeholder='Status'
                  />
                )}
                clearIcon={null}
              />
            </FormControl>
          ) : (
            <Box display='flex' alignItems='center' gap='8px'>
              {!data.status && !label
                ? '-'
                : ClientRequestStatusChip(data.status, label!)}
              {data.status === 50005 && (
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
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        width: '100%',
                      }}
                    >
                      {item.serviceType?.map(i => (
                        <ServiceTypeChip
                          size='small'
                          key={uuidv4()}
                          label={i}
                        />
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
                    <CustomTypo
                      variant='body2'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {convertLanguageCodeToPairMultipleTarget(
                        item?.sourceLanguage,
                        item?.targetLanguage,
                      )}
                      {/* {item?.targetLanguage.map(value => {
                        return (
                          <Box key={uuidv4()}>
                            {convertLanguageCodeToPair(
                              item?.sourceLanguage,
                              value,
                            )}
                          </Box>
                        )
                      })} */}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Desired due date</CustomTypo>
                    <CustomTypo variant='body2'>
                      {convertTimeToTimezone(
                        item.desiredDueDate,
                        user?.timezone,
                        timezone.getValue(),
                      )}
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

const LabelContainer = styled('div')`
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
