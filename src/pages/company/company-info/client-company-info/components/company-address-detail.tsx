import { Box, Card, Divider, Typography } from '@mui/material'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import CustomChip from '@src/@core/components/mui/chip'
import styled from '@emotion/styled'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  address: ClientAddressType<number>[]
}
export default function CompanyAddressDetail({ address }: Props) {
  const filteredAddress = () => {
    return address?.filter(item => item.addressType !== 'billing')
  }
  return (
    <>
      {filteredAddress()?.length
        ? filteredAddress()?.map((item, idx) => {
            const chipName =
              item.addressType === 'shipping' ? 'Shipping address' : item.name
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
                    <Label variant='body2'>Street:</Label>
                    <TitleTypography variant='body2'>
                      {item?.baseAddress ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                  <InfoBox>
                    <Label variant='body2'>Street2:</Label>
                    <TitleTypography variant='body2'>
                      {item?.detailAddress ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                  <InfoBox>
                    <Label variant='body2'>City:</Label>
                    <TitleTypography variant='body2'>
                      {item?.city ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                  <InfoBox>
                    <Label variant='body2'>State:</Label>
                    <TitleTypography variant='body2'>
                      {item?.state ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                  <InfoBox>
                    <Label variant='body2'>Country:</Label>
                    <TitleTypography variant='body2'>
                      {item?.country ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                  <InfoBox mb='8px'>
                    <Label variant='body2'>ZIP code:</Label>
                    <TitleTypography variant='body2'>
                      {item?.zipCode ?? '-'}
                    </TitleTypography>
                  </InfoBox>
                </Box>
              </Box>
            )
          })
        : null}
    </>
  )
}

const InfoBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: start;
`
const Label = styled(Typography)`
  font-weight: bold;
  font-size: 1rem;
`
