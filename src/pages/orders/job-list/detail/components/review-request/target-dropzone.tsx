import { Box, Button, Tooltip, Typography } from '@mui/material'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FileType } from '@src/types/common/file.type'
import { Dispatch, SetStateAction } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { videoExtensions } from '@src/shared/const/upload-file-extention/file-extension'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { Icon } from '@iconify/react'

type Props = {
  setTargetFiles: Dispatch<SetStateAction<FileType[]>>
  setUploadedTargetFiles: Dispatch<SetStateAction<File[]>>
  uploadedTargetFiles: File[]
  targetFiles: FileType[]
  targetFileSize: number
  setTargetFileSize: Dispatch<SetStateAction<number>>
  onFileUploadReject: () => void
  handleRemoveFile: (file: FileType, type: 'source' | 'target') => void
  setTargetFileUpdate: Dispatch<SetStateAction<boolean>>
  type: 'edit' | 'create'
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

const TargetDropzone = ({
  setTargetFiles,
  setUploadedTargetFiles,
  uploadedTargetFiles,
  targetFiles,
  targetFileSize,
  setTargetFileSize,
  onFileUploadReject,
  handleRemoveFile,
  setTargetFileUpdate,
  type,
}: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    noDragEventsBubbling: true,

    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize =
        acceptedFiles.reduce((res, file) => (res += file.size), 0) +
        targetFileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onFileUploadReject()
      } else {
        setUploadedTargetFiles(uploadedTargetFiles.concat(acceptedFiles))
      }
      const uniqueFiles = targetFiles
        .concat(acceptedFiles)
        .reduce((acc: FileType[], file: FileType) => {
          let result = targetFileSize

          acc.concat(file).forEach((file: FileType) => (result += file.size))
          setTargetFileSize(result)
          if (result > MAXIMUM_FILE_SIZE) {
            //  TODO : show exceed file size modal
            onFileUploadReject()
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (!found)
              acc.push({
                id: file.id ?? undefined,
                name: file.name,
                size: file.size,
                type: 'TARGET',
                path: file.path,
                extension: file.extension,
              })

            return acc
          }
        }, [])
      type === 'edit' && setTargetFileUpdate(true)
      setTargetFiles(uniqueFiles)
    },
  })
  return (
    <div
      {...getRootProps({
        className: 'dropzone',
      })}
    >
      <Box
        sx={{
          width: '100%',
          border: '1px dashed #8D8E9A',
          borderRadius: '10px',
          padding: '12px 20px',
          maxHeight: '325px',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 20,
            background: '#CCCCCC',
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
            Drag and drop or
          </Typography>
          <Button variant='outlined' size='small'>
            <input {...getInputProps()} />
            Browse file
          </Button>
        </Box>
        {targetFiles.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: '20px',
              width: '100%',
              gap: '20px',
            }}
          >
            {targetFiles.map((file: FileType, index: number) => {
              return (
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          marginRight: '8px',
                          display: 'flex',
                        }}
                      >
                        <Image
                          src={`/images/icons/file-icons/${
                            videoExtensions.includes(
                              file.name?.split('.').pop()?.toLowerCase() ?? '',
                            )
                              ? 'video'
                              : 'document'
                          }.svg`}
                          alt=''
                          width={32}
                          height={32}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          color: 'rgba(76, 78, 100, 0.54)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        onClick={event => {
                          event.stopPropagation()
                          handleRemoveFile(file, 'target')
                        }}
                      >
                        <Icon icon='mdi:close' fontSize={20} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default TargetDropzone
