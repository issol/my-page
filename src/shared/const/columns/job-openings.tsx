import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from '@src/pages/components/job-type-role-chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getTimezone } from '@src/shared/helpers/timezone.helper'
import { JobOpeningListType } from '@src/types/pro/pro-job-openings'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { differenceInDays, differenceInHours, format } from 'date-fns'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'

/** import dayjs and plugin */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

export const getJobOpeningsColumn = () => {
  const auth = useRecoilValueLoadable(authState)

  console.log(auth.getValue())

  const timezoneList = useRecoilValueLoadable(timezoneSelector)
  const calculateTimeLeft = (timeStr: Date, timezone: string) => {
    const timezoneCode =
      timezoneList.state === 'hasValue' && timezone
        ? timezoneList.contents.find(list => list.timezone === timezone)?.timezoneCode
        : '-'

    const targetTime = dayjs(timeStr).tz(timezone)
    const currentTime = dayjs()
    const duration = dayjs.duration(targetTime.diff(currentTime))
    const leftDays = duration.days()
    const leftHours = duration.hours()

    if (leftDays < 1) {
      return (
        <Typography variant='body1' color='#ff4d49'>
          0 hours left ({timezoneCode})
        </Typography>
      )
    }

    if (leftDays > 2) {
      return `${leftDays} days left (${timezoneCode})`
    }

    return `${leftDays} days and ${leftHours} hours left (${timezoneCode})`
  }

  const columns: GridColumns<JobOpeningListType> = [
    {
      flex: 0.0696,
      minWidth: 87,
      field: 'id',
      headerName: 'No.',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: { row: JobOpeningListType }) => {
        return <Typography>{row.corporationId}</Typography>
      },
    },
    {
      flex: 0.264,
      minWidth: 330,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job type / Role
        </Typography>
      ),
      renderCell: ({ row }: { row: JobOpeningListType }) => {
        return (
          <JobTypeRole jobInfo={[{ jobType: row.jobType, role: row.role }]} />
        )
      },
    },
    {
      flex: 0.224,
      minWidth: 280,
      field: 'languagePair',
      headerName: 'Language pair',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Language pair
        </Typography>
      ),
      renderCell: ({ row }: { row: JobOpeningListType }) => {
        return (
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.sourceLanguage &&
              row.targetLanguage &&
              row.sourceLanguage !== '' &&
              row.targetLanguage !== '' ? (
              <>
                {row.sourceLanguage.toUpperCase()} &rarr;{' '}
                {row.targetLanguage.toUpperCase()}
              </>
            ) : null}
          </Typography>
        )
      },
    },
    {
      flex: 0.192,
      minWidth: 240,
      field: 'experience',
      headerName: 'Years of experience',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Years of experience
        </Typography>
      ),
      renderCell: ({ row }: { row: JobOpeningListType }) => {
        return <Typography>{row.yearsOfExperience}</Typography>
      },
    },
    {
      flex: 0.2504,
      minWidth: 313,
      field: 'dueDate',
      headerName: 'Due date',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Due date
        </Typography>
      ),
      renderCell: ({ row }: { row: JobOpeningListType }) => {
        return (
          <Typography variant='body1'>
            {calculateTimeLeft(
              row.dueAt,
              auth.getValue().user?.timezone?.label || Intl.DateTimeFormat().resolvedOptions().timeZone
            )}
          </Typography>
        )
      },
    },
  ]

  return columns
}
