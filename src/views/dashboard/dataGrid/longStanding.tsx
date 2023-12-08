import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'
import { useState } from 'react'
import { GridColumns, GridSortModel } from '@mui/x-data-grid'
import { LongStandingDataType } from '@src/types/dashboard'
import { Box } from '@mui/material'

interface LongStandingDataGridProps<T extends { id: number }> {
  type: LongStandingDataType
  columns: GridColumns<T>
  initSort: GridSortModel
}

const LongStandingDataGrid = <T extends { id: number }>({
  type,
  columns,
  initSort,
}: LongStandingDataGridProps<T>) => {
  const [skip, setSkip] = useState(0)
  const [sortModel, setSortModel] = useState<GridSortModel>(initSort)
  // const { data } = useLongStanding({
  //   dataType: type,
  //   skip: skip,
  //   take: 7,
  //   sort: sortModel[0]?.field || initSort[0].field,
  //   ordering: sortModel[0]?.sort || (initSort[0].sort as OrderType),
  // })
  return (
    <Box>
      <DefaultDataGrid
        data={[]}
        columns={columns}
        defaultPageSize={7}
        sortModel={sortModel}
        setSortModel={setSortModel}
        setSkip={setSkip}
      />
    </Box>
  )
}

export default LongStandingDataGrid
