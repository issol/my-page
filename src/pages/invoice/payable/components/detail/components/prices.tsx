import { Box, Card, Divider, Typography } from '@mui/material'
import { ItemDetailType, JobType } from '@src/types/common/item.type'
import { useMemo } from 'react'
import languageHelper from '@src/shared/helpers/language.helper'
import { JobPricesDetailType } from '@src/types/jobs/jobs.type'
import ItemPriceUnitTable from '@src/pages/components/item-detail/price-unit-table'

type Props = {
  jobInfo: JobType
  prices: JobPricesDetailType
}
const ViewPrices = ({ jobInfo, prices }: Props) => {
  const itemDetail: ItemDetailType[] = useMemo(
    () =>
      prices?.detail?.map(
        item =>
          ({
            priceUnitId: item.priceUnitId,
            priceUnit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            prices: item.prices,
            unit: item.unit,
            currency: prices.currency,
          } || []),
      ),
    [prices],
  )

  return (
    <Card sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              fontSize={14}
              width={150}
            >
              Language pair
            </Typography>
            <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
              {languageHelper(jobInfo.sourceLanguage)}&nbsp;&rarr;&nbsp;
              {languageHelper(jobInfo.targetLanguage)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              fontSize={14}
              width={150}
            >
              Price
            </Typography>
            <Typography variant='subtitle2' fontWeight={400} fontSize={14}>
              {prices?.detail[0]?.title}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <ItemPriceUnitTable
          itemDetail={itemDetail}
          totalPrice={prices.totalPrice}
        />
      </Box>
    </Card>
  )
}

export default ViewPrices
