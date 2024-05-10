// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  List,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
// ** Icon Imports
import Icon from '@src/@core/components/icon'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** NextJS
import { useRouter } from 'next/router'

// ** Third Party Imports
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from '@src/@core/styles/libs/react-draft-wysiwyg'
import CustomChip from '@src/@core/components/mui/chip'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { styled } from '@mui/system'

// ** contexts

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** form
import { Controller, Resolver, useForm } from 'react-hook-form'

import { useDropzone } from 'react-dropzone'

// ** fetches
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import { useMutation, useQueryClient } from 'react-query'

// ** types
import { S3FileType } from 'src/shared/const/signedURLFileType'

import { toast } from 'react-hot-toast'
import { FormErrors } from 'src/shared/const/formErrors'

import { getFilePath } from 'src/shared/transformer/filePath.transformer'
import {
  certificationTestSchema,
  TestMaterialPostType,
} from 'src/types/schema/certification-test.schema'

import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import _ from 'lodash'
import {
  checkBasicTestExistence,
  PatchFormType,
  patchTest,
  postTest,
  TestFormType,
} from 'src/apis/certification-test.api'
import { RoleSelectType, SelectType } from 'src/types/onboarding/list'
import { JobList } from 'src/shared/const/job/jobs'

import { BasicTestExistencePayloadType } from '@src/types/certification-test/list'
import { useGetTestDetail } from '@src/queries/certification-test/certification-test-detail.query'
import languageHelper from '@src/shared/helpers/language.helper'
import { FileType } from '@src/types/common/file.type'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'

import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { content } from 'html2canvas/dist/types/css/property-descriptors/content'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'

const defaultValues: TestMaterialPostType = {
  testType: 'Basic test',
  googleFormLink: '',
  source: { value: '', label: '' },
  target: { value: '', label: '' },
  jobType: { value: '', label: '' },
  role: { value: '', label: '' },
  // content: null,
  file: [],
}

interface FileProp {
  name: string
  type: string
  size: number
}
const googleFormSA = process.env.NEXT_PUBLIC_CERTIFICATION_GOOGLE_FORM_SA || 'test-801@enough-service-dev.iam.gserviceaccount.com'

const TestMaterialPost = () => {
  const router = useRouter()
  // ** contexts
  const auth = useRecoilValueLoadable(authState)
  const { edit } = router.query
  const { id } = router.query
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  // ** states
  const {
    data: testDetail,
    isFetched,
    refetch,
  } = useGetTestDetail(Number(id), Boolean(edit))
  const [content, setContent] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  const [isDuplicated, setIsDuplicated] = useState(false) //check if the guideline is already exist
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
  const [postFormError, setPostFormError] = useState(false)
  const [uniqueLanguageList, setUniqueLanguageList] = useState<
    {
      value: string
      label: GloLanguageEnum
    }[]
  >([])
  const allLanguage = [{
    value: 'all',
    label: 'All',
  }]

  // ** file values
  const MAXIMUM_FILE_SIZE = FILE_SIZE.CERTIFICATION_TEST

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<
    Array<{ name: string; size: number; fileKey: string }> | []
  >([])
  const [deletedFiles, setDeletedFiles] = useState<Array<FileType> | []>([])

  const [selectedTestType, setSelectedTestType] = useState('Basic test')
  const [jobTypeSelected, setJobTypeSelected] = useState(false)
  const [googleFormLink, setGoogleFormLink] = useState('')

  const testType = ['Basic test', 'Skill test']

  const languageList = getGloLanguage()

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
          acc.concat(file).forEach((file: FileProp) => (result += file.size))
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

  function resetFormSelection() {
    reset({
      source: { label: '', value: '' },
      target: { label: '', value: '' },
      googleFormLink: '',
      testType: 'Basic test',
      jobType: { label: '', value: '' },
      role: { label: '', value: '' },
    })
    setIsDuplicated(false)
    setSelectedTestType('Basic test')
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <Box
      key={uuidv4()}
      sx={{
        boxSizing: 'border-box',
        padding: '10px 12px',
        background: '#F9F8F9',
        border: '1px solid rgba(76, 78, 100, 0.22)',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid container xs={12}>
        <Grid
          item
          xs={2}
          sx={{
            padding: 0,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          />
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              fontWeight: 600,
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {file.name}
          </Box>
          <Typography variant='body2'>{formatFileSize(file.size)}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <Icon icon='mdi:close' fontSize={24} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  ))

  const savedFileList = savedFiles?.map((file: any) => (
    <Box
      key={uuidv4()}
      sx={{
        boxSizing: 'border-box',
        padding: '10px 12px',
        background: '#F9F8F9',
        border: '1px solid rgba(76, 78, 100, 0.22)',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid container xs={12}>
        <Grid
          item
          xs={2}
          sx={{
            padding: 0,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          />
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              fontWeight: 600,
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {file.name}
          </Box>
          <Typography variant='body2'>{formatFileSize(file.size)}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => handleRemoveSavedFile(file)}>
            <Icon icon='mdi:close' fontSize={24} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  ))

  const {
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<TestMaterialPostType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(
      certificationTestSchema,
    ) as Resolver<TestMaterialPostType>,
  })

  const getValid = () => {
    if (isFetched) {
      return (
        !getValues('googleFormLink') ||
        !content.getCurrentContent().getPlainText('\u0001')
      )
    } else {
      return !isValid && !content.getCurrentContent().getPlainText('\u0001')
    }
  }

  useEffect(() => {
    setValue('file', files, { shouldDirty: true, shouldValidate: true })

    let result = 0
    files.forEach((file: FileProp) => (result += file.size))
    savedFiles.forEach(
      (file: { name: string; size: number }) => (result += file.size),
    )
    setFileSize(result)
  }, [files, savedFiles])

  useEffect(() => {
    if (isFetched) {
      setSelectedTestType(
        testDetail?.currentVersion.testType === 'basic'
          ? 'Basic test'
          : 'Skill test',
      )
      setValue(
        'testType',
        testDetail?.currentVersion.testType === 'basic'
          ? 'Basic test'
          : 'Skill test',
      )
      setValue(
        'source',
        testDetail?.currentVersion.testType === 'basic'
          ? { value: '', label: '' }
          : {
              value: testDetail?.currentVersion.source!,
              label: languageHelper(testDetail?.currentVersion.source!)!,
            },
      )
      setValue('target', {
        value: testDetail?.currentVersion.target!,
        label: languageHelper(testDetail?.currentVersion.target!)!,
      })

      setValue('googleFormLink', testDetail?.currentVersion.googleFormLink!)
      if (!_.isEmpty(testDetail?.currentVersion?.content)) {
        const content = convertFromRaw(
          testDetail!.currentVersion.content as any,
        )
        const editorState = EditorState.createWithContent(content)
        setContent(editorState)
      }

      setValue(
        'jobType',
        testDetail?.currentVersion.testType === 'skill'
          ? {
              value: testDetail?.currentVersion.jobType,
              label: testDetail.currentVersion.jobType,
            }
          : { value: '', label: '' },
      )

      setValue(
        'role',
        testDetail?.currentVersion.testType === 'skill'
          ? {
              value: testDetail?.currentVersion.role,
              label: testDetail.currentVersion.role,
            }
          : { value: '', label: '' },
      )

      if (testDetail?.currentVersion?.files.length)
        setSavedFiles(testDetail?.currentVersion.files)
    }
  }, [isFetched])


  useEffect(() => {
    setUniqueLanguageList(_.uniqBy(languageList, 'value'))
  }, [])

  const handleRemoveSavedFile = (file: FileType) => {
    setSavedFiles(savedFiles.filter(item => item.name !== file.name))
    setDeletedFiles([...deletedFiles, file])
  }

  function onDiscard(edit: boolean) {
    openModal({
      type: 'DiscardModal',
      children: (
        <CustomModal
          title={
            edit
              ? 'Are you sure you want to discard all changes?'
              : 'Are you sure you want to discard this test?'
          }
          rightButtonText='Discard'
          vary='error'
          onClose={() => closeModal('DiscardModal')}
          onClick={() => {
            closeModal('DiscardModal')
            edit
              ? router.push(`/certification-test/detail/${id}`)
              : router.push('/certification-test')
          }}
        />
      ),
    })
  }

  function onUpload(edit: boolean) {
    openModal({
      type: 'SubmitModal',
      children: (
        <CustomModal
          title={
            edit
              ? 'Are you sure you want to save all changes?'
              : 'Are you sure you want to upload this test?'
          }
          rightButtonText={edit ? 'Save' : 'Upload'}
          vary='successful'
          onClose={() => closeModal('SubmitModal')}
          onClick={() => {
            closeModal('SubmitModal')
            onSubmit(edit)
          }}
        />
      ),
    })
  }

  const postTestMutation = useMutation((form: TestFormType) => postTest(form), {
    onSuccess: data => {
      console.log(data)

      router.replace(`/certification-test/detail/${data.id}`)
      // refetch()
      // queryClient.invalidateQueries('test-material-list')
      // queryClient.invalidateQueries(['test-detail'])
      resetFormSelection()
      toast.success(`Success`, {
        position: 'bottom-left',
      })
    },
    onError: error => {
      if (error === 'MalformedURL') {
        // toast.error(AxiosErrors.MalformedURL, {
        //   position: 'bottom-left',
        // })
        openModal({
          type: 'MalformedURLModal',
          children: (
            <CustomModal
              onClose={() => closeModal('MalformedURLModal')}
              title={<>Please enter the edit link of the Google form</>}
              vary='error'
              rightButtonText='Okay'
              onClick={() => closeModal('MalformedURLModal')}
              soloButton={true}
            />
          ),
        })
      } else if (error === 'UrlPermission') {
        // toast.error(AxiosErrors.UrlPermission, {
        //   position: 'bottom-left',
        // })
        openModal({
          type: 'UrlPermissionModal',
          children: (
            <CustomModal
              onClose={() => closeModal('UrlPermissionModal')}
              title={<>Unauthorized Google form</>}
              titleSize='large'
              titleStyle='bold'
              body={
                <>
                  Please add the account below to the Google form as an editor.
                  This account is used for the sole purpose of delivering test
                  to Pros and is not used for any other purpose.
                </>
              }
              subtitle={googleFormSA}
              vary='error'
              rightButtonText='Okay'
              onClick={() => closeModal('UrlPermissionModal')}
              soloButton={true}
            />
          ),
        })
      } else {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      }
    },
  })

  const onClickGoogleFormInformation = () => {
    openModal({
      type: 'GoogleFormLinkInfoModal',
      children: (
        <CustomModal
          onClose={() => closeModal('GoogleFormLinkInfoModal')}
          noButton
          closeButton
          title={<>Google form link guideline</>}
          titleSize='large'
          titleStyle='bold'
          body={
            <>
              The link must be an edit link of the Google form.
              <br />
              <br />
              <b>{googleFormSA}</b> account
              must be added to the Google form as an editor. This account is
              used for the sole purpose of delivering test to Pros and is not
              used for any other purpose.
            </>
          }
          vary='info'
          onClick={() => closeModal('GoogleFormLinkInfoModal')}
          rightButtonText='Okay'
        />
      ),
    })
  }

  const patchTestMutation = useMutation(
    (form: PatchFormType) => patchTest(Number(id!), form),
    {
      onSuccess: data => {
        router.push(`/certification-test/detail/${data?.id}`)
        queryClient.invalidateQueries('test-material-list')
        queryClient.invalidateQueries(`test-detail-${id}-${edit}`)
        toast.success('Success', {
          position: 'bottom-left',
        })
      },
      onError: error => {
        if (error === 'MalformedURL') {
          // toast.error(AxiosErrors.MalformedURL, {
          //   position: 'bottom-left',
          // })
          openModal({
            type: 'MalformedURLModal',
            children: (
              <CustomModal
                onClose={() => closeModal('MalformedURLModal')}
                title={<>Please enter the edit link of the Google form</>}
                vary='error'
                rightButtonText='Okay'
                onClick={() => closeModal('MalformedURLModal')}
                soloButton={true}
              />
            ),
          })
        } else if (error === 'UrlPermission') {
          // toast.error(AxiosErrors.UrlPermission, {
          //   position: 'bottom-left',
          // })
          openModal({
            type: 'UrlPermissionModal',
            children: (
              <CustomModal
                onClose={() => closeModal('UrlPermissionModal')}
                title={<>Unauthorized Google form</>}
                titleSize='large'
                titleStyle='bold'
                body={
                  <>
                    Please add the account below to the Google form as an
                    editor. This account is used for the sole purpose of
                    delivering test to Pros and is not used for any other
                    purpose.
                  </>
                }
                subtitle={googleFormSA}
                vary='error'
                rightButtonText='Okay'
                onClick={() => closeModal('UrlPermissionModal')}
                soloButton={true}
              />
            ),
          })
        } else {
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        }
      },
    },
  )
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(value)

      if (value.testType === 'Basic test') {
        if (value.target && value.target.value !== '') {
          const filters: BasicTestExistencePayloadType = {
            company: 'GloZ',
            targetLanguage: value.target.value!,
            testType: 'basic',
          }
          checkBasicTestExistence(filters).then(res => setIsDuplicated(res))
        }
      } else {
        if (
          value.source &&
          value.source.value !== '' &&
          value.jobType &&
          value.jobType.value !== '' &&
          value.role &&
          value.role.value !== '' &&
          value.target &&
          value.target.value !== ''
        ) {
          const filters: BasicTestExistencePayloadType = {
            company: 'GloZ',
            testType: 'skill',
            sourceLanguage: value.source.value!,
            targetLanguage: value.target.value!,
            jobType: value.jobType.value!,
            role: value.role.value!,
          }
          checkBasicTestExistence(filters).then(res => setIsDuplicated(res))
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = (edit: boolean) => {
    if (auth.state === 'hasValue') {
      const data = getValues()
      //** data to send to server */
      const formContent = convertToRaw(content.getCurrentContent())
      const finalValue: TestFormType = {
        company: 'GloZ',
        writer: auth.getValue().user?.username!,
        email: auth.getValue().user?.email!,
        testPaperFormUrl: data.googleFormLink,
        source:
          data.source.value === '' ? data.target.value : data.source.value,
        target: data.target.value,
        testType: data.testType === 'Basic test' ? 'basic' : 'skill',
        jobType: data.jobType.value,
        role: data.role.value,
        content: formContent,
        text: content.getCurrentContent().getPlainText('\u0001'),
      }

      const patchValue: PatchFormType = {
        writer: auth.getValue().user?.username!,
        email: auth.getValue().user?.email!,
        testPaperFormUrl: data.googleFormLink,
        content: formContent,
        text: content.getCurrentContent().getPlainText(`\u0001`),
      }

      const fileInfo: Array<{ name: string; size: number; fileKey: string }> =
        []
      const language =
        data.testType === 'Basic test'
          ? `${data.target.value}`
          : `${data.source.value}-${data.target.value}`

      isFetched
        ? savedFiles?.map(file => {
            fileInfo.push({
              name: file.name,
              size: file.size,
              fileKey: getFilePath(
                [
                  'testPaper',
                  data.testType === 'Basic test' ? 'basic' : 'skill',
                  data.jobType.value,
                  data.role.value,
                  language,
                  `V${testDetail?.currentVersion.version!}`,
                ],
                file.name,
              ),
            })
          })
        : null

      // file upload
      if (data.file?.length) {
        const fileInfo: Array<{ name: string; size: number; fileKey: string }> =
          []
        const language =
          data.testType === 'Basic test'
            ? `${data.target.value}`
            : `${data.source.value}-${data.target.value}`
        const paths: string[] = data?.file?.map(file =>
          getFilePath(
            [
              'testPaper',
              data.testType === 'Basic test' ? 'basic' : 'skill',
              data.jobType.value,
              data.role.value,
              language,
              isFetched ? `V${testDetail?.currentVersion.version!}` : 'V1',
            ],
            file.name,
          ),
        )
        const promiseArr = paths.map((url, idx) => {
          return getUploadUrlforCommon(S3FileType.TEST_GUIDELINE, url).then(
            res => {
              fileInfo.push({
                name: data.file[idx].name,
                size: data.file[idx]?.size,
                fileKey: url,
              })
              return uploadFileToS3(res.url, data.file[idx])
            },
          )
        })
        Promise.all(promiseArr)
          .then(res => {
            finalValue.files = fileInfo
            patchValue.files = fileInfo

            isFetched
              ? patchTestMutation.mutate(patchValue)
              : postTestMutation.mutate(finalValue)
          })
          .catch(err => {
            isFetched
              ? patchTestMutation.mutate(patchValue)
              : postTestMutation.mutate(finalValue)
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            )
          })
      } else {
        patchValue.files = fileInfo
        isFetched
          ? patchTestMutation.mutate(patchValue)
          : postTestMutation.mutate(finalValue)
      }
    }
  }

  useEffect(() => {
    if (isDuplicated && !isFetched) {
      openModal({
        type: 'DuplicatedModal',
        children: (
          <CustomModal
            soloButton
            title={
              <>
                {selectedTestType === 'Basic test' ? (
                  <Typography variant='body2' fontSize={16}>
                    <span style={{ fontWeight: 700 }}>
                      {languageHelper(getValues('target.value'))}&nbsp;
                    </span>
                    {selectedTestType.toLowerCase()} has already been created.
                  </Typography>
                ) : (
                  <Typography variant='body2' fontSize={16}>
                    <span style={{ fontWeight: 700 }}>
                      {`${getValues('jobType.label')}, ${getValues(
                        'role.label',
                      )}, ${getValues('source.value').toUpperCase()}`}
                      &rarr;{getValues('target.value').toUpperCase()}
                    </span>
                    <br />
                    {selectedTestType.toLowerCase()} has already been created.
                  </Typography>
                )}
              </>
            }
            rightButtonText='Okay'
            vary='error'
            onClose={() => closeModal('DuplicatedModal')}
            onClick={() => {
              closeModal('DuplicatedModal')
              resetFormSelection()
            }}
          />
        ),
      })
    }
  }, [isDuplicated])

  return (
    <>
      {patchTestMutation.isLoading ||
      postTestMutation.isLoading ||
      auth.state === 'loading' ? (
        <OverlaySpinner />
      ) : (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
          <Typography variant='h6'>Create test</Typography>

          <form>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Grid xs={9.55} container>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <Card sx={{ padding: '20px', width: '100%' }}>
                    <Grid container xs={12} spacing={6}>
                      <Grid item xs={12}>
                        <Controller
                          name='testType'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <RadioGroup
                              row
                              aria-label='controlled'
                              name='controlled'
                              value={value}
                              onChange={(event, item) => {
                                onChange(item)
                                setSelectedTestType(item)
                                setValue('source', { label: '', value: '' })
                                setValue('target', { label: '', value: '' })
                                setValue('jobType', { label: '', value: '' })
                                setValue('role', { label: '', value: '' })
                                setValue('googleFormLink', '')
                              }}
                            >
                              {testType.map(value => {
                                return (
                                  <FormControlLabel
                                    key={uuidv4()}
                                    disabled={isFetched}
                                    value={value}
                                    control={<Radio />}
                                    label={value}
                                  />
                                )
                              })}
                            </RadioGroup>
                          )}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Controller
                          control={control}
                          name='source'
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              fullWidth
                              value={value}
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              isOptionEqualToValue={(option, newValue) => {
                                return option.value === newValue.value
                              }}
                              disabled={
                                isFetched || selectedTestType === 'Basic test'
                              }
                              options={uniqueLanguageList}
                              id='source'
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.source)}
                                  label={
                                    isFetched ||
                                    selectedTestType === 'Basic test'
                                      ? 'Source'
                                      : 'Source*'
                                  }
                                  // placeholder='Source*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.source && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.source?.label?.message ||
                              errors.source?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={6}>
                        <Controller
                          control={control}
                          name='target'
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              fullWidth
                              // filterSelectedOptions
                              value={value}
                              onChange={(e, v) => {
                                if (!v) onChange({ value: '', label: '' })
                                else onChange(v)
                              }}
                              options={getValues().testType === 'Basic test'
                                ? uniqueLanguageList
                                : [...allLanguage, ...uniqueLanguageList]
                              }
                              id='target'
                              disabled={isFetched}
                              getOptionLabel={option => option.label}
                              isOptionEqualToValue={(option, newValue) => {
                                return option.value === newValue.value
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.target)}
                                  label='Target*'
                                  // placeholder='Target*'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.target && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.target?.label?.message ||
                              errors.target?.value?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                      {selectedTestType === 'Skill test' ? (
                        <>
                          <Grid item xs={6}>
                            <Controller
                              control={control}
                              name='jobType'
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  value={value}
                                  onChange={(e, v) => {
                                    if (!v) {
                                      setRoleOptions(OnboardingListRolePair)
                                      onChange({ value: '', label: '' })
                                      setJobTypeSelected(false)
                                    } else {
                                      const jobTypeValue = v.value
                                      const res = OnboardingListRolePair.filter(
                                        value =>
                                          value.jobType.includes(jobTypeValue),
                                      )
                                      setRoleOptions(res)
                                      setJobTypeSelected(true)
                                      onChange(v)
                                    }
                                  }}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  disabled={isFetched}
                                  options={jobTypeOptions}
                                  id='jobType'
                                  getOptionLabel={option => option.label}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      autoComplete='off'
                                      error={Boolean(errors.jobType)}
                                      label='Job type*'
                                      // placeholder='Job type*'
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
                          <Grid item xs={6}>
                            <Controller
                              control={control}
                              name='role'
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  // filterSelectedOptions
                                  value={value}
                                  onChange={(e, v) => {
                                    if (!v) onChange({ value: '', label: '' })
                                    else onChange(v)
                                  }}
                                  options={roleOptions}
                                  disabled={!jobTypeSelected || isFetched}
                                  id='role'
                                  getOptionLabel={option => option.label}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      autoComplete='off'
                                      error={Boolean(errors.role)}
                                      label='Role*'
                                      // placeholder='Target*'
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
                        </>
                      ) : null}
                      <Grid item xs={12}>
                        <IconButton
                          onClick={() => {
                            onClickGoogleFormInformation()
                          }}
                          sx={{ padding: '0px' }}
                        >
                          <img src='/images/icons/info.svg' alt='more' />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12} mb='20px'>
                        <Controller
                          name='googleFormLink'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <FormControl fullWidth>
                                <InputLabel
                                  htmlFor='icons-adornment-password'
                                  error={!!errors.googleFormLink}
                                >
                                  Google form link*
                                </InputLabel>
                                <OutlinedInput
                                  label='Google form link*'
                                  value={value}
                                  id='icons-adornment-password'
                                  onChange={event => {
                                    onChange(event.target.value)
                                    setGoogleFormLink(event.target.value)
                                  }}
                                  error={!!errors.googleFormLink}
                                  type='text'
                                  placeholder='https://docs.google.com/forms'
                                  endAdornment={
                                    <InputAdornment position='end'>
                                      <IconButton
                                        edge='end'
                                        aria-label='toggle password visibility'
                                        onClick={() => {
                                          googleFormLink &&
                                            !errors.googleFormLink &&
                                            window.open(
                                              googleFormLink,
                                              '_blank',
                                            )
                                        }}
                                      >
                                        <OpenInNewIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            </>
                          )}
                        />
                        {errors.googleFormLink && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.googleFormLink?.message}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Card>

                  <Card sx={{ padding: '20px' }}>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      mb='20px'
                    >
                      <Typography variant='h6'>Test guideline*</Typography>
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
                    <Divider sx={{ mb: 2 }} />
                    <StyledEditor
                      error={
                        !content.getCurrentContent().getPlainText('\u0001') &&
                        showError
                      }
                      minHeight={17}
                    >
                      <ReactDraftWysiwyg
                        editorState={content}
                        placeholder={`Write down a test guideline or attach it as a file. \n This guideline will be delivered to Pros when they take the test.`}
                        onEditorStateChange={data => {
                          // console.log(data)

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
                    </StyledEditor>
                  </Card>
                </Box>
              </Grid>
              <Grid container xs={2.45}>
                <Box sx={{ width: '100%' }}>
                  <Card>
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
                          Test guideline file
                        </Typography>
                        <Typography variant='body2'>
                          {formatFileSize(fileSize)}/{' '}
                          {byteToMB(MAXIMUM_FILE_SIZE)}
                        </Typography>
                      </Box>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <Button variant='outlined' fullWidth>
                          <input {...getInputProps()} />
                          Upload files
                        </Button>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        padding: '0 20px',
                        overflow: 'scroll',

                        height: '454px',

                        marginBottom: '12px',

                        '&::-webkit-scrollbar': { display: 'none' },
                      }}
                    >
                      {testDetail?.currentVersion?.files?.length ? (
                        <List
                          sx={{
                            paddingBottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            marginBottom: 1,
                          }}
                        >
                          {savedFileList}
                        </List>
                      ) : null}
                      {files.length ? (
                        <Fragment>
                          <List
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                            }}
                          >
                            {fileList}
                          </List>
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
                      {isFetched ? (
                        <>
                          <Button
                            variant='outlined'
                            color='secondary'
                            onClick={() => onDiscard(true)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant='contained'
                            onClick={() => onUpload(true)}
                            disabled={getValid()}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant='outlined'
                            color='secondary'
                            onClick={() => onDiscard(false)}
                          >
                            Discard
                          </Button>
                          <Button
                            variant='contained'
                            onClick={() => onUpload(false)}
                            disabled={
                              !isValid ||
                              !content
                                .getCurrentContent()
                                .getPlainText('\u0001')
                            }
                          >
                            Upload
                          </Button>
                        </>
                      )}
                    </Box>
                  </Card>
                </Box>
              </Grid>
            </Box>
          </form>
        </Box>
      )}
    </>
  )
}

export default TestMaterialPost

TestMaterialPost.acl = {
  action: 'create',
  subject: 'certification_test',
}

const StyledEditor = styled(EditorWrapper)<{
  error?: boolean
  maxHeight?: boolean
  minHeight?: number
}>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
    min-height: ${({ minHeight }) =>
      minHeight ? `${minHeight}rem !important` : '10rem'};
    max-height: ${({ maxHeight }) => (maxHeight ? `300px` : '800px')};
  }
`
const FileList = styled('div')`
  width: 100%;
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  .file-details {
    width: 85%;
    display: flex;
    align-items: center;
    border: 1px solid;
  }

  .close-button {
    display: flex;
    align-items: center;
    width: 15%;
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

  .file-info {
    width: 100%;
    border: 1px solid;
  }

  .file-name {
    width: 100%;
    font-weight: 600;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
