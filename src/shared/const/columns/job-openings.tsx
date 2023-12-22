import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from '@src/pages/components/job-type-role-chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getTimezone } from '@src/shared/helpers/timezone.helper'
import { JobOpeningListType } from '@src/types/pro/pro-job-openings'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { differenceInDays, differenceInHours, format } from 'date-fns'
import dayjs from 'dayjs'

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'

export const getJobOpeningsColumn = () => {
  const auth = useRecoilValueLoadable(authState)
  const timezoneValue = useRecoilValueLoadable(timezoneSelector)

  //TODO: day, hour 나오게 수정해야 함
  const calculateTimeLeft = (timeStr: Date, timezone: CountryType) => {
    const timezoneList = timezoneValue.getValue()

    // console.log(timezoneList)

    // console.log(timezone)

    // const filteredTimezone = timezoneList.map(list => {
    //   return {
    //     code: list.timezoneCode,
    //     label: list.timezone,
    //     phone: '',
    //   }
    // })
    const timezoneCode = timezoneList.find(
      list => list.timezone === timezone?.label,
    )?.timezoneCode

    // 'Z'를 제거하고 UTC 시간대로 파싱
    const futureTime = new Date(timeStr)

    // 현재 시간 (UTC 기준)
    const currentTime = new Date()

    const timeLeft = futureTime.getTime() - currentTime.getTime()

    // 남은 시간이 음수이거나 0일 경우
    if (timeLeft <= 0) {
      return (
        <Typography variant='body1' color='#ff4d49'>
          0 hours left ({timezoneCode})
        </Typography>
      )
    }

    // 남은 시간을 일과 시간 단위로 계산
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )

    // 조건에 맞는 문자열 반환
    if (daysLeft >= 3) {
      return `${daysLeft} days left (${timezoneCode})`
    } else if (daysLeft > 0) {
      return `${daysLeft} days and ${hoursLeft} hours left (${timezoneCode})`
    } else {
      return (
        <Typography variant='body1' color='#ff4d49'>
          {hoursLeft} hours left ({timezoneCode})
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
              // row.dueDateTimezone?.code ?? 'KR',
              row.deadlineTimezone,

              // auth.getValue().user?.timezone!
            )}
            {/* {calculateRemainingTime(
              row.dueAt,
              // row.dueDateTimezone?.code ?? 'KR',
              auth.getValue().user?.timezone!
            )} */}
          </Typography>
        )
      },
    },
  ]

  return columns
}
