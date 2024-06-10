import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import Icon from '@src/@core/components/icon'

//** data */
import { MMDDYYYYHelper } from '@src/shared/helpers/date.helper'
import { Fragment, useMemo } from 'react'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'
import { DetailUserType } from '@src/types/common/detail-user.type'

type Props = {
  userInfo: DetailUserType
}

const About = ({ userInfo }: Props) => {
  if (!userInfo) {
    return null
  }

  const address = useMemo(() => {
    return userInfo.addresses && userInfo.addresses.length > 0
      ? userInfo?.addresses[0]
      : null
  }, [userInfo])

  const getAddress = (address: ClientAddressType<number>) => {
    const baseAddress = address.baseAddress ? `${address.baseAddress}` : ''
    const detailAddress = address.detailAddress
      ? `${address.detailAddress}`
      : ''
    const city = address.city ? `${address.city}` : ''
    const state = address.state ? `${address.state}` : ''
    const country = address.country ? `${address.country}` : ''
    const zipCode = address.zipCode ? `${address.zipCode}` : ''

    const parts: Array<string> = [
      baseAddress,
      detailAddress,
      city,
      state,
      country,
      zipCode,
    ]

    if (parts.every(val => val === '')) return '-'

    return `${parts.filter(val => val !== '').join(', ')}`
  }

  const getFullPronouns = (pronouns: string) => {
    const pronounsList = [
      { SHE: 'She/her/hers' },
      { HE: 'He/him/his' },
      { THEY: 'They/them/theirs' },
      { NONE: 'Perfer not to answer' },
    ]
    const foundPronoun = pronounsList.find(
      item => Object.keys(item)[0] === pronouns?.toUpperCase(),
    )
    return foundPronoun ? Object.values(foundPronoun)[0] : '-'
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography sx={{ fontSize: '12px' }}>About</Typography>
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
        <Typography sx={{ fontSize: '12px' }}>Contacts</Typography>
        <Box
          sx={{
            display: 'flex',
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
              {address ? getAddress(address) : '-'}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
          <Typography variant='body2' fontWeight={600} fontSize={16}>
            Mobile phone: :&nbsp;
            <Typography variant='body2' fontSize={16} component={'span'}>
              {!userInfo.mobilePhone
                ? '-'
                : contryCodeAndPhoneNumberFormatter(
                    splitContryCodeAndPhoneNumber(userInfo.mobilePhone),
                  )}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
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

        {/* <>
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
                value={userInfo?.status ? userInfo?.status : '-'}
                label='Status'
                disabled={true}
              >
                {Object.values(ProSideViewStatus).map(value => {
                  return (
                    <MenuItem key={uuidv4()} value={value.value}>
                      {value.label || '-'}
                    </MenuItem>
                  )
                })}
                {userInfo?.status ? null : <MenuItem value='-'>{'-'}</MenuItem>}
              </Select>
            </FormControl>
          </Box>
        </> */}
      </Box>
    </Fragment>
  )
}

const LabelTitle = styled('label')`
  white-space: nowrap;
  font-weight: 600;
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
