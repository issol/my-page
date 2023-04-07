import { Button, Card, CardHeader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import styled from 'styled-components'
import { FileNameType, UserInfo } from '@src/apis/payment-info.api'

type Props = {
  info: UserInfo
  onCopy: (info: string) => void
  isAccountManager: boolean
  replaceDots: (value: string) => string
  downloadFile: (value: FileNameType) => void
}

export default function PersonalInfo({
  info,
  onCopy,
  isAccountManager,
  replaceDots,
  downloadFile,
}: Props) {
  return (
    <Card>
      <CardHeader title='Personal Info' />
      <CardBox>
        <img
          src='/images/cards/social-number.png'
          alt='social security number'
          aria-label='social security number'
          width={115}
          height={70}
        />
        <Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>
          Social Security number
        </Typography>
        <Typography variant='body2'>
          {replaceDots(info?.identificationNumber ?? '')}
          <IconButton onClick={() => onCopy(info?.identificationNumber ?? '')}>
            <Icon icon='mdi:content-copy' fontSize={20} />
          </IconButton>
        </Typography>
        <Button
          variant='outlined'
          sx={{ marginTop: '15px' }}
          // ** TODO : 아래 disabled옵션 주석 해제하기!
          // disabled={!isAccountManager || !info?.identificationUploaded}
          onClick={() => downloadFile('identification')}
        >
          Download
        </Button>
      </CardBox>

      <CardBox>
        <img
          src='/images/cards/business-license.png'
          alt='social security number'
          aria-label='social security number'
          width={115}
          height={70}
        />
        <Typography sx={{ marginTop: '15px', fontWeight: 'bold' }}>
          W8/ W9/ Business license
        </Typography>

        <Button
          variant='outlined'
          sx={{ marginTop: '15px' }}
          disabled={!isAccountManager || !info?.businessLicenseUploaded}
          onClick={() => downloadFile('businessLicense')}
        >
          Download
        </Button>
      </CardBox>
    </Card>
  )
}

const CardBox = styled(Box)`
  margin: 0 18px 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 1px solid rgba(76, 78, 100, 0.12);
  border-radius: 10px;
`
