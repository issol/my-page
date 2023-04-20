import { useEffect, useState } from 'react'

import styled from 'styled-components'

// ** MUI Imports
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import FormControlLabel from '@mui/material/FormControlLabel'
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
import {
  ClientProjectFilterType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import { useGetClientProjectList } from '@src/queries/client/client-detail'
import ClientProjectList from './list/list'
import { UserDataType } from '@src/context/types'
import ClientProjectCalendarContainer from './calendar'

export type FilterType = {
  projectType: Array<{ value: string; label: string }>
  category: Array<{ value: string; label: string }>
  serviceType: Array<{ value: string; label: string }>
  status: Array<{ value: string; label: string }>
  dueDate: Date[]
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

type Props = { id: number; user: UserDataType }
type MenuType = 'list' | 'calendar'

export default function ClientProjects({ id, user }: Props) {
  const [menu, setMenu] = useState<MenuType>('list')

  const [clientProjectListPage, setClientProjectListPage] = useState<number>(0)
  const [clientProjectListPageSize, setClientProjectListPageSize] =
    useState<number>(10)

  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const [hideCompletedProjects, setHideCompletedProjects] = useState(false)
  const [selectedProjectRow, setSelectedProjectRow] =
    useState<ClientProjectListType | null>(null)

  const [selected, setSelected] = useState<number | null>(null)

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

  const { data: clientProjectList, isLoading } =
    useGetClientProjectList(filters)

  const { control, handleSubmit, trigger, reset, watch } = useForm<FilterType>({
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

  const handleRowClick = (row: ClientProjectListType) => {
    if (row.id === selected) {
      setSelected(null)
      setSelectedProjectRow(null)
    } else {
      setSelected(row.id)
      setSelectedProjectRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  const handleHideCompletedProjects = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideCompletedProjects(event.target.checked)
    setFilters(prevState => ({
      ...prevState,
      hideCompletedProject: event.target.checked,
    }))
  }

  const onSubmit = (data: FilterType) => {
    const { projectType, category, serviceType, status, dueDate, search } = data

    const filter = {
      projectType: projectType.map(value => value.value),
      category: category.map(value => value.value),
      serviceType: serviceType.map(value => value.value),
      status: status.map(value => value.value),
      dueDate: dueDate.map(value => value),

      search: search,
      take: clientProjectListPageSize,
      skip: clientProjectListPageSize * clientProjectListPage,
      sort: 'DESC',
    }

    setFilters(filter)
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ClientProjectsFilter
              filter={filters}
              control={control}
              setFilter={setFilters}
              onReset={onClickResetButton}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              trigger={trigger}
              watch={watch}
              setServiceTypeList={setServiceTypeList}
              serviceTypeList={serviceTypeList}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              // search={onSearch}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <FormControlLabel
                value='start'
                control={
                  <Switch
                    checked={hideCompletedProjects}
                    onChange={handleHideCompletedProjects}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '21px',

                      letterSpacing: '0.15px',

                      color: 'rgba(76, 78, 100, 0.6)',
                    }}
                  >
                    Hide completed projects
                  </Typography>
                }
                labelPlacement='start'
              />
            </Box>

            <ClientProjectList
              list={clientProjectList?.data!}
              listCount={clientProjectList?.totalCount!}
              isLoading={isLoading}
              listPage={clientProjectListPage}
              listPageSize={clientProjectListPageSize}
              setListPage={setClientProjectListPage}
              setListPageSize={setClientProjectListPageSize}
              handleRowClick={handleRowClick}
              isSelected={isSelected}
              selected={selected}
              user={user}
              title='Projects'
            />
          </Box>
        ) : (
          // <CalendarContainer id={id} sort={sort} setSort={setSort} />
          <ClientProjectCalendarContainer id={1} />
        )}
      </Box>
    </Box>
  )
}

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
