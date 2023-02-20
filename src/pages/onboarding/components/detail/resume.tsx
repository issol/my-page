import Card from '@mui/material/Card'

import styled from 'styled-components'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from 'src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import TypoGraphy from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { v4 as uuidv4 } from 'uuid'
import { OnboardingProDetailsType } from 'src/types/onboarding/details'

type Props = {
  userInfo: OnboardingProDetailsType
  onClickResume: (resume: {
    id: number
    uri: string
    fileName: string
    fileType: string
  }) => void
}

export default function Resume({ userInfo, onClickResume }: Props) {
  return (
    <Card sx={{ padding: '20px' }}>
      <TypoGraphy
        variant='h6'
        sx={{
          padding: 0,
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Resume
        <IconButton sx={{ padding: 0 }}>
          <img src='/images/icons/file-icons/download.svg'></img>
        </IconButton>
      </TypoGraphy>
      <CardContent sx={{ padding: 0 }}>
        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {userInfo.resume && userInfo.resume.length ? (
            userInfo.resume?.map(value => {
              return (
                <Box
                  key={uuidv4()}
                  sx={{
                    width: '53px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onClickResume(value)}
                >
                  <img
                    src={`/images/icons/file-icons/${value.fileType}-file.svg`}
                    style={{
                      width: '40px',
                      height: '40px',
                    }}
                  ></img>
                  <ResumeFileName>{value.fileName}</ResumeFileName>
                </Box>
              )
            })
          ) : (
            <Box>-</Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

const ResumeFileName = styled.div`
  width: 100%;
  // height: 51px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  // line-height: 14px;

  text-align: center;
  letter-spacing: 0.4px;

  color: rgba(76, 78, 100, 0.6);

  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
