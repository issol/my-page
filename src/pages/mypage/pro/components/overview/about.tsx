import { InputLabel, MenuItem, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

import { v4 as uuidv4 } from 'uuid'

//** data */
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  convertTimeToTimezone,
  MMDDYYYYHelper,
} from '@src/shared/helpers/date.helper'
import { ProStatus } from '@src/shared/const/status/statuses'
import { Fragment } from 'react'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { contryCodeAndPhoneNumberFormatter, splitContryCodeAndPhoneNumber } from '@src/shared/helpers/phone-number-helper'

type Props = {
  userInfo: {
    preferredName?: string
    preferredNamePronunciation?: string
    pronounce?: string | null
    email: string
    timezone: CountryType
    mobilePhone?: string
    telephone?: string
    birthday?: string
    status?: string
    address: ClientAddressType<number> | null
  }
}

export default function About({ userInfo }: Props) {
  if (!userInfo) {
    return null
  }

  const getAddress = (address: ClientAddressType<number>) => {
    const state1 = address.baseAddress ? `${address.baseAddress}, ` : ''

    const state2 = address.detailAddress ? `${address.detailAddress}, ` : ''

    const city = address.city ? `${address.city}, ` : ''
    const state = address.state ? `${address.state}, ` : ''
    const country = address.country ? `${address.country}, ` : ''
    const zipCode = address.zipCode ? `${address.zipCode}` : ''

    if (
      state1 === '' &&
      state2 === '' &&
      city === '' &&
      state === '' &&
      country === '' &&
      zipCode === ''
    )
      return '-'

    return `${state1}${state2}${city}${state}${country}${zipCode}`
  }

  const getFullPronouns = (pronouns: string) => {
    const pronounsList = [
      {'SHE': 'She/her/hers'},
      {'HE': 'He/him/his'},
      {'THEY': 'They/them/theirs'},
      {'NONE': 'Perfer not to answer'},
    ]
    const foundPronoun = pronounsList.find((item) => Object.keys(item)[0] === pronouns?.toUpperCase())
    return foundPronoun ? Object.values(foundPronoun)[0] : '-';
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
          <Label>{getFullPronouns(userInfo.pronounce!) || '-'}</Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:calendar-blank' style={{ opacity: '0.7' }} />
          <LabelTitle>Date of Birth:</LabelTitle>
          <Label>{MMDDYYYYHelper(userInfo.birthday) || '-'}</Label>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        mt='20px'
      >
        <Typography variant='body2'>Contacts</Typography>
        <Box
          sx={{
            display: 'flex',
            // alignItems: 'center',
            gap: '8px',
          }}
        >
          <Box>
            <Icon
              icon='mdi:home'
              style={{
                opacity: '0.7',
              }}
              fontSize={24}
            />
          </Box>

          <Typography variant='body2' fontWeight={600} fontSize={16}>
            Permanent address :&nbsp;
            <Typography variant='body2' fontSize={16} component={'span'}>
              {userInfo?.address ? getAddress(userInfo?.address) : '-'}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
          <LabelTitle>Mobile phone:</LabelTitle>
          <Label>
            {!userInfo.mobilePhone
              ? '-'
              : contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(userInfo.mobilePhone)
                )
            }
          </Label>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon='mdi:phone' style={{ opacity: '0.7' }} />
          <LabelTitle>Telephone:</LabelTitle>
          <Label>
            {!userInfo.telephone
              ? '-'
              : contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(userInfo.telephone)
                )
            }
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
