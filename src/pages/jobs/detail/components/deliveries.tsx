import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'

import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { JobsFileType, ProJobDeliveryType } from '@src/types/jobs/jobs.type'
import { Dispatch, SetStateAction } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Image from 'next/image'

import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'

type Props = {
  delivery: Array<ProJobDeliveryType>

  downloadAllFiles: (files: Array<JobsFileType> | [] | undefined) => void
  downloadOneFile: (file: JobsFileType) => void
  expanded: string | false
  setExpanded: Dispatch<SetStateAction<string | false>>
}
const Deliveries = ({
  delivery,
  downloadAllFiles,
  downloadOneFile,
  expanded,
  setExpanded,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  function getFileSize(files: Array<JobsFileType> | [] | undefined) {
    if (!files || !files.length) return 0
    /* @ts-ignore */
    return files.reduce(
      (acc: number, file: JobsFileType) => acc + Number(file.size),
      0,
    )
  }

  return (
    <Box
      sx={{
        '& .Mui-expanded .MuiAccordion-rounded': {
          borderTop: '1px solid #D8D8DD !important',
          margin: '0 !important',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {delivery.map(value => {
        return (
          <Accordion
            key={uuidv4()}
            expanded={expanded === value.id.toString()}
            onChange={handleChange(value.id.toString())}
            sx={{
              borderRadius: '10px !important',
              boxShadow: 'none !important',
              border: '1px solid #D8D8DD',
              margin: '0 !important',
            }}
            disableGutters
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                padding:
                  expanded === value.id.toString() ? '20px' : '12px 20px',
                background: '#F7F8FF',
                '& .MuiAccordionSummary-content': {
                  margin: 0,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                  paddingRight: '32px',
                }}
              >
                <Typography variant='body1' fontWeight={600} fontSize={14}>
                  {convertTimeToTimezone(
                    value.deliveredDate,
                    auth.getValue().user?.timezone,
                    timezone.getValue(),
                  )}
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
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '20px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                {value.files.length > 0 ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      width: '100%',
                      gap: '20px',
                      mt: '20px',
                    }}
                  >
                    {value.files.map(file => {
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
                                  src={`/images/icons/file-icons/${extractFileExtension(
                                    file.name,
                                  )}.svg`}
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

                                <Typography
                                  variant='caption'
                                  lineHeight={'14px'}
                                >
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                onClick={() => {
                                  downloadOneFile(file)
                                }}
                                sx={{ padding: 0 }}
                              >
                                <Icon icon='ic:sharp-download' />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: '20px',
                      padding: '20px',
                      background: '#F9F8F9',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography variant='body2'>No target files</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    background: '#F7F7F9',
                    borderRadius: '10px',
                    padding: '20px',
                  }}
                >
                  <Typography fontSize={14} fontWeight={400}>
                    {value.note ?? '-'}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          // <Card
          //   key={uuidv4()}
          //   sx={{
          //     padding: '24px',
          //     display: 'flex',
          //     flexDirection: 'column',
          //     gap: '20px',
          //   }}
          // >
          //   <Box sx={{ display: 'flex', gap: '20px' }}>
          //     <Box
          //       sx={{
          //         display: 'flex',
          //         flexDirection: 'column',
          //         gap: '3px',
          //       }}
          //     >
          //       <Typography variant='body1' fontWeight={600} fontSize={14}>
          //         {convertTimeToTimezone(
          //           value.deliveredDate,
          //           auth.getValue().user?.timezone,
          //           timezone.getValue(),
          //         )}
          //       </Typography>
          //     </Box>
          //   </Box>
          //   {value.files.length > 0 ? (
          //     <Box
          //       sx={{
          //         display: 'flex',
          //         flexDirection: 'column',
          //         gap: '12px',
          //       }}
          //     >
          //       <Box
          //         sx={{
          //           display: 'flex',
          //           gap: '20px',
          //           alignItems: 'center',
          //         }}
          //       >
          //         <Typography variant='caption'>
          //           {formatFileSize(getFileSize(value.files))}
          //         </Typography>
          //         <Button
          //           variant='outlined'
          //           size='small'
          //           startIcon={<Icon icon='mdi:download' />}
          //           onClick={() => downloadAllFiles(value.files)}
          //         >
          //           Download all
          //         </Button>
          //       </Box>
          //       <Box
          //         sx={{
          //           display: 'grid',
          //           gridTemplateColumns: 'repeat(3, 1fr)',
          //           width: '100%',
          //           gap: '20px',
          //         }}
          //       >
          //         {value.files.map(file => (
          //           <Box key={uuidv4()} sx={{ marginTop: '5px' }}>
          //             <FileBox>
          //               <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //                 <Box sx={{ marginRight: '8px', display: 'flex' }}>
          //                   <Icon
          //                     icon='material-symbols:file-present-outline'
          //                     style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          //                     fontSize={24}
          //                   />
          //                 </Box>
          //                 <Box
          //                   sx={{
          //                     display: 'flex',
          //                     flexDirection: 'column',
          //                   }}
          //                 >
          //                   <Tooltip title={file.name}>
          //                     <FileName variant='body1'>{file.name}</FileName>
          //                   </Tooltip>

          //                   <Typography variant='caption' lineHeight={'14px'}>
          //                     {formatFileSize(file.size)}
          //                   </Typography>
          //                 </Box>
          //               </Box>

          //               <IconButton
          //                 onClick={() => downloadOneFile(file)}
          //                 // disabled={jobInfo.status === 'Declined'}
          //                 // disabled={isFileUploading || !isUserInTeamMember}
          //               >
          //                 <Icon icon='mdi:download' fontSize={24} />
          //               </IconButton>
          //             </FileBox>
          //           </Box>
          //         ))}
          //       </Box>
          //     </Box>
          //   ) : (
          //     <Box
          //       sx={{
          //         padding: '20px',
          //         background: '#F9F8F9',
          //         borderRadius: '10px',
          //       }}
          //     >
          //       <Typography variant='body2'>No target files</Typography>
          //     </Box>
          //   )}
          //   <Divider />
          //   <Box
          //     sx={{
          //       display: 'flex',
          //       flexDirection: 'column',
          //       gap: '10px',
          //     }}
          //   >
          //     <Typography variant='body1' fontWeight={600}>
          //       Notes to LPM
          //     </Typography>
          //     <Typography>{value.note ?? '-'}</Typography>
          //   </Box>
          // </Card>
        )
      })}
    </Box>
  )
}
export default Deliveries
