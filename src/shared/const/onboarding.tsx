import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  OnboardingListCellType,
  OnboardingUserType,
  OnboardingListType,
  RoleSelectType,
} from 'src/types/onboarding/list'
import LegalNameEmail from 'src/pages/onboarding/components/list/list-item/legalname-email'

import TestStatus from 'src/pages/onboarding/components/list/list-item/test-status'
import { GridColumns } from '@mui/x-data-grid'
import JobTypeRole from 'src/pages/components/job-type-role-chips'

export const columns: GridColumns<OnboardingListType> = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'No.',
    renderHeader: () => <Box>No.</Box>,
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'name',
    headerName: 'Legal name / Email',
    renderHeader: () => <Box>Legal name / Email</Box>,
    renderCell: ({ row }: OnboardingListCellType) => {
      return <LegalNameEmail row={row} />
    },
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'experience',
    headerName: 'Experience',
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
    renderHeader: () => <Box>Test status</Box>,
    renderCell: ({ row }: OnboardingListCellType) => {
      return <TestStatus row={row} />
    },
  },
]

export const DefaultRolePair: Array<RoleSelectType> = [
  {
    label: 'Audio describer',
    value: 'Audio describer',
    jobType: ['Dubbing'],
  },
  {
    label: 'Audio description QCer',
    value: 'Audio description QCer',
    jobType: ['Dubbing'],
  },
  {
    label: 'Copywriter',
    value: 'Copywriter',
    jobType: ['Misc.'],
  },
  {
    label: 'DTPer',
    value: 'DTPer',
    jobType: ['Documents/Text', 'Webcomics', 'Webnovel'],
  },
  {
    label: 'DTP QCer',
    value: 'DTP QCer',
    jobType: ['Documents/Text', 'Webcomics', 'Webnovel'],
  },
  {
    label: 'Dubbing audio QCer',
    value: 'Dubbing audio QCer',
    jobType: ['Dubbing'],
  },
  {
    label: 'Dubbing script QCer',
    value: 'Dubbing script QCer',
    jobType: ['Dubbing'],
  },
  {
    label: 'Dubbing script translator',
    value: 'Dubbing script translator',
    jobType: ['Dubbing'],
  },
  {
    label: 'Dubbing voice artist',
    value: 'Dubbing voice artist',
    jobType: ['Dubbing'],
  },
  {
    label: 'Editor',
    value: 'Editor',
    jobType: ['Misc.'],
  },
  {
    label: 'Interpreter',
    value: 'Interpreter',
    jobType: ['Interpretation'],
  },
  {
    label: 'Proofreader',
    value: 'Proofreader',
    jobType: ['Webcomics'],
  },
  {
    label: 'QCer',
    value: 'QCer',
    jobType: ['Documents/Text', 'OTT/Subtitle'],
  },
  {
    label: 'SDH author',
    value: 'SDH author',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'SDH QCer',
    value: 'SDH QCer',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Subtitle author',
    value: 'Subtitle author',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Subtitle QCer',
    value: 'Subtitle QCer',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Supp author',
    value: 'Supp author',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Supp QCer',
    value: 'Supp QCer',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Template author',
    value: 'Template author',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Template QCer',
    value: 'Template QCer',
    jobType: ['OTT/Subtitle'],
  },
  {
    label: 'Transcriber',
    value: 'Transcriber',
    jobType: ['Documents/Text', 'OTT/Subtitle'],
  },
  {
    label: 'Translator',
    value: 'Translator',
    jobType: ['Documents/Text', 'OTT/Subtitle'],
  },
  {
    label: 'Video editor',
    value: 'Video editor',
    jobType: ['Misc.'],
  },
  {
    label: 'Webcomics QCer',
    value: 'Webcomics QCer',
    jobType: ['Webcomics'],
  },
  {
    label: 'Webcomics translator',
    value: 'Webcomics translator',
    jobType: ['Webcomics'],
  },
  {
    label: 'Webnovel QCer',
    value: 'Webnovel QCer',
    jobType: ['Webnovel'],
  },
  {
    label: 'Webnovel translator',
    value: 'Webnovel translator',
    jobType: ['Webnovel'],
  },
]

export const RejectReason = {
  'Pro does not have enough experience for this role.':
    'Thank you for your interest!\nUnfortunately, your listed years of experience do not meet the required years of experience for this role, and thus cannot proceed any further.\nShould you have any questions or concerns, please do not hesitate to contact tad@glozinc.com.\n- TAD Onboarding Team',
  'Pro is not suitable for this role.':
    'Thank you for your interest!\nUnfortunately, your listed experience do not meet the experiences required for this role, and thus cannot proceed any further.\nShould you have any questions or concerns, please do not hesitate to contact tad@glozinc.com.\n- TAD Onboarding Team',
  'Recruitment is not needed for this role.':
    'Thank you for your interest, however, we are not currently recruiting the role/language pair you have applied for.\nWe are always looking for qualified linguists and are constantly receiving new projects from a wide variety of clients, so please do not hesitate to contact tad@glozinc.com for more information.\n- TAD Onboarding Team',
  Others: '',
}
