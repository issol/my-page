import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { GridColumns } from '@mui/x-data-grid'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import TestTypeChip from 'src/pages/certification-test/components/list/list-item/test-type-chip'
import JobTypeRole from 'src/pages/components/job-type-role-chips'

import { TestMaterialListType } from 'src/types/certification-test/list'
import { FullDateTimezoneHelper } from '../../helpers/date.helper'

export const getStandardPriceColumns = () => {
  const materialColumns: GridColumns<StandardPriceListType> = [
    {
      flex: 0.12,
      minWidth: 100,
      field: 'sort',
      headerName: 'Test type',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box></Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box></Box>
      },
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'priceName',
      headerName: 'Price name',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>Price name</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.priceName}</Box>
      },
    },

    {
      flex: 0.3,
      minWidth: 180,
      field: 'category',
      headerName: 'Category',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Category</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.category}</Box>
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'serviceType',
      headerName: 'Service type',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Service type</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.serviceType}</Box>
      },
    },
    {
      flex: 0.17,
      field: 'currency',
      minWidth: 80,
      headerName: 'Currency',
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => <Box>Currency</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.currency}</Box>
      },
    },
    {
      flex: 0.17,
      field: 'catBasis',
      minWidth: 80,
      headerName: 'CAT basis',
      disableColumnMenu: true,
      sortable: true,
      renderHeader: () => <Box>CAT basis</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.catBasis}</Box>
      },
    },
  ]

  return materialColumns
}
