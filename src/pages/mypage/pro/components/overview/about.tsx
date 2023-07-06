import { InputLabel, MenuItem, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

import { v4 as uuidv4 } from 'uuid'

//** data */
import { getGmtTime } from 'src/shared/helpers/timezone.helper'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  FullDateTimezoneHelper,
  MMDDYYYYHelper,
} from '@src/shared/helpers/date.helper'
import { ProStatus } from '@src/shared/const/status/statuses'
import { Fragment } from 'react'

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
    residence?: string
  }
}

export default function About({ userInfo }: Props) {
  if (!userInfo) {
    return null
  }

  return (
    <Fragment>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:calendar-blank' style={{ opacity: '0.7' }} />
          <LabelTitle>Date of Birth:</LabelTitle>
          <Label>{MMDDYYYYHelper(userInfo.dateOfBirth) || '-'}</Label>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        mt='20px'
      >
        <Typography variant='body2'>Contacts</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:home' style={{ opacity: '0.7' }} />
          <LabelTitle>Residence:</LabelTitle>
          <Label>{userInfo.residence || '-'}</Label>
        </Box>
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
            <FormControl fullWidth>
              <InputLabel id='controlled-select-label'>Status</InputLabel>
              <Select
                value={userInfo?.status ?? '-'}
                label='Status'
                disabled={true}
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
          </Box>
        </>
      </Box>
    </Fragment>
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
