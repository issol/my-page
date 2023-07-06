import { useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
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

/* TODO:
about : 수정 버튼, 수정 form연결 및 schema => dialog 사용해야 함!!
*/

type Props = {
  userInfo: UserDataType
}

export default function MyPageOverview({ userInfo }: Props) {
  const { openModal, closeModal } = useModal()

  const [editProfile, setEditProfile] = useState(false)

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, dirtyFields, isValid, isDirty },
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={4} display='flex' flexDirection='column' gap='24px'>
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
              <Button variant='contained' disabled={!isValid || !isFieldDirty}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
