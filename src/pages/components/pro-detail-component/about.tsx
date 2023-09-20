import {
  Card,
  InputLabel,
  TextField,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { UserInfoResType } from 'src/apis/user.api'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

import { v4 as uuidv4 } from 'uuid'

//** data */
import { getGmtTimeEng } from 'src/shared/helpers/timezone.helper'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { MMDDYYYYHelper } from '@src/shared/helpers/date.helper'
import { ProStatus } from '@src/shared/const/status/statuses'
import { getAddress } from '@src/shared/helpers/address-helper'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

type Props = {
  userInfo: {
    preferredName?: string
    preferredNamePronunciation?: string
    pronounce?: string
    email: string
    timezone: CountryType
    mobilePhone?: string
    telephone?: string
    dateOfBirth?: string
    status?: string
    address: ClientAddressType<number>
  }
  type: string
  handleChangeStatus?: (event: SelectChangeEvent) => void
  status?: string
}

export default function About({
  userInfo,
  type,
  handleChangeStatus,
  status,
}: Props) {
  if (!userInfo) {
    return null
  }

  return (
    <Card sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant='body2'>About</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:account-outline' style={{ opacity: '0.7' }} />
          <LabelTitle>Preferred name:</LabelTitle>
          <Label>{userInfo.preferredName || '-'}</Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:emoticon' style={{ opacity: '0.7' }} />
          <LabelTitle>Pronunciation:</LabelTitle>
          <Label>{userInfo.preferredNamePronunciation || '-'}</Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:label-variant' style={{ opacity: '0.7' }} />
          <LabelTitle>Pronouns:</LabelTitle>
          <Label>{userInfo.pronounce || '-'}</Label>
        </Box>
        {type === 'pro' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon icon='mdi:calendar-blank' style={{ opacity: '0.7' }} />
            <LabelTitle>Date of Birth:</LabelTitle>
            <Label>{MMDDYYYYHelper(userInfo.dateOfBirth) || '-'}</Label>
          </Box>
        ) : null}
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        mt='20px'
      >
        <Typography variant='body2'>Contacts</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:email-outline' style={{ opacity: '0.7' }} />
          <LabelTitle>Email:</LabelTitle>
          <Label>{userInfo.email || '-'}</Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:earth' style={{ opacity: '0.7' }} />
          <LabelTitle>Timezone:</LabelTitle>
          <Label>{getGmtTimeEng(userInfo.timezone?.code) || '-'}</Label>
        </Box>
        {type === 'pro' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon icon='mdi:home' style={{ opacity: '0.7' }} />
            <LabelTitle>Permanent address:</LabelTitle>
            <Label>
              {userInfo?.address ? getAddress([userInfo?.address]) : '-'}
            </Label>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
          <LabelTitle>Mobile phone:</LabelTitle>
          <Label>
            {!userInfo.mobilePhone
              ? '-'
              : '+' + userInfo.timezone.phone + ') ' + userInfo.mobilePhone}
          </Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:phone' style={{ opacity: '0.7' }} />
          <LabelTitle>Telephone:</LabelTitle>
          <Label>
            {!userInfo.telephone
              ? '-'
              : '+' + userInfo.timezone.phone + ') ' + userInfo.telephone}
          </Label>
        </Box>

        <>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {type === 'onboarding' ? (
              <FormControl fullWidth>
                <TextField
                  disabled
                  id='about-status-textfield'
                  label='Status'
                  defaultValue={userInfo.status ? userInfo.status : ' '} // 온보딩이 진행중인 경우엔 상태값이 없음, 공백으로 빈칸 처리함
                />
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <InputLabel id='controlled-select-label'>Status</InputLabel>
                <Select
                  value={userInfo.status}
                  defaultValue={userInfo.status}
                  label='Status'
                  id='controlled-select'
                  onChange={handleChangeStatus}
                  labelId='controlled-select-label'
                  disabled={type === 'onboarding'}
                >
                  {Object.values(ProStatus).map(value => {
                    return (
                      <MenuItem key={uuidv4()} value={value.value}>
                        {value.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            )}
          </Box>
        </>
      </Box>
    </Card>
  )
}

const LabelTitle = styled.label`
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`
const Label = styled.label`
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`
