import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'
import OnboardingList from './components/list/list'
import { SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { JobList } from 'src/shared/const/job/jobs'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import {
  FilterType,
  SelectType,
  RoleSelectType,
  OnboardingFilterType,
} from 'src/types/onboarding/list'
import {
  useGetOnboardingProList,
  useGetStatistic,
  useGetOnboardingStatistic,
} from 'src/queries/onboarding/onboarding-query'
import { OnboardingListRolePair, RoleList } from '@src/shared/const/role/roles'

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
  })

  const { data: onboardingProList } = useGetOnboardingProList(filters)

  const { data: totalStatistics } = useGetStatistic()
  const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  console.log(onboardingProList)

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
    }

    console.log(filter)

    setFilters(filter)

    console.log(data)
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

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
      />
    </Grid>
  )
}

Onboarding.acl = {
  action: 'read',
  subject: 'onboarding',
}
