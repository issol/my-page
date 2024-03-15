import React, {
  RefObject,
  SyntheticEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
import { JobItemType, JobType } from '@src/types/common/item.type'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import languageHelper from '@src/shared/helpers/language.helper'
import { v4 as uuidv4 } from 'uuid'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { JobStatusType } from '@src/types/jobs/jobs.type'
import { LegalName } from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useRouter } from 'next/router'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import styled from '@emotion/styled'
import { JobButton } from '@src/pages/orders/job-list/details/index'

const HeadRowItemNames = [
  '',
  'No.',
  'Job',
  'Job status',
  'Prices',
  'Assigned Pro',
  '',
]

export type JobListMode = 'view' | 'edit' | 'delete'

interface JobListCardProps {
  index: number
  mode?: JobListMode
  info: JobItemType
  isUserInTeamMember: boolean
  serviceType: Array<{ label: string; value: string }[]>
  tableRowRef: RefObject<HTMLTableRowElement>
  statusList?: Array<{ value: number; label: string }>
  handleRemoveJob: (
    jobId: number,
    corporationId: string,
    jobName: string,
  ) => Promise<void>
  handleChangeServiceType: (
    event: SyntheticEvent<Element, Event>,
    value: {
      label: string
      value: string
    }[],
    index: number,
  ) => void
  onClickAddJob: (itemId: number, index: number) => void
}

const JobListCard = ({
  index,
  tableRowRef,
  mode = 'view',
  info,
  isUserInTeamMember,
  serviceType,
  statusList,
  handleRemoveJob,
  handleChangeServiceType,
  onClickAddJob,
}: JobListCardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const router = useRouter()

  const { orderId, jobId } = router.query

  const currentRole = getCurrentRole()

  const [open, setOpen] = useState<boolean>(true)
  const [selected, setSelected] = React.useState<readonly number[]>([])

  const NoList = () => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '15px',
          alignItems: 'center',
          borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
        }}
      >
        <Typography variant='subtitle1'>There are no jobs</Typography>
      </Box>
    )
  }

  const onClickRow = (row: JobType, info: JobItemType) => {
    router.push({
      pathname: '/orders/job-list/detail/',
      query: { orderId: orderId, jobId: jobId },
    })
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = info.jobs
        .filter(row => row.id !== Number(jobId!))
        .map(n => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const onSelectClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const allChecked = useMemo(() => {
    const filteredJobs = info.jobs.filter(row => row.id !== Number(jobId))
    return selected.length === filteredJobs.length && filteredJobs.length > 0
  }, [selected])

  return (
    <Card ref={ref}>
      <Box
        display='flex'
        gap='8px'
        alignItems='center'
        justifyContent='space-between'
        padding='24px'
      >
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              <KeyboardArrowDown sx={{ display: open ? 'none' : 'block' }} />
              <KeyboardArrowUp sx={{ display: open ? 'block' : 'none' }} />
            </IconButton>
            <Typography
              variant='body1'
              sx={{
                fontWeight: 600,
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              {String(index + 1).padStart(2, '0')}. &nbsp;
              {languageHelper(info.sourceLanguage)}
              &nbsp;&rarr;&nbsp;
              {languageHelper(info.targetLanguage)}&nbsp;
            </Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <JobButton label='Add job' onClick={() => {}}>
              <img
                src='/images/icons/job-icons/icon-add-frame.svg'
                alt='Add job'
              />
            </JobButton>
            <JobButton label='Add Job template' onClick={() => {}}>
              <img
                src='/images/icons/job-icons/icon-template.svg'
                alt='Add Job template'
              />
            </JobButton>
          </Box>
        </Box>
      </Box>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                textTransform: 'none',
              }}
            >
              <TableRow
                sx={{
                  height: '46px',
                  fontWeight: '400',
                  fontSize: '14px',
                  background: theme.palette.background.default,
                }}
              >
                {mode === 'delete' && (
                  <TableCell size='small' padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={allChecked}
                      onChange={onSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all desserts',
                      }}
                    />
                  </TableCell>
                )}

                {HeadRowItemNames.slice(1).map((name, index) => (
                  <TableCell
                    key={`${name}-${index}`}
                    sx={{
                      height: '46px',
                      fontWeight: '400',
                      fontSize: '14px',
                    }}
                    size='small'
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <span>{name}</span>
                      <span
                        style={{
                          width: '2px',
                          height: '14px',
                          background: theme.palette.divider,
                          display:
                            HeadRowItemNames.length - 3 < index
                              ? 'none'
                              : 'block',
                        }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {info.jobs.length > 0
                ? info.jobs.map((row, index) => {
                    const isItemSelected = isSelected(row.id)
                    return (
                      <TableRow
                        component='tr'
                        ref={row.id === Number(jobId!) ? tableRowRef : null}
                        key={uuidv4()}
                        sx={{
                          '& > *': { borderBottom: 'unset' },
                          background:
                            row.id === Number(jobId!)
                              ? 'rgba(76, 78, 100, 0.12)'
                              : '#fff',
                        }}
                        // hover
                        onClick={() => {
                          //onClickRow(row, info)
                        }}
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {mode === 'delete' && (
                          <CustomTableCell padding='checkbox'>
                            <Checkbox
                              disabled={row.id === Number(jobId!)}
                              color='primary'
                              checked={isItemSelected}
                              onClick={event => onSelectClick(event, row.id)}
                              inputProps={{
                                'aria-labelledby': row.corporationId,
                              }}
                            />
                          </CustomTableCell>
                        )}
                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                        >
                          {row.corporationId}
                        </CustomTableCell>

                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                        >
                          <ServiceTypeChip
                            size='small'
                            label={row.serviceType}
                          />
                        </CustomTableCell>

                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                        >
                          {JobsStatusChip(
                            row.status as JobStatusType,
                            statusList!,
                          )}
                        </CustomTableCell>

                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                        >
                          {row?.totalPrice
                            ? formatCurrency(
                                // TODO: 임시코드임, job details list에서 totalPrice의 정확한 라운딩 처리를 위해서 numberPlace, rounding 정보가 있어야 하나 없음
                                // 원화일때 1000원 미만의 값은 0으로 나오도록 하드코딩 함
                                Number(row?.totalPrice) < 1000 &&
                                  row?.currency === 'KRW'
                                  ? 0
                                  : Number(row?.totalPrice),
                                row?.currency!,
                              )
                            : '-'}
                        </CustomTableCell>
                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                        >
                          <Box>
                            {row.assignedPro ? (
                              <LegalName
                                row={{
                                  isOnboarded: true,
                                  isActive: true,
                                  firstName: row.assignedPro.firstName,
                                  middleName: row.assignedPro.middleName,
                                  lastName: row.assignedPro.lastName,
                                  email: row.assignedPro.email,
                                }}
                              />
                            ) : (
                              <Button
                                variant='outlined'
                                size='small'
                                onClick={() => {}}
                              >
                                Request/Assign
                              </Button>
                            )}
                          </Box>
                        </CustomTableCell>
                        <CustomTableCell
                          size='small'
                          component='th'
                          scope='row'
                          align='right'
                        >
                          <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='flex-end'
                            gap='8px'
                          >
                            <img
                              src='/images/icons/job-icons/icon-trigger.svg'
                              alt='trigger on'
                            />
                            <TriggerSwitchStatus
                              variant='body2'
                              color={theme.palette.success.main}
                              bgColor='#EEFBE5'
                            >
                              On
                            </TriggerSwitchStatus>
                          </Box>
                        </CustomTableCell>
                      </TableRow>
                    )
                  })
                : NoList()}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
      {mode === 'delete' && (
        <Card
          sx={{
            width: `${ref.current?.getBoundingClientRect().width}px`,
            position: 'fixed',
            bottom: 0,
            height: '103px',
          }}
        >
          <Box
            width='100%'
            height='100%'
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
            padding='32px 20px'
            gap='16px'
          >
            <Button size='large' variant='outlined'>
              Cancel
            </Button>
            <Button
              size='large'
              variant='contained'
              disableElevation
              disabled={selected.length === 0}
            >
              {selected.length === 0 && 'Delete'}
              {selected.length !== 0 &&
                `Delete selected jobs (${selected.length})`}
            </Button>
          </Box>
        </Card>
      )}
    </Card>
  )
}

const CustomTableCell = styled(TableCell)(() => ({
  height: '54px',
}))

const TriggerSwitchStatus = styled(Typography)<{
  color: string
  bgColor: string
}>(({ color, bgColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '28px',
  fontWeight: 500,
  background: bgColor,
  color: color,
  borderRadius: '5px',
}))

export default JobListCard
