import { Grid, Typography } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'
import OnboardingList from './components/list/list'
import { SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DefaultRolePair } from 'src/shared/const/onboarding'
import { JobList } from 'src/shared/const/personalInfo'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import {
  FilterType,
  SelectType,
  RoleSelectType,
} from 'src/types/onboarding/list'
import { useGetOnboardingProList } from 'src/queries/onboarding/onboarding-query'

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
  const { data: onboardingProList } = useGetOnboardingProList()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] =
    useState<RoleSelectType[]>(DefaultRolePair)
  const [onboardingListPage, setOnboardingListPage] = useState<number>(0)
  const [onboardingListPageSize, setOnboardingListPageSize] =
    useState<number>(10)
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  console.log(onboardingProList)

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

  const onSubmit = (data: FilterType) => {
    const { jobType, role, source, target, experience, testStatus, search } =
      data

    //** TODO : API 연결 */
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
        handleFilterStateChange={handleFilterStateChange}
        expanded={expanded}
      />
      <OnboardingList
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
