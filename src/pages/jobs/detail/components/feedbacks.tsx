import {
  Badge,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from '@src/@core/components/mui/chip'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { Icon } from '@iconify/react'
import { ProJobFeedbackType } from '@src/types/jobs/jobs.type'
import { UseMutateFunction } from 'react-query'
import { timezoneSelector } from '@src/states/permission'
type Props = {
  feedbacks: Array<ProJobFeedbackType>
  checkFeedback: UseMutateFunction<unknown, unknown, number, unknown>
}

const Feedbacks = ({ feedbacks, checkFeedback }: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  return (
    <>
      {feedbacks.length > 0 ? (
        <Box sx={{ mt: '20px' }}>
          {feedbacks.map(value => (
            <Box
              key={uuidv4()}
              sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CustomChip
                      label={'LPM'}
                      skin='light'
                      sx={{
                        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #26C6F9`,
                        color: '#26C6F9',
                      }}
                      size='medium'
                    />
                    <Typography variant='body1' fontWeight={600} fontSize={14}>
                      {value.name}
                    </Typography>
                    <Divider orientation='vertical' flexItem variant='middle' />
                    <Typography variant='body2'>{value.email}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    {!value.isChecked && (
                      <Badge
                        variant='dot'
                        color='primary'
                        sx={{ marginLeft: '4px' }}
                      ></Badge>
                    )}
                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color={
                        !value.isChecked ? '#666CFF' : 'rgba(76, 78, 100, 0.60)'
                      }
                    >
                      {convertTimeToTimezone(
                        value.createdAt,
                        auth.getValue().user?.timezone,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='body1' fontSize={14} fontWeight={400}>
                      {value.feedback ?? ''}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Checkbox
                      name='size-small'
                      sx={{ padding: 0, outline: 'none' }}
                      value={value.isChecked}
                      checked={value.isChecked}
                      disabled={value.isChecked}
                      onClick={() => checkFeedback(value.id)}
                      checkedIcon={
                        <Icon
                          icon='bi:check-circle-fill'
                          fontSize={24}
                          color='#72E128'
                        />
                      }
                      icon={
                        <Icon
                          icon='bi:check-circle'
                          fontSize={24}
                          color='#4C4E6461'
                        />
                      }
                    />
                    {value.isChecked ? null : (
                      <Typography
                        fontWeight={400}
                        fontSize={12}
                        color='#4C4E6499'
                      >
                        Mark as read
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                </Box>

                {/* <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    gap: '10px',
                    padding: '20px 0',
                  }}
                >
                  <Checkbox
                    name='size-small'
                    sx={{ padding: 0, outline: 'none' }}
                    value={value.isChecked}
                    checked={value.isChecked}
                    disabled={value.isChecked}
                    onClick={() => checkFeedback(value.id)}
                    checkedIcon={
                      <Icon
                        icon='bi:check-circle-fill'
                        fontSize={40}
                        color='#72E128'
                      />
                    }
                    icon={<Icon icon='bi:check-circle' fontSize={40} />}
                  />
                  <Typography
                    variant='caption'
                    textAlign={'center'}
                    fontSize={12}
                  >
                    I’ve checked the feedback.
                  </Typography>
                </Box> */}
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
    </>
  )
}

export default Feedbacks
