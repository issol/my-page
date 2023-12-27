import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import React, { useEffect, useState } from 'react'
import {
  GridCallbackDetails,
  GridColumns,
  GridRowParams,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid'
import {
  CSVDataRecordProps,
  LongStandingDataType,
  OrderType,
} from '@src/types/dashboard'
import { Box } from '@mui/material'
import { useLongStanding } from '@src/queries/dashboard/dashnaord-lpm'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import NoList from '@src/pages/components/no-list'

interface LongStandingDataGridProps<T extends { id: number; status?: number }>
  extends CSVDataRecordProps {
  title: string
  type: LongStandingDataType
  columns: GridColumns
  initSort: GridSortModel
  setOpenInfoDialog: (open: boolean, key: string) => void
  onRowClick?: (
    params: GridRowParams<T>,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails,
  ) => void
  containerHeight?: number
}

const LongStandingDataGrid = <T extends { id: number; status?: number }>({
  title,
  type,
  columns,
  initSort,
  setOpenInfoDialog,
  setDataRecord,
  onRowClick,
  containerHeight = 547,
}: LongStandingDataGridProps<T>) => {
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
    setDataRecord([{ [title]: data?.totalCount || 0 }])
  }, [data?.data])

  return (
    <GridItem
      height={!data || data?.data.length === 0 ? 253 : containerHeight}
      sm
      padding='0px'
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <Title
          padding='20px'
          title={title}
          prefix='🚨 '
          postfix={`(${(data?.totalCount || 0).toLocaleString()})`}
          openDialog={setOpenInfoDialog}
        />
        <Box sx={{ height: 'calc(100% - 80px)' }}>
          <DefaultDataGrid
            title={getNoListTitle()}
            data={data}
            columns={columns}
            defaultPageSize={7}
            sortModel={sortModel}
            setSortModel={setSortModel}
            setSkip={setSkip}
            onRowClick={onRowClick}
          />
        </Box>
      </Box>
    </GridItem>
  )
}

export default LongStandingDataGrid
