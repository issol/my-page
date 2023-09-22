import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  FileBox,
  FileName,
} from '@src/pages/invoice/receivable/detail/components/invoice-info'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { authState } from '@src/states/auth'
import { JobsFileType, ProJobDeliveryType } from '@src/types/jobs/jobs.type'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  delivery: Array<ProJobDeliveryType>

  downloadAllFiles: (files: Array<JobsFileType> | [] | undefined) => void
  downloadOneFile: (file: JobsFileType) => void
}
const Deliveries = ({ delivery, downloadAllFiles, downloadOneFile }: Props) => {
  const auth = useRecoilValueLoadable(authState)

  function getFileSize(files: Array<JobsFileType> | [] | undefined) {
    if (!files || !files.length) return 0
    /* @ts-ignore */
    return files.reduce((acc: number, file: JobsFileType) => acc + file.size, 0)
  }

  console.log(delivery)

  return (
    <>
      {delivery.map(value => {
        return (
          <Card
            key={uuidv4()}
            sx={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <Typography variant='body1' fontWeight={600} fontSize={14}>
                  {FullDateTimezoneHelper(
                    value.deliveredDate,
                    auth.getValue().user?.timezone,
                  )}
                </Typography>
              </Box>
            </Box>
            {value.files.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='caption'>
                    {formatFileSize(getFileSize(value.files))}
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles(value.files)}
                  >
                    Download all
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    width: '100%',
                    gap: '20px',
                  }}
                >
                  {value.files.map(file => (
                    <Box key={uuidv4()} sx={{ marginTop: '5px' }}>
                      <FileBox>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ marginRight: '8px', display: 'flex' }}>
                            <Icon
                              icon='material-symbols:file-present-outline'
                              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
                              fontSize={24}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Tooltip title={file.name}>
                              <FileName variant='body1'>{file.name}</FileName>
                            </Tooltip>

                            <Typography variant='caption' lineHeight={'14px'}>
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>

                        <IconButton
                          onClick={() => downloadOneFile(file)}
                          // disabled={jobInfo.status === 'Declined'}
                          // disabled={isFileUploading || !isUserInTeamMember}
                        >
                          <Icon icon='mdi:download' fontSize={24} />
                        </IconButton>
                      </FileBox>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  padding: '20px',
                  background: '#F9F8F9',
                  borderRadius: '10px',
                }}
              >
                <Typography variant='body2'>No target files</Typography>
              </Box>
            )}
            <Divider />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <Typography variant='body1' fontWeight={600}>
                Notes to LPM
              </Typography>
              <Typography>{value.note ?? '-'}</Typography>
            </Box>
          </Card>
        )
      })}
    </>
  )
}
export default Deliveries
