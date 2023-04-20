import { useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'

// ** components

// ** third parties
import isEqual from 'lodash/isEqual'

// ** fetch
import {
  useGetProjectList,
  useGetWorkNameList,
} from '@src/queries/pro-project/project.query'
import {
  FilterType as ActiveFilterType,
  SortingType,
} from '@src/apis/pro-projects.api'
import logger from '@src/@core/utils/logger'
import ClientProjectsFilter from './list/filters'
import { useForm } from 'react-hook-form'
import { ClientProjectFilterType } from '@src/types/client/client-projects.type'

export type FilterType = {
  projectType: Array<{ value: string; label: string }>
  category: Array<{ value: string; label: string }>
  serviceType: Array<{ value: string; label: string }>
  status: Array<{ value: string; label: string }>
  dueDate: Array<{ value: string; label: string }>
  search: string
}

const defaultValues: FilterType = {
  projectType: [],
  category: [],
  serviceType: [],
  status: [],
  dueDate: [],
  search: '',
}

type Props = { id: number }
type MenuType = 'list' | 'calendar'

export default function ClientProjects({ id }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')
  const [clientProjectListPage, setClientProjectListPage] = useState<number>(0)
  const [clientProjectListPageSize, setClientProjectListPageSize] =
    useState<number>(10)
  const [filters, setFilters] = useState<ClientProjectFilterType>({
    projectType: [],
    category: [],
    serviceType: [],
    status: [],
    dueDate: [],
    search: '',
    take: clientProjectListPageSize,
    skip: clientProjectListPageSize * clientProjectListPage,
    sort: 'DESC',
  })
  const [sort, setSort] = useState<SortingType>('DESC')
  const [skip, setSkip] = useState(0)

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    reset({
      projectType: [],
      category: [],
      serviceType: [],
      status: [],
      dueDate: [],
      search: '',
    })

    setFilters({
      projectType: [],
      category: [],
      serviceType: [],
      status: [],
      dueDate: [],
      search: '',
      skip: 0,
      take: 10,
      sort: 'DESC',
    })
  }

  const onSubmit = (data: FilterType) => {
    const { projectType, category, serviceType, status, dueDate, search } = data

    const filter = {
      projectType: projectType.map(value => value.value),
      category: category.map(value => value.value),
      serviceType: serviceType.map(value => value.value),
      status: status.map(value => value.value),
      dueDate: dueDate.map(value => value.value),

      search: search,
      take: clientProjectListPageSize,
      skip: clientProjectListPageSize * clientProjectListPage,
      sort: 'DESC',
    }

    console.log(filter)

    setFilters(filter)

    console.log(data)
  }

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
            <ClientProjectsFilter
              // workName={!workName?.length ? [] : workName}
              filter={filters}
              setFilter={setFilters}
              onReset={onClickResetButton}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              // search={onSearch}
            />
            {/* <ProjectsList
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
            /> */}
            <Box>List</Box>
          </Grid>
        ) : (
          // <CalendarContainer id={id} sort={sort} setSort={setSort} />
          <Box>Calendar</Box>
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
