import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import styled from 'styled-components'

// ** types
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import { ClientStatus } from '@src/shared/const/status/statuses'

type Props = {
  userInfo: ClientDetailType
}

/**
 * TODO : form 여는 함수 연결
 * status 변경 함수 연결
 */

export default function ClientInfo({ userInfo }: Props) {
  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>Company info</Typography>
            <IconButton>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Box display='flex' flexDirection='column' gap='16px'>
          <InfoBox>
            <Icon icon='ic:outline-email' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Email:
            </Typography>
            <TitleTypography variant='body2'>{userInfo.email}</TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='mdi:earth' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Time zone:
            </Typography>
            <TitleTypography variant='body2'>
              {getGmtTime(userInfo.timezone.code)}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='mdi:telephone' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Telephone:
            </Typography>
            <TitleTypography variant='body2'>
              {userInfo?.phone
                ? `+${userInfo.timezone.phone})  ${userInfo.phone}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:smartphone' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Mobile phone:
            </Typography>
            <TitleTypography variant='body2'>
              {userInfo?.mobile
                ? `+${userInfo.timezone.phone})  ${userInfo.mobile}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:fax-outline-rounded' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Fax:
            </Typography>
            <TitleTypography variant='body2'>
              {userInfo?.fax
                ? `+${userInfo.timezone.phone})  ${userInfo.fax}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:link' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Website:
            </Typography>
            <Box
              width='100%'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <TitleTypography variant='body2'>
                {userInfo.websiteLink ?? '-'}
              </TitleTypography>
              <IconButton
                edge='end'
                disabled={!userInfo.websiteLink}
                onClick={() => window.open(`${userInfo.websiteLink}`, '_blank')}
              >
                <Icon icon='material-symbols:open-in-new' opacity={0.7} />
              </IconButton>
            </Box>
          </InfoBox>
        </Box>
        <Divider style={{ marginBottom: '24px' }} />
        <Autocomplete
          autoHighlight
          fullWidth
          options={ClientStatus}
          //** TODO : status변경하는 함수 연결 */
          //   onChange={(e, v) => {
          //     if (!v) onChange({ value: '', label: '' })
          //     else onChange(v.value)
          //   }}
          value={
            !userInfo.status
              ? { value: '', label: '' }
              : ClientStatus.filter(item => item.value === userInfo.status)[0]
          }
          renderInput={params => (
            <TextField {...params} label='Status*' placeholder='Status*' />
          )}
        />
      </CardContent>
    </Card>
  )
}

const InfoBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`
