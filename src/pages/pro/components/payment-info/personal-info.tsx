import { Button, Card, CardHeader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import styled from 'styled-components'
import {
  FileNameType,
  PositionType,
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
  files?: Array<FileItemType & { positionType: PositionType; proId: number }>
  isAccountManager: boolean
}

export default function PersonalInfo({
  info,
  replaceDots,
  downloadFile,
  files,
  isAccountManager,
}: Props) {
  function renderDetails() {
    if (!info) return null
    switch (info.type) {
      case 'internationalWire':
      case 'wise':
      case 'us_ach':
      case 'paypal':
        const transferData = info as TransferWiseFormType
        const copyOfId = files?.find(i => i.positionType === 'copyOfId')
        const businessLicense = files?.find(
          i => i.positionType === 'businessLicense',
        )
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
              {copyOfId && isAccountManager && (
                <Button
                  variant='outlined'
                  onClick={() => downloadFile(copyOfId)}
                >
                  Download
                </Button>
              )}
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
              {businessLicense && isAccountManager && (
                <Button
                  variant='outlined'
                  onClick={() => downloadFile(businessLicense)}
                >
                  Download
                </Button>
              )}
            </CardBox>
          </>
        )
      case 'koreaDomesticTransfer':
        //@ts-ignore
        const isSolo = !info?.copyOfBankStatement
        const copyOfRrCard = files?.find(i => i.positionType === 'copyOfRrCard')
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
              {copyOfRrCard && isAccountManager && (
                <Button
                  variant='outlined'
                  onClick={() => downloadFile(copyOfRrCard)}
                >
                  Download
                </Button>
              )}
            </CardBox>
          )
        }
        const koreanData = info as KoreaDomesticTransferType
        const copyOfBankStatement = files?.find(
          i => i.positionType === 'copyOfBankStatement',
        )
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
              {copyOfBankStatement && (
                <Button
                  variant='outlined'
                  onClick={() => downloadFile(copyOfBankStatement)}
                >
                  Download
                </Button>
              )}
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
