import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { JobTableColumn } from '@src/shared/const/columns/dashboard'
import styled from 'styled-components'
import { useJobType } from '@src/queries/dashboard/dashnaord-lpm'

const TempData = {
  take: 7,
  skip: 0,
  totalCount: 323,
  sort: 'jobType-role',
  ordering: 'desc', // default
  data: [
    {
      id: 26,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 27,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 28,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 29,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 30,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 31,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
    {
      id: 32,
      jobType: 'Dubbing',
      role: 'Audio describer',
      pros: 323,
      ratio: 3.2,
    },
  ],
}

const TADJobDataGrid = () => {
  const { data } = useJobType('pair')
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <CustomDataGrid
        columns={JobTableColumn}
        rows={(data?.report || []).map((item, index) => ({
          id: `${item.jobType}-${index}`,
          numbering: index + 1,
          ...item,
        }))}
        rowCount={data?.totalCount || 0}
        pageSize={7}
        rowsPerPageOptions={[]}
      />
    </div>
  )
}

const CustomDataGrid = styled(DataGrid)(() => {
  return {
    '& .MuiDataGrid-virtualScroller': {
      marginTop: '38px !important',
    },

    '& .MuiDataGrid-columnHeaders': {
      maxHeight: '38px !important',
      minHeight: '38px !important',
      background: 'none !important',
    },

    '& .MuiDataGrid-columnHeader': {
      background: 'none !important',
    },

    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },

    '& .MuiDataGrid-virtualScrollerContent': {
      height: 'auto !important',
    },

    '& .MuiDataGrid-row': {
      display: 'flex',
      alignItems: 'center',
      maxHeight: '40px !important',
      minHeight: '40px !important',
      cursor: 'pointer',
    },

    '& .MuiDataGrid-main': {
      '& .MuiDataGrid-cell': {
        borderBottom: 'none',
      },
    },
    '& .desiredDueDate-date__cell': {
      padding: '0 !important',
      maxWidth: '100% !important',
    },

    '& .MuiDataGrid-footerContainer': {
      border: 'none',
    },
  }
})

export default TADJobDataGrid
