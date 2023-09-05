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
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { Icon } from '@iconify/react'
type Props = {
  feedbacks: [
    {
      id: number
      isChecked: boolean
      name: string
      email: string
      createdAt: string
      feedback: string
    },
  ]
}

const Feedbacks = ({ feedbacks }: Props) => {
  const auth = useRecoilValueLoadable(authState)

  return (
    <>
      {feedbacks.length > 0 ? (
        <>
          {feedbacks.map(value => (
            <Box
              key={uuidv4()}
              sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '85%',
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
                      size='small'
                    />
                    <Typography variant='body1' fontWeight={500} fontSize={14}>
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
                      variant='body2'
                      color={
                        !value.isChecked ? '#666CFF' : 'rgba(76, 78, 100, 0.60)'
                      }
                    >
                      {FullDateTimezoneHelper(
                        value.createdAt,
                        auth.getValue().user?.timezone,
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='body1' fontSize={16} fontWeight={400}>
                      {value.feedback ?? ''}
                    </Typography>
                  </Box>
                </Box>
                <Box
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
                </Box>
              </Box>
            </Box>
          ))}
        </>
      ) : null}
    </>
  )
}

export default Feedbacks
