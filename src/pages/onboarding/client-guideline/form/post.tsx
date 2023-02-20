// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Button,
  Card,
  FormHelperText,
  List,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** React Imports
import { Fragment, useContext, useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { Writer } from 'src/@core/components/chip'

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
import { useDropzone } from 'react-dropzone'
import {
  clientGuidelineSchema,
  ClientGuidelineType,
} from 'src/types/schema/client-guideline.schema'
import {
  Category,
  ClientCategoryIncludeGloz,
  ServiceType,
} from 'src/shared/const/clientGuideline'

// ** fetches
import axios from 'axios'
import { getPresignedUrl } from 'src/apis/user.api'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'
import { useMutation } from 'react-query'
import { postGuideline } from 'src/apis/client-guideline.api'

// ** types
import { FormType } from 'src/apis/client-guideline.api'
import { toast } from 'react-hot-toast'
import { FormErrors } from 'src/shared/const/formErrors'

const defaultValues = {
  title: '',
  client: { label: '', value: '' },
  category: { label: '', value: '' },
  serviceType: { label: '', value: '' },
  // content: null,
  file: [],
}

interface FileProp {
  name: string
  type: string
  size: number
}

const ClientGuidelineForm = () => {
  const router = useRouter()
  // ** contexts
  const { user } = useContext(AuthContext)
  const { setModal } = useContext(ModalContext)

  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)

  // ** file values
  const MAXIMUM_FILE_SIZE = 50000000

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.cvs'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'video/*': ['.avi', '.mp4', '.mkv', '.wmv', '.mov'],
    },
    onDrop: (acceptedFiles: File[]) => {
      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: File[], file: File) => {
          const found = acc.find(f => f.name === file.name)
          if (!found) acc.push(file)
          return acc
        }, [])
      setFiles(uniqueFiles)
    },
  })
  console.log(files)

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <FileList key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          />
        </div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='mdi:close' fontSize={20} />
      </IconButton>
    </FileList>
  ))

  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<ClientGuidelineType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(clientGuidelineSchema),
  })

  useEffect(() => {
    setValue('file', files, { shouldDirty: true, shouldValidate: true })

    let result = 0
    files.forEach((file: FileProp) => (result += file.size))

    setFileSize(result)
  }, [files])

  useEffect(() => {
    if (fileSize > MAXIMUM_FILE_SIZE) {
      setError('file', { message: FormErrors.fileSizeExceed })
    } else {
      clearErrors('file')
    }
  }, [fileSize])

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
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to discard this contract?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='contained' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setModal(null)
              router.push('/onboarding/client-guideline/')
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
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to upload this guideline?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='contained' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='outlined'
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

  const guidelineMutation = useMutation(
    (form: FormType) => postGuideline(form),
    {
      onSuccess: data => {
        //** TODO : return data에 오는 id로 client-guideline detail페이지로 이동하기
        //router.push(`/onboarding/client-guideline/detail/${data.id}`)
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

    data.file?.length &&
      data.file.forEach(file => {
        getPresignedUrl(user?.id as number, file.name).then(res => {
          const formData = new FormData()
          formData.append('files', file)
          axios
            .put(res, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:
                  'Bearer ' + typeof window === 'object'
                    ? getUserTokenFromBrowser()
                    : null,
              },
            })
            .then(res =>
              console.log('upload client guideline file success :', res),
            )
            .catch(err =>
              toast.error(
                'Something went wrong while uploading files. Please try again.',
                {
                  position: 'bottom-left',
                },
              ),
            )
        })
      })

    //** data to send to server */
    const formContent = convertToRaw(content.getCurrentContent())
    const finalValue = {
      title: data.title,
      client: data.client.value,
      category: data.category.value,
      serviceType: data.serviceType.value,
      content: formContent,
    }
    guidelineMutation.mutate(finalValue)
  }

  return (
    <form>
      <StyledEditor
        style={{ margin: '0 70px' }}
        error={!content.getCurrentContent().getPlainText('\u0001') && showError}
      >
        <Typography variant='h6' mb='24px'>
          New client guidelines
        </Typography>

        <Grid container spacing={6} className='match-height'>
          <Grid item xs={9}>
            <Card sx={{ padding: '30px 20px 20px' }}>
              <Box display='flex' justifyContent='flex-end' mb='26px'>
                <Box display='flex' alignItems='center' gap='8px'>
                  <Writer label='Writer' size='small' />
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
              {/* title */}
              <Grid item xs={12} mb='20px'>
                <Controller
                  name='title'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <TextField
                        fullWidth
                        autoFocus
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        inputProps={{ maxLength: 100 }}
                        error={Boolean(errors.title)}
                        label='Title*'
                        placeholder='Tappytoon webnovel styleguide #1'
                      />
                    </>
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.title?.message}
                  </FormHelperText>
                )}
              </Grid>
              {/* client */}
              <Box display='flex' gap='20px'>
                <Grid item xs={6} mb='20px'>
                  <Controller
                    name='client'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={ClientCategoryIncludeGloz}
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
                {/* category */}
                <Grid item xs={6} mb='20px'>
                  <Controller
                    name='category'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={Category}
                        value={value}
                        filterSelectedOptions
                        onChange={(e, v) => {
                          if (!v) onChange({ value: '', label: '' })
                          else onChange(v)
                        }}
                        id='category'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.category)}
                            label='Category*'
                            placeholder='Category*'
                          />
                        )}
                      />
                    )}
                  />
                  {errors.category && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.category?.label?.message ||
                        errors.category?.value?.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Box>
              {/* service type */}
              <Grid item xs={12} mb='20px'>
                <Controller
                  name='serviceType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={ServiceType}
                      value={value}
                      filterSelectedOptions
                      onChange={(e, v) => {
                        if (!v) onChange({ value: '', label: '' })
                        else onChange(v)
                      }}
                      id='serviceType'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors.serviceType)}
                          label='Service type*'
                          placeholder='Service type*'
                        />
                      )}
                    />
                  )}
                />
                {errors.serviceType && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.serviceType?.label?.message ||
                      errors.serviceType?.value?.message}
                  </FormHelperText>
                )}
              </Grid>
              <Divider />
              <ReactDraftWysiwyg
                editorState={content}
                placeholder='Write down a guideline or attach it as a file.'
                onEditorStateChange={data => {
                  setShowError(true)
                  setContent(data)
                }}
              />
              {!content.getCurrentContent().getPlainText('\u0001') &&
              showError ? (
                <Typography
                  color='error'
                  sx={{ fontSize: '0.75rem', marginLeft: '12px' }}
                  mt='8px'
                >
                  {FormErrors.required}
                </Typography>
              ) : (
                ''
              )}
            </Card>
          </Grid>

          <Grid item xs={3} className='match-height' sx={{ height: '152px' }}>
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
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    Attached file
                  </Typography>
                  <Typography variant='body2'>
                    {Math.round(fileSize / 100) / 10 > 1000
                      ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
                      : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
                    /50mb
                  </Typography>
                </Box>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <Button variant='outlined' fullWidth>
                    <input {...getInputProps()} />
                    Upload files
                  </Button>
                </div>
                {files.length ? (
                  <Fragment>
                    <List>{fileList}</List>
                  </Fragment>
                ) : null}
              </Box>
            </Card>
            {errors.file && (
              <FormHelperText sx={{ color: 'error.main' }} id=''>
                {errors.file.message}
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
                  disabled={
                    !isValid ||
                    !content.getCurrentContent().getPlainText('\u0001')
                  }
                >
                  Upload
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </StyledEditor>
    </form>
  )
}

export default ClientGuidelineForm

ClientGuidelineForm.acl = {
  action: 'create',
  subject: 'client_guideline',
}

const StyledEditor = styled(EditorWrapper)<{ error: boolean }>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
  }
`
const FileList = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  .file-details {
    display: flex;
    align-items: center;
  }
  .file-preview {
    margin-right: 8px;
    display: flex;
  }

  img {
    width: 38px;
    height: 38px;

    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(93, 89, 98, 0.14);
  }

  .file-name {
    font-weight: 600;
  }
`
