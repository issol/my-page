import { Box, Tab, Typography } from '@mui/material'
import JobFilters from './list/filterts'
import JobList from './list/list'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { Suspense, SyntheticEvent, useState, MouseEvent } from 'react'
import styled from 'styled-components'
import TabPanel from '@mui/lab/TabPanel'
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import { useGetProJobList } from '@src/queries/jobs/jobs.query'

type MenuType = 'requested' | 'completed'

export type FilterType = {
  jobDueDate: Date[]

  client: Array<{ label: string; value: number }>

  search: string
}

const defaultValues: FilterType = {
  jobDueDate: [],

  client: [],

  search: '',
}
export type JobListFilterType = {
  take?: number
  skip?: number
  search?: string
  ordering?: 'desc' | 'asc'
  sort?: 'corporationId'
  jobDueDateTo?: string
  jobDueDateFrom?: string
  client?: string[]
}

const defaultFilters: JobListFilterType = {
  take: 10,
  skip: 0,
  search: '',

  client: [],
  jobDueDateFrom: '',
  jobDueDateTo: '',
}

const Jobs = () => {
  const [value, setValue] = useState<MenuType>('requested')

  const [filters, setFilters] = useState<JobListFilterType>(defaultFilters)

  const { data: jobList, isLoading } = useGetProJobList(filters)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
    }[]
  >([])

  const { control, handleSubmit, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(defaultFilters)
  }

  const onSubmit = (data: FilterType) => {
    const {
      jobDueDate,

      client,

      search,
    } = data

    const filter: JobListFilterType = {
      client: client.map(value => value.label),

      jobDueDateFrom: jobDueDate[0]?.toISOString() ?? '',
      jobDueDateTo: jobDueDate[1]?.toISOString() ?? '',

      search: search,
      take: rowsPerPage,
      skip: rowsPerPage * page,
      ordering: 'desc',
      sort: 'corporationId',
    }

    setFilters(filter)
  }

  return (
    <>
      <Typography variant='h5'>Jobs</Typography>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='Order detail Tab menu'
          style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
        >
          <CustomTab
            value='requested'
            label='Requested & Ongoing'
            iconPosition='start'
            icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />

          <CustomTab
            value='completed'
            label='Completed & Inactive'
            iconPosition='start'
            icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='requested' sx={{ pt: '24px' }}>
          <Suspense>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <JobFilters
                onSubmit={onSubmit}
                control={control}
                handleSubmit={handleSubmit}
                clientList={clientList}
                onReset={onClickResetButton}
              />
              <JobList
                columns={getProJobColumns()}
                list={jobList?.data!}
                listCount={jobList?.totalCount!}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                isLoading={isLoading}
                setFilters={setFilters}
              />
            </Box>
          </Suspense>
        </TabPanel>
        <TabPanel value='completed' sx={{ pt: '24px' }}>
          <Suspense></Suspense>
        </TabPanel>
      </TabContext>
    </>
  )
}

export default Jobs

Jobs.acl = {
  subject: 'jobs',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
