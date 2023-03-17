import { Grid, IconButton, Typography } from '@mui/material'

import PageHeader from 'src/@core/components/page-header'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'
import OnboardingList from './components/list/list'
import { SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { JobList } from 'src/shared/const/job/jobs'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { makeStyles } from '@mui/material'
import {
  FilterType,
  SelectType,
  RoleSelectType,
  OnboardingFilterType,
  OnboardingListType,
  OnboardingListCellType,
} from 'src/types/onboarding/list'
import {
  useGetOnboardingProList,
  useGetStatistic,
  useGetOnboardingStatistic,
} from 'src/queries/onboarding/onboarding-query'
import { OnboardingListRolePair, RoleList } from '@src/shared/const/role/roles'
import { GridColumns } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import LegalNameEmail from './components/list/list-item/legalname-email'
import JobTypeRole from '../components/job-type-role-chips'
import TestStatus from './components/list/list-item/test-status'
import Icon from 'src/@core/components/icon'

const defaultValues: FilterType = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  testStatus: [],
  search: '',
}

export default function Onboarding() {
  const [onboardingListPage, setOnboardingListPage] = useState<number>(0)
  const [onboardingListPageSize, setOnboardingListPageSize] =
    useState<number>(10)
  const [filters, setFilters] = useState<OnboardingFilterType>({
    jobType: [],
    role: [],
    source: [],
    target: [],
    experience: [],
    testStatus: [],
    take: onboardingListPageSize,
    skip: onboardingListPageSize * onboardingListPage,
    order: 'desc',
  })

  const { data: onboardingProList, isLoading } =
    useGetOnboardingProList(filters)

  const { data: totalStatistics } = useGetStatistic()
  const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
  const [idOrder, setIdOrder] = useState(true)
  const [isHoverId, setIsHoverId] = useState(false)

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    setRoleOptions(OnboardingListRolePair)
    setJobTypeOptions(JobList)
    reset({
      jobType: [],
      role: [],
      source: [],
      target: [],
      experience: [],
      testStatus: [],
      search: '',
    })

    setFilters({
      jobType: [],
      role: [],
      source: [],
      target: [],
      experience: [],
      testStatus: [],
      take: onboardingListPageSize,
      skip: onboardingListPageSize * onboardingListPage,
    })
  }

  const onSubmit = (data: FilterType) => {
    const { jobType, role, source, target, experience, testStatus, search } =
      data

    const filter = {
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      testStatus: testStatus.map(value => value.value),
      experience: experience.map(value => value.value),
      search: search,
      take: onboardingListPageSize,
      skip: onboardingListPageSize * onboardingListPage,
      order: 'desc',
    }

    console.log(filter)

    setFilters(filter)

    console.log(data)
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const columns: GridColumns<OnboardingListType> = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'No.',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Box
          onMouseOver={() => setIsHoverId(true)}
          onMouseLeave={() => setIsHoverId(false)}
          sx={{
            display: 'flex',
            minWidth: 80,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
          {isHoverId ? (
            <IconButton>
              <Icon
                icon={`mdi:${idOrder ? 'arrow-up' : 'arrow-down'}`}
                fontSize={18}
                onClick={() => {
                  setIdOrder(!idOrder)
                  setFilters(prevState => ({
                    ...prevState,
                    order: idOrder ? 'asc' : 'desc',
                  }))
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,
              id: row.id,
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
          />
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'experience',
      headerName: 'Experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Experience</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return <Typography variant='body1'>{row.experience}</Typography>
      },
    },
    {
      flex: 0.4,
      minWidth: 180,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job type / Role</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        const jobInfo = row.jobInfo.map(value => ({
          jobType: value.jobType,
          role: value.role,
        }))
        return <JobTypeRole jobInfo={jobInfo} />
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: OnboardingListCellType) => (
        <Box>
          {!row.jobInfo.length ? (
            '-'
          ) : (
            <Box key={row.id}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {row.jobInfo[0].source && row.jobInfo[0].target ? (
                  <>
                    {row.jobInfo[0].source.toUpperCase()} &rarr;{' '}
                    {row.jobInfo[0].target.toUpperCase()}
                  </>
                ) : (
                  '-'
                )}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      flex: 0.17,
      field: 'age',
      minWidth: 80,
      headerName: 'testStatus',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Test status</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return <TestStatus row={row} />
      },
    },
  ]

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Onboarding list</Typography>}
      />
      <OnboardingDashboard
        totalStatistics={totalStatistics!}
        onboardingStatistic={onboardingStatistic!}
      />
      <Filters
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        trigger={trigger}
        setJobTypeOptions={setJobTypeOptions}
        setRoleOptions={setRoleOptions}
        jobTypeOptions={jobTypeOptions}
        roleOptions={roleOptions}
        languageList={languageList}
        onClickResetButton={onClickResetButton}
        handleFilterStateChange={handleFilterStateChange}
        expanded={expanded}
      />
      <OnboardingList
        onboardingProListCount={onboardingProList!.totalCount}
        onboardingProList={onboardingProList!.data}
        onboardingListPage={onboardingListPage}
        setOnboardingListPage={setOnboardingListPage}
        onboardingListPageSize={onboardingListPageSize}
        setOnboardingListPageSize={setOnboardingListPageSize}
        columns={columns}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Grid>
  )
}

Onboarding.acl = {
  action: 'read',
  subject: 'onboarding',
}
