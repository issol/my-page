// ** react
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

// ** style component
import { Box, Divider, Grid, Typography } from '@mui/material'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ** types
import { ItemDetailType, ItemType } from '@src/types/common/item.type'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** types & validation
import { languageType } from '@src/pages/orders/add-new'
import { StandardPriceListType } from '@src/types/common/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
// import ItemPriceUnitForm from './item-price-unit-form'
// import TmAnalysisForm from './tm-analysis-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** helpers
import { FullDateHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import ItemPriceUnitTable from './price-unit-table'
import TmAnalysisTable from './tm-analysis-table'
import { UserRoleType } from '@src/context/types'

type Props = {
  item: ItemType
  priceList: StandardPriceListType[]
  idx?: number
  role: UserRoleType
}

export default function ItemDetail({ item, priceList, idx, role }: Props) {
  return (
    <Grid item xs={12}>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              height: '54px',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
              variant='body1'
            >
              Item due date
            </Typography>
            <Typography variant='body1' fontSize={14}>
              {FullDateHelper(item.dueAt)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              height: '54px',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
              variant='body1'
            >
              Contact person for job
            </Typography>
            <Typography variant='body1' fontSize={14}>
              {getLegalName({
                firstName: item.contactPerson?.firstName,
                middleName: item.contactPerson?.firstName,
                lastName: item.contactPerson?.firstName,
              })}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              height: '54px',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
              variant='body1'
            >
              Language pair
            </Typography>
            <Typography variant='body1' fontSize={14}>
              {languageHelper(item.source)}
              &nbsp;&rarr;&nbsp;
              {languageHelper(item.target)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              height: '54px',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
              variant='body1'
            >
              Price
            </Typography>
            <Typography variant='body1' fontSize={14}>
              {priceList?.find(price => price.id === item.priceId)?.priceName}
            </Typography>
          </Box>
        </Grid>
        {/* price unit start */}
        <ItemPriceUnitTable
          itemDetail={item.detail || []}
          totalPrice={item.totalPrice}
        />

        <Grid item xs={12}>
          <Typography variant='subtitle1' mb='24px' fontWeight={600}>
            Item description
          </Typography>
          <Typography>{item.description}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {/* TM analysis */}
        {role.name === 'CLIENT' ? null : (
          <Grid item xs={12}>
            <TmAnalysisTable data={item.analysis || []} />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
