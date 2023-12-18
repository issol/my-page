import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from '@src/pages/components/job-type-role-chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getTimezone } from '@src/shared/helpers/timezone.helper'
import { JobOpeningListType } from '@src/types/pro/pro-job-openings'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { differenceInDays, differenceInHours, format } from 'date-fns'
import dayjs from 'dayjs'

export const getJobOpeningsColumn = () => {
  const calculateRemainingTime = (dueDate: Date, timezoneCode: string) => {
    const now = new Date()
    const diffInHours = differenceInHours(dueDate, now)
    const diffInDays = differenceInDays(dueDate, now)

    if (diffInDays >= 3) {
      return `${Math.floor(diffInDays)} days left (${getTimezone(
        dueDate,
        timezoneCode,
      )})`
    } else if (diffInDays > 0) {
      return `${Math.floor(diffInDays)} days and ${
        diffInHours % 24
      } hours left (${getTimezone(dueDate, timezoneCode)})`
    } else {
      return (
        <Typography variant='body1' color='#ff4d49'>
          {diffInHours} hours left ({getTimezone(dueDate, timezoneCode)})
        </Typography>
      )
    }
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
        return <Typography>{row.id}</Typography>
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
            {calculateRemainingTime(
              row.dueDate,
              row.dueDateTimezone?.code ?? 'KR',
            )}
          </Typography>
        )
      },
    },
  ]

  return columns
}
