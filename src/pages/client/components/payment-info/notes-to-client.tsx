import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { AuthContext } from '@src/shared/auth/auth-provider'
import useModal from '@src/hooks/useModal'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { DeliveryFileType } from '@src/types/orders/order-detail'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import NotesToClientForm from './notes-to-client-form'
import { FileType } from '@src/types/common/file.type'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import toast from 'react-hot-toast'
import {
  getFilePath,
  getNotesToClientFilePath,
} from '@src/shared/transformer/filePath.transformer'
import { useMutation, useQueryClient } from 'react-query'
import {
  createNotesToClient,
  createNotesToClientFiles,
  deleteNotesToClientFiles,
  updateNotesToClient,
} from '@src/apis/client.api'

type Props = {
  notesToClient: {
    id?: number
    note: string | null
    file: FileType[]
  }
  clientId: number
}
const NotesToClient = ({ notesToClient, clientId }: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.NOTES_TO_CLIENT
  const queryClient = useQueryClient()

  const { user } = useRecoilValue(authState)
  const [savedFiles, setSavedFiles] = useState<FileType[]>(notesToClient.file)

  const { openModal, closeModal } = useModal()

  const notesToClientMutation = useMutation(
    (note: string | null) => updateNotesToClient(clientId, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientPaymentInfo'])
      },
    },
  )
  const notesToClientFilesMutation = useMutation(
    (files: FileType[]) => createNotesToClientFiles(clientId, files),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientPaymentInfo'])
      },
    },
  )

  const deleteNotesToClientFilesMutation = useMutation(
    (fileId: number) => deleteNotesToClientFiles(fileId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['clientPaymentInfo'])
      },
    },
  )

  async function uploadFiles(
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
  ): Promise<[Promise<void>[], FileType[]]> {
    const fileInfo: FileType[] = []
    const paths: string[] = files?.map(file =>
      getNotesToClientFilePath(clientId, file.name),
    )

    const promiseArr: Promise<void>[] = paths.map(async (url, idx) => {
      try {
        const res = await getUploadUrlforCommon(S3FileType.TAX_INVOICE, url)
        fileInfo.push({
          // type: 'uploaded',
          file: url,
          name: files[idx].name,
          type: files[idx].type,
          size: files[idx].size,
        })
        await uploadFileToS3(res.url, files[idx])
      } catch (error) {
        onError()
      }
    })

    await Promise.all(promiseArr)
      .then(res => {
        // logger.debug('upload client guideline file success :', res)
        notesToClientFilesMutation.mutate(fileInfo)
        // updateProject.mutate({ deliveries: fileInfo })
        // updateDeliveries.mutate(fileInfo)
        setFiles([])
        closeModal('EditNotesToClientModal')
        // setImportedFiles([])
      })
      .catch(err =>
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        ),
      )

    return [promiseArr, fileInfo]
  }

  const onClickSaveNotesToClient = (
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
    note: string | null,
    deletedFiles: FileType[],
  ) => {
    if (files.length > 0) {
      uploadFiles(files, setFiles)
    }
    if (deletedFiles.length > 0) {
      deletedFiles.forEach(item =>
        deleteNotesToClientFilesMutation.mutate(item.id!, {
          onError: () => {
            onError()
          },
          onSuccess: () => {
            closeModal('EditNotesToClientModal')
          },
        }),
      )
    }

    notesToClientMutation.mutate(note, {
      onSuccess: () => {
        closeModal('EditNotesToClientModal')
      },
    })
  }

  const onClickEditNotesToClient = () => {
    openModal({
      type: 'EditNotesToClientModal',
      children: (
        <NotesToClientForm
          onClose={() => closeModal('EditNotesToClientModal')}
          clientNotes={notesToClient}
          onClickSaveNotesToClient={onClickSaveNotesToClient}
        />
      ),
    })
  }

  function fetchFile(file: FileType) {
    getDownloadUrlforCommon(S3FileType.NOTES_TO_CLIENT, file.file!).then(
      res => {
        fetch(res.url, { method: 'GET' })
          .then(res => {
            return res.blob()
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${file.name}`
            document.body.appendChild(a)
            a.click()
            setTimeout((_: any) => {
              window.URL.revokeObjectURL(url)
            }, 60000)
            a.remove()
          })
          .catch(err =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      },
    )
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  function downloadOneFile(file: FileType) {
    fetchFile(file)
  }

  function downloadAllFiles(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file)
    })
  }

  const fileSize = useMemo(() => {
    if (notesToClient?.file.length > 0) {
      return notesToClient.file.reduce((res, { size }) => (res += size), 0)
    }
    return 0
  }, [notesToClient])

  const savedFileList = savedFiles?.map((file: FileType) => (
    <Box key={uuidv4()}>
      <Box
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
      </Box>
    </Box>
  ))

  useEffect(() => {
    setSavedFiles(notesToClient.file)
  }, [notesToClient.file])

  return (
    <Card sx={{ padding: '24px' }}>
      <Box display='flex' flexDirection='column'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Typography variant='h6'>Notes to client</Typography>
            <Button
              variant='outlined'
              sx={{
                height: '34px',
              }}
              startIcon={<Icon icon='mdi:download' />}
              onClick={() => downloadAllFiles(notesToClient?.file)}
              disabled={!notesToClient?.file?.length}
              // onClick={() => downloadAllFiles(currentVersion?.files)}
            >
              Download all
            </Button>
          </Box>
          <IconButton onClick={onClickEditNotesToClient}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        </Box>

        <Typography variant='body2'>
          {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        {savedFileList.length > 0 && (
          <Box sx={{ padding: '20px 0' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,1fr)',
                gridGap: '16px',
              }}
            >
              {savedFileList}
            </Box>
          </Box>
        )}

        <Divider />
        <Box>
          <Typography variant='body1'>{notesToClient.note ?? '-'}</Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default NotesToClient
