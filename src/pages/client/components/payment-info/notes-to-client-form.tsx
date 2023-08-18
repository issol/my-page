import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import useModal from '@src/hooks/useModal'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import SimpleAlertModal from '../modals/simple-alert-modal'
import { FileType } from '@src/types/common/file.type'
import { v4 as uuidv4 } from 'uuid'
import { isEqual } from 'lodash'

type Props = {
  onClose: any
  clientNotes: {
    id?: number
    note: string | null
    file: FileType[]
  }
  onClickSaveNotesToClient: (
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
    note: string | null,
    deletedFiles: Array<FileType>,
  ) => void
}

const NotesToClientForm = ({
  onClose,
  clientNotes,
  onClickSaveNotesToClient,
}: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.NOTES_TO_CLIENT
  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<FileType[]>(clientNotes.file)
  const [deletedFiles, setDeletedFiles] = useState<Array<FileType>>([])

  const { openModal, closeModal } = useModal()
  const [note, setNote] = useState<string | null>(clientNotes.note)

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
          message={`The maximum file size you can upload is ${byteToMB(
            MAXIMUM_FILE_SIZE,
          )}.`}
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

  const handleRemoveSavedFile = (file: FileType) => {
    setSavedFiles(savedFiles.filter(item => item.name !== file.name))
    setDeletedFiles([...deletedFiles, file])
  }

  const saveButtonDisableCheck = () => {
    const isNoteChanged = clientNotes.note !== note
    const isFileChanged =
      !isEqual(clientNotes.file, files) || deletedFiles.length > 0

    if (isNoteChanged || isFileChanged) {
      return false
    } else {
      return true
    }
  }

  const fileList = files.map((file: FileType) => (
    <Box
      key={uuidv4()}
      sx={{
        display: 'flex',
        marginBottom: '8px',
        width: '100%',
        justifyContent: 'space-between',
        borderRadius: '8px',
        padding: '10px 12px',
        border: '1px solid rgba(76, 78, 100, 0.22)',
        background: '#f9f8f9',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: '8px', display: 'flex' }}>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
            fontSize={24}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Tooltip title={file.name}>
            <Typography
              variant='body1'
              fontSize={14}
              fontWeight={600}
              lineHeight={'20px'}
              sx={{
                overflow: 'hidden',
                wordBreak: 'break-all',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {file.name}
            </Typography>
          </Tooltip>
          <Typography variant='caption' lineHeight={'14px'}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>
      </Box>
      <IconButton>
        <Icon
          icon='mdi:close'
          fontSize={24}
          onClick={() => handleRemoveFile(file)}
        />
      </IconButton>
    </Box>
  ))
  const savedFileList = savedFiles.map((file: FileType) => (
    <Box
      key={uuidv4()}
      sx={{
        display: 'flex',
        marginBottom: '8px',
        width: '100%',
        justifyContent: 'space-between',
        borderRadius: '8px',
        padding: '10px 12px',
        border: '1px solid rgba(76, 78, 100, 0.22)',
        background: '#f9f8f9',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: '8px', display: 'flex' }}>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
            fontSize={24}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Tooltip title={file.name}>
            <Typography
              variant='body1'
              fontSize={14}
              fontWeight={600}
              lineHeight={'20px'}
              sx={{
                overflow: 'hidden',
                wordBreak: 'break-all',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {file.name}
            </Typography>
          </Tooltip>
          <Typography variant='caption' lineHeight={'14px'}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>
      </Box>
      <IconButton>
        <Icon
          icon='mdi:close'
          fontSize={24}
          onClick={() => handleRemoveSavedFile(file)}
        />
      </IconButton>
    </Box>
  ))

  useEffect(() => {
    let result = 0
    files.forEach((file: FileType) => (result += file.size))

    savedFiles.forEach((file: FileType) => (result += file.size))
    setFileSize(result)
  }, [files, savedFiles])

  return (
    <Card sx={{ padding: '50px 60px', width: '820px' }}>
      <Box display='flex' flexDirection='column'>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Typography variant='h6'>Notes to client</Typography>
          <div {...getRootProps({ className: 'dropzone' })}>
            <Button
              variant='contained'
              sx={{
                height: '34px',
              }}
              // startIcon={<Icon icon='mdi:download' />}
              // onClick={() => downloadAllFiles(currentVersion?.files)}
            >
              <input {...getInputProps()} />
              Upload files
            </Button>
          </div>
        </Box>
        <Typography variant='body2'>
          {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
        </Typography>
      </Box>
      {(fileList && fileList.length) || (savedFileList && savedFiles.length) ? (
        <Box sx={{ padding: '20px 0' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gridGap: '16px',
            }}
          >
            {fileList}
            {savedFileList}
          </Box>
        </Box>
      ) : null}

      <Divider />
      <Box sx={{ padding: '20px 0' }}>
        <TextField
          fullWidth
          placeholder='Upload a file or write down a payment information of your company. It will be delivered to the client.'
          multiline
          rows={4}
          value={note}
          onChange={e => {
            if (e.target.value === '') {
              setNote(null)
            } else setNote(e.target.value)
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() =>
            onClickSaveNotesToClient(files, setFiles, note, deletedFiles)
          }
          disabled={saveButtonDisableCheck()}
        >
          Save
        </Button>
      </Box>
    </Card>
  )
}

export default NotesToClientForm
