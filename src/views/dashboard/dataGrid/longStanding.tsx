import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import React, { Dispatch, useEffect, useState } from 'react'
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
import { useLongStanding } from '@src/queries/dashnaord.query'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import NoList from '@src/pages/components/no-list'
import DashboardForSuspense, {
  DashboardErrorFallback,
  DashboardSuspenseProps,
} from '@src/views/dashboard/suspense'

interface LongStandingDataGridProps<T extends { id: number; status?: number }>
  extends CSVDataRecordProps {
  title: string
  type: LongStandingDataType
  columns: GridColumns
  initSort: GridSortModel
  setOpenInfoDialog: (open: boolean, key: string) => void
  overlayTitle: string
  onRowClick?: (
    params: GridRowParams<T>,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails,
  ) => void
  containerHeight?: number
  setIsData?: Dispatch<boolean>
}

const LongStanding = <T extends { id: number; status?: number }>({
  title,
  type,
  columns,
  initSort,
  setOpenInfoDialog,
  setDataRecord,
  onRowClick,
  setIsData,
  overlayTitle,
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

  useEffect(() => {
    setDataRecord([{ [title]: data?.totalCount || 0 }])
  }, [data?.data])

  useEffect(() => {
    if (!setIsData) return

    if (!data) {
      setIsData(false)
      return
    }

    setIsData(data?.data.length !== 0)
  }, [data, sortModel])

  return (
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
          overlayTitle={overlayTitle}
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
  )
}

const LongStandingDataGrid = <T extends { id: number; status?: number }>(
  props: LongStandingDataGridProps<T>,
) => {
  const [isData, setIsData] = useState(false)

  return (
    <DashboardForSuspense
      {...props}
      sectionTitle={props.title}
      titleProps={{
        prefix: '🚨 ',
        postfix: `(0)`,
        padding: '20px',
      }}
      refreshDataQueryKey={props.type}
    >
      <GridItem
        height={isData ? props.containerHeight || 547 : 253}
        sm
        padding='0px'
      >
        <LongStanding {...props} setIsData={setIsData} />
      </GridItem>
    </DashboardForSuspense>
  )
}

export default LongStandingDataGrid
