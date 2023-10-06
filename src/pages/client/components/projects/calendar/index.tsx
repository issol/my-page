// ** React Imports
import { Suspense, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Switch from '@mui/material/Switch'

// ** components

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import { Typography } from '@mui/material'
import { useGetProjectCalendarData } from '@src/queries/pro-project/project.query'
import { CalendarEventType, SortingType } from '@src/apis/pro/pro-projects.api'

import { ClientProjectCalendarEventType } from '@src/apis/client.api'
import ClientProjectCalendar from './client-project-calendar'

import { useGetClientProjectsCalendar } from '@src/queries/client/client-detail'
import ClientProjectList from '../list/list'
import { UserDataType } from '@src/context/types'
import { ClientProjectListType } from '@src/types/client/client-projects.type'
import { useGetStatusList } from '@src/queries/common.query'
import {
  getOrderStatusColor,
  getQuoteStatusColor,
} from '@src/shared/helpers/colors.helper'
import { OrderStatusType } from '@src/types/common/orders.type'
import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import { QuotesStatusType } from '@src/types/common/quotes.type'
import { itemSchema } from '@src/types/schema/item.schema'

type Props = {
  id: number
  user: UserDataType
}

const ClientProjectCalendarContainer = ({ id, user }: Props) => {
  // ** States

  const [hideFilter, setHideFilter] = useState(false)
  const [selectedType, setSelectedType] = useState<'quote' | 'order'>('order')
  const { data: statusList } = useGetStatusList(
    selectedType === 'order' ? 'Order' : 'Quote',
  )

  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  // ** Hooks
  const { settings } = useSettings()

  // ** calendar values
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { data, refetch } = useGetClientProjectsCalendar(
    id,
    year,
    month,
    selectedType,
  )
  const [event, setEvent] = useState<Array<ClientProjectCalendarEventType>>([])

  console.log(data)

  const [currentListId, setCurrentListId] = useState<null | number>(null)
  const [currentList, setCurrentList] = useState<
    Array<ClientProjectCalendarEventType>
  >([])

  const [selected, setSelected] = useState<number | null>(null)

  const handleRowClick = (row: ClientProjectListType) => {
    if (row.id === selected) {
      setSelected(null)
      // setSelectedProjectRow(null)
    } else {
      setSelected(row.id)
      // setSelectedProjectRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  useEffect(() => {
    if (currentListId && data?.data) {
      // console.log(currentListId)

      setCurrentList(data?.data.filter(item => item.id === currentListId))
    }
  }, [currentListId])

  useEffect(() => {
    console.log(data)

    if (data?.data?.length) {
      setEvent([...data.data])
    } else {
      setEvent([
        //@ts-ignore
        {
          id: 0,
          corporationId: '',
          serviceType: [],
          projectName: '',
          workName: '',
          category: '',
          orderDate: '',
          dueDate: '',
          status: 10000,
          extendedProps: {
            calendar: 'primary',
          },
          type: 'order',
        },
      ])
    }
  }, [data])

  useEffect(() => {
    if (data?.data.length && hideFilter) {
      if (selectedType === 'order') {
        setEvent(
          data.data.filter(
            item =>
              item.status !== 10700 &&
              item.status !== 101200 &&
              item.status !== 101000 &&
              item.status !== 101100,
          ),
        )
      } else {
        setEvent(
          data.data.filter(
            item =>
              item.status !== 20900 &&
              item.status !== 201100 &&
              item.status !== 201200,
          ),
        )
      }
    } else if (data?.data.length && !hideFilter) {
      setEvent([...data.data])
    }
  }, [data, hideFilter, selectedType])
  useEffect(() => {
    if (statusList) {
      const res = statusList.map(value => ({
        ...value,
        color:
          selectedType === 'order'
            ? getOrderStatusColor(value.value as OrderStatusType)
            : getQuoteStatusColor(value.value as QuotesStatusType),
      }))
      setStatuses(res)
    }
  }, [statusList, selectedType])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && {
            border: theme => `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <Suspense>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid rgba(76, 78, 100, 0.12)',
                padding: '40px 20px 0 20px',
              }}
            >
              <Typography
                fontSize={14}
                fontWeight={selectedType === 'order' ? 400 : 600}
                color={selectedType === 'order' ? '#BDBDBD' : '#666CFF'}
              >
                Quotes
              </Typography>
              <Switch
                checked={selectedType === 'order'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedType(event.target.checked ? 'order' : 'quote')
                }}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{
                  '.MuiSwitch-switchBase:not(.Mui-checked)': {
                    color: '#666CFF',
                    '.MuiSwitch-thumb': {
                      color: '#666CFF',
                    },
                  },
                  '.MuiSwitch-track': {
                    backgroundColor: '#666CFF',
                  },
                }}
              />
              <Typography
                fontSize={14}
                fontWeight={selectedType === 'order' ? 600 : 400}
                color={selectedType === 'order' ? '#666CFF' : '#BDBDBD'}
              >
                Orders
              </Typography>
            </Box>
            <CalendarStatusSideBar
              alertIconStatus='Canceled'
              status={statuses!}
              mdAbove={mdAbove}
              leftSidebarWidth={leftSidebarWidth}
              title='Project'
            />
          </Box>
        </Suspense>
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
            display='flex'
            alignItems='center'
            gap='8px'
            justifyContent='right'
            padding='0 0 22px'
            position='absolute'
            right='0'
          >
            <Typography>Hide completed projects</Typography>
            <Switch
              checked={hideFilter}
              onChange={e => setHideFilter(e.target.checked)}
            />
          </Box>
          <ClientProjectCalendar
            event={event}
            setYear={setYear}
            setMonth={setMonth}
            direction={direction}
            setCurrentListId={setCurrentListId}
          />
        </Box>
      </CalendarWrapper>

      {currentList.length ? (
        <ClientProjectList
          list={currentList}
          listCount={currentList.length}
          handleRowClick={handleRowClick}
          isSelected={isSelected}
          selected={selected}
          user={user}
        />
      ) : null}
    </Box>
  )
}

export default ClientProjectCalendarContainer
