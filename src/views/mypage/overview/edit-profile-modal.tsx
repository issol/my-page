import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import useAuth from '@src/hooks/useAuth'
import useModal from '@src/hooks/useModal'
import ClientBillingAddressesForm from 'src/pages/[companyName]/client/components/forms/client-billing-address'
import ProProfileForm from 'src/pages/[companyName]/components/forms/pro/profile.form'
import { authState } from '@src/states/auth'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import {
  clientBillingAddressDefaultValue,
  clientBillingAddressSchema,
} from '@src/types/schema/client-billing-address.schema'
import { userProfileSchema } from '@src/types/schema/profile.schema'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import { PersonalInfo } from '@src/types/sign/personalInfoTypes'

type Props = {
  userInfo: DetailUserType
  onClick: any
  onClose: any
}

const EditProfileModal = ({ userInfo, onClick, onClose }: Props) => {
  const auth = useRecoilValueLoadable(authState)

  console.log(userInfo)

  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<Omit<PersonalInfo, 'address'>>({
    defaultValues: {
      legalNamePronunciation: '',
      havePreferred: false,
      preferredName: '',
      mobile: '',
      timezone: { code: '', label: '' },
    },
    mode: 'onChange',
    resolver: yupResolver(userProfileSchema) as unknown as Resolver<
      Omit<PersonalInfo, 'address'>
    >,
  })

  const {
    control: addressControl,
    getValues: getAddress,
    reset: addressReset,
    formState: {
      errors: addressError,
      isValid: isAddressValid,
      dirtyFields: isAddressFieldDirty,
    },
  } = useForm<ClientAddressType>({
    defaultValues: {
      ...clientBillingAddressDefaultValue,
      addressType: 'billing',
    },
    mode: 'onChange',
    resolver: yupResolver(
      clientBillingAddressSchema,
    ) as Resolver<ClientAddressType>,
  })

  console.log('isAddressValid', isAddressValid)

  useEffect(() => {
    if (userInfo) {
      reset({
        preferredName: userInfo.preferredName ?? '',
        pronounce: userInfo.pronounce ?? null,
        preferredNamePronunciation: userInfo.preferredNamePronunciation ?? '',
        legalNamePronunciation: userInfo.legalNamePronunciation ?? '',
        phone: auth.getValue().user?.telephone,
        havePreferred: auth.getValue().user?.havePreferred ?? false,
        birthday: userInfo.birthday ? new Date(userInfo.birthday!) : null,
        mobile: auth.getValue().user?.mobilePhone,
        timezone: userInfo.timezone!,
      })
      if (userInfo?.addresses) {
        addressReset({
          ...userInfo?.addresses[0],
          id: String(0),
          addressType: 'billing',
          // id: String(userInfo.addresses[0].id),
          // id: uuidv4(),
        })
      }
    }
  }, [userInfo])

  console.log('EEEEEEE', isValid, isAddressValid)

  return (
    <Box
      sx={{
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box sx={{ padding: '50px 60px' }}>
        <Grid container spacing={6} sx={{ maxHeight: '60%' }}>
          <Grid item xs={12}>
            <Typography variant='h6'>My Profile</Typography>
          </Grid>
          <ProProfileForm control={control} errors={errors} watch={watch} />
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6} mb={4}>
              <Grid item xs={12}>
                <Typography fontWeight={600}>Permanent address</Typography>
              </Grid>
              <ClientBillingAddressesForm
                control={addressControl}
                errors={addressError}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container display='flex' gap='16px' justifyContent='center'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => onClick(getValues(), getAddress())}
            disabled={!isValid || !isAddressValid}
          >
            Save
          </Button>
        </Grid>
      </Box>
    </Box>
  )
}

export default EditProfileModal
