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
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'

// ** Styled Component Import
import CustomChip from 'src/@core/components/mui/chip'
import FileItem from 'src/@core/components/fileItem'
import { StyledEditor } from 'src/@core/components/editor/customEditor'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// ** contexts

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDropzone } from 'react-dropzone'
import {
  clientGuidelineSchema,
  ClientGuidelineType,
} from 'src/types/schema/client-guideline.schema'

import { CategoryList } from 'src/shared/const/category/categories'

import { ServiceTypeList } from 'src/shared/const/service-type/service-types'

// ** fetches
import { getUploadUrlforCommon, uploadFileToS3 } from 'src/apis/common.api'
import { useMutation } from 'react-query'
import {
  checkGuidelineExistence,
  FilePostType,
  postGuideline,
} from 'src/apis/client-guideline.api'

// ** types
import { FormType } from 'src/apis/client-guideline.api'
import { FileType } from 'src/types/common/file.type'
import { S3FileType } from 'src/shared/const/signedURLFileType'

// ** values
import { FormErrors } from 'src/shared/const/formErrors'

// ** helpers
import { getFilePath } from 'src/shared/transformer/filePath.transformer'
import logger from '@src/@core/utils/logger'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { useGetClientList } from '@src/queries/client.query'
import useModal from '@src/hooks/useModal'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

const defaultValues = {
  title: '',
  client: { label: '', value: '' },
  category: { label: '', value: '' },
  serviceType: { label: '', value: '' },
  // content: null,
  file: [],
}

const ClientGuidelineForm = () => {
  const router = useRouter()
  // ** contexts
  const auth = useRecoilValueLoadable(authState)
  const { openModal, closeModal } = useModal()
  // ** states
  const [content, setContent] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  const [isDuplicated, setIsDuplicated] = useState(false) //check if the guideline is already exist

  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

  // ** file values
  const MAXIMUM_FILE_SIZE = FILE_SIZE.CLIENT_GUIDELINE

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
          let result = fileSize
          acc.concat(file).forEach((file: FileType) => (result += file.size))
          if (result > MAXIMUM_FILE_SIZE) {
            openModal({
              type: 'AlertMaximumFileSizeModal',
              children: (
                <AlertModal
                  title='The maximum file size you can upload is 2gb.'
                  onClick={() => closeModal('AlertMaximumFileSizeModal')}
                  vary='error'
                  buttonText='Okay'
                />
              ),
            })
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

  useEffect(() => {
    if (isDuplicated) {
      openModal({
        type: 'DuplicateModal',
        children: (
          <CustomModal
            title={
              <>
                The guideline for this client/category/
                <br />
                service type already exists.
              </>
            }
            vary='error'
            onClick={() => {
              closeModal('DuplicateModal')
              resetFormSelection()
            }}
            onClose={() => {
              closeModal('DuplicateModal')
            }}
            soloButton
            rightButtonText='Okay'
          />
        ),
      })
      resetFormSelection()
      setIsDuplicated(false)
    }
  }, [isDuplicated])

  type FormSelectKey = 'client' | 'category' | 'serviceType'

  function resetFormSelection() {
    const values: Array<FormSelectKey> = ['client', 'category', 'serviceType']
    values.forEach(name => {
      setValue(
        name,
        { label: '', value: '' },
        { shouldDirty: true, shouldValidate: true },
      )
    })
  }

  function checkGuideline() {
    const { category, client, serviceType } = getValues()
    if (category?.value && client.value && serviceType?.value) {
      checkGuidelineExistence(
        client.value,
        category.value,
        serviceType.value,
      ).then(res => setIsDuplicated(res))
    }
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileType) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
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
    files.forEach((file: FileType) => (result += file.size))

    setFileSize(result)
  }, [files])

  function onDiscard() {
    openModal({
      type: 'DiscardModal',
      children: (
        <CustomModal
          title='Are you sure to discard this guideline?'
          vary='error'
          onClick={() => {
            closeModal('DiscardModal')
            router.push('/onboarding/client-guideline/')
          }}
          onClose={() => {
            closeModal('DiscardModal')
          }}
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
          title='Are you sure to upload this guideline?'
          vary='successful'
          onClick={() => {
            closeModal('UploadModal')
            onSubmit()
          }}
          onClose={() => {
            closeModal('UploadModal')
          }}
          rightButtonText='Upload'
        />
      ),
    })
  }

  const guidelineMutation = useMutation(
    (form: FormType) => postGuideline(form),
    {
      onSuccess: data => {
        router.replace(`/onboarding/client-guideline/detail/${data.id}`)
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
    if (auth.state === 'hasValue' && auth.getValue().user) {
      const data = getValues()
      //** data to send to server */
      const formContent = convertToRaw(content.getCurrentContent())
      const finalValue: FormType = {
        writer: auth.getValue().user?.username!,
        email: auth.getValue().user?.email!,
        title: data.title,
        client: data.client.value,
        category: data.category?.value ?? '',
        serviceType: data.serviceType?.value ?? '',
        content: formContent,
        text: content.getCurrentContent().getPlainText('\u0001'),
      }
      // file upload
      if (data.file.length) {
        const fileInfo: Array<FilePostType> = []
        const paths: string[] = data?.file?.map(file =>
          getFilePath(
            [
              data.client.value,
              data.category?.value ?? '',
              data.serviceType?.value ?? '',
              'V1',
            ],
            file.name,
          ),
        )
        const promiseArr = paths.map((url, idx) => {
          return getUploadUrlforCommon(S3FileType.CLIENT_GUIDELINE, url).then(
            res => {
              fileInfo.push({
                name: data.file[idx].name,
                size: data.file[idx]?.size,
                fileUrl: url,
              })
              return uploadFileToS3(res.url, data.file[idx])
            },
          )
        })
        Promise.all(promiseArr)
          .then(res => {
            logger.debug('upload client guideline file success :', res)
            finalValue.files = fileInfo
            guidelineMutation.mutate(finalValue)
          })
          .catch(err =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      } else {
        guidelineMutation.mutate(finalValue)
      }
    }
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
                    {auth.getValue().user?.username}
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography variant='body2'>
                    {auth.getValue().user?.email}
                  </Typography>
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
                        options={clientList}
                        onChange={(e, v) => {
                          if (!v) onChange({ value: '', label: '' })
                          else onChange(v)
                          checkGuideline()
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
                        options={CategoryList}
                        value={value}
                        // filterSelectedOptions
                        onChange={(e, v) => {
                          if (!v) onChange({ value: '', label: '' })
                          else onChange(v)
                          checkGuideline()
                        }}
                        id='category'
                        getOptionLabel={option => option.label ?? ''}
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
                      options={ServiceTypeList}
                      value={value}
                      // filterSelectedOptions
                      onChange={(e, v) => {
                        if (!v) onChange({ value: '', label: '' })
                        else onChange(v)
                        checkGuideline()
                      }}
                      id='serviceType'
                      getOptionLabel={option => option.label ?? ''}
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
                    {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
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
