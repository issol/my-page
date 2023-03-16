import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import PageHeader from '@src/@core/components/page-header'
import { JobList } from '@src/shared/const/job/jobs'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import { ProFilterType, ProListFilterType } from '@src/types/pro/list'
import { SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import ProListFilters from './list/filters'

const defaultValues: ProFilterType = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  status: [],
  clients: [],
  search: '',
}

const Pro = () => {
  const [proListPage, setProListPage] = useState<number>(0)
  const [proListPageSize, setProListPageSize] = useState<number>(10)
  const [filters, setFilters] = useState<ProListFilterType>({
    jobType: [],
    role: [],
    source: [],
    target: [],
    experience: [],
    status: [],
    clients: [],
    take: proListPage,
    skip: proListPage * proListPageSize,
    order: 'desc',
  })

  // const { data: onboardingProList, isLoading } =
  //   useGetOnboardingProList(filters)

  // const { data: totalStatistics } = useGetStatistic()
  // const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
  const [idOrder, setIdOrder] = useState(true)
  const [isHoverId, setIsHoverId] = useState(false)

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<ProFilterType>({
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
      status: [],
      clients: [],
      search: '',
    })

    setFilters({
      jobType: [],
      role: [],
      source: [],
      target: [],
      experience: [],
      status: [],
      clients: [],
      take: proListPageSize,
      skip: proListPageSize * proListPage,
    })
  }

  const onSubmit = (data: ProFilterType) => {
    const {
      jobType,
      role,
      source,
      target,
      experience,
      status,
      clients,
      search,
    } = data

    const filter = {
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      status: status.map(value => value.value),
      experience: experience.map(value => value.value),
      clients: clients.map(value => value.value),
      search: search,
      take: proListPageSize,
      skip: proListPageSize * proListPage,
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
  return (
    <Grid container spacing={6}>
      <PageHeader title={<Typography variant='h5'>Pro list</Typography>} />
      <ProListFilters
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
    </Grid>
  )
}

export default Pro

Pro.acl = {
  subject: 'pro',
  action: 'read',
}
