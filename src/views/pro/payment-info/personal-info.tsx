import { Button, Card, CardHeader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from '@src/@core/components/icon'
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
  onCopy: (info: string) => void
  info: BillingMethodUnionType | undefined
  replaceDots: (value: string) => string
  downloadFile: (file: FileItemType) => void
  files?: Array<FileItemType & { positionType: PositionType; proId: number }>
  isAccountManager: boolean
}

export default function PersonalInfo({
  onCopy,
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
              <Typography fontWeight={600} mt='10px'>
                Personal (Social security) ID
              </Typography>
              <Box display='flex' alignItems='center'>
                <Typography variant='body2'>
                  {replaceDots(transferData?.personalId)}
                </Typography>
                {isAccountManager && (
                  <IconButton
                    onClick={() => onCopy(transferData?.personalId ?? '')}
                  >
                    <Icon icon='mdi:content-copy' fontSize={20} />
                  </IconButton>
                )}
              </Box>
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
        const isSolo = !('copyOfBankStatement' in info)
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
              <Box display='flex' alignItems='center'>
                <Typography variant='body2'>
                  {replaceDots(koreanData?.rrn?.toString())}
                </Typography>
                {isAccountManager && (
                  <IconButton
                    onClick={() => onCopy(koreanData?.rrn?.toString() ?? '')}
                  >
                    <Icon icon='mdi:content-copy' fontSize={20} />
                  </IconButton>
                )}
              </Box>
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
  gap: 2px;
`
