import { Icon } from '@iconify/react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { downloadStateFile } from '@src/shared/helpers/file-download.helper'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'
import { TaxInfoType } from '@src/types/payment-info/pro/tax-info.type'
import { styled } from '@mui/system'

type Props = {
  billingMethod: ProPaymentType | null
  info: TaxInfoType
}
export default function TaxInfoDetail({ billingMethod, info }: Props) {
  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={
          billingMethod === 'koreaDomesticTransfer' || !billingMethod ? 12 : 6
        }
      >
        <BorderBox>
          <ContentGrid>
            <Typography sx={{ fontWeight: 600 }}>Tax info</Typography>

            <Typography variant='body2'>
              {info?.taxInfo ? info?.taxInfo : '-'}
            </Typography>
          </ContentGrid>
          <ContentGrid style={{ marginTop: '16px' }}>
            <Typography sx={{ fontWeight: 600 }}>Tax rate</Typography>

            <Typography variant='body2'>
              {info?.tax ? info.tax : '-'}
            </Typography>
          </ContentGrid>
        </BorderBox>
      </Grid>
      {billingMethod === 'koreaDomesticTransfer' || !billingMethod ? null : (
        <Grid item xs={6}>
          <BorderBox>
            <Typography sx={{ fontWeight: 600, mb: '16px' }}>
              W8 / W9 / Business license (CA)
            </Typography>
            <Button
              sx={{ width: '116px' }}
              size='small'
              variant='outlined'
              startIcon={<Icon icon='ic:baseline-download' />}
              disabled={!info?.businessLicense}
              onClick={() => {
                if (!info?.businessLicense) return
                downloadStateFile(info.businessLicense)
              }}
            >
              Download
            </Button>
            {/* <ContentGrid>

              <Typography variant='body2'>sdfsdf</Typography>
            </ContentGrid> */}
          </BorderBox>
        </Grid>
      )}
    </Grid>
  )
}

const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`

const ContentGrid = styled('div')`
  /* margin-top: 12px; */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`
