import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import styled from 'styled-components'

// ** types
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  clientInfo: ClientDetailType
}

/** TODO : form여는 함수 연결 */
export default function ClientAddresses({ clientInfo }: Props) {
  const { clientAddresses: address } = clientInfo

  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>Address</Typography>
            <IconButton>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {address?.length
          ? address.map((item, idx) => {
              const chipName =
                item.addressType === 'billing'
                  ? 'Billing address'
                  : item.addressType === 'shipping'
                  ? 'Shipping address'
                  : item.name
              return (
                <Box key={idx}>
                  <Divider style={{ marginBottom: '24px' }} />

                  <Box display='flex' flexDirection='column' gap='16px'>
                    <CustomChip
                      sx={{ alignSelf: 'self-start' }}
                      rounded
                      label={chipName}
                      skin='light'
                      color={
                        item.addressType === 'shipping' ? 'info' : 'secondary'
                      }
                      size='small'
                    />
                    <InfoBox>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        Street:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.baseAddress ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        Street2:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.detailAddress ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        City:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.city ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        State:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.state ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        Country:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.country ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox mb='8px'>
                      <Typography
                        fontSize='1rem'
                        variant='body2'
                        fontWeight='bold'
                      >
                        ZIP code:
                      </Typography>
                      <TitleTypography variant='body2'>
                        {item?.zipCode ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                  </Box>
                </Box>
              )
            })
          : null}
      </CardContent>
    </Card>
  )
}

const InfoBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`
