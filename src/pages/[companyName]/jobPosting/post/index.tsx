// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Button,
  Card,
  FormHelperText,
  IconButton,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** React Imports
import { useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import AddLinkModal from '../components/add-link-modal'
import EditLinkModal from '../components/edit-link-modal'

// ** Styled Component Import
import { StyledEditor } from '@src/@core/components/editor/customEditor'
import CustomChip from '@src/@core/components/mui/chip'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { LinkItem } from '@src/@core/components/linkItem'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { styled } from '@mui/system'

// ** contexts

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** form
import { Controller, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** fetches
import { FormType, postJobPosting, StatusType } from '@src/apis/jobPosting.api'
import { useMutation, useQueryClient } from 'react-query'

// ** types
import {
  jobPostingFormSchema,
  JobPostingFormType,
  LinkType,
} from '@src/types/schema/jobPosting.schema'
import { CountryType } from '@src/types/sign/personalInfoTypes'

// ** third parties
import { v4 as uuidv4 } from 'uuid'

// ** values
import { JobList } from '@src/shared/const/job/jobs'
import { JobPostingStatus } from '@src/shared/const/status/statuses'
import { RoleList } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { ExperiencedYears } from '@src/shared/const/experienced-years'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import FallbackSpinner from '@src/@core/components/spinner'

import { timezoneSelector } from '@src/states/permission'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import PushPinIcon from '@mui/icons-material/PushPin'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'
export default function JobPostingPost() {
  const router = useRouter()
  const languageList = getGloLanguage()
  const queryClient = useQueryClient()

  // ** contexts
  const auth = useRecoilValueLoadable(authState)
  const { openModal, closeModal } = useModal()

  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())
  const [link, setLink] = useState<Array<LinkType>>([])
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const loadTimezonePin = ():
    | {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    | null => {
    const storedOptions = getTimezonePin()
    return storedOptions ? JSON.parse(storedOptions) : null
  }

  useEffect(() => {
    if (timezoneList.length !== 0) return
    const zoneList = timezone.getValue()
    const loadTimezonePinned = loadTimezonePin()
    const filteredTimezone = zoneList.map((list, idx) => {
      return {
        id: idx,
        code: list.timezoneCode,
        label: list.timezone,
        pinned:
          loadTimezonePinned && loadTimezonePinned.length > 0
            ? loadTimezonePinned[idx].pinned
            : false,
      }
    })
    setTimezoneList(filteredTimezone)
  }, [timezone])

  const defaultValues = {
    status: { value: '' as StatusType, label: '' as StatusType },
    jobType: { value: '', label: '' },
    role: { value: '', label: '' },
    sourceLanguage: { value: '', label: '' },
    targetLanguage: { value: '', label: '' },
    yearsOfExperience: { value: '', label: '' },
    postLink: [],
    openings: undefined,
    dueDate: '',
    dueDateTimezone: { id: undefined, code: '', label: '', pinned: false },
    jobPostLink: '',
  }

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<JobPostingFormType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(jobPostingFormSchema) as Resolver<JobPostingFormType>,
  })

  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const currDueDate = watch('dueDate')

  useEffect(() => {
    if (!currDueDate) {
      setValue(
        'dueDateTimezone',
        { id: undefined, code: '', label: '', pinned: false },
        setValueOptions,
      )
    } else if (
      currDueDate &&
      !watch('dueDateTimezone')?.code &&
      auth.state === 'hasValue' &&
      auth.getValue().user &&
      timezoneList.length > 0
    ) {
      const getUserTimezone = timezoneList.find(
        zone => zone.code === auth.getValue().user?.timezone?.code,
      )
      setValue('dueDateTimezone', getUserTimezone, setValueOptions)
    }
  }, [currDueDate])

  function onDiscard() {
    openModal({
      type: 'DiscardModal',
      children: (
        <CustomModal
          title='Are you sure to discard all changes?'
          onClose={() => closeModal('DiscardModal')}
          onClick={() => {
            closeModal('DiscardModal')
            router.push('/recruiting/')
          }}
          vary='error'
          rightButtonText='Discard'
        />
      ),
    })
  }

  function onUpload() {
    openModal({
      type: 'UploadModal',
      children: (
        <CustomModal
          title='Are you sure to post this job posting?'
          onClose={() => closeModal('UploadModal')}
          onClick={() => {
            closeModal('UploadModal')
            onSubmit()
          }}
          vary='successful'
          rightButtonText='Post'
        />
      ),
    })
  }

  function openAddLinkModal() {
    openModal({
      type: 'AddLinkModal',
      children: (
        <AddLinkModal
          onAdd={addLink}
          onClose={() => closeModal('AddLinkModal')}
        />
      ),
    })
  }

  function openEditLinkModal(savedLink: LinkType) {
    openModal({
      type: 'EditLinkModal',
      children: (
        <EditLinkModal
          onAdd={editLink}
          onClose={() => closeModal('EditLinkModal')}
          savedLink={savedLink}
        />
      ),
    })
  }

  function editLink(item: LinkType) {
    const itemToDelete = link.filter(v => v.id !== item.id)
    const itemToAdd = { ...item, id: uuidv4() }
    setLink([...itemToDelete, itemToAdd])
  }

  function addLink(item: LinkType) {
    if (link.length >= 15) return
    const itemToAdd = { ...item, id: uuidv4() }
    setLink([...link, itemToAdd])
  }

  function deleteLink(item: LinkType) {
    const itemToDelete = link.filter(v => v.id !== item.id)
    setLink(itemToDelete)
  }

  useEffect(() => {
    setValue('postLink', link, setValueOptions)
  }, [link])

  const postMutation = useMutation((form: FormType) => postJobPosting(form), {
    onSuccess: res => {
      router.push(`/jobPosting/detail/${res?.id}`)
      queryClient.invalidateQueries(['get-jobPosting/list'])
      queryClient.invalidateQueries(['get-jobPosting/detail'])

      toast.success('Success', {
        position: 'bottom-left',
      })
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  const onSubmit = () => {
    const data = getValues()
    const finalForm = {
      status: data.status.value,
      jobType: data.jobType.value,
      role: data.role.value,
      sourceLanguage: data.sourceLanguage.value,
      targetLanguage: data.targetLanguage.value,
      yearsOfExperience: data?.yearsOfExperience?.value ?? '',
      openings: data.openings ?? 0,
      dueDate: data.dueDate ?? '',
      dueDateTimezone: data.dueDateTimezone
        ? { label: data.dueDateTimezone.label, code: data.dueDateTimezone.code }
        : '',
      postLink: data.postLink,
      content:
        content.getCurrentContent().getPlainText('\u0001') === ''
          ? ''
          : convertToRaw(content.getCurrentContent()),
      text: content.getCurrentContent().getPlainText('\u0001'),
    }

    const filteredForm = Object.fromEntries(
      Object.entries(finalForm).filter(([_, value]) => value !== ''),
    )
    // @ts-ignore
    postMutation.mutate(filteredForm)
  }

  const handleTimezonePin = (option: {
    id: number | undefined
    code: string
    label: string
    pinned: boolean
  }) => {
    const newOptions = timezoneList.map(opt =>
      opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt,
    )
    setTimezoneList(newOptions)
    setTimezonePin(newOptions)
  }

  const pinSortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1 // 핀 상태에 따라 정렬
  })

  return (
    <>
      {auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : auth.state === 'hasValue' ? (
        <DatePickerWrapper>
          <form>
            <StyledEditor style={{ margin: '0 70px' }}>
              <Typography variant='h6' mb='24px'>
                Create job posting
              </Typography>

              <Grid container spacing={6} className='match-height'>
                <Grid item xs={12} md={9}>
                  <Card sx={{ padding: '30px 20px 20px' }}>
                    <Box display='flex' justifyContent='flex-end' mb='26px'>
                      <Box display='flex' alignItems='center' gap='8px'>
                        <CustomChip
                          label='Writer'
                          skin='light'
                          color='error'
                          size='small'
                        />
                        <Typography
                          sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                          color='primary'
                        >
                          {auth.getValue().user?.username}
                        </Typography>
                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography variant='body2'>
                          {auth.getValue().user?.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={6} mb='20px'>
                      {/* status */}
                      <Grid item xs={4}>
                        <Controller
                          name='status'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={JobPostingStatus}
                              disableClearable={value.value === ''}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              value={value}
                              id='status'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.status)}
                                  label='Status*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.status && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.status?.value?.message ||
                              errors.status?.label?.message}
                          </FormHelperText>
                        )}
                      </Grid>

                      {/* jobType */}
                      <Grid item xs={4}>
                        <Controller
                          name='jobType'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={JobList}
                              value={value}
                              disableClearable={value.value === ''}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              id='jobType'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.jobType)}
                                  label='Job type*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.jobType && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.jobType?.label?.message ||
                              errors.jobType?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* role */}
                      <Grid item xs={4}>
                        <Controller
                          name='role'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={RoleList}
                              value={value}
                              disableClearable={value.value === ''}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              id='role'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.role)}
                                  label='Role*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.role && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.role?.label?.message ||
                              errors.role?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* source */}
                      <Grid item xs={6}>
                        <Controller
                          name='sourceLanguage'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={languageList}
                              disableClearable={value.value === ''}
                              value={value}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              id='sourceLanguage'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.sourceLanguage)}
                                  label='Source*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.sourceLanguage && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.sourceLanguage?.label?.message ||
                              errors.sourceLanguage?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>

                      {/* target */}
                      <Grid item xs={6}>
                        <Controller
                          name='targetLanguage'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={languageList}
                              disableClearable={value.value === ''}
                              value={value}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              id='targetLanguage'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.targetLanguage)}
                                  label='Target*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.targetLanguage && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.targetLanguage?.label?.message ||
                              errors.targetLanguage?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>

                    <Divider />
                    <Grid
                      container
                      spacing={6}
                      mb='20px'
                      sx={{ paddingTop: '10px' }}
                      rowSpacing={6}
                    >
                      <Grid item xs={6}>
                        <Controller
                          name='openings'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              fullWidth
                              autoComplete='off'
                              onChange={e => {
                                const value = Number(e.target.value)
                                if (value <= 15) onChange(value)
                                else return
                              }}
                              value={value}
                              error={Boolean(errors.openings)}
                              label='Number of linguist'
                              InputProps={{
                                type: 'number',
                              }}
                            />
                          )}
                        />
                        {errors.openings && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.openings?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* years of ex */}
                      <Grid item xs={6}>
                        <Controller
                          name='yearsOfExperience'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              options={ExperiencedYears}
                              disableClearable={!value || value.value === ''}
                              value={value}
                              // filterSelectedOptions
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              id='yearsOfExperience'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.yearsOfExperience)}
                                  label='Years of experience'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      {/* date & time */}
                      <Grid item xs={6}>
                        <Controller
                          name='dueDate'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomDatePicker
                              selected={value ? new Date(value) : null}
                              id='dueDate'
                              onChange={onChange}
                              placeholderText='MM/DD/YYYY'
                              customInput={
                                <CustomInput label='Due date' icon='calendar' />
                              }
                            />
                          )}
                        />
                        {errors.dueDate && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.dueDate?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* timezone */}
                      <Grid item xs={6}>
                        <Controller
                          name='dueDateTimezone'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              value={value}
                              options={pinSortedOptions}
                              onChange={(e, v) => onChange(v)}
                              // disableClearable
                              disabled={!currDueDate}
                              renderOption={(props, option) => (
                                <Box
                                  component='li'
                                  {...props}
                                  key={uuidv4()}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Typography
                                    noWrap
                                    sx={{
                                      width: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {timeZoneFormatter(
                                      option,
                                      timezone.getValue(),
                                    )}
                                  </Typography>
                                  <IconButton
                                    onClick={event => {
                                      event.stopPropagation() // 드롭다운이 닫히는 것 방지
                                      handleTimezonePin(option)
                                    }}
                                    size='small'
                                    style={{
                                      color: option.pinned
                                        ? '#FFAF66'
                                        : undefined,
                                    }}
                                  >
                                    <PushPinIcon />
                                  </IconButton>
                                </Box>
                              )}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  label='Due date timezone'
                                  // error={Boolean(errors.dueDateTimezone)}
                                  inputProps={{
                                    ...params.inputProps,
                                  }}
                                />
                              )}
                              getOptionLabel={option =>
                                timeZoneFormatter(
                                  option,
                                  timezone.getValue(),
                                ) ?? ''
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Divider style={{ marginBottom: '20px' }} />
                    <ReactDraftWysiwyg
                      editorState={content}
                      placeholder='Memo'
                      onEditorStateChange={data => {
                        setContent(data)
                      }}
                    />
                  </Card>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={3}
                  className='match-height'
                  sx={{ height: '152px' }}
                >
                  <Card style={{ height: '565px', overflow: 'scroll' }}>
                    <Box
                      sx={{
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <Box display='flex' justifyContent='space-between'>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          <Icon icon='material-symbols:link' opacity={0.7} />
                          Link*
                        </Typography>
                        <Typography variant='body2'>
                          {getValues('postLink')?.length || 0}/15
                        </Typography>
                      </Box>
                      <Button
                        variant='outlined'
                        fullWidth
                        disabled={watch('postLink').length >= 15}
                        onClick={openAddLinkModal}
                      >
                        <Icon icon='material-symbols:add' opacity={0.7} />
                        Add link
                      </Button>
                      {watch('postLink').length ? <Divider /> : null}
                      {watch('postLink').map(item => (
                        <LinkItem
                          key={item.id}
                          link={item}
                          onClick={() => openEditLinkModal(item)}
                          onClear={deleteLink}
                        />
                      ))}
                    </Box>
                  </Card>
                  {errors.postLink && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.postLink.message}
                    </FormHelperText>
                  )}
                  <Card style={{ marginTop: '24px' }}>
                    <Box
                      sx={{
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={onDiscard}
                      >
                        Discard
                      </Button>
                      <Button
                        variant='contained'
                        onClick={onUpload}
                        disabled={!isValid}
                      >
                        Post
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </StyledEditor>
          </form>
        </DatePickerWrapper>
      ) : null}
    </>
  )
}

JobPostingPost.acl = {
  subject: 'job_posting',
  action: 'create',
}

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
`
