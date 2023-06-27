import { useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useDropzone } from 'react-dropzone'

// ** mui
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** react hook form
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** context
import { AuthContext } from '@src/context/AuthContext'

// ** types & validation
import { RequestFormType } from '@src/types/requests/common.type'
import {
  getClientRequestDefaultValue,
  clientRequestSchema,
} from '@src/types/schema/client-request.schema'
import { FileType } from '@src/types/common/file.type'

// ** apis
import { useGetClientList } from '@src/queries/client.query'

// ** components
import AddRequestForm from '@src/pages/components/forms/add-request-item-form'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import FileItem from '@src/@core/components/fileItem'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { createClientRequest } from '@src/apis/requests/client-request.api'
import { useMutation } from 'react-query'
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { useGetCompanyOptions } from '@src/queries/options.query'

export default function AddNewRequest() {
  const router = useRouter()

  const { user } = useContext(AuthContext)
  const { openModal, closeModal } = useModal()

  // ** file values
  const MAXIMUM_FILE_SIZE = 2147483648

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])

  // ** file managing
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
    maxSize: MAXIMUM_FILE_SIZE,
    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize =
        acceptedFiles.reduce((res, file) => (res += file.size), 0) + fileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onFileUploadReject()
      } else {
        setFiles(files.concat(acceptedFiles))
        setFileSize(totalFileSize)
      }
    },
    onDropRejected: () => onFileUploadReject(),
  })

  function onFileUploadReject() {
    openModal({
      type: 'dropReject',
      children: (
        <SimpleAlertModal
          message={`The maximum file size you can upload is ${
            Math.round(MAXIMUM_FILE_SIZE / 100) / 10000
          }mb.`}
          onClose={() => closeModal('dropReject')}
        />
      ),
    })
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)

    setFiles([...filtered])
  }

  /* TODO:
  api요청 3가지 항목
  1. contact person => api변경해야 함, 그리고 job title도 같이 filter에 표기해주기
  */

  // ** forms
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RequestFormType>({
    mode: 'onChange',
    defaultValues: getClientRequestDefaultValue(user?.userId!),
    resolver: yupResolver(clientRequestSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  })

  // ** form options
  const { data: clientList } = useGetClientList({
    skip: 0,
    take: 1000,
  })
  const { data: companies } = useGetCompanyOptions('LSP')

  const clients = useMemo(() => {
    return (
      clientList?.data?.map(item => ({
        value: item.clientId,
        label: item.name,
        timezone: item.timezone,
      })) || []
    )
  }, [clientList])

  const createMutation = useMutation(
    (form: RequestFormType) => createClientRequest(form),
    {
      onSuccess: res => {
        router.push(`/quotes/requests/${res.id}`)
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function mutateData() {
    const data: RequestFormType = getValues()
    if (files.length) {
      const fileInfo: Array<{ fileName: string; fileSize: number }> = []
      const paths: string[] = files?.map(file =>
        getFilePath(
          [S3FileType.REQUEST, user?.userId.toString()!, 'sampleFile'],
          file.name,
        ),
      )
      const promiseArr = paths.map((url, idx) => {
        return getUploadUrlforCommon(S3FileType.REQUEST, url).then(res => {
          fileInfo.push({
            fileName: files[idx].name,
            fileSize: files[idx]?.size,
          })
          return uploadFileToS3(res.url, files[idx])
        })
      })
      Promise.all(promiseArr)
        .then(res => {
          data.sampleFiles = fileInfo
          createMutation.mutate(data)
        })
        .catch(err => {
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          )
        })
    } else {
      createMutation.mutate(data)
    }
  }
  function onRequest() {
    openModal({
      type: 'request',
      children: (
        <CustomModal
          vary='successful'
          title='Are you sure you want to send the request to the selected LSP?'
          onClick={() => {
            mutateData()
            closeModal('request')
          }}
          onClose={() => closeModal('request')}
          rightButtonText='Request'
        />
      ),
    })
  }

  function onCancelRequest() {
    openModal({
      type: 'cancelRequest',
      children: (
        <DiscardModal
          title='Are you sure you want to discard the request?'
          onClick={() => {
            closeModal('cancelRequest')
            router.back()
          }}
          onClose={() => closeModal('cancelRequest')}
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title={
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap='8px'>
                <IconButton onClick={() => router.back()}>
                  <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
                </IconButton>
                <Typography variant='h5'>Create new request</Typography>
              </Box>
            </Box>
          }
        />
      </Grid>
      {/* left */}
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Controller
                name='contactPersonId'
                control={control}
                render={({ field: { value, onChange } }) => {
                  const selectedPerson = clients.find(
                    item => item.value === value,
                  )
                  return (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={clients}
                      onChange={(e, v) => {
                        onChange(v.value)
                        fields.forEach((item, i) =>
                          update(i, {
                            ...item,
                            desiredDueTimezone: v.timezone,
                          }),
                        )
                      }}
                      disableClearable
                      value={
                        selectedPerson || {
                          value: -0,
                          label: '',
                          timezone: { phone: '', label: '', code: '' },
                        }
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Contact person*'
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='lspId'
                control={control}
                render={({ field: { value, onChange } }) => {
                  const personList =
                    companies?.map(item => ({
                      value: item.id,
                      label: item.name,
                    })) || []
                  const selectedPerson = personList.find(
                    item => item.value === value,
                  )
                  return (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={personList}
                      onChange={(e, v) => {
                        onChange(v.value)
                      }}
                      disableClearable
                      value={selectedPerson || { value: '', label: '' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='LSP*'
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <AddRequestForm
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
                fields={fields}
                remove={remove}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<Icon icon='material-symbols:add' />}
                disabled={!isValid}
                onClick={() => {
                  const contactPerson = getValues('contactPersonId')
                  const timezone = clients?.find(
                    c => c.value === contactPerson,
                  )?.timezone

                  append({
                    name: '',
                    sourceLanguage: '',
                    targetLanguage: '',
                    category: '',
                    serviceType: [],
                    desiredDueDate: '',
                    desiredDueTimezone:
                      timezone !== undefined
                        ? timezone
                        : {
                            phone: '',
                            label: '',
                            code: '',
                          },
                  })
                }}
              >
                <Typography
                  color={!isValid ? 'secondary' : 'primary'}
                  sx={{ textDecoration: 'underline' }}
                >
                  Add new item
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} mb='24px'>
                Notes
              </Typography>
              <Controller
                name='notes'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextField
                      rows={4}
                      multiline
                      fullWidth
                      error={Boolean(errors.notes)}
                      label='Write down a note'
                      value={value ?? ''}
                      onChange={onChange}
                      inputProps={{ maxLength: 500 }}
                    />
                    <Typography variant='body2' mt='12px' textAlign='right'>
                      {value?.length ?? 0}/500
                    </Typography>
                  </>
                )}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* right */}
      <Grid item xs={3}>
        <Card
          style={{
            height: '306px',
            overflow: 'scroll',
            marginBottom: '24px',
          }}
        >
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
                Sample files
              </Typography>
              <Typography variant='body2'>
                {Math.round(fileSize / 100) / 10 > 1000
                  ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
                  : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
                /2 gb
              </Typography>
            </Box>
            <div {...getRootProps({ className: 'dropzone' })}>
              <Button variant='outlined' fullWidth>
                <input {...getInputProps()} />
                Upload files
              </Button>
            </div>
            {files.map((file: FileType, index: number) => {
              return (
                <Box key={file.id}>
                  <FileItem
                    key={file.name}
                    file={file}
                    onClear={handleRemoveFile}
                  />
                </Box>
              )
            })}
          </Box>
        </Card>
        <Card
          sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Button
            fullWidth
            variant='outlined'
            color='secondary'
            onClick={onCancelRequest}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant='contained'
            disabled={!isValid}
            onClick={onRequest}
          >
            Request
          </Button>
        </Card>
      </Grid>
    </Grid>
  )
}

AddNewRequest.acl = {
  subject: 'client_request',
  action: 'read',
}
