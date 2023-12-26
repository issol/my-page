import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { JobTableColumn } from '@src/shared/const/columns/dashboard'
import styled from 'styled-components'
import { useJobType } from '@src/queries/dashboard/dashnaord-lpm'
import { Box } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import React, { useEffect, useState } from 'react'
import OptionsMenu from '@src/@core/components/option-menu'
import { useRouter } from 'next/router'
import { CSVDataRecordProps } from '@src/types/dashboard'
import NoList from '@src/pages/components/no-list'

interface TADJobDataGridProps extends CSVDataRecordProps {
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const TADJobDataGrid = ({
  dataRecord,
  setDataRecord,
  setOpenInfoDialog,
}: TADJobDataGridProps) => {
  const router = useRouter()
  const [filter, setFilter] = useState<'jobType' | 'role' | 'pair'>('pair')
  const [page, setPage] = useState(0)

  const { data } = useJobType(filter)

  const getTitle = () => {
    if (filter === 'jobType') return 'Job types'
    if (filter === 'role') return 'Roles'
    if (filter === 'pair') return 'Job type/Role pool'
  }

  useEffect(() => {
    const filterJobTypeAndRole = data?.report.map(item => {
      if (filter === 'pair') {
        return {
          'Job Type': item.jobType,
          Role: item.role,
          Number: item.count,
          Percent: item.ratio,
          '   ': '',
        }
      }
      if (filter === 'role') {
        return {
          Role: item.role,
          Number: item.count,
          Percent: item.ratio,
          '   ': '',
        }
      }
      return {
        'Job Type': item.jobType,
        Number: item.count,
        Percent: item.ratio,
        '   ': '',
      }
    })

    setDataRecord(filterJobTypeAndRole || [])
  }, [filter])

  return (
    <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
      <Box
        display='flex'
        justifyContent='space-between'
        sx={{ padding: '20px 20px 10px' }}
      >
        <Title
          title='Job type/Role pool'
          subTitle={`Total ${data?.totalCount || 0} ${getTitle()}`}
          openDialog={setOpenInfoDialog}
          handleClick={() => router.push('/pro')}
        />
        <Box>
          <OptionsMenu
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
            options={[
              {
                text: 'Job type/Role',
                menuItemProps: {
                  onClick: () => {
                    setFilter('pair')
                    setPage(0)
                  },
                },
              },
              {
                text: 'Job types',
                menuItemProps: {
                  onClick: () => {
                    setFilter('jobType')
                    setPage(0)
                  },
                },
              },
              {
                text: 'Roles',
                menuItemProps: {
                  onClick: () => {
                    setFilter('role')
                    setPage(0)
                  },
                },
              },
            ]}
          />
        </Box>
      </Box>
      <div style={{ height: `calc(100% - 105px)`, width: '100%' }}>
        <CustomDataGrid
          columns={JobTableColumn}
          rows={(data?.report || []).map((item, index) => ({
            id: `${item.jobType}-${index}`,
            numbering: index + 1,
            ...item,
          }))}
          components={{
            Header: () => null,
            NoRowsOverlay: () => NoList(`There are no Pros yet`),
            NoResultsOverlay: () => NoList(`There are no Pros yet`),
          }}
          page={page}
          onPageChange={() => setPage(page + 1)}
          pageSize={7}
          rowCount={data?.totalCount || 0}
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
