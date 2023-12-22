import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { AddRoleType } from 'src/types/onboarding/list'
import { AppliedRoleType, TestType } from 'src/types/onboarding/details'
import languageHelper from 'src/shared/helpers/language.helper'
type Props = {
  open: boolean
  onClose: any
  skillTest: TestType
  basicTest: TestType
  type: string
  handleActionSkillTest: (id: number, type: string) => void
}
export default function SkillTestActionModal({
  open,
  onClose,
  skillTest,
  basicTest,
  type,
  handleActionSkillTest,
}: Props) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='xs'
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={`/images/icons/alert/${
              type === 'Awaiting assignment' ||
              type === 'Skill failed' ||
              type === 'Cancelled'
                ? 'alert-error-color'
                : 'alert-success'
            }.svg`}
            width={68}
            height={68}
            alt=''
          />
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',

              textAlign: 'center',
              letterSpacing: '0.15px',

              color: 'rgba(76, 78, 100, 0.6)',
            }}
          >
            Are you sure you want to&nbsp;
            {type === 'Awaiting assignment' ? (
              'cancel this skill test?'
            ) : type === 'Cancelled' ? (
              'cancel this skill test?'
            ) : type === 'Skill test Ready' ? (
              'proceed this skill test?'
            ) : type === 'Skill failed' ? (
              <>
                <span
                  style={{
                    color: '#666CFF',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  fail
                </span>
                &nbsp;this Pro
              </>
            ) : null}
          </Typography>
          {type === 'Skill failed' || type === 'Cancelled' ? (
            <Typography
              variant='subtitle2'
              sx={{ fontSize: '16px', fontWeight: 600, textAlign: 'center' }}
            >
              {skillTest.jobType}, {skillTest.role},&nbsp;
              {skillTest.sourceLanguage && skillTest.targetLanguage ? (
                <>
                  {skillTest.sourceLanguage.toUpperCase()} &rarr;{' '}
                  {skillTest.targetLanguage.toUpperCase()}
                </>
              ) : (
                ''
              )}
            </Typography>
          ) : (
            <Typography
              variant='body2'
              sx={{ fontWeight: 600, fontSize: '16px', textAlign: 'center' }}
            >
              {skillTest.targetLanguage && skillTest.targetLanguage !== '' ? (
                <>
                  {skillTest.targetLanguage.toUpperCase()}&nbsp;
                  {`(${languageHelper(skillTest.targetLanguage)})`}
                </>
              ) : (
                ''
              )}
            </Typography>
          )}
        </DialogContentText>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '18px',
          }}
        >
          <Button
            size='medium'
            type='button'
            variant='outlined'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={onClose}
          >
            {type === 'Awaiting assignment'
              ? 'No'
              : type === 'Skill test Ready'
              ? 'Cancel'
              : type === 'Skill failed'
              ? 'Cancel'
              : type === 'Cancelled'
              ? 'No'
              : null}
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              onClose()
              handleActionSkillTest(skillTest.testId, type)
            }}
          >
            {type === 'Awaiting assignment'
              ? 'Cancel'
              : type === 'Skill test Ready'
              ? 'Proceed'
              : type === 'Skill failed'
              ? 'Fail'
              : type === 'Cancelled'
              ? 'Cancel'
              : null}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
