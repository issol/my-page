import { Icon } from '@iconify/react'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  TextField,
  Typography,
  ButtonBase,
} from '@mui/material'
import { ServiceTypeChip, assignmentStatusChip } from '@src/@core/components/chips/chips'

import { useGetStatusList } from '@src/queries/common.query'
import { useGetMessage } from '@src/queries/order/job.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { JobAssignProRequestsType, JobPricesDetailType, JobRequestsProType } from '@src/types/jobs/jobs.type'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState, useRef, Fragment, KeyboardEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from '@src/@core/components/mui/chip'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useMutation } from 'react-query'
import { readMessage, sendMessage } from '@src/apis/jobs/job-detail.api'
import { JobType } from '@src/types/common/item.type'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { toast } from 'react-hot-toast'
import { is } from 'immutable'

type Props = {
  jobId: number
  jobRequestId?: number | null
  info: {
    userId: number
    firstName: string
    middleName: string | null
    lastName: string
  }
  messageType: 'request' | 'job'
  sendFrom: 'LPM' | 'PRO'
  jobDetail?: {
    jobId: number;
    jobInfo: JobType | undefined;
    jobPrices: JobPricesDetailType | undefined;
    jobAssign: JobAssignProRequestsType[];
    jobAssignDefaultRound: number;
  }[]
  status?: number
  jobName?: string
  isUpdatable: boolean
  onClose: () => void
}

const Message = ({ 
  jobId, 
  jobRequestId, 
  info, 
  messageType, 
  sendFrom, 
  jobDetail,
  status,
  isUpdatable,
  jobName,
  onClose 
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [message, setMessage] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<number>(jobId)
  const [selectedJobProId, setSelectedJobProId] = useState<number>(info.userId)

  const jobTerminatedStatuses = [601000, 70200, 70400, 70450, 70500, 70600]

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const scrollRef = useRef<HTMLDivElement>(null); 

  const {
    data: messageList,
    isLoading: messageListLoading,
    refetch: messageRefetch,
  } = useGetMessage(selectedJobId, selectedJobProId, sendFrom === 'PRO' ? 'all' : messageType)

  const { data: jobAssignmentStatusList } = useGetStatusList('JobAssignment')

  const sendMessageToProMutation = useMutation(
    (data: { jobId: number; proId: number; message: string }) => 
      (messageType === 'request' && jobRequestId)
        ? sendMessage(data.jobId, jobRequestId, data.proId, data.message)
        : sendMessage(data.jobId, 0, data.proId, data.message),
    {
      onSuccess: () => {
        toast.success('Sent successfully', {
          position: 'bottom-left',
        })
      },
      onError: (error: any) => {
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        )
      },
    },
  )

  const readMessageMutation = useMutation(
    (data: { jobId: number; proId: number; type: string }) => 
      readMessage(data.jobId, data.proId, data.type),
    {
      onSuccess: () => {
        refetchMessage()
      },
      onError: (error: any) => {

      },
    },
  )

  const refetchMessage = () => {
    messageRefetch().then(() => {
      setMessage('')
      scrollToBottom()
    })
  }

  const handleSendMessage = () => {
    sendMessageToProMutation.mutateAsync({
      jobId: selectedJobId,
      proId: selectedJobProId,
      message: message,
    }).then(() => {
      // 메세지를 보낸 후 읽음 처리한다.
      handleReadMessage()
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      handleSendMessage()  // Shift + Enter가 눌렸을 때 handleClick 함수를 호출
    }
  };

  const scrollToBottom = () => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 200) // 스크롤 타이밍 조정

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }

  const isMessageUsable = () => {
    // status를 체크해서 메세지 보내는 창을 컨트롤 한다.
    if (!isUpdatable) return false

    if (messageType === 'request') { 
      if (sendFrom === 'LPM') {
        return jobDetail && !jobDetail?.some((value) => value.jobId === selectedJobId && value.jobInfo?.pro)
      } else {
        return status && !jobTerminatedStatuses.includes(status)
      }
    } else {
      if (sendFrom === 'LPM') {
        const selectedJob = jobDetail?.find((value) => value.jobId === selectedJobId)
        const selectedJobStatus = selectedJob?.jobInfo?.status
        return selectedJobStatus && !jobTerminatedStatuses.includes(selectedJobStatus)
      } else {
        return status && !jobTerminatedStatuses.includes(status)
      }
    }
  }

  const handleReadMessage = () => {
    // job에 contact person이 나일때만 읽음 처리한다.
    if (sendFrom === 'LPM' && messageType === 'job' && jobDetail) {
      const selectedJob = jobDetail?.find((value) => value.jobId === selectedJobId)
      if (selectedJob?.jobInfo?.contactPerson?.userId === auth.getValue()?.user?.id) {
        readMessageMutation.mutate({
          jobId: selectedJobId,
          proId: selectedJobProId,
          type: messageType,
        })
      }
    } else {
      readMessageMutation.mutate({
        jobId: selectedJobId,
        proId: selectedJobProId,
        type: sendFrom === 'PRO' ? 'all' : messageType,
      })
    }
  }
  useEffect(() => {
    // LPM에서 메세지 탭을 변경할때 메세지를 읽음 처리 한다.
    handleReadMessage()
    refetchMessage()
  }, [selectedJobId])

  useEffect(() => {
    refetchMessage()
  }, [messageRefetch])

  useEffect(() => {
    // 메세지 컴포넌트가 열릴때 메세지를 읽음 처리 한다.
    handleReadMessage()
    scrollToBottom()
  }, []);
  
  return (
    <Box
      sx={{
        maxWidth: 
          sendFrom === 'LPM' && messageType === 'job'
            ? '648px'
            : '483px',
        height: '709px', // 화면 높이가 709px보다 큰 경우 709px, 그렇지 않으면 80vh
        maxHeight: '709px', // 최대 높이 709px로 제한
        width: '100%',
        overflowY: 'scroll',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        display: 'flex',
      }}
    >
      {messageListLoading && (<OverlaySpinner />)}
      {(sendFrom === 'LPM' && messageType === 'job' && jobDetail) && (
        <Box
          sx={{ 
            width: '165px',
            overflowY: 'auto', 
            flex: 'none', 
            borderRight: '1px solid #E9EAEC',
            
          }}
        >
          {jobDetail.map((value, index) => {
            return value.jobInfo?.pro && (
              <Box
                key={index}
                sx={{
                  height: '89px',
                  padding: '20px',
                  gap: '4px',
                  cursor: 'pointer',
                  background:
                    value.jobId === selectedJobId
                      ? 'rgba(76, 78, 100, 0.05)'
                      : 'inherit',
                }}
                onClick={(v) => {               
                  setSelectedJobId(value.jobId)
                  setSelectedJobProId(value.jobInfo?.pro?.id ?? 0)
                }}
              >
                <Typography fontSize={14}>
                  {value?.jobInfo?.corporationId}
                </Typography>
                <ServiceTypeChip label={value?.jobInfo?.serviceType} />
              </Box>)
          })}
        </Box>
      )}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          position: 'relative',
          minHeight: '709px',
        }}
        ref={scrollRef}
      >
        <Box
          sx={{
            padding: '32px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E5E4E4',
            position: 'sticky',
            top: 0,
            backgroundColor: '#FFF',
            height: '101px',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
            <Image
              src='/images/icons/order-icons/message.svg'
              width={50}
              height={50}
              alt=''
              quality={100}
            />
            {sendFrom === 'LPM' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                  <Typography fontSize={20} fontWeight={500} color={'#4C4E64'}>
                    {getLegalName({
                      firstName: info.firstName,
                      middleName: info.middleName,
                      lastName: info.lastName,
                    })}
                  </Typography>
                  {sendFrom === 'LPM' && messageType === 'request' && assignmentStatusChip(70000, jobAssignmentStatusList!)}
                </Box>
                <Typography color={'#8D8E9A'} fontSize={14}>{messageList?.proInfo.email}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography fontSize={20} fontWeight={500} color={'#4C4E64'}>{jobName}</Typography>
              </Box>
            )
            }
          </Box>
          <IconButton
            sx={{ padding: 0, height: 'fit-content' }}
            onClick={onClose}
          >
            <Icon icon='mdi:close'></Icon>
          </IconButton>
        </Box>
        <Box sx={{ minHeight: '430px' }}>
        {messageList &&
        messageList.contents &&
        messageList.contents.length > 0 ? (
          <>
            {messageList.contents.map((item, index) => (
              item.messageType === 'system' ? (
                <Box
                  key={uuidv4()}
                  sx={{
                    height: '37px',
                    backgroundColor: '#EEFBE5',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center', // Add this line
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src='/images/icons/job-icons/add.svg'
                      alt=''
                      width={20}
                      height={20}
                      quality={100}
                    />
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      color='#4C4E64'
                      textAlign='center'
                    >
                      {item.content}
                    </Typography>
                  </Box>
                </Box>
              ) : (
              <Box
                key={uuidv4()}
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderBottom: 
                    messageList.contents && 
                    index+1 <= messageList.contents?.length-1 && 
                    messageList.contents?.[index+1].messageType === 'system' 
                      ? 'none'
                      : '1px solid #E9EAEC',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                      {!item.isPro ? (
                        <CustomChip
                          label={'LPM'}
                          skin='light'
                          sx={{
                            background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #21AEDB`,
                            color: '#21AEDB',
                            maxWidth: 48,
                          }}
                          size='small'
                        />
                      ): null}
                      <Typography
                        fontWeight={600}
                        fontSize={14}
                        color={!item.isPro ? '#666CFF' : 'rgba(76, 78, 100, 0.87)'}
                      >
                        {getLegalName({
                          firstName: item.firstName,
                          middleName: item.middleName,
                          lastName: item.lastName,
                        })}
                        {!item.isPro ? '(Me)' : ''}
                      </Typography>
                    </Box>
                    <Typography fontSize={12} fontWeight={400} color='#4C4E6499'>
                      {convertTimeToTimezone(
                        item.createdAt,
                        auth.getValue()?.user?.timezone,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                  fontSize={14}
                  fontWeight={400}
                >
                  {item.content.split('\n').map((line, index, array) => (
                    <Fragment key={index}>
                      {line}
                      {index !== array.length - 1 && <br />}
                    </Fragment>
                  ))}
                </Typography>
              </Box>)
            ))}
          </>
        ) : null}
        </Box>
        {isMessageUsable() ? (
          <Box 
            sx={{ 
              padding: '20px',
              paddingTop: '10px',
              position: 'sticky',
              bottom: 0,
              borderTop: '1px solid #E9EAEC',
              backgroundColor: '#FFF',
              height: '178px',
            }}>
            <Box sx={{ padding: 0, border: '1px solid #E5E4E4', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
              <TextField
                rows={4}
                multiline
                autoComplete='off'
                fullWidth
                placeholder={sendFrom === 'LPM' ? 'Write down a message to Pro' : 'Write down a message to LPM'}
                value={message ?? ''}
                onChange={handleChangeMessage}
                inputProps={{ maxLength: 500 }}
                sx={{ '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',  // 테두리 삭제
                  },
                  '&:hover fieldset': {
                    border: 'none',  // 호버 시 테두리 삭제
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',  // 포커스 시 테두리 삭제
                  }}
                }}
                onKeyDown={handleKeyDown} 
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: '8px',
                }}
              >
                <ButtonBase
                  onClick={handleSendMessage}
                  disabled={message?.length === 0}
                >
                  <Box>
                    {
                      message?.length > 0 ? (
                        <Image 
                          src='/images/icons/buttons/send-message.svg'
                          alt='Send'
                          width={36}
                          height={36}
                          quality={100}
                        />
                      ) : (
                        <Image 
                          src='/images/icons/buttons/send-message-disabled.svg'
                          alt='Send'
                          width={36}
                          height={36}
                          quality={100}
                        />
                      )
                    }
                  </Box>
                </ButtonBase>
              </Box>
            </Box>
            <Typography variant='body2' mt='12px' textAlign='right'>
              {message?.length ?? 0}/500
            </Typography>
          </Box>) : null
        }
      </Box>
    </Box>
  )
}

export default Message
