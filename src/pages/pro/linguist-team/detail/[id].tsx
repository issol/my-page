import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import {
  useGetServiceType,
  useGetSimpleClientList,
} from '@src/queries/common.query'
import { useGetLinguistTeamDetail } from '@src/queries/pro/linguist-team'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import { linguistTeamSchema } from '@src/types/schema/pro/linguist-team.schema'
import { useRouter } from 'next/router'
import { useState, MouseEvent, useEffect, useMemo, ChangeEvent, useContext } from 'react'
import { Controller, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import SelectPro from '../add-new/components/select-pro'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { ProListType } from '@src/types/pro/list'
import SelectProModal from '../add-new/components/select-pro-modal'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useGetClientList } from '@src/queries/client.query'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import _ from 'lodash'
import registDND from '../add-new/components/dnd'
import { deleteLinguistTeam, updateLinguistTeam } from '@src/apis/pro/linguist-team'
import { useMutation, useQueryClient } from 'react-query'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { linguist_team } from '@src/shared/const/permission-class'

export type FilterType = {
  serviceTypeId?: number[]
  source?: string | null
  target?: string | null
  clientId?: number[]
  search?: string
  skip: number
  take: number
  seeMyTeams?: '0' | '1'
}

export const initialFilter: FilterType = {
  serviceTypeId: [],
  source: null,
  target: null,
  seeMyTeams: '0',
  clientId: [],
  search: '',
  skip: 0,
  take: 12,
}

const LinguistTeamDetail = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  const languageList = getGloLanguage()
  const { data, isLoading } = useGetLinguistTeamDetail(Number(id))
  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientList } = useGetSimpleClientList()

  const ability = useContext(AbilityContext)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [expandSelectProArea, setExpandSelectProArea] = useState<boolean>(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [editMode, setEditMode] = useState<boolean>(false)

  const Writer = new linguist_team(data?.author?.userId!)
  const isUpdatable = ability.can('update', Writer)

  const updateMutation = useMutation(
    (
      data: Omit<LinguistTeamFormType, 'pros'> & {
        pros: Array<{ userId: number; order: number }>
      },
    ) => updateLinguistTeam(Number(id), data),
    {
      onSuccess: (data: any) => {
        setEditMode(false)
        queryClient.invalidateQueries(['linguistTeamDetail', Number(id)])
        router.replace(`/pro/linguist-team/detail/${data.id}`)
      },
    },
  )

  const deleteMutation = useMutation(
    (id: number) => deleteLinguistTeam(id), {
    onSuccess: () => {
      handleBack()
    },
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError,
    watch,
    reset,
    formState: { errors, isValid, isSubmitted, touchedFields, isDirty },
  } = useForm<LinguistTeamFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(
      linguistTeamSchema,
    ) as unknown as Resolver<LinguistTeamFormType>,
  })

  const { fields, append, remove, update, move } = useFieldArray({
    control: control,
    name: 'pros',
  })


  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const onClickDeleteButton = () => {
    handleMenuClose()
    openModal({
      type: 'DeleteLinguistTeam',
      children: (
        <CustomModal
          vary='error-alert'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
                // marginBottom: '16px',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Delete Linguist team?
              </Typography>
              The change will be applied not just to you, but whole team.
            </Box>
          }
          rightButtonText='Delete'
          onClick={() => {
            console.log('delete')
            closeModal('DeleteLinguistTeam')
            onClickDelete()
          }}
          onClose={() => closeModal('DeleteLinguistTeam')}
        />
      ),
    })
  }

  const onClickSelectProsHelperIcon = () => {
    openModal({
      type: 'SelectProsHelper',
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Selected Pros
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                "Selected Pros" is the place where Pros intended to be added to
                the Linguist team are displayed.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('SelectProsHelper')}
          onClose={() => closeModal('SelectProsHelper')}
        />
      ),
    })
  }
  const onClickSelectPro = (proList: ProListType[]) => {
    proList.forEach((pro, index) => {
      if (!fields.some(existingPro => existingPro.userId === pro.userId)) {
        append({ ...pro, order: index + 1 })
      }
    })
    closeModal('SelectProModal')
  }

  const onClickAddPros = () => {
    openModal({
      type: 'SelectProModal',
      children: (
        <SelectProModal
          onClose={() => closeModal('SelectProModal')}
          getValues={getValues}
          onClickSelectPro={onClickSelectPro}
        />
      ),
    })
  }

  const onChangePrivateTeamCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      openModal({
        type: 'DisablePrivateTeam',
        children: (
          <CustomModal
            vary='error-alert'
            title={
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                }}
              >
                <Typography variant='body1' fontSize={20} fontWeight={500}>
                  Disable private option?
                </Typography>
                <Typography variant='body2' fontSize={16} fontWeight={400}>
                  This action is irreversible and will share the team with all
                  team members. Proceed?
                </Typography>
              </Box>
            }
            rightButtonText='Proceed'
            onClick={() => {
              setValue('isPrivate', '0')

              closeModal('DisablePrivateTeam')
            }}
            onClose={() => closeModal('DisablePrivateTeam')}
          />
        ),
      })
    } else {
      setValue('isPrivate', '1')
    }
  }

  const handleBack = () => {
    queryClient.invalidateQueries(['linguistTeam', initialFilter])
    queryClient.invalidateQueries('linguistCardList')
    if (!editMode) {
      router.replace('/pro/?tab=linguistList')
    } else {
      if (!isDirty) {
        setEditMode(false)
      } else {
        openModal({
          type: 'LinguistEditCancel',
          children: (
            <CustomModal
              vary='error-alert'
              title={
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant='body1' fontSize={20} fontWeight={500}>
                    Discard changes?
                  </Typography>
                  Are you sure you want to discard all changes?
                </Box>
              }
              rightButtonText='Discard'
              onClick={() => {
                closeModal('LinguistEditCancel')
                setEditMode(false)
              }}
              onClose={() => closeModal('LinguistEditCancel')}
            />
          ),
        })
      }
    }
  }

  const onClickDelete = () => {
    deleteMutation.mutate(Number(id))
  }

  const handleSaveChanges = () => {
    const pros = getValues().pros.map((pro, index) => {
      return {
        userId: pro.userId,
        order: index + 1,
      }
    })
    const result = {
      ...getValues(),
      pros,
    }

    updateMutation.mutate(result)
  }

  const onClickSave = () => {
    openModal({
      type: 'SaveLinguistTeam',
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Save changes?
              </Typography>
              Are you sure you want to save all changes?
            </Box>
          }
          rightButtonText='Save'
          onClick={() => {
            closeModal('SaveLinguistTeam')
            handleSaveChanges()
          }}
          onClose={() => closeModal('SaveLinguistTeam')}
        />
      ),
    })
  }

  useEffect(() => {
    if (data) {
      const result: LinguistTeamFormType = {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate ? '1' : '0',
        isPrioritized: data.isPrioritized ? '1' : '0',
        serviceTypeId: data.serviceTypeId,
        clientId: data.clientId,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        pros: data.pros,
      }
      reset(result)
    }
  }, [data])

  useEffect(() => {
    const clear = registDND(({ source, destination }) => {
      if (!destination) return

      move(source.index, destination.index)
    })
    return () => clear()
  }, [move])

  return (
    <>
      {data && !isLoading && serviceTypeList ? (
        <Card
          sx={{
            position: 'relative',
            paddingBottom: editMode ? '100px' : 0,
            height: editMode ? '100%' : 'auto',
          }}
        >
          <Box
            display='flex'
            alignItems='center'
            gap='8px'
            padding='24px'
            justifyContent='space-between'
            sx={{
              borderBottom: '1px solid #E9EAEC',
            }}
          >
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <IconButton
                onClick={() => {
                  handleBack()
                }}
              >
                <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
              </IconButton>
              {editMode ? (
                <Typography fontSize={20} fontWeight={500}>
                  Edit linguist team
                </Typography>
              ) : (
                <>
                  {data.isPrivate ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '5px',
                        background: '#F7F7F9',
                      }}
                    >
                      <Icon icon='mdi:lock' color='#8D8E9A' />
                    </Box>
                  ) : null}

                  <Typography fontSize={20} fontWeight={500}>
                    {data.name}
                  </Typography>
                </>
              )}
            </Box>
            {editMode ? (
              data.isPrivate ? (
                <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',

                  gap: '4px',
                  marginLeft: '-24px',
                  maxWidth: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Controller
                    name='isPrivate'
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          sx={{ paddingRight: 0 }}
                          checked={field.value === '1' ? true : false}
                          onChange={e => {
                            onChangePrivateTeamCheckBox(e)
                          }}
                        />
                      )
                    }}
                  />

                  <Typography fontSize={14} fontWeight={400}>
                    Private team
                  </Typography>
                  <Icon icon='mdi:lock' color='#8D8E9A' fontSize={20} />
                </Box>
                <Typography fontSize={12} fontWeight={400} color='#8D8E9A'>
                  Only you will be able to see this team.
                </Typography>
              </Box>
              ) : null
            ) : (
              <Box>
                <IconButton
                  sx={{ width: '24px', height: '24px', padding: 0 }}
                  onClick={handleMenuClick}
                >
                  <Icon icon='mdi:dots-horizontal' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={anchorEl}
                  id='customized-menu'
                  onClose={handleMenuClose}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <Tooltip title="Not authorized" disableHoverListener={isUpdatable}>
                    <Box>
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        startIcon={<Icon icon='mdi:pencil-outline' />}
                        onClick={() => {
                          setEditMode(true)
                          handleMenuClose()
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                        disabled={!isUpdatable}
                      >
                        Edit
                      </Button>
                    </MenuItem>
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        startIcon={<Icon icon='mdi:trash-outline' />}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          color: '#FF4D49',
                          borderRadius: 0,
                        }}
                        onClick={onClickDeleteButton}
                        disabled={!isUpdatable}
                      >
                        Delete
                      </Button>
                    </MenuItem>
                    </Box>
                  </Tooltip>
                </Menu>
              </Box>
            )}
          </Box>
          {/* info */}
          {expandSelectProArea ? null : (
            <Grid
              container
              spacing={6}
              rowSpacing={4}
              sx={{ padding: '24px 20px', borderBottom: '1px solid #E9EAEC' }}
            >
              {editMode ? (
                <>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Team name&nbsp;
                        <Typography color='#666CFF' component='span'>
                          *
                        </Typography>
                      </Typography>
                      <FormControl fullWidth className='filterFormControl'>
                        <Controller
                          name='name'
                          control={control}
                          render={({ field, formState }) => {
                            return (
                              <TextField
                                value={field.value}
                                error={
                                  !!formState.errors.name &&
                                  formState.isSubmitted
                                }
                                helperText={
                                  formState.isSubmitted
                                    ? formState.errors.name?.message
                                    : ''
                                }
                                sx={{
                                  height: '46px',
                                }}
                                inputProps={{
                                  style: {
                                    height: '46px',
                                    padding: '0 14px',
                                  },
                                }}
                                onChange={e => {
                                  if (e.target.value) {
                                    if (e.target.value.length <= 50)
                                      field.onChange(e, {
                                        shouldDirty: true,
                                      })
                                  } else {
                                    field.onChange(null)
                                  }
                                }}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Client
                      </Typography>
                      <Box className='filterFormSoloAutoComplete'>
                        <Controller
                          name='clientId'
                          control={control}
                          render={({ field, formState }) => {
                            return (
                              <Autocomplete
                                fullWidth
                                options={clientList || []}
                                value={
                                  clientList?.find(
                                    value => value.clientId === field.value,
                                  ) ?? null
                                }
                                getOptionLabel={option => option.name}
                                onChange={(e, v) => {
                                  console.log(v)

                                  if (v) {
                                    field.onChange(v.clientId)
                                  } else {
                                    field.onChange(null)
                                  }
                                }}
                                renderInput={params => (
                                  <TextField {...params} autoComplete='off' />
                                )}
                              />
                            )
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        // gap: '8px',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '4px' }}>
                        <Typography fontSize={14} fontWeight={600}>
                          Service type
                        </Typography>
                        <Typography color='#666CFF' fontSize={14}>
                          *
                        </Typography>
                      </Box>

                      <Box className='filterFormSoloAutoComplete'>
                        <Controller
                          name='serviceTypeId'
                          control={control}
                          render={({ field, formState }) => {
                            return (
                              <Autocomplete
                                fullWidth
                                options={serviceTypeList}
                                value={serviceTypeList.find(
                                  (item: { value: number; label: string }) =>
                                    field.value === item.value,
                                )}
                                onChange={(e, v) => {
                                  if (v) {
                                    field.onChange(v.value)
                                  } else {
                                    field.onChange(null)
                                  }
                                }}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    autoComplete='off'
                                    error={
                                      !!formState.errors.serviceTypeId &&
                                      formState.isSubmitted
                                    }
                                    helperText={
                                      formState.isSubmitted
                                        ? formState.errors.serviceTypeId
                                            ?.message
                                        : ''
                                    }
                                  />
                                )}
                              />
                            )
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '4px' }}>
                        <Typography fontSize={14} fontWeight={600}>
                          Source language
                        </Typography>
                        <Typography color='#666CFF' fontSize={14}>
                          *
                        </Typography>
                      </Box>
                      <Box className='filterFormSoloAutoComplete'>
                        <Controller
                          name='sourceLanguage'
                          control={control}
                          render={({ field, formState }) => {
                            return (
                              <Autocomplete
                                fullWidth
                                options={_.uniqBy(languageList, 'value')}
                                getOptionLabel={option => option.label}
                                value={
                                  languageList.find(
                                    (item: {
                                      value: string
                                      label: GloLanguageEnum
                                    }) => field.value === item.value,
                                  ) ?? null
                                }
                                onChange={(e, v) => {
                                  if (v) {
                                    field.onChange(v.value)
                                  } else {
                                    field.onChange(null)
                                  }
                                }}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    autoComplete='off'
                                    error={
                                      !!formState.errors.sourceLanguage &&
                                      formState.isSubmitted
                                    }
                                    helperText={
                                      formState.isSubmitted
                                        ? formState.errors.sourceLanguage
                                            ?.message
                                        : ''
                                    }
                                  />
                                )}
                              />
                            )
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '4px' }}>
                        <Typography fontSize={14} fontWeight={600}>
                          Target language
                        </Typography>
                        <Typography color='#666CFF' fontSize={14}>
                          *
                        </Typography>
                      </Box>
                      <Box className='filterFormSoloAutoComplete'>
                        <Controller
                          name='targetLanguage'
                          control={control}
                          render={({ field, formState }) => {
                            return (
                              <Autocomplete
                                fullWidth
                                options={_.uniqBy(languageList, 'value')}
                                getOptionLabel={option => option.label}
                                value={
                                  languageList.find(
                                    (item: {
                                      value: string
                                      label: GloLanguageEnum
                                    }) => field.value === item.value,
                                  ) ?? null
                                }
                                onChange={(e, v) => {
                                  if (v) {
                                    field.onChange(v.value)
                                  } else {
                                    field.onChange(null)
                                  }
                                }}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    autoComplete='off'
                                    error={
                                      !!formState.errors.targetLanguage &&
                                      formState.isSubmitted
                                    }
                                    helperText={
                                      formState.isSubmitted
                                        ? formState.errors.targetLanguage
                                            ?.message
                                        : ''
                                    }
                                  />
                                )}
                              />
                            )
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        '& .MuiInputBase-root': {
                          height: '46px',
                        },
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Description
                      </Typography>

                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              sx={{
                                height: '46px',
                              }}
                              value={field.value}
                              onChange={e => {
                                if (e.target.value) {
                                  if (e.target.value.length <= 50) {
                                    field.onChange(e)
                                  }
                                } else {
                                  field.onChange(null)
                                }
                                trigger('description')
                              }}
                            />
                          )
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography color='#888' fontSize={12} fontWeight={400}>
                          {getValues('description')
                            ? getValues('description')?.length
                            : 0}
                          /50
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        No.
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {data.corporationId}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Creator
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {getLegalName({
                          firstName: data.author?.firstName,
                          lastName: data.author?.lastName,
                          middleName: data.author?.middleName,
                        })}
                        ({data.author?.email})
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Last updated
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {convertTimeToTimezone(
                          data.updatedAt,
                          auth.getValue().user?.timezone,
                          timezone.getValue(),
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3.6}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Description
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {data.description ?? '-'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Client
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {data.clientId}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Service type
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {serviceTypeList?.find(
                          value => value.value === data.serviceTypeId,
                        )?.label ?? '-'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2.8}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Source language
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {languageHelper(data.sourceLanguage)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3.6}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        color='#8D8E9A'
                        fontWeight={400}
                      >
                        Target language
                      </Typography>
                      <Typography fontSize={14} fontWeight={400}>
                        {languageHelper(data.targetLanguage)}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          )}

          <SelectPro
            onClickSelectProsHelperIcon={onClickSelectProsHelperIcon}
            fields={fields}
            control={control}
            trigger={trigger}
            getValues={getValues}
            onClickAddPros={onClickAddPros}
            remove={remove}
            handleBack={handleBack}
            onClickSave={onClickSave}
            setExpandSelectProArea={setExpandSelectProArea}
            expandSelectProArea={expandSelectProArea}
            type={editMode ? 'edit' : 'detail'}
          />
        </Card>
      ) : null}
    </>
  )
}

export default LinguistTeamDetail

LinguistTeamDetail.acl = {
  subject: 'pro',
  action: 'read',
}
