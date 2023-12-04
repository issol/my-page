import React, { ReactElement, useState } from 'react'
import { Box } from '@mui/material'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
} from '@src/pages/dashboards/components/dashboardItem'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import dayjs from 'dayjs'
import Grid from '@mui/material/Grid'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import { DoNotDisturbAlt, ReceiptLong } from '@mui/icons-material'
import { DataGrid, GridColumns, GridSortModel } from '@mui/x-data-grid'

import {
  useDashboardCount,
  useDashboardCountList,
} from '@src/queries/dashboard/dashnaord-lpm'
import { DashboardQuery, OrderType, ViewType } from '@src/types/dashboard'
import { toCapitalize } from '@src/pages/dashboards/lpm'

interface StatusAndListProps extends DashboardQuery {
  type: 'job' | 'order'
  statusColumn: GridColumns
  initSort: GridSortModel
  userViewDate: string
}

const StatusAndList = ({
  type = 'order',
  to,
  from,
  statusColumn,
  initSort,
  userViewDate,
}: StatusAndListProps) => {
  const { data: countData } = useDashboardCount({ to, from })
  const [activeStatus, setActiveStatus] = useState<ViewType>('ongoing')
  const [sortModel, setSortModel] = useState<GridSortModel>(initSort)

  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(6)

  const { data } = useDashboardCountList({
    countType: type,
    type: activeStatus,
    to,
    from,
    skip: skip,
    take: 6,
    sort: sortModel[0]?.field || initSort[0].field,
    ordering: sortModel[0]?.sort || (initSort[0].sort as OrderType),
  })

  return (
    <Grid container flexDirection='row' gap='24px'>
      <Grid item display='flex' flexDirection='column' gap='24px'>
        <GridItem width={290} height={175}>
          <Box sx={{ width: '100%' }}>
            <Box marginBottom='20px'>
              <SectionTitle>
                <span className='title'>Ongoing {`${type}s`}</span>
                <ErrorOutlineIcon className='info_icon' />
              </SectionTitle>
            </Box>
            <StatusSectionList style={{ padding: '20px 0' }}>
              <li
                data-active={activeStatus === 'ongoing'}
                onClick={() => setActiveStatus('ongoing')}
              >
                <StatusIcon
                  label='Ongoing'
                  color='rgba(253, 181, 40, 0.2)'
                  icon={
                    <img
                      width={24}
                      height={24}
                      src='/images/icons/dashnoard_loading_icon.svg'
                      alt='아이콘'
                    />
                  }
                />
                <span className='value'>{countData['ongoing']}</span>
              </li>
            </StatusSectionList>
          </Box>
        </GridItem>
        <GridItem width={290} height={290}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Box marginBottom='20px'>
              <SectionTitle>
                <span className='title'>{toCapitalize(type)} status</span>
                <ErrorOutlineIcon className='info_icon' />
              </SectionTitle>
              <SubDateDescription textAlign='left'>
                {userViewDate}
              </SubDateDescription>
            </Box>
            <StatusSectionList>
              <li
                data-active={activeStatus === 'created'}
                onClick={() => setActiveStatus('created')}
              >
                <StatusIcon
                  label='Created'
                  color='rgba(102, 108, 255, 0.2)'
                  icon={<AddIcon sx={{ color: '#666CFF' }} />}
                />
                <span className='value'>{countData['created']}</span>
              </li>
              <li
                data-active={activeStatus === 'invoiced'}
                onClick={() => setActiveStatus('invoiced')}
              >
                <StatusIcon
                  label='Invoiced'
                  color='rgba(114, 225, 40, 0.2)'
                  icon={<ReceiptLong sx={{ color: '#64C623' }} />}
                />
                <span className='value'>{countData['invoiced']}</span>
              </li>
              <li
                data-active={activeStatus === 'canceled'}
                onClick={() => setActiveStatus('canceled')}
              >
                <StatusIcon
                  label='Canceled'
                  color='rgba(224, 68, 64, 0.1)'
                  icon={<DoNotDisturbAlt sx={{ color: '#E04440' }} />}
                />
                <span className='value'>{countData['canceled']}</span>
              </li>
            </StatusSectionList>
          </Box>
        </GridItem>
      </Grid>
      <GridItem sm height={489} padding='0'>
        <Box sx={{ width: '100%' }}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ padding: '0 20px', height: '72px' }}
          >
            <SectionTitle>
              <span className='title'>
                Ongoing {type}s &gt; {toCapitalize(activeStatus)}{' '}
                {`(${countData[activeStatus]})`}
              </span>
            </SectionTitle>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: `calc(489px - 72px)`,
              padding: 0,
              margin: 0,
            }}
          >
            <DataGrid
              initialState={{
                sorting: { sortModel },
              }}
              page={page}
              onPageChange={newPage => {
                setPage(newPage)
                setSkip(val => newPage * 4)
              }}
              pageSize={pageSize}
              onPageSizeChange={pageSize => setPageSize(pageSize)}
              paginationMode='server'
              rows={data?.data || []}
              columns={statusColumn}
              rowCount={data?.totalCount || 0}
              rowsPerPageOptions={[6]}
              sortModel={sortModel}
              onSortModelChange={newSortModel => setSortModel(newSortModel)}
            />
          </Box>
        </Box>
      </GridItem>
    </Grid>
  )
}

interface StatusIconProps {
  label: string
  icon: ReactElement
  color: string
}

const StatusIcon = ({ label, icon, color }: StatusIconProps) => {
  return (
    <Box display='flex' alignItems='center' gap='10px'>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          backgroundColor: color,
        }}
      >
        {icon}
      </Box>
      <Typography fontSize='14px' fontWeight={600} color='#4C4E64DE'>
        {label}
      </Typography>
    </Box>
  )
}

const StatusSectionList = styled('ul')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: 0,
    listStyle: 'none',
    padding: '0',

    '& > li': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '8px 10px',
      borderRadius: '10px',
      cursor: 'pointer',
      backgroundColor: '#fff',

      '&:hover': {
        backgroundColor: 'rgba(76, 78, 100, 0.05)',
        transition: 'background-color 0.5s',
      },

      '&:active': {
        backgroundColor: 'rgba(109, 120, 141, 0.1)',
        transition: 'background-color 0.5s',
      },

      '&[data-active=true]': {
        backgroundColor: 'rgba(109, 120, 141, 0.1)',
        transition: 'background-color 0.5s',
      },
    },

    '& > li > .value': {
      fontSize: '16px',
      fontWeight: 600,
    },
  }
})

export default StatusAndList
