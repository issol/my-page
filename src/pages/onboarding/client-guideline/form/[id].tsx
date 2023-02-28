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

// ** React Imports
import { Suspense, useContext, useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import FallbackSpinner from 'src/@core/components/spinner'
import { toast } from 'react-hot-toast'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import CustomChip from 'src/@core/components/mui/chip'
import FileItem from 'src/@core/components/fileItem'
import EmptyPost from 'src/@core/components/page/empty-post'

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
import { useMutation } from 'react-query'
import {
  deleteGuidelineFile,
  FilePostType,
  getGuidelineUploadPreSignedUrl,
  updateGuideline,
} from 'src/apis/client-guideline.api'
import { useGetGuideLineDetail } from 'src/queries/client-guideline.query'
import { postFiles } from 'src/apis/common.api'

// ** types
import { FormType } from 'src/apis/client-guideline.api'
import { FileType } from 'src/types/common/file.type'

// ** values
import { FormErrors } from 'src/shared/const/formErrors'

// ** helpers
import { getFilePath } from 'src/shared/transformer/filePath.transformer'

const defaultValues = {
  title: '',
  client: { label: '', value: '' },
  category: { label: '', value: '' },
  serviceType: { label: '', value: '' },
  file: [],
}

const ClientGuidelineEdit = () => {
  const router = useRouter()
  const id = Number(router.query.id)
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
  const [savedFiles, setSavedFiles] = useState<
    Array<{ name: string; size: number }> | []
  >([])
  const [deletedFiles, setDeletedFiles] = useState<Array<FileType> | []>([])

  const { data, isSuccess, isError } = useGetGuideLineDetail(id)

  if (isError) {
    return <EmptyPost />
  }

  const currentVersion = data?.currentVersion || {
    id: null,
    version: null,
    userId: null,
    title: '',
    writer: '',
    email: '',
    client: '',
    category: '',
    serviceType: null,
    updatedAt: '',
    content: null,
    files: [],
  }

  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ClientGuidelineType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(clientGuidelineSchema),
  })

  function initializeValue(
    name: 'title' | 'client' | 'category' | 'serviceType' | 'file',
    value: string | { value: string; label: string },
  ) {
    setValue(name, value, { shouldDirty: true, shouldValidate: true })
  }

  useEffect(() => {
    if (isSuccess) {
      initializeValue('title', currentVersion.title)

      initializeValue(
        'client',
        ClientCategoryIncludeGloz.filter(
          item => item.value === currentVersion.client,
        )[0],
      )
      initializeValue(
        'category',
        Category.filter(item => item.value === currentVersion.category)[0],
      )
      initializeValue(
        'serviceType',
        ServiceType.filter(
          item => item.value === currentVersion.serviceType,
        )[0],
      )
      if (currentVersion?.content) {
        const editorState = EditorState.createWithContent(
          convertFromRaw(currentVersion?.content as any),
        )
        setContent(editorState)
      }
      if (currentVersion?.files.length) setSavedFiles(currentVersion.files)
    }
  }, [isSuccess])

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
          let result = fileSize
          acc.concat(file).forEach((file: FileType) => (result += file.size))
          if (result > MAXIMUM_FILE_SIZE) {
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
                    alt='The maximum file size you can upload is 50mb.'
                  />
                  <Typography variant='body2'>
                    The maximum file size you can upload is 50mb.
                  </Typography>
                </Box>
                <ModalButtonGroup>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setModal(null)
                    }}
                  >
                    Okay
                  </Button>
                </ModalButtonGroup>
              </ModalContainer>,
            )
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (!found) acc.push(file)
            return acc
          }
        }, [])
      setFiles(uniqueFiles)
    },
  })

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleRemoveSavedFile = (file: FileType) => {
    setSavedFiles(savedFiles.filter(item => item.name !== file.name))
    setDeletedFiles([...deletedFiles, file])
  }

  const fileList = files.map((file: FileType) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
  ))

  const savedFileList = savedFiles?.map((file: any) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveSavedFile} />
  ))

  useEffect(() => {
    setValue('file', files, { shouldDirty: true, shouldValidate: true })

    let result = 0
    files.forEach((file: FileType) => (result += file.size))

    savedFiles.forEach(
      (file: { name: string; size: number }) => (result += file.size),
    )
    setFileSize(result)
  }, [files, savedFiles])

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
            Are you sure to discard this guideline?
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
              router.back()
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

  const guidelinePatchMutation = useMutation(
    (form: FormType) => updateGuideline(id, form),
    {
      onSuccess: data => {
        router.push(`/onboarding/client-guideline/detail/${data?.id}`)
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
    //** data to send to server */
    const formContent = convertToRaw(content.getCurrentContent())
    const finalValue: FormType = {
      writer: user?.username!,
      email: user?.email!,
      title: data.title,
      client: data.client.value,
      category: data.category.value,
      serviceType: data.serviceType.value,
      content: formContent,
      text: content.getCurrentContent().getPlainText('\u0001'),
    }

    // file upload
    if (data.file.length) {
      const formData = new FormData()
      const fileInfo: Array<FilePostType> = []
      const paths: string[] = data?.file?.map(file =>
        getFilePath(
          [
            data.client.value,
            data.category.value,
            data.serviceType.value,
            `V${currentVersion?.version!}`,
          ],
          file.name,
        ),
      )
      getGuidelineUploadPreSignedUrl(paths).then(res => {
        const promiseArr = res.map((url, idx) => {
          fileInfo.push({
            name: data.file[idx].name,
            size: data.file[idx]?.size,
            fileUrl: paths[idx],
          })
          formData.append(`file`, data.file[idx])
          return postFiles(url, formData)
        })
        Promise.all(promiseArr)
          .then(res => {
            console.log('upload client guideline file success :', res)
            finalValue.files = fileInfo
            guidelinePatchMutation.mutate(finalValue)
          })
          .catch(err =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      })
    } else {
      guidelinePatchMutation.mutate(finalValue)
    }

    if (deletedFiles.length) {
      deletedFiles.forEach(item =>
        deleteGuidelineFile(item.id!).catch(err =>
          toast.error(
            'Something went wrong while deleting files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        ),
      )
    }
  }

  if (!isSuccess) return null

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <form>
        <StyledEditor
          style={{ margin: '0 70px' }}
          error={
            !content.getCurrentContent().getPlainText('\u0001') && showError
          }
        >
          <Grid container spacing={6} className='match-height'>
            <Grid item xs={12} md={8}>
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
                          disabled
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
                              label='Client*'
                              placeholder='Client*'
                              disabled
                              InputProps={{
                                sx: { background: 'rgba(76, 78, 100, 0.12)' },
                              }}
                            />
                          )}
                        />
                      )}
                    />
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
                              label='Category*'
                              placeholder='Category*'
                              disabled
                              InputProps={{
                                sx: { background: 'rgba(76, 78, 100, 0.12)' },
                              }}
                            />
                          )}
                        />
                      )}
                    />
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
                            label='Service type*'
                            placeholder='Service type*'
                            disabled
                            InputProps={{
                              sx: { background: 'rgba(76, 78, 100, 0.12)' },
                            }}
                          />
                        )}
                      />
                    )}
                  />
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

            <Grid
              item
              xs={12}
              md={4}
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
                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                      Attached file
                    </Typography>
                    <Typography variant='body2'>
                      {Math.round(fileSize / 100) / 10 > 1000
                        ? `${(Math.round(fileSize / 100) / 10000).toFixed(
                            1,
                          )} mb`
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
                  <div>
                    {currentVersion?.files?.length ? (
                      <List sx={{ paddingBottom: 0 }}>{savedFileList}</List>
                    ) : null}
                    {files.length ? (
                      <List sx={{ paddingTop: 0 }}>{fileList}</List>
                    ) : null}
                  </div>
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
    </Suspense>
  )
}

export default ClientGuidelineEdit

ClientGuidelineEdit.acl = {
  action: 'read',
  subject: 'client_guideline',
}

const StyledEditor = styled(EditorWrapper)<{ error: boolean }>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
  }
`
