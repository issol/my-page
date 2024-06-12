import { Card, Box, Typography, styled } from '@mui/material'
import Chip from '@src/@core/components/mui/chip'
import { CompanyInfoType } from '@src/types/company/info'

type Props = {
  companyInfo: CompanyInfoType
  companyLogoURL: string
}

const CompanyInfoCard = ({ companyInfo, companyLogoURL }: Props) => {
  return (
    <DesignedCard>
      <Card sx={{ padding: '24px' }}>
        <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
          <Card
            sx={{
              padding: '4px 5px',
              width: '120px',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100px',
                height: '86.85px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={companyLogoURL}
                alt=''
                style={{
                  width: '80px',
                  // height: '66.85px',
                }}
              />
            </Box>
          </Card>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '30px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',

                gap: '10px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Typography variant='h5'>{companyInfo?.name}</Typography>

                {companyInfo?.billingPlan ? (
                  <Chip
                    color='primary'
                    skin='light'
                    label={companyInfo?.billingPlan?.name}
                  />
                ) : (
                  <Chip color='primary' skin='light' label={'Premium'} />
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </DesignedCard>
  )
}

export default CompanyInfoCard

const DesignedCard = styled(Card)`
  position: relative;

  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)
      ),
      #72e128;
  }
`
