import { Icon } from '@iconify/react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

type Props = {
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  userInfo: UserDataType
}

const Contracts = ({ edit, setEdit, userInfo }: Props) => {
  return (
    <Card sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6'>Contracts</Typography>

        <IconButton
          onClick={() => setEdit!(true)}
          // disabled={invoiceInfo.invoiceStatus === 'Paid'}
        >
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        mt='20px'
      >
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
          >
            <Icon icon='mdi:email-outline' style={{ opacity: '0.7' }} />
            <LabelTitle>Email:</LabelTitle>
            <Label>{userInfo.email || '-'}</Label>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
          >
            <Icon icon='mdi:earth' style={{ opacity: '0.7' }} />
            <LabelTitle>Timezone:</LabelTitle>
            <Label>{getGmtTime(userInfo.timezone?.code) || '-'}</Label>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
          >
            <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
            <LabelTitle>Mobile phone:</LabelTitle>
            <Label>
              {!userInfo.mobile
                ? '-'
                : '+' + userInfo.timezone.phone + ') ' + userInfo.mobile}
            </Label>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
          >
            <Icon icon='mdi:phone' style={{ opacity: '0.7' }} />
            <LabelTitle>Telephone:</LabelTitle>
            <Label>
              {!userInfo.phone
                ? '-'
                : '+' + userInfo.timezone.phone + ') ' + userInfo.phone}
            </Label>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
          >
            <Icon icon='mdi:cellphone' style={{ opacity: '0.7' }} />
            <LabelTitle>Fax:</LabelTitle>
            <Label>
              {!userInfo.fax
                ? '-'
                : '+' + userInfo.timezone.phone + ') ' + userInfo.fax}
            </Label>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

const LabelTitle = styled.label`
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.87);
`
const Label = styled.label`
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: rgba(76, 78, 100, 0.6);
`

export default Contracts
