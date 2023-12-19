import { Box, Card, Divider, IconButton, Typography } from '@mui/material'

import IconifyIcon from '@src/@core/components/icon'

import { getAddress } from '@src/shared/helpers/address-helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { contryCodeAndPhoneNumberFormatter, splitContryCodeAndPhoneNumber } from '@src/shared/helpers/phone-number-helper'
import {
  ClientType,
  OrderFeatureType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'

import { Dispatch, SetStateAction } from 'react'
import { UseMutationResult } from 'react-query'
import { updateOrderType } from '../[id]'

type Props = {
  type: string
  client: ClientType
  setEdit?: Dispatch<SetStateAction<boolean>>
  updateProject?: UseMutationResult<void, unknown, updateOrderType, unknown>
  canUseFeature?: (v: OrderFeatureType) => boolean
  project: ProjectInfoType
}

const OrderDetailClient = ({
  type,
  client,
  setEdit,
  updateProject,
  canUseFeature,
  project,
}: Props) => {
  const isUpdatable = canUseFeature ? canUseFeature('tab-Client') : false
  const canUpdateStatus = canUseFeature
    ? canUseFeature('button-Edit-Set-Status-To-UnderRevision')
    : false

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
        {type === 'detail' && isUpdatable ? (
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0 }}
            onClick={() => {
              if (canUpdateStatus)
                updateProject && updateProject.mutate({ status: 10500 })
              setEdit!(true)
            }}
          >
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
          <Typography variant='h6'>{client?.client?.name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Divider />
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Typography
              variant='subtitle1'
              sx={{ fontSize: '14px', fontWeight: 600, width: '131px' }}
            >
              Contact person
            </Typography>
            <Typography variant='subtitle2' fontSize={14}>
              {client.contactPerson !== null
                ? getLegalName({
                    firstName: client?.contactPerson?.firstName!,
                    middleName: client?.contactPerson?.middleName!,
                    lastName: client?.contactPerson?.lastName!,
                  })
                : '-'}
              {client.contactPerson !== null &&
                `${
                  client.contactPerson.jobTitle &&
                  client.contactPerson.jobTitle !== ''
                    ? ` / ${client.contactPerson.jobTitle}`
                    : ''
                }`}
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
                    {
                      client?.contactPerson !== null
                        ? client?.contactPerson?.timezone?.label
                        : client?.client?.timezone?.label
                    }
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
                    {client?.contactPerson?.phone
                      ? contryCodeAndPhoneNumberFormatter(
                          splitContryCodeAndPhoneNumber(client.contactPerson.phone)
                        )
                      : client?.client?.phone
                        ? contryCodeAndPhoneNumberFormatter(
                            splitContryCodeAndPhoneNumber(client.client.phone)
                          )
                        : '-'
                    }
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
                    {client?.contactPerson?.mobile
                      ? contryCodeAndPhoneNumberFormatter(
                          splitContryCodeAndPhoneNumber(client.contactPerson.mobile)
                        )
                      : client?.client?.mobile
                        ? contryCodeAndPhoneNumberFormatter(
                            splitContryCodeAndPhoneNumber(client.client.mobile)
                          )
                        : '-'
                    }
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
                    {client?.contactPerson?.fax
                      ? contryCodeAndPhoneNumberFormatter(
                          splitContryCodeAndPhoneNumber(client.contactPerson.fax)
                        )
                      : client?.client?.fax
                        ? contryCodeAndPhoneNumberFormatter(
                            splitContryCodeAndPhoneNumber(client.client.fax)
                          )
                        : '-'
                    }
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
                    {client?.contactPerson !== null
                      ? client?.contactPerson?.email
                      : client?.client?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            {client?.clientAddress?.length > 0 ? (
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
                    {project?.addressType}
                  </Box>
                  &nbsp;address
                </Typography>
                <Typography variant='body2'>
                  {getAddress(client?.clientAddress)}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default OrderDetailClient
