import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import { FullDateTimezoneHelper, convertDateByTimezone, convertUTCISOStringToLocalTimezoneISOString } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { RequestDetailType } from '@src/types/requests/detail.type'

type Props = {
  data: RequestDetailType | undefined
  openReasonModal: () => void
}
export default function RequestDetailCard({ data, openReasonModal }: Props) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <LabelContainer>
          <CustomTypo fontWeight={600}>Request date</CustomTypo>
          <CustomTypo variant='body2'>
            {FullDateTimezoneHelper(
              data?.requestedAt,
              data?.contactPerson?.timezone,
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
            {/* {getLegalName({
              firstName: data?.contactPerson?.firstName!,
              middleName: data?.contactPerson?.middleName,
              lastName: data?.contactPerson?.lastName!,
            })}
            {data?.contactPerson?.jobTitle
              ? ` / ${data?.contactPerson?.jobTitle}`
              : ''} */}
              {'LSP의 Contact person 정보가 API에 없음(수정해야함)'}
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
                      {item?.quantity ?? '-'}
                    </CustomTypo>
                  </LabelContainer>
                </Grid>
                <Grid item xs={6}>
                  <LabelContainer>
                    <CustomTypo fontWeight={600}>Desired due date</CustomTypo>
                    <CustomTypo variant='body2'>
                      {/* {FullDateTimezoneHelper(
                          item?.desiredDueDate, 
                          item?.desiredDueTimezone.code
                        )
                      } */}
                      {
                        convertUTCISOStringToLocalTimezoneISOString(
                          item.desiredDueDate,
                          item?.desiredDueTimezone.code
                        )!
                      }
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
