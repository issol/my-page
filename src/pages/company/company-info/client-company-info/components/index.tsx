import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import Chip from '@src/@core/components/mui/chip'
import {
  ClientCompanyInfoType,
  CorporateClientInfoType,
  RoleType,
} from '@src/context/types'
import { FileType } from '@src/types/common/file.type'
import CustomChip from '@src/@core/components/mui/chip'

import {
  Suspense,
  MouseEvent,
  useState,
  SyntheticEvent,
  useEffect,
  useContext,
} from 'react'

import useModal from '@src/hooks/useModal'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'
import { useMutation, useQueryClient } from 'react-query'

import { getCurrentRole } from '@src/shared/auth/storage'

import { S3FileType } from 'src/shared/const/signedURLFileType'
import { useConfirmLeave } from '@src/hooks/useConfirmLeave'

import {
  clientCompanyInfoSchema,
  getClientCompanyInfoDefaultValue,
} from '@src/types/schema/client-info/client-company-info.schema'
import {
  ClientAddressFormType,
  clientAddressAllRequiredSchema,
  clientAddressDefaultValue,
} from '@src/types/schema/client-address.schema'
import ClientAddressesForm from '@src/pages/client/components/forms/addresses-info-form'
import ClientCompanyInfoForm from '@src/pages/client/components/forms/client-info/client-company-info-form'

import { toast } from 'react-hot-toast'
import { updateClient } from '@src/apis/client.api'
import { getTypeList } from '@src/shared/transformer/type.transformer'
import CompanyInfoCard from './info-card'

import CompanyAddressDetail from './company-address-detail'
import CompanyInfoDetail from './company-info-detail'
import { isEmpty } from 'lodash'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import CompanyPaymentInfo from './payment-info'
import FallbackSpinner from '@src/@core/components/spinner'

interface FileProp {
  name: string
  type: string
  size: number
}

type MenuType = 'companyInfo' | 'paymentInfo'
export default function ClientCompanyInfoPageComponent() {
  const currentRole = getCurrentRole()

  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const country = getTypeList('CountryCode')

  const [tab, setTab] = useState<MenuType>('companyInfo')

  const { user, company } = useRecoilValue(authState)

  const [infoEdit, setInfoEdit] = useState(false)
  const [addressEdit, setAddressEdit] = useState(false)
  const [file, setFile] = useState<File | null>()

  const { ConfirmLeaveModal } = useConfirmLeave({
    shouldWarn: infoEdit || addressEdit,
    toUrl: '/',
  })

  const isUpdatable =
    currentRole &&
    (currentRole.type === 'Master' || currentRole.type === 'Manager')

  const updateClientMutation = useMutation(
    (
      data: CorporateClientInfoType &
        ClientCompanyInfoType &
        ClientAddressFormType,
    ) => updateClient(company?.clientId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'clientUserInfo' })
      },
      onError: () => onError(),
    },
  )

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  const {
    control,
    getValues,
    reset,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm<ClientCompanyInfoType>({
    defaultValues: getClientCompanyInfoDefaultValue(
      company?.businessClassification ?? 'corporate',
    ),
    mode: 'onChange',
    resolver: yupResolver(clientCompanyInfoSchema),
  })

  const {
    control: addressControl,
    getValues: getAddress,
    reset: resetAddress,
    formState: {
      errors: addressErrors,
      isValid: isAddressValid,
      dirtyFields: addressDirtyFields,
    },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientAddressAllRequiredSchema),
  })

  function resetCompanyInfoForm() {
    reset({
      businessClassification: company?.businessClassification,
      name: company?.name ?? '',
      email: company?.email ?? '',
      phone: company?.phone ?? '',
      mobile: company?.mobile ?? '',
      fax: company?.fax ?? '',
      websiteLink: company?.websiteLink ?? '',
      timezone: company?.timezone,
      headquarter: company?.headquarter ?? '',
    })
  }

  function resetAddressForm() {
    resetAddress({
      clientAddresses: company?.clientAddresses
        .map(i => ({
          ...i,
          id: i?.id?.toString(),
        }))
        .filter(i => i.addressType !== 'billing'),
    })
  }

  useEffect(() => {
    resetCompanyInfoForm()
    if (company?.clientAddresses.length) {
      resetAddressForm()
    }
  }, [company])

  const { fields, append, remove, update } = useFieldArray({
    control: addressControl,
    name: 'clientAddresses',
  })

  const handleChange = (_: any, newValue: MenuType) => {
    setTab(newValue)
  }

  function onSaveForm() {
    if (infoEdit) {
      setInfoEdit(false)
      updateClientMutation.mutate(getValues())
    } else {
      const address = getAddress()?.clientAddresses?.map(item => {
        delete item.id
        return item
      })
      setAddressEdit(false)
      updateClientMutation.mutate({ clientAddresses: address })
    }
  }

  function onCancelEdit() {
    if (infoEdit) {
      if (isEmpty(dirtyFields)) {
        setInfoEdit(false)
      } else {
        openDiscardModal(() => {
          setInfoEdit(false)
          resetCompanyInfoForm()
        })
      }
    } else {
      if (isEmpty(addressDirtyFields)) {
        setAddressEdit(false)
      } else {
        openDiscardModal(() => {
          setAddressEdit(false)
          resetAddressForm()
        })
      }
    }
  }

  function openDiscardModal(onClick: any) {
    openModal({
      type: 'discardAlert',
      children: (
        <DiscardModal
          onClick={() => {
            onClick()
            closeModal('discardAlert')
          }}
          onClose={() => closeModal('discardAlert')}
        />
      ),
    })
  }

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ConfirmLeaveModal />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <CompanyInfoCard companyInfo={company!} />
        <TabContext value={tab}>
          <TabList
            onChange={handleChange}
            aria-label='client company info menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='companyInfo'
              label='Company info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />

            <CustomTab
              value='paymentInfo'
              label='Payment info'
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='companyInfo'>
            {infoEdit || addressEdit ? null : (
              <>
                <Card style={{ padding: '24px' }}>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box display='flex' gap='16px' alignItems='center'>
                      <Typography variant='h6'>Company information</Typography>
                      {company?.businessClassification === 'corporate' ? (
                        <CustomChip
                          icon={<Icon icon='fluent:shield-task-16-filled' />}
                          label='Verified'
                          skin='light'
                          color='success'
                          size='small'
                        />
                      ) : null}
                    </Box>

                    {isUpdatable && (
                      <IconButton onClick={() => setInfoEdit(true)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    )}
                  </Box>
                  <CompanyInfoDetail companyInfo={company} />
                </Card>
                <Card style={{ padding: '24px', marginTop: '24px' }}>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Typography variant='h6'>Address</Typography>
                    {isUpdatable && (
                      <IconButton onClick={() => setAddressEdit(true)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    )}
                  </Box>

                  <CompanyAddressDetail
                    address={company?.clientAddresses ?? []}
                  />
                </Card>
              </>
            )}
            {infoEdit ? (
              <Card style={{ padding: '24px' }}>
                <Grid container spacing={6}>
                  {company?.businessClassification !==
                  'corporate_non_korean' ? null : (
                    <Grid item xs={12}>
                      <Controller
                        name='headquarter'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            {...field}
                            options={country}
                            onChange={(e, v) => field.onChange(v.value)}
                            disableClearable
                            value={
                              !field?.value
                                ? { value: '', label: '' }
                                : country.find(
                                    item => item.value === field?.value,
                                  )
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Headquarter'
                                inputProps={{
                                  ...params.inputProps,
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                  )}

                  <ClientCompanyInfoForm
                    control={control}
                    errors={errors}
                    watch={watch}
                  />
                  <Grid
                    item
                    xs={12}
                    display='flex'
                    justifyContent='center'
                    gap='16px'
                  >
                    <Button variant='outlined' onClick={onCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      disabled={!isValid || isEmpty(dirtyFields)}
                      onClick={onSaveForm}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ) : null}

            {addressEdit ? (
              <Card style={{ padding: '24px' }}>
                <Grid container spacing={6}>
                  <ClientAddressesForm
                    control={addressControl}
                    fields={fields}
                    append={append}
                    remove={remove}
                    update={update}
                    errors={addressErrors}
                    isValid={isAddressValid}
                    type='all-required'
                    getValues={getAddress}
                  />
                  <Grid
                    item
                    xs={12}
                    display='flex'
                    justifyContent='center'
                    gap='16px'
                  >
                    <Button variant='outlined' onClick={onCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      disabled={!isAddressValid || isEmpty(addressDirtyFields)}
                      onClick={onSaveForm}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ) : null}
          </TabPanel>
          <TabPanel value='paymentInfo'>
            <Suspense fallback={<FallbackSpinner />}>
              <CompanyPaymentInfo />
            </Suspense>
          </TabPanel>
        </TabContext>
      </Box>
    </Suspense>
  )
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`
