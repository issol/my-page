import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'
import OnboardingList from './components/list/list'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { DefaultRolePair, JobList } from 'src/shared/const/personalInfo'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'

export type FilterType = {
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  experience: { label: string; value: string }[]
  testStatus: { label: string; value: string }[]
  search: string
}

const defaultValues = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  testStatus: [],
  search: '',
}
export default function Onboarding() {
  const [jobTypeOptions, setJobTypeOptions] = useState(JobList)
  const [roleOptions, setRoleOptions] = useState(DefaultRolePair)
  const [onboardingListPage, setOnboardingListPage] = useState<number>(0)
  const [onboardingListPageSize, setOnboardingListPageSize] =
    useState<number>(10)

  const languageList = getGloLanguage()

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
    // resolver: yupResolver(profileSchema),
  })
  const onClickResetButton = () => {
    setRoleOptions(DefaultRolePair)
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
  }

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Onboarding list</Typography>}
      />
      <OnboardingDashboard />
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
      />
      <OnboardingList
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
