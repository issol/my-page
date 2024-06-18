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
import { UserInfoResType } from '@src/apis/user.api'
import { styled } from '@mui/system'
import Icon from '@src/@core/components/icon'

import { v4 as uuidv4 } from 'uuid'

//** data */
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { MMDDYYYYHelper } from '@src/shared/helpers/date.helper'
import { ProOnboardStatus, ProStatus } from '@src/shared/const/status/statuses'
import { getAddress } from '@src/shared/helpers/address-helper'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'
import { getCurrentRole } from '@src/shared/auth/storage'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { useEffect, useState } from 'react'
import { ProOnboardStatusType } from '@src/types/common/status.type'

const Pronounce: Record<string, string> = {
  SHE: 'She/her/hers',
  HE: 'He/him/his',
  THEY: 'They/them/theirs',
  NONE: 'Perfer not to answer',
}

type Props = {
  userInfo: {
    preferredName?: string
    preferredNamePronunciation?: string
    pronounce?: string
    email: string
    timezone: CountryType
    mobilePhone?: string
    telephone?: string
    birthday?: string
    status?: string
    address: ClientAddressType<number> | null
    onboardingStatus: ProOnboardStatusType
  }
  type: string
  handleChangeStatus?: (event: SelectChangeEvent) => void
  status?: string
}

const About = ({ userInfo, type, handleChangeStatus, status }: Props) => {
  const currentRole = getCurrentRole()
  const timezone = useRecoilValueLoadable(timezoneSelector)

  if (!userInfo) {
    return null
  }

  return (
    <Card
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <Typography fontSize={20} fontWeight={500}>
        Profile
      </Typography>
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
          <Label>
            {Pronounce[userInfo.pronounce?.toUpperCase() || ''] || '-'}
          </Label>
        </Box>
        {type === 'pro' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon icon='mdi:calendar-blank' style={{ opacity: '0.7' }} />
            <LabelTitle>Date of Birth:</LabelTitle>
            <Label>{MMDDYYYYHelper(userInfo.birthday) || '-'}</Label>
          </Box>
        ) : null}
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant='body2'>Contacts</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:email-outline' style={{ opacity: '0.7' }} />
          <LabelTitle>Email:</LabelTitle>
          <Label>{userInfo.email || '-'}</Label>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Box sx={{ width: '24px', height: '24px' }}>
            <Icon icon='mdi:earth' style={{ opacity: '0.7' }} fontSize={24} />
          </Box>

          <Box>
            <LabelTitle>Timezone:</LabelTitle>&nbsp;&nbsp;
            <Label>
              {timeZoneFormatter(userInfo.timezone, timezone.getValue()) || '-'}
            </Label>
          </Box>
          {/* <LabelTitle>Timezone:</LabelTitle>
          <Label>
            {timeZoneFormatter(userInfo.timezone, timezone.getValue()) || '-'}
          </Label> */}
        </Box>
        {type === 'pro' ? (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Icon icon='mdi:home' style={{ opacity: '0.7' }} />
            <Box>
              <LabelTitle>Permanent address:</LabelTitle>&nbsp;&nbsp;
              <Label>
                {userInfo?.address ? getAddress([userInfo?.address]) : '-'}
              </Label>
            </Box>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
          <LabelTitle>Mobile phone:</LabelTitle>
          <Label>
            {!userInfo.mobilePhone
              ? '-'
              : contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(userInfo.mobilePhone),
                )}
          </Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:phone' style={{ opacity: '0.7' }} />
          <LabelTitle>Telephone:</LabelTitle>
          <Label>
            {!userInfo.telephone
              ? '-'
              : contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(userInfo.telephone),
                )}
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
                <InputLabel id='controlled-select-label'>Status</InputLabel>
                <Select
                  value={userInfo.onboardingStatus}
                  defaultValue={userInfo.onboardingStatus}
                  label='Status'
                  id='controlled-select'
                  onChange={handleChangeStatus}
                  labelId='controlled-select-label'
                  // disabled={
                  //   type === 'onboarding' || currentRole?.name === 'LPM'
                  // }
                >
                  {Object.values(ProOnboardStatus).map(value => {
                    return (
                      <MenuItem key={uuidv4()} value={value.value}>
                        {value.label}
                      </MenuItem>
                    )
                  })}
                </Select>
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
                  // disabled={
                  //   type === 'onboarding' || currentRole?.name === 'LPM'
                  // }
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

const LabelTitle = styled('label')`
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`
const Label = styled('label')`
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(76, 78, 100, 0.6);
`

export default About
