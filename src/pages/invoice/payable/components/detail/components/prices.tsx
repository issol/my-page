import { Icon } from '@iconify/react'
import { Box, Button, Card, Divider, Typography } from '@mui/material'
import useModal from '@src/hooks/useModal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { defaultOption } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ItemType, JobType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState } from 'react'
import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  row: JobType
  priceUnitsList: Array<PriceUnitListType>
}
const ViewPrices = ({ row }: Props) => {
  return (
    <Card sx={{ padding: '24px' }}>
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                {languageHelper(row.sourceLanguage)}&nbsp;&rarr;&nbsp;
                {languageHelper(row.targetLanguage)}
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
                {fields[0].name}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Row
            getItem={getItem}
            getPriceOptions={getPriceOptions}
            itemControl={itemControl}
            showMinimum={showMinimum}
            setItem={setItem}
            setShowMinimum={setShowMinimum}
            openModal={openModal}
            closeModal={closeModal}
            priceUnitsList={priceUnitsList}
            type='detail'
          />
        </Box> */}
    </Card>
  )
}

export default ViewPrices
