import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import IconifyIcon from '@src/@core/components/icon'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { ClientType } from '@src/types/orders/order-detail'
import { ClientAddressType } from '@src/types/schema/client-address.schema'

type Props = {
  type: string
  client: ClientType
}

const OrderDetailClient = ({ type, client }: Props) => {
  const getNumber = (phone: string | null, timezonePhone: string) => {
    return phone ? `+${timezonePhone}) ${phone}` : '-'
  }

  const getAddress = (type: string, address: ClientAddressType[]) => {
    const addressType = address.find(item => item.isSelected)
    console.log(addressType)

    if (addressType) {
      const state1 = addressType.baseAddress
        ? `${addressType.baseAddress}, `
        : ''

      const state2 = addressType.detailAddress
        ? `${addressType.detailAddress}, `
        : ''

      const city = addressType.city ? `${addressType.city}, ` : ''
      const state = addressType.state ? `${addressType.state}, ` : ''
      const country = addressType.country ? `${addressType.country}, ` : ''
      const zipCode = addressType.zipCode ? `${addressType.zipCode}` : ''

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
  }
  return (
    <Card sx={{ padding: '24px' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        {type === 'detail' ? (
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }}>
            <IconifyIcon icon='mdi:pencil-outline' width={24} height={24} />
          </IconButton>
        ) : null}

        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Card sx={{ padding: '4px 5px' }}>
            <img
              src='/images/signup/role-client.png'
              alt='lpm'
              width={110}
              height={110}
            />
          </Card>
          <Typography variant='h6'>{client.client.name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Divider />
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography
              variant='subtitle1'
              sx={{ fontSize: '14px', fontWeight: 600, width: '131px' }}
            >
              Contact person
            </Typography>
            <Typography>
              {client.contactPerson !== null
                ? getLegalName({
                    firstName: client.contactPerson?.firstName!,
                    middleName: client.contactPerson?.middleName!,
                    lastName: client.contactPerson?.lastName!,
                  })
                : '-'}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '17.5px' }}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <IconifyIcon
                    icon='mdi:earth'
                    color='rgba(76, 78, 100, 0.54)'
                  />
                  <Typography
                    variant='subtitle1'
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Time zone:
                  </Typography>
                  <Typography variant='body2'>
                    {getGmtTimeEng(
                      client.contactPerson !== null
                        ? client.contactPerson.timezone.code
                        : client.client.timezone.code,
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <IconifyIcon
                    icon='material-symbols:call'
                    color='rgba(76, 78, 100, 0.54)'
                  />
                  <Typography
                    variant='subtitle1'
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Telephone:
                  </Typography>
                  <Typography variant='body2'>
                    {getNumber(
                      client.contactPerson !== null
                        ? client.contactPerson.phone!
                        : client.client.phone,
                      client.contactPerson !== null
                        ? client.contactPerson.timezone.phone
                        : client.client.timezone.phone,
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <IconifyIcon
                    icon='mdi:cellphone'
                    color='rgba(76, 78, 100, 0.54)'
                  />
                  <Typography
                    variant='subtitle1'
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Mobile phone:
                  </Typography>
                  <Typography variant='body2'>
                    {getNumber(
                      client.contactPerson !== null
                        ? client.contactPerson.mobile!
                        : client.client.mobile,
                      client.contactPerson !== null
                        ? client.contactPerson.timezone.phone
                        : client.client.timezone.phone,
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <IconifyIcon
                    icon='material-symbols:fax-outline-rounded'
                    color='rgba(76, 78, 100, 0.54)'
                  />
                  <Typography
                    variant='subtitle1'
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Fax:
                  </Typography>
                  <Typography variant='body2'>
                    {getNumber(
                      client.contactPerson !== null
                        ? client.contactPerson.fax!
                        : client.client.fax,
                      client.contactPerson !== null
                        ? client.contactPerson.timezone.phone
                        : client.client.timezone.phone,
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <IconifyIcon
                    icon='ic:outline-email'
                    color='rgba(76, 78, 100, 0.54)'
                  />
                  <Typography
                    variant='subtitle1'
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Email:
                  </Typography>
                  <Typography variant='body2'>
                    {client.contactPerson !== null
                      ? client.contactPerson.email
                      : client.client.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />

            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  width: '131px',
                  display: 'flex',
                }}
              >
                <Box sx={{ textTransform: 'capitalize' }}>
                  {client.addressType}
                </Box>
                &nbsp;address
              </Typography>
              <Typography variant='body2'>
                {getAddress(client.addressType, client.clientAddress)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default OrderDetailClient
