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

// ** fetch
import {
  useGetProjectList,
  useGetWorkNameList,
} from '@src/queries/pro/pro-project.query'
import {
  FilterType as ActiveFilterType,
  SortingType,
} from '@src/apis/pro/pro-projects.api'
import { useQueryClient } from 'react-query'

export type FilterType = {
  title?: Array<{ value: string; label: string }>
  role?: Array<{ value: string; label: string }>
  status?: Array<{ value: string; label: string }>
  source?: Array<{ value: string; label: string }>
  target?: Array<{ value: string; label: string }>
  client?: Array<{ value: string; label: string }>
  sort?: SortingType
  skip: number
  take: number
}

export const initialFilter: FilterType = {
  title: [],
  role: [],
  status: [],
  source: [],
  target: [],
  client: [],
  skip: 0,
  take: 10,
}

type Props = { id: number }
type MenuType = 'list' | 'calendar'

export default function ProjectsDetail({ id }: Props) {
  const queryClient = useQueryClient()
  const [menu, setMenu] = useState<MenuType>('list')
  const [filter, setFilter] = useState<FilterType>({ ...initialFilter })
  const [activeFilter, setActiveFilter] = useState<ActiveFilterType>({
    skip: 0,
    take: 10,
  })
  const [sort, setSort] = useState<SortingType>('DESC')
  const [skip, setSkip] = useState(0)

  const { data: workName } = useGetWorkNameList(id)

  const { data: list } = useGetProjectList(id, activeFilter)

  function getFilter(name: keyof Omit<FilterType, 'skip' | 'take' | 'sort'>) {
    if (filter[name] && filter[name]?.length) {
      return filter[name]?.map(item => item.value)
    }
    return []
  }

  function onSearch() {
    setActiveFilter({
      ...activeFilter,
      sort,
      title: getFilter('title'),
      role: getFilter('role'),
      status: getFilter('status'),
      source: getFilter('source'),
      target: getFilter('target'),
      client: getFilter('client'),
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
    queryClient.invalidateQueries([
      'get-project/list',
      {
        ...activeFilter,
        sort,
        title: getFilter('title'),
        role: getFilter('role'),
        status: getFilter('status'),
        source: getFilter('source'),
        target: getFilter('target'),
        client: getFilter('client'),
        skip: skip * activeFilter.take,
        take: activeFilter.take,
      },
    ])
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ skip: 0, take: 10 })
    queryClient.invalidateQueries(['get-project/list', { ...initialFilter }])
  }

  useEffect(() => {
    queryClient.invalidateQueries(['get-project/list'])
  }, [])

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
              workName={!workName?.length ? [] : workName}
              filter={filter}
              setFilter={setFilter}
              onReset={onReset}
              search={onSearch}
            />
            <ProjectsList
              isCardHeader={true}
              skip={skip}
              sort={sort}
              setSort={setSort}
              pageSize={activeFilter.take!}
              setSkip={(n: number) => {
                setSkip(n)
                setActiveFilter({
                  ...activeFilter,
                  skip: n * activeFilter.take!,
                })
              }}
              setPageSize={(n: number) =>
                setActiveFilter({ ...activeFilter, take: n })
              }
              list={list || { data: [], totalCount: 0 }}
            />
          </Grid>
        ) : (
          <CalendarContainer id={id} sort={sort} setSort={setSort} />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
