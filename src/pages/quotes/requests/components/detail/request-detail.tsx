import { Icon } from '@iconify/react'
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material'
import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { v4 as uuidv4 } from 'uuid'

import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'

import styled from '@emotion/styled'

import { RequestDetailType } from '@src/types/requests/detail.type'
import {
  convertLanguageCodeToPair,
  convertLanguageCodeToPairMultipleTarget,
} from 'src/shared/helpers/language.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  data: RequestDetailType | undefined
  openReasonModal: () => void
}
export default function RequestDetailCard({ data, openReasonModal }: Props) {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Request date</CustomTypo>
          <CustomTypo variant='body2'>
            {convertTimeToTimezone(
              data?.requestedAt,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
          </CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Status</CustomTypo>
          <Box display='flex' alignItems='center' gap='8px'>
            {!data?.status ? null : ClientRequestStatusChip(data?.status)}
            {data?.status === 'Canceled' && (
              <IconButton sx={{ padding: 0 }} onClick={openReasonModal}>
                <Icon icon='material-symbols:help-outline' />
              </IconButton>
            )}
          </Box>
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
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>LSP</CustomTypo>
          <CustomTypo variant='body2'>{data?.lsp?.name}</CustomTypo>
        </LabelContainer>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {data?.items?.map((item, idx) => {
        const numbering = idx + 1 > 9 ? `${idx}.` + 1 : `0${idx + 1}.`
        return (
          <Grid item xs={12} key={item?.id}>
            <ItemBox>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography variant='h6'>
                    {numbering} {item?.name}
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
                      {typeof item?.quantity === 'string'
                        ? '-'
                        : item?.quantity ?? '-'}
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
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Desired due date</CustomTypo>
                    <CustomTypo variant='body2'>
                      {convertTimeToTimezone(
                        item?.desiredDueDate,
                        auth.getValue().user?.timezone,
                        timezone.getValue(),
                      )}
                      {/* {
                        convertUTCISOStringToLocalTimezoneISOString(
                          item.desiredDueDate,
                          item?.desiredDueTimezone?.code!,
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
