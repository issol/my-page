import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import React, { useEffect, useState } from 'react'
import { GridColumns, GridSortModel } from '@mui/x-data-grid'
import {
  CSVDataRecordProps,
  LongStandingDataType,
  OrderType,
} from '@src/types/dashboard'
import { Box } from '@mui/material'
import { useLongStanding } from '@src/queries/dashboard/dashnaord-lpm'
import { Title } from '@src/views/dashboard/dashboardItem'
import NoList from '@src/pages/components/no-list'

interface LongStandingDataGridProps extends CSVDataRecordProps {
  title: string
  type: LongStandingDataType
  columns: GridColumns
  initSort: GridSortModel
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const LongStandingDataGrid = ({
  title,
  type,
  columns,
  initSort,
  setOpenInfoDialog,
  setDataRecord,
}: LongStandingDataGridProps) => {
  const [skip, setSkip] = useState(0)
  const [sortModel, setSortModel] = useState<GridSortModel>(initSort)
  const { data } = useLongStanding({
    dataType: type,
    skip: skip,
    take: 7,
    sort: sortModel[0]?.field || initSort[0].field,
    ordering: sortModel[0]?.sort || (initSort[0].sort as OrderType),
  })

  const getNoListTitle = () => {
    const _title = title.split('-').slice(0, 2)
    return `${_title.join(' ')}`
  }

  useEffect(() => {
    const filterItems = data?.data.map(item => {
      return {
        [`${title} status`]: item.status,
        [`${title} price`]: item.totalPrice,
        '  ': '',
      }
    })

    setDataRecord(filterItems || [])
  }, [data?.data])

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Title
        padding='20px'
        title={title}
        prefix='🚨 '
        postfix={`(${data?.totalCount || 0})`}
        openDialog={setOpenInfoDialog}
      />
      <Box>
        <DefaultDataGrid
          title={getNoListTitle()}
          data={data}
          columns={columns}
          defaultPageSize={7}
          sortModel={sortModel}
          setSortModel={setSortModel}
          setSkip={setSkip}
        />
      </Box>
    </Box>
  )
}

export default LongStandingDataGrid
