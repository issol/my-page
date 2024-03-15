import { Icon } from '@iconify/react'
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import useModal from '@src/hooks/useModal'
import { useState } from 'react'

type Props = {
  onClick: () => void
  onClose: () => void
}

const RequestSummaryModal = ({ onClick, onClose }: Props) => {
  const { openModal, closeModal } = useModal()
  const [selectedRequestOption, setSelectedRequestOption] = useState(0)
  const onClickRequestOptionHelperIcon = () => {
    openModal({
      type: 'RequestOptionModal',
      children: (
        <CustomModal
          closeButton
          noButton
          title={
            <>
              <Typography fontSize={20} fontWeight={500}>
                Relay request
              </Typography>
              <Typography
                fontSize={16}
                fontWeight={400}
                color='#8D8E9A'
                mt='10px'
              >
                You can select one or more Pro(s) and set priorities and the
                request will be sent sequentially based on the priorities. You
                can set the request term after which the request will be sent to
                the next Pro. And if the previous Pro doesn’t respond in time,
                the opportunity will expire and the request will be sent to the
                next Pro. The job is automatically assigned to the Pro who
                accepts in their order.
              </Typography>
              <Typography fontSize={20} fontWeight={500} mt='16px'>
                Bulk request (First come first served)
              </Typography>
              <Typography
                fontSize={16}
                fontWeight={400}
                color='#8D8E9A'
                mt='10px'
              >
                You can select one or more Pro(s) and send a request at the same
                time. The job is automatically assigned to the first Pro to
                accept.
              </Typography>
              <Typography fontSize={20} fontWeight={500} mt='16px'>
                Bulk request (Manual assign)
              </Typography>
              <Typography
                fontSize={16}
                fontWeight={400}
                color='#8D8E9A'
                mt='10px'
              >
                You can select one or more Pro(s) and send a request at the same
                time. LPM chooses one of the Pros who have accepted and manually
                assign the job.
              </Typography>
            </>
          }
          vary='info'
          rightButtonText=''
          onClick={() => closeModal('RequestOptionModal')}
          onClose={() => closeModal('RequestOptionModal')}
        />
      ),
      // isCloseable: true,
    })
  }
  return (
    <Box
      sx={{
        maxWidth: '780px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: '32px 20px',
            borderBottom: '1px solid #E5E4E4',
          }}
        >
          <Typography fontSize={20} fontWeight={500}>
            Request summary
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '32px 20px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderBottom: '1px solid #E5E4E4',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              Request option
            </Typography>
            <Typography fontSize={14} fontWeight={600} color='#666CFF'>
              *
            </Typography>
            <IconButton
              sx={{ padding: 0 }}
              onClick={onClickRequestOptionHelperIcon}
            >
              <Icon icon='mdi:info-circle-outline' fontSize={18} />
            </IconButton>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Box
                sx={{
                  border:
                    selectedRequestOption === 0
                      ? '1px solid #666CFF'
                      : '1px solid #8D8E9A',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '5px',
                  height: '61px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedRequestOption(0)}
              >
                <Icon
                  icon='simple-icons:relay'
                  fontSize={24}
                  color={selectedRequestOption === 0 ? '#666CFF' : '#8D8E9A'}
                />
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={selectedRequestOption === 0 ? '#666CFF' : '#8D8E9A'}
                >
                  Relay request
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  border:
                    selectedRequestOption === 1
                      ? '1px solid #666CFF'
                      : '1px solid #8D8E9A',
                  padding: '8px 0px 8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '5px',
                  height: '61px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedRequestOption(1)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',

                    alignItems: 'center',
                  }}
                >
                  <Icon
                    icon='mdi:run-fast'
                    fontSize={24}
                    color={selectedRequestOption === 1 ? '#666CFF' : '#8D8E9A'}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color={
                        selectedRequestOption === 1 ? '#666CFF' : '#8D8E9A'
                      }
                    >
                      Bulk request
                    </Typography>
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      color={
                        selectedRequestOption === 1 ? '#666CFF' : '#8D8E9A'
                      }
                    >
                      (First come first served)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  border:
                    selectedRequestOption === 2
                      ? '1px solid #666CFF'
                      : '1px solid #8D8E9A',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '5px',
                  height: '61px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedRequestOption(2)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',

                    alignItems: 'center',
                  }}
                >
                  <Icon
                    icon='lucide:mouse-pointer-click'
                    fontSize={24}
                    color={selectedRequestOption === 2 ? '#666CFF' : '#8D8E9A'}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color={
                        selectedRequestOption === 2 ? '#666CFF' : '#8D8E9A'
                      }
                    >
                      Bulk request
                    </Typography>
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      color={
                        selectedRequestOption === 2 ? '#666CFF' : '#8D8E9A'
                      }
                    >
                      (Manual assign)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default RequestSummaryModal
