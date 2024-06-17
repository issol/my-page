import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'

import { authState } from '@src/states/auth'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { userProfileSchema } from '@src/types/schema/profile.schema'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import {
  ProProfileAddress,
  ProProfileInfo,
} from '@src/types/sign/personalInfoTypes'
import ProProfileForm from '@src/pages/[companyName]/components/forms/pro/profile.form'
import ClientBillingAddressesForm from '@src/pages/[companyName]/client/components/forms/client-billing-address'

type Props = {
  userInfo: DetailUserType
  onClick: (data: ProProfileInfo) => void
  onClose: any
}

const EditProfileModal = ({ userInfo, onClick, onClose }: Props) => {
  const auth = useRecoilValueLoadable(authState)

  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<ProProfileInfo>({
    defaultValues: {
      mobilePhone: null,
      pronounce: null,
      havePreferredName: null,
      preferredName: '',
      preferredNamePronunciation: '',
      legalNamePronunciation: '',
      telephone: null,
      birthday: null,
      timezone: null,
    },
    mode: 'onChange',
    resolver: yupResolver(userProfileSchema) as Resolver<ProProfileInfo>,
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
  } = useForm<ProProfileAddress>({
    defaultValues: {
      name: null,
      baseAddress: '',
      detailAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      addressType: undefined,
    },
    mode: 'onChange',
    resolver: yupResolver(
      clientBillingAddressSchema,
    ) as unknown as Resolver<ProProfileAddress>,
  })

  useEffect(() => {
    if (userInfo) {
      reset({
        preferredName: userInfo.preferredName ?? '',
        pronounce: userInfo.pronounce,
        preferredNamePronunciation: userInfo.preferredNamePronunciation ?? '',
        legalNamePronunciation: userInfo.legalNamePronunciation ?? '',
        telephone: userInfo.telephone,
        havePreferredName: userInfo.havePreferredName,
        mobilePhone: userInfo.mobilePhone,
        birthday: userInfo.birthday,
        timezone: userInfo.timezone,
      })

      if (userInfo?.addresses) {
        const address = userInfo?.addresses?.[0]
        if (address) {
          addressReset({
            name: address.name,
            baseAddress: address.baseAddress,
            detailAddress: address.detailAddress,
            city: address.city,
            state: address.state,
            country: address.country || '',
            zipCode: address.zipCode || '',
            addressType: 'billing',
          })
        }
      }
    }
  }, [userInfo])

  return (
    <Box
      sx={{
        width: '65vw',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
      padding='50px 60px'
    >
      <Typography variant='h5' mb='15px'>
        My Profile
      </Typography>
      <Grid
        container
        gap={5}
        sx={{ maxHeight: '65vh', overflowY: 'scroll' }}
        pt='15px'
      >
        <Grid item xs={12}>
          <ProProfileForm control={control} errors={errors} watch={watch} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography fontWeight={600}>Permanent address</Typography>
            </Grid>
            <Grid item xs={12}>
              <ClientBillingAddressesForm
                control={addressControl}
                errors={addressError}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='center'
        gap='16px'
        mt='24px'
      >
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => onClick({ ...getValues(), addresses: [getAddress()] })}
          disabled={!isValid || !isAddressValid}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default EditProfileModal
