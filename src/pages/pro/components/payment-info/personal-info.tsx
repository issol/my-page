import { Button, Card, CardHeader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import styled from 'styled-components'
import {
  FileNameType,
  UserInfo,
  getProPaymentFile,
} from '@src/apis/payment-info.api'
import {
  BillingMethodUnionType,
  KoreaDomesticTransferSoloType,
  KoreaDomesticTransferType,
  TransferWiseFormType,
} from '@src/types/payment-info/pro/billing-method.type'
import { BorderBox } from '@src/@core/components/detail-info'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'

type Props = {
  info: BillingMethodUnionType | undefined
  replaceDots: (value: string) => string
  downloadFile: (file: FileItemType) => void
}

export default function PersonalInfo({
  info,
  replaceDots,
  downloadFile,
}: Props) {
  function renderDetails() {
    if (!info) return null
    switch (info.type) {
      case 'internationalWire':
      case 'wise':
      case 'us_ach':
      case 'paypal':
        const transferData = info as TransferWiseFormType
        return (
          <>
            <CardBox>
              <img
                src='/images/cards/social-number.png'
                alt='social security number'
                aria-label='social security number'
                width={115}
                height={70}
              />
              <Typography fontWeight={600}>
                Personal (Social security) ID
              </Typography>
              <Typography variant='body2'>
                {replaceDots(transferData?.personalId)}
              </Typography>
            </CardBox>
            <CardBox mt={4}>
              <img
                src='/images/cards/business-license.png'
                alt='social security number'
                aria-label='social security number'
                width={115}
                height={70}
              />
              <Typography fontWeight={600}>W8/ W9/ Business license</Typography>
            </CardBox>
          </>
        )
      case 'koreaDomesticTransfer':
        //@ts-ignore
        const isSolo = !info?.copyOfBankStatement
        if (isSolo) {
          const koreanSoloData = info as KoreaDomesticTransferSoloType
          return (
            <CardBox>
              <img
                src='/images/cards/business-card.png'
                alt='social security number'
                aria-label='social security number'
                width={115}
                height={70}
              />
              <Typography fontWeight={600}>Business registration</Typography>
              <Typography variant='body2' fontWeight={600}>
                {koreanSoloData?.businessName}
              </Typography>
              <Typography variant='body2'>
                {replaceDots(koreanSoloData?.businessNumber?.toString())}
              </Typography>
            </CardBox>
          )
        }
        const koreanData = info as KoreaDomesticTransferType
        return (
          <>
            <CardBox>
              <img
                src='/images/cards/social-number.png'
                alt='social security number'
                aria-label='social security number'
                width={115}
                height={70}
              />
              <Typography fontWeight={600}>Resident registration</Typography>
              <Typography variant='body2'>
                {replaceDots(koreanData?.rrn?.toString())}
              </Typography>
            </CardBox>
            <CardBox mt={4}>
              <img
                src='/images/cards/bank-statement.png'
                alt='social security number'
                aria-label='social security number'
                width={115}
                height={70}
              />
              <Typography fontWeight={600}>Bank statement</Typography>
            </CardBox>
          </>
        )
      default:
        return null
    }
  }
  return (
    <Card sx={{ padding: '24px' }}>
      <Typography variant='h6'>Personal Info</Typography>
      <Box mt={4}>{renderDetails()}</Box>
    </Card>
  )
}

const CardBox = styled(BorderBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`
