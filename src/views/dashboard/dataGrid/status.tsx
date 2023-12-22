import React, { ReactElement, Suspense, useState } from 'react'
import { Box } from '@mui/material'
import {
  GridItem,
  SectionTitle,
  SubDateDescription,
  Title,
} from '@src/views/dashboard/dashboardItem'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Grid from '@mui/material/Grid'
import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import {
  Approval,
  CheckCircleOutline,
  DoNotDisturbAlt,
  KeyboardArrowRight,
  ReceiptLong,
  SmsFailedRounded,
} from '@mui/icons-material'
import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid'

import {
  useDashboardCount,
  useDashboardCountList,
} from '@src/queries/dashboard/dashnaord-lpm'
import { DashboardQuery, OrderType, ViewType } from '@src/types/dashboard'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import { useRouter } from 'next/router'
import DefaultDataGrid from '@src/views/dashboard/dataGrid/default'

const StatusDefined: Record<ViewType, { icon: ReactElement; color: string }> = {
  ongoing: {
    icon: <DoNotDisturbAlt sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  created: {
    icon: <AddIcon sx={{ color: 'rgba(102, 108, 255, 1)' }} />,
    color: 'rgba(102, 108, 255, 0.2)',
  },
  invoiced: {
    icon: <ReceiptLong sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(100, 198, 35, 0.2)',
  },
  canceled: {
    icon: <DoNotDisturbAlt sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  applied: {
    icon: <AddIcon sx={{ color: 'rgba(102, 108, 255, 1)' }} />,
    color: 'rgba(102, 108, 255, 0.2)',
  },
  passed: {
    icon: <CheckCircleOutline sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(114, 225, 40, 0.2)',
  },
  failed: {
    icon: <SmsFailedRounded sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  approved: {
    icon: <Approval sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(100, 198, 35, 0.2)',
  },
}

interface StatusAndListProps<T extends { id: number; orderId?: number }>
  extends DashboardQuery {
  type: 'job' | 'order' | 'application'
  statusColumn: GridColumns<T>
  initSort: GridSortModel
  userViewDate: string
  setOpenInfoDialog: (open: boolean, key: string) => void
  movePage?: () => void
  moveDetailPage?: (params: GridRowParams<T>) => void
}

const StatusAndDataGrid = <T extends { id: number; orderId?: number }>({
  type = 'order',
  to,
  from,
  statusColumn,
  initSort,
  movePage,
  moveDetailPage,
  userViewDate,
  setOpenInfoDialog,
}: StatusAndListProps<T>) => {
  const [activeStatus, setActiveStatus] = useState<ViewType>('ongoing')

  const [skip, setSkip] = useState(0)
  const [sortModel, setSortModel] = useState<GridSortModel>(initSort)

  const { data: countData } = useDashboardCount({ countType: type, to, from })
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
    <Suspense fallback={<div>로딩 중</div>}>
      <Grid container flexDirection='row' gap='24px'>
        <Grid item display='flex' flexDirection='column' gap='24px'>
          <GridItem width={300} height={175}>
            <Box sx={{ width: '100%' }}>
              <Title
                title={`Ongoing ${type}s`}
                marginBottom='20px'
                handleClick={movePage && movePage}
                openDialog={setOpenInfoDialog}
              />

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
                  <span className='value'>
                    {countData && countData['ongoing'].toLocaleString()}
                  </span>
                </li>
              </StatusSectionList>
            </Box>
          </GridItem>
          <GridItem width={300} height={290}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title={`${toCapitalize(type)} status`}
                marginBottom='20px'
                handleClick={movePage && movePage}
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
              />
              <StatusSectionList>
                {Object.entries(countData || []).map(([key, value], index) => {
                  if (key === 'ongoing') return null
                  return (
                    <li
                      key={`${key}-${index}`}
                      data-active={activeStatus === key}
                      onClick={() => setActiveStatus(key as ViewType)}
                    >
                      <StatusIcon
                        label={toCapitalize(key)}
                        color={StatusDefined[key as ViewType]?.color}
                        icon={StatusDefined[key as ViewType]?.icon}
                      />
                      <span className='value'>{value.toLocaleString()}</span>
                    </li>
                  )
                })}
              </StatusSectionList>
            </Box>
          </GridItem>
        </Grid>
        <GridItem sm height={489} padding='0'>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Title
              title={`Ongoing ${type}s > ${toCapitalize(activeStatus)}`}
              postfix={`(${
                countData && (countData[activeStatus] || 0).toLocaleString()
              })`}
              marginBottom='20px'
              padding='20px 20px 0'
              handleClick={movePage && movePage}
            />
            <Box
              sx={{
                width: '100%',
                height: `calc(100% - 84px)`,
                padding: 0,
                margin: 0,
              }}
            >
              <DefaultDataGrid<T>
                title={`Ongoing ${type}s`}
                data={data}
                columns={statusColumn}
                defaultPageSize={6}
                sortModel={sortModel}
                setSortModel={setSortModel}
                setSkip={setSkip}
                onRowClick={params => moveDetailPage && moveDetailPage(params)}
              />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Suspense>
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

export default StatusAndDataGrid
