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

const AssignRolePair = [
  {
    value: 'Content LQA reviewer',
    label: 'Content LQA reviewer',
    jobType: ['Misc.', ' OTT/Subtitle'],
  },
  {
    value: 'DTT reviewer',
    label: 'DTT reviewer',
    jobType: ['Misc.', 'OTT/Subtitle'],
  },
  {
    value: 'Language manager',
    label: 'Language manager',
    jobType: ['Misc.', 'OTT/Subtitle'],
  },

  {
    value: 'Localization engineer',
    label: 'Localization engineer',
    jobType: [
      'Documents/Text',
      'Webcomics',
      'Webnovel',
      'Misc.',
      'OTT/Subtitle',
      'Webcomics',
      'Webnovel',
    ],
  },
  {
    value: 'Reviewer',
    label: 'Reviewer',
    jobType: ['Documents/Text', 'Dubbing', 'Interpretation'],
  },
  {
    value: 'Vendor LM',
    label: 'Vendor LM',
    jobType: ['Misc.', 'OTT/Subtitle'],
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

export const PauseReason = {
  'Recruitment is not currently needed for this role.':
    'Thank you for your interest, however, we are not currently recruiting the role/language pair at this time and have paused your application process.\nWe are always looking for qualified linguists and are constantly receiving new projects from a wide variety of clients, so we will resume your process once more projects roll in!\n- TAD Onboarding Team',
  'Too many applicants for this role.':
    'Thank you for your interest, however, all roles for the language pair have been filled at this time. We are always looking for qualified linguists and are constantly receiving new projects from a wide variety of clients, so we will resume your process once more projects roll in!\n- TAD Onboarding Team',
  'Project is not confirmed yet.':
    'Thank you for applying for this role, however, the project you were offered is on-hold or has not been confirmed yet. Please note that we are always looking for qualified linguists and are constantly receiving new projects from a wide variety of clients, so we will resume your process as soon as we can!\n- TAD Onboarding Team',
  Others: '',
}
