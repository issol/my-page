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

import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Styled Component Import
import { StyledEditor } from 'src/@core/components/editor/customEditor'
import CustomChip from 'src/@core/components/mui/chip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import EmptyPost from 'src/@core/components/page/empty-post'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AuthContext } from 'src/context/AuthContext'

// ** form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ClientListIncludeGloz } from 'src/shared/const/client/clients'

// ** fetches
import { useGetRecruitingDetail } from 'src/queries/recruiting.query'
import {
  FormType,
  StatusType,
  updateRecruiting,
} from '@src/apis/recruiting.api'

// ** types
import {
  recruitingFormSchema,
  RecruitingFormType,
} from 'src/types/schema/recruiting.schema'
import { CountryType } from 'src/types/sign/personalInfoTypes'

// ** values
import { JobList } from 'src/shared/const/job/jobs'
import { RoleList } from 'src/shared/const/role/roles'
import { RecruitingStatus } from 'src/shared/const/status/statuses'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { countries } from 'src/@fake-db/autocomplete'
import { useMutation } from 'react-query'
import JobPostingListModal from '../components/jobPosting-modal'
import { useGetJobPostingList } from '@src/queries/jobPosting.query'
import FallbackSpinner from '@src/@core/components/spinner'

export default function RecruitingEdit() {
  const router = useRouter()
  const id = Number(router.query.id)

  const languageList = getGloLanguage()

  /* dialog states */
  const [openDialog, setOpenDialog] = useState(false)
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [search, setSearch] = useState(false)
  const { data: list, isLoading } = useGetJobPostingList(
    { skip: skip * pageSize, take: pageSize },
    search,
    setSearch,
  )

  useEffect(() => {
    if (openDialog) setSearch(true)
  }, [openDialog])

  // ** contexts
  const { user } = useContext(AuthContext)
  const { setModal } = useContext(ModalContext)

  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())

  const { data, refetch, isSuccess, isError } = useGetRecruitingDetail(
    id,
    false,
  )

  useEffect(() => {
    if (!Number.isNaN(id)) {
      refetch()
    }
  }, [id])

  const { currentVersion: currData } = data || {
    id: null,
    version: null,
    writer: '',
    email: '',
    createdAt: '',
    status: '',
    client: '',
    jobType: '',
    role: '',
    sourceLanguage: '',
    targetLanguage: '',
    openings: null,
    dueDate: '',
    dueDateTimezone: '',
    jobPostLink: '',
    content: '',
    isHide: 'false',
  }

  const ability = useContext(AbilityContext)
  const isWriter =
    ability.can('update', 'recruiting') && user?.email === currData?.email

  function initializeValues(data: any) {
    const values: Array<{ name: any; list?: Array<any> }> = [
      { name: 'status', list: RecruitingStatus },
      { name: 'client', list: ClientListIncludeGloz },
      { name: 'role', list: RoleList },
      { name: 'jobType', list: JobList },
      { name: 'sourceLanguage', list: languageList },
      { name: 'targetLanguage', list: languageList },
      { name: 'openings' },
      { name: 'dueDate' },
      { name: 'dueDateTimezone', list: countries },
      { name: 'jobPostLink' },
    ]

    values.forEach(({ name, list = null }) => {
      const value = data[name]
      let itemValue = null
      if (!value) {
        return
      }
      if (list?.length) {
        if (name !== 'dueDateTimezone') {
          // @ts-ignore
          itemValue = list.find(item => item.value === value)
        } else {
          // @ts-ignore
          itemValue = list.find(item => item.code === value)
        }
      } else {
        itemValue = value
      }

      setValue(name, itemValue, { shouldDirty: true, shouldValidate: true })
    })
  }

  useEffect(() => {
    if (isSuccess) {
      initializeValues(currData)

      if (currData?.content) {
        const editorState = EditorState.createWithContent(
          convertFromRaw(currData?.content as any),
        )
        setContent(editorState)
      }
    }
  }, [isSuccess])

  type LinkModeType = 'insert' | 'find'
  const [linkMode, setLinkMode] = useState<LinkModeType>('insert')
  const defaultValues = {
    status: { value: '' as StatusType, label: '' as StatusType },
    client: { value: '', label: '' },
    jobType: { value: '', label: '' },
    role: { value: '', label: '' },
    sourceLanguage: { value: '', label: '' },
    targetLanguage: { value: '', label: '' },
    openings: undefined,
    dueDate: '',
    dueDateTimezone: { code: '', label: '', phone: '' },
    jobPostLink: '',
  }

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

  function addLink(link: string) {
    setValue('jobPostLink', link, { shouldDirty: true, shouldValidate: true })
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
              router.replace('/recruiting/')
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

  const updateMutation = useMutation(
    (form: FormType) => updateRecruiting(id, form),
    {
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
    },
  )

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
      dueDateTimezone: data.dueDateTimezone?.code ?? '',
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
    updateMutation.mutate(filteredForm)
  }

  return (
    <>
      {!data ? (
        <FallbackSpinner />
      ) : isError ? (
        <EmptyPost />
      ) : (
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
                          color={
                            user?.email === currData?.email
                              ? 'primary'
                              : 'secondary'
                          }
                        >
                          {currData?.writer}
                        </Typography>
                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography variant='body2'>
                          {currData?.email}
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
                              filterSelectedOptions
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
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              disabled={!isWriter}
                              options={ClientListIncludeGloz}
                              filterSelectedOptions
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
                                  label='Client*'
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
                              disabled={!isWriter}
                              options={JobList}
                              value={value}
                              filterSelectedOptions
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
                              disabled={!isWriter}
                              options={RoleList}
                              value={value}
                              filterSelectedOptions
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
                              disabled={!isWriter}
                              options={languageList}
                              value={value}
                              filterSelectedOptions
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
                              disabled={!isWriter}
                              options={languageList}
                              value={value}
                              filterSelectedOptions
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
                      <Grid item xs={4}>
                        <Controller
                          name='openings'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              fullWidth
                              disabled={!isWriter}
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
                      <Grid item xs={4}>
                        <Controller
                          name='dueDate'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <DatePicker
                              disabled={!isWriter}
                              selected={value ? new Date(value) : null}
                              id='dueDate'
                              onChange={onChange}
                              placeholderText='Due date'
                              customInput={<CustomInput icon='calendar' />}
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
                      <Grid item xs={4}>
                        <Controller
                          name='dueDateTimezone'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              disabled={!isWriter}
                              value={value}
                              options={countries as CountryType[]}
                              onChange={(e, v) => onChange(v)}
                              disableClearable
                              renderOption={(props, option) => (
                                <Box component='li' {...props}>
                                  {option.label} ({option.code}) +{option.phone}
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
                            />
                          )}
                        />
                        {errors.dueDateTimezone && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.dueDateTimezone?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* jobpost link */}
                      <Grid item xs={12}>
                        <Box display='flex' gap='8px'>
                          <Select
                            disabled={!isWriter}
                            id='job post link'
                            labelId='select job post link'
                            defaultValue='insert'
                            onChange={e =>
                              setLinkMode(e.target.value as LinkModeType)
                            }
                          >
                            <MenuItem value='insert'>Insert link</MenuItem>
                            <MenuItem value='find'>Find link</MenuItem>
                          </Select>
                          {linkMode === 'insert' ? (
                            <Controller
                              name='jobPostLink'
                              control={control}
                              rules={{ required: true }}
                              render={({
                                field: { value, onChange, onBlur },
                              }) => (
                                <OutlinedInput
                                  fullWidth
                                  disabled={!isWriter}
                                  value={value}
                                  id='jobPostLink'
                                  onChange={onChange}
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
                              )}
                            />
                          ) : (
                            <OutlinedInput
                              fullWidth
                              disabled={!isWriter}
                              readOnly
                              value={watch('jobPostLink')}
                              id='jobPostLink'
                              onClick={() => isWriter && setOpenDialog(true)}
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
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider style={{ marginBottom: '20px' }} />
                    <ReactDraftWysiwyg
                      editorState={content}
                      placeholder='Memo'
                      readOnly={!isWriter}
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
                        Save
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
            list={list || { data: [], count: 0 }}
            isLoading={isLoading}
          />
        </DatePickerWrapper>
      )}
    </>
  )
}

RecruitingEdit.acl = {
  subject: 'recruiting',
  action: 'update',
}
