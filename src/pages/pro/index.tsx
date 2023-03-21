import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { GridColumns } from '@mui/x-data-grid'
import Icon from '@src/@core/components/icon'
import PageHeader from '@src/@core/components/page-header'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { JobList } from '@src/shared/const/job/jobs'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import {
  ProFilterType,
  ProListCellType,
  ProListFilterType,
  ProListType,
} from '@src/types/pro/list'
import { SyntheticEvent, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import JobTypeRole from '../components/job-type-role-chips'
import LegalNameEmail from '../onboarding/components/list/list-item/legalname-email'
import TestStatus from '../onboarding/components/list/list-item/test-status'
import ProListFilters from './list/filters'
import ProList from './list/list'
import { v4 as uuidv4 } from 'uuid'
import {
  JobTypeChip,
  ProStatusChip,
  RoleChip,
} from '@src/@core/components/chips/chips'
import { rows } from '@src/@fake-db/table/static-data'
import ListResume from './list/list-resume'

import { ModalContext } from '@src/context/ModalContext'
import FilePreviewDownloadModal from '../components/pro-detail-modal/modal/file-preview-download-modal'

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

  const { data: proList, isLoading } = useGetProList(filters)
  const { setModal } = useContext(ModalContext)

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

  const onClickFile = (file: {
    id: number
    url: string
    fileName: string
    fileExtension: string
  }) => {
    setModal(
      <FilePreviewDownloadModal
        open={true}
        onClose={() => setModal(null)}
        docs={[file]}
      />,
    )
  }

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

    setFilters(filter)
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const columns: GridColumns<ProListType> = [
    {
      field: 'id',
      minWidth: 120,
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
      minWidth: 310,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: ProListCellType) => {
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
            link={`/pro/detail/${row.id}`}
          />
        )
      },
    },
    {
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return <ProStatusChip status={row.status} label={row.status} />
      },
    },
    {
      minWidth: 260,
      field: 'clients',
      headerName: 'Clients',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Clients</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!row.clients.length
              ? '-'
              : row.clients.map(
                  (item, idx) =>
                    idx < 2 && (
                      <Box
                        key={uuidv4()}
                        sx={{
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '150px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.client}{' '}
                          {idx === 0 && row.clients.length > 1 && ','}&nbsp;
                        </Box>
                      </Box>
                    ),
                )}
            {row.clients.length > 1 ? (
              <Box>+{row.clients.length - 1}</Box>
            ) : null}
          </Box>
        )
      },
    },

    {
      minWidth: 240,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: ProListCellType) => (
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
      minWidth: 330,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job type / Role</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <JobTypeChip
              type={row.jobInfo[0].jobType}
              label={row.jobInfo[0].jobType}
            />
            <RoleChip type={row.jobInfo[0].role} label={row.jobInfo[0].role} />
          </Box>
        )
        // const jobInfo = row.jobInfo.map(value => ({
        //   jobType: value.jobType,
        //   role: value.role,
        // }))
        // return <JobTypeRole jobInfo={jobInfo} />
      },
    },
    {
      minWidth: 160,
      field: 'resume',
      headerName: 'Resume',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Resume</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return (
          <ListResume
            resume={row.resume}
            onClickFile={onClickFile}
          ></ListResume>
        )
      },
    },

    {
      minWidth: 190,
      field: 'experience',
      headerName: 'Years of experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Years of experience</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return <Typography variant='body1'>{row.experience}</Typography>
      },
    },
    {
      minWidth: 313,
      field: 'onboardedAt',
      headerName: 'Date of onboarded',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date of onboarded</Box>,
      renderCell: ({ row }: ProListCellType) => {
        return <Typography variant='body1'>{row.onboardedAt}</Typography>
      },
    },
  ]
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
      <ProList
        proListPage={proListPage}
        setProListPage={setProListPage}
        proListPageSize={proListPageSize}
        setProListPageSize={setProListPageSize}
        proList={proList?.data!}
        proListCount={proList?.totalCount!}
        setFilters={setFilters}
        columns={columns}
        isLoading={isLoading}
      />
    </Grid>
  )
}

export default Pro

Pro.acl = {
  subject: 'pro',
  action: 'read',
}
