import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import useModal from '@src/hooks/useModal'
import { getProJobAssignColumns } from '@src/shared/const/columns/pro-job-assgin'
import { ProListType } from '@src/types/pro/list'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { ProStatusChip } from '@src/@core/components/chips/chips'
import registDND from '@src/pages/pro/linguist-team/add-new/components/dnd'
import {
  JobAssignProRequestsType,
  JobRequestsProType,
} from '@src/types/jobs/jobs.type'

type Props = {
  onClick: (
    selectedRequestOption: number,
    requestTerm: number | null,
    selectedProList: ProListType[],
    existingProsLength: number,
    type: 'create' | 'add',
  ) => void
  onClose: () => void
  selectedPros: ProListType[]
  existingPros: JobAssignProRequestsType | null
  type: 'create' | 'add'
}

const RequestSummaryModal = ({
  onClick,
  onClose,
  selectedPros,
  existingPros,
  type,
}: Props) => {
  console.log(existingPros)

  const { openModal, closeModal } = useModal()
  const [selectedRequestOption, setSelectedRequestOption] = useState(0)
  const [requestTerm, setRequestTerm] = useState<number | null>(
    existingPros ? existingPros.interval : null,
  )
  const [selectedProList, setSelectedProList] =
    useState<ProListType[]>(selectedPros)
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

  const onClickHelperIcon = () => {
    if (selectedRequestOption === 0) {
      openModal({
        type: 'RequestTermModal',
        children: (
          <CustomModalV2
            noButton
            closeButton
            title='Request term'
            subtitle="In the relay request method, this is the time interval between requests being passed from the previous Pro to the next Pro and can be set in minutes. If a Pro doesn't respond within their request term, their chance to respond is lost and the request is passed on to the next Pro."
            vary='info'
            onClose={() => closeModal('RequestTermModal')}
            onClick={() => closeModal('RequestTermModal')}
            rightButtonText=''
          />
        ),
      })
    } else {
      openModal({
        type: 'ReminderTimeModal',
        children: (
          <CustomModalV2
            noButton
            closeButton
            title='Reminder time'
            subtitle='When using the bulk request method, you can set the reminder time in minutes. If no one responds within the set period of time, a reminder notification is sent to the LPM.'
            vary='info'
            onClose={() => closeModal('ReminderTimeModal')}
            onClick={() => closeModal('ReminderTimeModal')}
            rightButtonText=''
          />
        ),
      })
    }
  }

  useEffect(() => {
    setSelectedProList(
      selectedPros.map((value, index) => ({
        ...value,
        order:
          index +
          1 +
          (existingPros && existingPros?.pros?.length
            ? existingPros?.pros?.length
            : 0),
      })),
    )
  }, [selectedPros, existingPros])

  useEffect(() => {
    if (existingPros) {
      setSelectedRequestOption(
        existingPros.type === 'relayRequest'
          ? 0
          : existingPros.type === 'bulkAutoAssign'
            ? 1
            : 2,
      )
    }
  }, [existingPros])

  useEffect(() => {
    const clear = registDND(({ source, destination }) => {
      if (!destination) return
      setSelectedProList(prevList => {
        const newList = [...prevList]
        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)
        return newList
      })
    }, 'assign')
    return () => clear()
  }, [setSelectedProList])

  console.log(existingPros)

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
            {(existingPros && existingPros.type === 'relayRequest') ||
            type === 'create' ? (
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
            ) : null}
            {(existingPros && existingPros.type === 'bulkAutoAssign') ||
            type === 'create' ? (
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
                      color={
                        selectedRequestOption === 1 ? '#666CFF' : '#8D8E9A'
                      }
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
            ) : null}
            {(existingPros && existingPros.type === 'bulkManualAssign') ||
            type === 'create' ? (
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
                      color={
                        selectedRequestOption === 2 ? '#666CFF' : '#8D8E9A'
                      }
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
            ) : null}
          </Grid>
        </Box>
        <Box
          sx={{
            padding: '20px',
          }}
        >
          <Typography fontSize={14} fontWeight={500}>
            Selected Pros ({selectedProList.length ?? 0})
          </Typography>
        </Box>
        <Box>
          <DataGrid
            sx={{ height: '54px !important' }}
            autoHeight
            rows={[]}
            components={{
              NoRowsOverlay: () => <></>,
              NoResultsOverlay: () => <></>,
            }}
            columns={getProJobAssignColumns(
              selectedRequestOption === 0,
              false,
              true,
              false,
            )}
            hideFooter
          />
          <Box
            sx={{
              // position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              // minHeight: '501px',
              minHeight: '370px',
              background: '#FFFFFF',
            }}
            className='selectPro'
          >
            {selectedProList.length > 0 && (
              <Box
                key='proList'
                data-droppable-id='proList'
                sx={{
                  overflowY: 'scroll',
                  maxHeight: '400px',
                  '&::-webkit-scrollbar': {
                    width: 6,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: 20,
                    background: hexToRGBA('#57596C', 0.6),
                  },
                  '&::-webkit-scrollbar-track': {
                    borderRadius: 20,
                    background: 'transparent',
                  },
                }}
              >
                {selectedProList.map((value, index) => {
                  return (
                    <Box
                      key={uuidv4()}
                      data-index={index}
                      className='dnd-item'
                      sx={{
                        width: '100%',
                        display: 'flex',
                        height: '54px',
                        // background: '#F7F8FF',

                        borderTop: '1px solid rgba(76, 78, 100, 0.12)',
                        borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                      }}
                    >
                      {selectedRequestOption === 0 ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flex: 0.0936,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Typography fontWeight={600} fontSize={14}>
                              {index +
                                1 +
                                (existingPros && existingPros?.pros?.length
                                  ? existingPros?.pros?.length
                                  : 0)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'grab',
                            }}
                            className='dnd-handle'
                          >
                            <Icon
                              icon='akar-icons:drag-vertical'
                              fontSize={24}
                              color='#8D8E9A'
                            />
                          </Box>
                        </Box>
                      ) : null}

                      <Box
                        sx={{
                          paddingLeft: '16px',
                          display: 'flex',

                          flex: selectedRequestOption === 0 ? 0.3974 : 0.45,
                        }}
                      >
                        <LegalNameEmail
                          row={{
                            isOnboarded: value.isOnboarded,
                            isActive: value.isActive,

                            firstName: value.firstName,
                            middleName: value.middleName,
                            lastName: value.lastName,
                            email: value.email,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          // padding: '16px 20px',

                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '20px',
                          flex: selectedRequestOption === 0 ? 0.2308 : 0.25,
                        }}
                      >
                        <ProStatusChip
                          status={value.status}
                          label={value.status}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '20px',

                          flex: selectedRequestOption === 0 ? 0.2782 : 0.3,
                        }}
                      >
                        {!value.ongoingJobCount || value.ongoingJobCount === 0
                          ? '-'
                          : `${value.ongoingJobCount} job(s)`}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              padding: '32px 20px 0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
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
                {selectedRequestOption === 0 ? 'Request term' : 'Reminder time'}
              </Typography>
              {selectedRequestOption === 0 ? (
                <Typography fontSize={14} fontWeight={600} color='#666CFF'>
                  *
                </Typography>
              ) : null}

              <IconButton sx={{ padding: 0 }} onClick={onClickHelperIcon}>
                <Icon icon='mdi:info-circle-outline' fontSize={18} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {selectedRequestOption === 0 ? null : (
                <Typography fontSize={14} fontWeight={400}>
                  Remind me if nobody responds in&nbsp;
                </Typography>
              )}
              <FormControl className='filterFormControl'>
                <TextField
                  value={requestTerm}
                  disabled={existingPros ? true : false}
                  onChange={e => {
                    if (e.target.value) {
                      setRequestTerm(Number(e.target.value))
                    } else {
                      setRequestTerm(null)
                    }
                  }}
                  sx={{
                    height: '46px',
                    width: '205px',
                  }}
                  inputProps={{
                    style: {
                      height: '46px',
                      padding: '0 14px',
                    },
                  }}
                />
              </FormControl>
              <Typography fontSize={14} fontWeight={600}>
                minute(s)
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              padding: '32px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Button variant='outlined' onClick={onClose} color='secondary'>
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() =>
                onClick(
                  selectedRequestOption,
                  requestTerm,
                  selectedProList,
                  existingPros?.pros.length ?? 0,
                  type,
                )
              }
            >
              Confirm your request
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RequestSummaryModal
