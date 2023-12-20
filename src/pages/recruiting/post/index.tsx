// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Button,
  Card,
  FormHelperText,
  InputAdornment,
  List,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** React Imports
import { useContext, useEffect, useMemo, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Styled Component Import
import { StyledEditor } from 'src/@core/components/editor/customEditor'
import CustomChip from 'src/@core/components/mui/chip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** fetches
import { FormType, postRecruiting, StatusType } from '@src/apis/recruiting.api'
import { useMutation } from 'react-query'
import { useGetJobPostingList } from '@src/queries/jobs/jobPosting.query'
import { useGetClientList } from '@src/queries/client.query'

// ** types
import {
  recruitingFormSchema,
  RecruitingFormType,
} from 'src/types/schema/recruiting.schema'
import { CountryType } from 'src/types/sign/personalInfoTypes'

// ** values
import { JobList, ProJobPair } from 'src/shared/const/job/jobs'
import { RoleList, ProRolePair } from 'src/shared/const/role/roles'

import { RecruitingStatus } from 'src/shared/const/status/statuses'

import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { countries } from 'src/@fake-db/autocomplete'
import JobPostingListModal from '../components/jobPosting-modal'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import logger from '@src/@core/utils/logger'

import { timezoneSelector } from '@src/states/permission'

export default function RecruitingPost() {
  const router = useRouter()
  const languageList = getGloLanguage()

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
  }, [timezone])

  /* dialog states */
  const [openDialog, setOpenDialog] = useState(false)
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const { data: list, isLoading } = useGetJobPostingList({
    skip: skip * pageSize,
    take: pageSize,
  })

  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

  // ** contexts
  const auth = useRecoilValueLoadable(authState)
  const { setModal } = useContext(ModalContext)

  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())

  const defaultValues = {
    status: { value: '' as StatusType, label: '' as StatusType },
    client: { value: '', label: '' },
    jobType: { value: '', label: '' },
    role: { value: '', label: '' },
    sourceLanguage: { value: '', label: '' },
    targetLanguage: { value: '', label: '' },
    openings: undefined,
    dueDate: '',
    dueDateTimezone: { code: '', label: '' },
    jobPostLink: '',
  }

  type FilterState = Array<{ value: string; label: string }>
  const [jobTypeOption, setJobTypeOption] = useState<FilterState>([])
  const [roleOption, setRoleOption] = useState<FilterState>([])

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RecruitingFormType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(recruitingFormSchema),
  })
  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const currDueDate = watch('dueDate')

  useEffect(() => {
    if (!currDueDate) {
      setValue(
        'dueDateTimezone',
        { code: '', label: '', phone: '' },
        setValueOptions,
      )
    } else if (currDueDate && !watch('dueDateTimezone')?.label) {
      setValue(
        'dueDateTimezone',
        auth.getValue().user?.timezone,
        setValueOptions,
      )
    }
  }, [currDueDate])

  function addLink(link: string) {
    setValue('jobPostLink', link, setValueOptions)
  }
  function onDiscard() {
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-alert-error.png'
            width={60}
            height={60}
            alt=''
          />
          <Typography variant='body2'>
            Are you sure to discard this request?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              router.push('/recruiting/')
            }}
          >
            Discard
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onUpload() {
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-successful.png'
            width={60}
            height={60}
            alt=''
          />
          <Typography variant='body2'>
            Are you sure to add this recruiting request?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              onSubmit()
            }}
          >
            Upload
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  const postMutation = useMutation((form: FormType) => postRecruiting(form), {
    onSuccess: res => {
      router.push(`/recruiting/detail/${res?.id}`)
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
      client: data.client.value,
      jobType: data.jobType.value,
      role: data.role.value,
      sourceLanguage: data.sourceLanguage.value,
      targetLanguage: data.targetLanguage.value,
      openings: data.openings ?? 0,
      dueDate: data.dueDate ?? '',
      dueDateTimezone: data.dueDateTimezone?.label ?? '',
      jobPostLink: data.jobPostLink,
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

  const currJobType = watch('jobType')
  const currRole = watch('role')
  function findDynamicFilterOptions(
    type: 'role' | 'jobType',
  ): Array<{ value: string; label: string }> {
    switch (type) {
      case 'jobType':
        const key = currJobType.value as keyof typeof ProRolePair
        return ProRolePair[key]?.length ? [...ProRolePair[key]] : []
      case 'role':
        const roleKey = currRole.value as keyof typeof ProJobPair
        return ProJobPair[roleKey]?.length ? [...ProJobPair[roleKey]] : []
      default:
        return []
    }
  }

  useEffect(() => {
    const newFilter = findDynamicFilterOptions('jobType')
    setRoleOption(newFilter)
  }, [currJobType])

  useEffect(() => {
    const newFilter = findDynamicFilterOptions('role')
    setJobTypeOption(newFilter)
  }, [currRole])

  return (
    <DatePickerWrapper>
      <form>
        <StyledEditor style={{ margin: '0 70px' }}>
          <Typography variant='h6' mb='24px'>
            Recruiting Request
          </Typography>

          <Grid container spacing={6} className='match-height'>
            <Grid item xs={12} md={9}>
              <Card sx={{ padding: '30px 20px 20px' }}>
                <Box display='flex' justifyContent='flex-end' mb='26px'>
                  <Box display='flex' alignItems='center' gap='8px'>
                    <CustomChip
                      label='Requestor'
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
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>
                      {auth.getValue().user?.email}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={6} mb='20px'>
                  {/* status */}
                  <Grid item xs={6}>
                    <Controller
                      name='status'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={RecruitingStatus}
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
                              error={Boolean(errors.status)}
                              label='Status*'
                              placeholder='Status*'
                            />
                          )}
                        />
                      )}
                    />
                    {errors.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.status?.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* client */}
                  <Grid item xs={6}>
                    <Controller
                      name='client'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={clientList}
                          // filterSelectedOptions
                          onChange={(e, v) => {
                            if (!v) onChange({ value: '', label: '' })
                            else onChange(v)
                          }}
                          value={value}
                          id='client'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errors.client)}
                              label='Client'
                              placeholder='Client*'
                            />
                          )}
                        />
                      )}
                    />
                    {errors.client && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.client?.label?.message ||
                          errors.client?.value?.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* jobType */}
                  <Grid item xs={6}>
                    <Controller
                      name='jobType'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={
                            !jobTypeOption.length ? JobList : jobTypeOption
                          }
                          value={value}
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
                              error={Boolean(errors.jobType)}
                              label='Job type*'
                              placeholder='Job type*'
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
                  <Grid item xs={6}>
                    <Controller
                      name='role'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={!roleOption.length ? RoleList : roleOption}
                          value={value}
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
                              error={Boolean(errors.role)}
                              label='Role*'
                              placeholder='Role*'
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
                              error={Boolean(errors.sourceLanguage)}
                              label='Source*'
                              placeholder='Source*'
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
                              error={Boolean(errors.targetLanguage)}
                              label='Target*'
                              placeholder='Target*'
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
                  <Grid item xs={2.2}>
                    <Controller
                      name='openings'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          fullWidth
                          onChange={e => {
                            const value = Number(e.target.value)
                            if (value <= 15) onChange(value)
                            else return
                          }}
                          value={value}
                          error={Boolean(errors.openings)}
                          label='Number of linguist'
                          placeholder='Number of linguist'
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
                  {/* date & time */}
                  <Grid item xs={3.8}>
                    <Controller
                      name='dueDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <DatePicker
                          selected={value ? new Date(value) : null}
                          id='dueDate'
                          onChange={onChange}
                          placeholderText='Due date'
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
                      render={({ field: { value, onChange, onBlur } }) => {
                        return (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            value={value || { code: '', label: '', phone: '' }}
                            disabled={!currDueDate}
                            options={timeZoneList as CountryType[]}
                            onChange={(e, v) => onChange(v)}
                            disableClearable
                            renderOption={(props, option) => (
                              <Box component='li' {...props} key={uuidv4()}>
                                {timeZoneFormatter(option, timezone.getValue())}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Due date timezone'
                                error={Boolean(errors.dueDateTimezone)}
                                inputProps={{
                                  ...params.inputProps,
                                }}
                              />
                            )}
                            getOptionLabel={option =>
                              timeZoneFormatter(option, timezone.getValue()) ??
                              ''
                            }
                          />
                        )
                      }}
                    />
                    {errors.dueDateTimezone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.dueDateTimezone?.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* jobpost link */}
                  <Grid item xs={12}>
                    <Box display='flex' gap='24px'>
                      <Select
                        id='job post link'
                        labelId='select job post link'
                        defaultValue='find'
                        disabled
                      >
                        <MenuItem value='find'>Find link</MenuItem>
                      </Select>
                      <OutlinedInput
                        fullWidth
                        readOnly
                        value={watch('jobPostLink')}
                        id='jobPostLink'
                        onClick={() => setOpenDialog(true)}
                        placeholder='Job posting link'
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton edge='end'>
                              <Icon
                                icon='material-symbols:open-in-new'
                                opacity={0.7}
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Box>
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
              <Card>
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
                    Add
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </StyledEditor>
      </form>
      {/* job posting list dialog */}
      <JobPostingListModal
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        addLink={addLink}
        skip={skip}
        pageSize={pageSize}
        setSkip={setSkip}
        setPageSize={setPageSize}
        list={list || { data: [], totalCount: 0 }}
        isLoading={isLoading}
      />
    </DatePickerWrapper>
  )
}

RecruitingPost.acl = {
  subject: 'recruiting',
  action: 'create',
}
