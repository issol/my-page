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
import { sendMessage } from '@src/apis/jobs/job-detail.api'
import { JobType } from '@src/types/common/item.type'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { toast } from 'react-hot-toast'

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
  onClose: () => void
}

const Message = ({ jobId, jobRequestId, info, messageType, sendFrom, jobDetail, onClose }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [message, setMessage] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<number>(jobId)
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
  } = useGetMessage(selectedJobId, info.userId, sendFrom === 'PRO' ? 'all' : messageType)

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
        refetchMessage()
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

  const refetchMessage = () => {
    messageRefetch().then(() => {
      setMessage('')
      scrollToBottom()
    })
  }

  const handleSendMessage = () => {
    sendMessageToProMutation.mutate({
      jobId: selectedJobId,
      proId: info.userId,
      message: message,
    })
  }

  // 키보드 입력을 처리하는 함수
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

  useEffect(() => {
    refetchMessage()
  }, [messageRefetch])

  useEffect(() => {
    scrollToBottom()
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 
          sendFrom === 'LPM'
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
      {(sendFrom === 'LPM' && jobDetail) && (
        <Box
          sx={{ 
            width: '165px',
            overflowY: 'auto', 
            flex: 'none', 
            borderRight: '1px solid #E9EAEC',
            
          }}
        >
          {jobDetail.map((value, index) => {
            return value.jobAssign?.length > 0 && (
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
                onClick={() => {
                  setSelectedJobId(value.jobId)
                  refetchMessage()
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                <Typography fontSize={20} fontWeight={500}>
                  {getLegalName({
                    firstName: info.firstName,
                    middleName: info.middleName,
                    lastName: info.lastName,
                  })}
                </Typography>
                {assignmentStatusChip(70000, jobAssignmentStatusList!)}
              </Box>
              <Typography color={'#8D8E9A'} fontSize={14}>{messageList?.proInfo.email}</Typography>
            </Box>
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
              <Box
                key={uuidv4()}
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderBottom: '1px solid #E9EAEC',
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
                <Typography fontSize={14} fontWeight={400}>
                  {item.content.split('\n').map((line, index, array) => (
                    <Fragment key={index}>
                      {line}
                      {index !== array.length - 1 && <br />}
                    </Fragment>
                  ))}
                </Typography>
              </Box>
            ))}
          </>
        ) : null}
        {/* TODO: 메세지 박스 상황별 보여지는 부분 컨트롤 해야 함 */}
        </Box>
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
                // label='Write down a message to Pro'
                placeholder='Write down a message to Pro'
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
          </Box>
      </Box>
    </Box>
  )
}

export default Message
