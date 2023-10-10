// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'
import { Card, Typography } from '@mui/material'

// ** components
import ReceivableCalendar from './calendar'
import ReceivableList from '../list/list'
import CalendarSideBar from '@src/pages/components/sidebar'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

// ** types
import { CalendarEventType } from '@src/types/common/calendar.type'
import {
  InvoiceReceivableFilterType,
  InvoiceReceivableListType,
} from '@src/types/invoice/receivable.type'

// ** apis
import { useGetReceivableCalendar } from '@src/queries/invoice/receivable.query'
import { useGetStatusList } from '@src/queries/common.query'
import { getReceivableStatusColor } from '@src/shared/helpers/colors.helper'
import { getCurrentRole } from '@src/shared/auth/storage'
// import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'
import { getInvoiceReceivableListColumns } from '@src/shared/const/columns/invoice-receivable'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

const CalendarContainer = () => {
  // ** Hooks
  const { settings } = useSettings()

  const currentRole = getCurrentRole()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const { data: statusList } = useGetStatusList('InvoiceReceivable')
  const auth = useRecoilValueLoadable(authState)

  const statuses = statusList?.map(i => ({
    value: i.value,
    label: i.label,
    color: getReceivableStatusColor(i.value as InvoiceReceivableStatusType),
  }))

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<InvoiceReceivableFilterType>({
    mine: '0',
    hidePaid: '0',
    skip: 0,
    take: 10,
  })

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch, isLoading } = useGetReceivableCalendar(
    year,
    month,
    filter,
  )

  const [event, setEvent] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<CalendarEventType<InvoiceReceivableListType>>
  >([])

  useEffect(() => {
    if (currentListId && data?.data) {
      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId])

  useEffect(() => {
    if (data?.data?.length) {
      setEvent([...data.data])
    } else {
      setEvent([])
    }
  }, [data])

  return (
    <Box>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
          '& .fc-daygrid-event-harness': {
            '& .fc-event': {
              padding: '0 !important',
            },
            '.fc-h-event': {
              border: 'none',
            },
          },
        }}
      >
        <CalendarStatusSideBar
          alertIconStatus='Canceled'
          status={statuses || []}
          mdAbove={mdAbove}
          leftSidebarWidth={leftSidebarWidth}
          title='Invoice'
        />
        <Box
          sx={{
            px: 5,
            pt: 3.75,
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove
              ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
              : {}),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '24px',
            }}
          >
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>See only my invoices</Typography>
              <Switch
                checked={filter.mine === '1'}
                onChange={e =>
                  setFilter({ ...filter, mine: e.target.checked ? '1' : '0' })
                }
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Typography>Hide paid invoices</Typography>
              <Switch
                checked={filter.hidePaid === '1'}
                onChange={e =>
                  setFilter({
                    ...filter,
                    hidePaid: e.target.checked ? '1' : '0',
                  })
                }
              />
            </Box>
          </Box>
          <ReceivableCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>
      {currentListId === null ? null : (
        <Card sx={{ background: 'white', marginTop: 10 }}>
          <ReceivableList
            isLoading={isLoading}
            page={skip}
            setPage={setSkip}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setFilters={setFilter}
            columns={getInvoiceReceivableListColumns(
              statusList!,
              currentRole!,
              auth,
            )}
            list={
              currentList?.length
                ? {
                    data: currentList,
                    count: pageSize,
                    totalCount: currentList?.length,
                  }
                : { data: [], count: 0, totalCount: 0 }
            }
            role={currentRole!}
            type='calendar'
          />
        </Card>
      )}
    </Box>
  )
}

export default CalendarContainer
