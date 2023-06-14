import { Icon } from '@iconify/react'
import { Box, Button, Card, Divider, Typography } from '@mui/material'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { defaultOption } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemDetailType, ItemType, JobType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
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
      prices?.datas?.map(
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
              {prices?.datas[0]?.priceUnitTitle}
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
