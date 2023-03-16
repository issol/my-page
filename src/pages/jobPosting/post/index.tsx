// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Button,
  Card,
  FormHelperText,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import AddLinkModal from '../components/add-link-modal'
import EditLinkModal from '../components/edit-link-modal'

// ** Styled Component Import
import { StyledEditor } from 'src/@core/components/editor/customEditor'
import CustomChip from 'src/@core/components/mui/chip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { LinkItem } from 'src/@core/components/linkItem'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AuthContext } from 'src/context/AuthContext'

// ** form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** fetches
import { FormType, postJobPosting, StatusType } from '@src/apis/jobPosting.api'
import { useMutation } from 'react-query'

// ** types
import {
  jobPostingFormSchema,
  JobPostingFormType,
  LinkType,
} from 'src/types/schema/jobPosting.schema'
import { CountryType } from 'src/types/sign/personalInfoTypes'

// ** third parties
import { v4 as uuidv4 } from 'uuid'

// ** values
import { JobList } from 'src/shared/const/job/jobs'
import { JobPostingStatus } from 'src/shared/const/status/statuses'
import { RoleList } from 'src/shared/const/role/roles'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { countries } from 'src/@fake-db/autocomplete'
import { ExperiencedYears } from 'src/shared/const/experienced-years'

export default function JobPostingPost() {
  const router = useRouter()
  const languageList = getGloLanguage()

  // ** contexts
  const { user } = useContext(AuthContext)
  const { setModal } = useContext(ModalContext)

  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())
  const [link, setLink] = useState<Array<LinkType>>([])

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
    dueDateTimezone: { code: '', label: '', phone: '' },
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
    resolver: yupResolver(jobPostingFormSchema),
  })

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
            Are you sure to discard all changes?
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
            Are you sure to post this job posting?
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
            Post
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function openAddLinkModal() {
    setModal(<AddLinkModal onAdd={addLink} />)
  }

  function openEditLinkModal(savedLink: LinkType) {
    setModal(<EditLinkModal onAdd={editLink} savedLink={savedLink} />)
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
    setValue('postLink', link, { shouldDirty: true, shouldValidate: true })
  }, [link])

  const postMutation = useMutation((form: FormType) => postJobPosting(form), {
    onSuccess: res => {
      router.push(`/jobPosting/detail/${res?.id}`)
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
      dueDateTimezone: data.dueDateTimezone?.code ?? '',
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

  return (
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
                      {user?.username}
                    </Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>{user?.email}</Typography>
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
                  <Grid item xs={6}>
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
                          value={value}
                          filterSelectedOptions
                          onChange={(e, v) => {
                            if (!v) onChange({ value: '', label: '' })
                            else onChange(v)
                          }}
                          id='yearsOfExperience'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errors.yearsOfExperience)}
                              label='Years of experience'
                              placeholder='Years of experience'
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
                  <Grid item xs={6}>
                    <Controller
                      name='dueDateTimezone'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
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
                    Add
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </StyledEditor>
      </form>
    </DatePickerWrapper>
  )
}

JobPostingPost.acl = {
  subject: 'job_posting',
  action: 'create',
}

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
`