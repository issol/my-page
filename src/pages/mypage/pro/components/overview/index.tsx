import { useEffect, useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import About from './about'
import ProProfileForm from '@src/pages/components/forms/pro/profile.form'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'

// ** types & schemas
import { UserDataType } from '@src/context/types'
import { PersonalInfo } from '@src/types/sign/personalInfoTypes'
import { getProfileSchema } from '@src/types/schema/profile.schema'

// ** third parties
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import WorkDaysCalendar from './work-days-calendar'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { CalendarContainer } from 'react-datepicker'
import AvailableCalendarWrapper from '@src/@core/styles/libs/available-calendar'
import { getWeekends } from '@src/shared/helpers/date.helper'
import TimelineDot from '@src/@core/components/mui/timeline-dot'
/* TODO:
about : 수정 버튼, 수정 form연결 및 schema => dialog 사용해야 함!!
*/

type Props = {
  userInfo: UserDataType
}

export default function MyPageOverview({ userInfo }: Props) {
  const { openModal, closeModal } = useModal()

  const [editProfile, setEditProfile] = useState(false)
  const [editNote, setEditNote] = useState(false)

  //forms
  const [note, setNote] = useState('') //TODO: user정보로 초기화 해주기
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<PersonalInfo>({
    defaultValues: {
      legalNamePronunciation: '',
      havePreferred: false,
      preferredName: '',
      mobile: '',
      timezone: { code: '', phone: '', label: '' },
    },
    mode: 'onChange',
    resolver: yupResolver(getProfileSchema('edit')),
  })

  const isFieldDirty = !_.isEmpty(dirtyFields)

  useEffect(() => {
    if (userInfo) {
      reset({
        preferredName: userInfo.preferredName ?? '',
        pronounce: userInfo.pronounce,
        preferredNamePronunciation: userInfo.preferredNamePronunciation ?? '',
        havePreferred: userInfo?.havePreferred ?? false,
        dateOfBirth: userInfo.dateOfBirth,
        residence: userInfo?.residence,
        mobile: userInfo.mobilePhone,
        timezone: userInfo.timezone!,
      })
    }
  }, [userInfo])

  function onCloseProfile() {
    if (isFieldDirty) {
      openModal({
        type: 'closeProfileForm',
        children: (
          <DiscardChangesModal
            onClose={() => closeModal('closeProfileForm')}
            onDiscard={() => {
              reset()
              setEditProfile(false)
            }}
          />
        ),
      })
    } else {
      setEditProfile(false)
    }
  }

  function onProfileSave() {
    setEditProfile(false)
    const data = getValues()
    console.log('data', data)
    //TODO: mutation붙이기 + confirm modal
  }

  function onNoteSave() {
    //TODO: mutation붙이기 + confirm modal
    setEditNote(false)
  }

  const dateData = [
    {
      id: 1,
      reason: '내맴',
      start: '2023-07-24',
      end: '2023-07-28',
    },
    {
      //   id: 2,
      reason: '내맴',
      start: '2023-07-04',
      end: '2023-07-07',
    },
  ]
  const weekends = dateData.concat(getWeekends(2023, 7))

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={3}
        display='flex'
        flexDirection='column'
        gap='24px'
        minWidth='400px'
      >
        {/* My Profile */}
        <Card sx={{ padding: '20px' }}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            mb='24px'
          >
            <Typography variant='h6'>My profile</Typography>
            <IconButton onClick={() => setEditProfile(!editProfile)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
          <About userInfo={userInfo} />
        </Card>

        {/* Available work days */}
        <AvailableCalendarWrapper>
          <Card sx={{ padding: '20px' }}>
            <CardHeader
              title='Available work days'
              sx={{ mb: '24px', padding: 0 }}
            />
            <WorkDaysCalendar
              event={weekends}
              setMonth={setMonth}
              setYear={setYear}
            />
            <Box
              display='flex'
              justifyContent='space-between'
              gap='10px'
              mt='11px'
            >
              {/* TODO: off on weekends값도 서버에 저장하기 */}
              <FormControlLabel
                label='Off on weekends'
                control={<Checkbox name='Off on weekends' />}
              />

              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TimelineDot color='grey' />
                <Typography
                  variant='caption'
                  sx={{ lineHeight: '14px', color: 'rgba(76, 78, 100, 0.87)' }}
                >
                  Unavailable
                </Typography>
              </Box>
            </Box>
          </Card>
        </AvailableCalendarWrapper>

        {/* Notes to LPM / TAD */}
        <Card sx={{ padding: '20px' }}>
          <CardHeader
            title={
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='h6'>Notes to LPM / TAD</Typography>
                <IconButton onClick={() => setEditNote(true)}>
                  <Icon icon='mdi:pencil-outline' />
                </IconButton>
              </Box>
            }
            sx={{ padding: 0 }}
          />
          <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
          <CardContent sx={{ padding: 0 }}>
            {/* TODO: 실데이터 표기 */}
            No notes have been written.
          </CardContent>
        </Card>
      </Grid>

      {/* My profile form modal */}
      <Dialog
        open={editProfile}
        onClose={() => setEditProfile(false)}
        maxWidth='md'
      >
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>My Profile</Typography>
            </Grid>
            <ProProfileForm control={control} errors={errors} watch={watch} />
            <Grid
              item
              xs={12}
              display='flex'
              gap='16px'
              justifyContent='center'
            >
              <Button variant='outlined' onClick={onCloseProfile}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isValid || !isFieldDirty}
                onClick={onProfileSave}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Note form modal */}
      <Dialog open={editNote} onClose={() => setEditNote(false)}>
        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant='h6' mb='24px'>
            Notes to LPM / TAD
          </Typography>
          <TextField
            sx={{ width: '470px' }}
            rows={4}
            multiline
            fullWidth
            label='Please write down the note to share with LPM / TAD.'
            value={note}
            onChange={e => setNote(e.target.value)}
            inputProps={{ maxLength: 500 }}
          />
          <Typography variant='body2' mt='12px' textAlign='right'>
            {note?.length ?? 0}/500
          </Typography>
          <Box display='flex' gap='16px' justifyContent='center'>
            {/* TODO: cancel시 note는 유저 데이터로 초기화하기 */}
            <Button variant='outlined' onClick={() => setEditNote(false)}>
              Cancel
            </Button>
            <Button variant='contained' disabled={!note} onClick={onNoteSave}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
