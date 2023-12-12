import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { JobTableColumn } from '@src/shared/const/columns/dashboard'
import styled from 'styled-components'
import { useJobType } from '@src/queries/dashboard/dashnaord-lpm'
import { Box } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import React from 'react'

interface TADJobDataGridProps {
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const TADJobDataGrid = ({ setOpenInfoDialog }: TADJobDataGridProps) => {
  const { data } = useJobType('pair')

  return (
    <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
      <Box sx={{ padding: '20px 20px 10px' }}>
        <Title
          title='Job type/Role pool'
          subTitle={`Total ${data?.totalCount || 0} Job type/Role`}
          openDialog={setOpenInfoDialog}
        />
      </Box>
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
    </Box>
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
