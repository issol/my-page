import { useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'

// ** components
import Filters from './list-view/filter'
import ProjectsList from './list-view/list'
import CalendarContainer from './calendar-view/calendar-container'

// ** third parties
import isEqual from 'lodash/isEqual'

// ** fetch
import { useGetProjectList } from '@src/queries/pro-project/project.query'

export type FilterType = {
  title?: Array<{ value: string; label: string }>
  role?: Array<{ value: string; label: string }>
  status?: Array<{ value: string; label: string }>
  source?: Array<{ value: string; label: string }>
  target?: Array<{ value: string; label: string }>
  client?: Array<{ value: string; label: string }>
  skip?: number
  take?: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'take'>

export const initialFilter: FilterOmitType = {
  title: [],
  role: [],
  status: [],
  source: [],
  target: [],
  client: [],
}

type Props = { id: number }
type MenuType = 'list' | 'calendar'

export default function ProjectsDetail({ id }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')
  const [filter, setFilter] = useState<FilterOmitType>({ ...initialFilter })
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)

  // console.log(filter)
  const { data: list, refetch } = useGetProjectList(
    id,
    {
      title: getFilter('title'),
      role: getFilter('role'),
      status: getFilter('status'),
      source: getFilter('source'),
      target: getFilter('target'),
      client: getFilter('client'),
      skip: skip * pageSize,
      take: pageSize,
    },
    search,
    setSearch,
  )

  function getFilter(name: keyof FilterOmitType) {
    if (filter[name] && filter[name]?.length) {
      return filter[name]?.map(item => item.value)
    }
    return []
  }

  function onReset() {
    setFilter({ ...initialFilter })
  }

  useEffect(() => {
    if (isEqual(initialFilter, filter)) {
      refetch()
    }
  }, [filter])

  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        justifyContent='right'
        padding='10px 0 24px'
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='list'
            $focus={menu === 'list'}
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            List view
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'calendar'}
            value='calendar'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Calendar view
          </CustomBtn>
        </ButtonGroup>
      </Box>
      <Box>
        {menu === 'list' ? (
          <Grid>
            <Filters
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={() => setSearch(true)}
            />
            <ProjectsList
              isCardHeader={true}
              skip={skip}
              setSkip={setSkip}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={false}
              list={list || { data: [], count: 0 }}
            />
          </Grid>
        ) : (
          <CalendarContainer id={id} />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
