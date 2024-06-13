// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import {
  JobTypeChip,
  QuoteStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { styled } from '@mui/system'
import { authState } from '@src/states/auth'
import { useRecoilValueLoadable } from 'recoil'

// ** values
import { ProjectInfoType } from '@src/types/common/quotes.type'
import { Fragment, useEffect, useState } from 'react'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserRoleType } from '@src/context/types'
import { ClientType } from '@src/types/orders/order-detail'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getClientDetail } from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import useModal from '@src/hooks/useModal'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import { UseMutationResult } from 'react-query'
import { updateProjectInfoType } from '../[id]'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { ReasonType } from '@src/types/quotes/quote'
import SimpleMultilineAlertModal from 'src/pages/[companyName]/components/modals/custom-modals/simple-multiline-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { timezoneSelector } from '@src/states/permission'
import { QuotesStatusLabel } from '@src/types/common/status.type'

type Props = {
  project: ProjectInfoType | undefined
  setEditMode: (v: boolean) => void
  isUpdatable: boolean
  canCheckboxEdit: boolean
  updateStatus?: (status: number, callback?: () => void) => void
  role: UserRoleType
  client?: ClientType
  type: 'detail' | 'history'
  updateProject?: UseMutationResult<
    void,
    unknown,
    updateProjectInfoType,
    unknown
  >
  statusList?: Array<{ value: number; label: string }>
}

export default function QuotesProjectInfoDetail({
  project,
  setEditMode,
  isUpdatable,
  canCheckboxEdit,
  updateStatus,
  role,
  client,
  type,
  updateProject,
  statusList,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [contactPersonEdit, setContactPersonEdit] = useState(false)
  const { openModal, closeModal } = useModal()

  const [clientDetail, setClientDetail] = useState<ClientDetailType | null>(
    null,
  )
  const [contactPersonId, setContactPersonId] = useState<number | null>(null)
  const [contactPersonList, setContactPersonList] = useState<
    Array<
      ContactPersonType<number> & {
        value: number
        label: string
      }
    >
  >([])
  const onClickReason = (status: string, reason: ReasonType | null) => {
    openModal({
      type: `${status}ReasonModal`,
      children: (
        <ReasonModal
          onClose={() => closeModal(`${status}ReasonModal`)}
          reason={reason}
          type={status}
          vary='question-info'
          role={role.name === 'CLIENT' ? 'client' : 'lpm'}
        />
      ),
    })
  }

  const onClickEditSaveContactPerson = () => {
    // TODO api
    updateProject &&
      updateProject.mutate(
        { contactPersonId: contactPersonId },
        {
          onSuccess: () => {
            setContactPersonEdit(false)
          },
        },
      )
  }

  const filterStatusList = () => {
    if (client && statusList) {
      if (client.isEnrolledClient) {
        return statusList?.filter(
          value =>
            value.label === 'New' ||
            value.label === 'In preparation' ||
            value.label === 'Internal review',
        )
      } else {
        return statusList?.filter(
          value =>
            value.label !== 'Changed into order' && value.label !== 'Canceled',
        )
      }
    }
    return statusList!
  }

  const getStatusNameFromCode = (code: number): QuotesStatusLabel => {
    const status =
      statusList?.find(status => status.value === code)?.label ?? 'New'
    return status as QuotesStatusLabel
  }

  const onClickShowDescription = (value: boolean) => {
    let confirmButtonText = ''
    let message = ''
    if (value) {
      confirmButtonText = 'Show'
      message =
        'Are you sure you want to show the\nproject description to the client?'
    } else {
      confirmButtonText = 'Hide'
      message =
        'Are you sure you want to hide the\nproject description to the client?'
    }
    openModal({
      type: 'ShowDescriptionModal',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('ShowDescriptionModal')}
          onConfirm={() => {
            updateProject &&
              updateProject.mutate({
                showDescription: value ? '1' : '0',
              })
          }}
          closeButtonText='Cancel'
          confirmButtonText={confirmButtonText}
          message={message}
          vary='successful'
        />
      ),
    })
  }

  const onChangeStatus = (status: number) => {
    const statusLabel = statusList?.find(value => value.value === status)?.label
    openModal({
      type: 'ChangeStatusModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to change the status as&nbsp;
              <Typography
                variant='body2'
                fontWeight={600}
                component={'span'}
                fontSize={16}
              >
                [{statusLabel ?? ''}]
              </Typography>
            </>
          }
          vary='successful'
          rightButtonText='Proceed'
          onClick={() =>
            updateStatus &&
            updateStatus(status, () => closeModal('ChangeStatusModal'))
          }
          onClose={() => closeModal('ChangeStatusModal')}
        />
      ),
    })
  }

  useEffect(() => {
    if (client) {
      setContactPersonId(client.contactPerson ? client.contactPerson.id! : null)

      getClientDetail(client.client.clientId)
        .then(res => {
          setClientDetail(res)
          if (res?.contactPersons?.length) {
            const result: Array<
              ContactPersonType<number> & {
                value: number
                label: string
              }
            > = res.contactPersons.map(item => ({
              ...item,
              value: item.id!,
              label: !item?.jobTitle
                ? getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })
                : `${getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })} / ${item.jobTitle}`,
            }))
            setContactPersonList(result)
          } else {
            setContactPersonList([])
          }
        })
        .catch(e => {
          setClientDetail(null)
          setContactPersonList([])
        })
    }
  }, [client])

  // console.log(contactPersonId)

  return (
    <Fragment>
      {!project ? null : (
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            mb={4}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>{project.projectName}</Typography>
            {isUpdatable ? (
              <IconButton onClick={() => setEditMode(true)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Grid>

          <Grid item xs={6}>
            <LabelContainer style={{ height: '40px' }}>
              <CustomTypo fontWeight={600}>Quote date</CustomTypo>
              <CustomTypo variant='body2'>
                {/* {FullDateHelper(project.quoteDate)} */}
                {convertTimeToTimezone(
                  project.quoteDate,
                  auth.getValue().user?.timezone!,
                  timezone.getValue(),
                )}
              </CustomTypo>
            </LabelContainer>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Status</CustomTypo>
              {role.name === 'CLIENT' ? (
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QuoteStatusChip
                    size='small'
                    label={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                    status={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                  />
                </Box>
              ) : type === 'detail' &&
                statusList
                  ?.filter(
                    value =>
                      !filterStatusList().some(v => v.value === value.value),
                  )
                  .some(status => status.label === project.status) ? (
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QuoteStatusChip
                    size='small'
                    label={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                    status={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                  />
                  {(project.status === 'Revision requested' ||
                    project.status === 'Rejected' ||
                    project.status === 'Canceled') && (
                    <IconButton
                      onClick={() => {
                        project.reason &&
                          onClickReason(
                            project.reason.type === 'revision-requested'
                              ? 'Requested'
                              : project.reason.type?.replace(/^[a-z]/, char =>
                                  char.toUpperCase(),
                                ),
                            project.reason,
                          )
                      }}
                    >
                      <img
                        src='/images/icons/onboarding-icons/more-reason.svg'
                        alt='more'
                      />
                    </IconButton>
                  )}
                </Box>
              ) : (
                <Autocomplete
                  fullWidth
                  disableClearable={true}
                  options={filterStatusList() ?? []}
                  onChange={(e, v) => {
                    if (v?.value) {
                      onChangeStatus(v.value as number)
                    }
                  }}
                  value={
                    statusList &&
                    statusList.find(item => item.label === project.status)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      placeholder='Status'
                      size='small'
                      sx={{ maxWidth: '300px' }}
                    />
                  )}
                />
              )}
              {/* {type === 'detail' &&
              ((isUpdatable &&
                // 연결된 Client가 있는 경우
                project.status !== 'Quote sent' &&
                project.status !== 'Client review' &&
                project.status !== 'Revision requested' &&
                project.status !== 'Under revision' &&
                project.status !== 'Revised' &&
                project.status !== 'Accepted' &&
                project.status !== 'Changed into order' &&
                project.status !== 'Expired' &&
                project.status !== 'Rejected' &&
                project.status !== 'Canceled') ||
                // 연결된 Client가 없는 경우
                !client?.isEnrolledClient) ? (
                <Box sx={{ display: 'flex', gap: '2px', alignItems: 'left' }}>
                  <Autocomplete
                    fullWidth
                    disableClearable={true}
                    options={filterStatusList() ?? []}
                    onChange={(e, v) => {
                      if (updateStatus && v?.value) {
                        updateStatus(v.value as number)
                      }
                    }}
                    value={
                      statusList &&
                      statusList.find(item => item.label === project.status)
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder='Status'
                        size='small'
                        sx={{ maxWidth: '300px' }}
                      />
                    )}
                  />
                  {(client?.isEnrolledClient &&
                    (project.status === 'Revision requested' ||
                      project.status === 'Rejected' ||
                      project.status === 'Canceled')) ||
                  (!client?.isEnrolledClient &&
                    project.status === 'Canceled') ? (
                    <IconButton
                      onClick={() => {
                        project.reason &&
                          onClickReason(
                            project.reason.type === 'revision-request'
                              ? 'Requested'
                              : project.reason.type?.replace(/^[a-z]/, char =>
                                  char.toUpperCase(),
                                ),
                            project.reason,
                          )
                      }}
                    >
                      <img
                        src='/images/icons/onboarding-icons/more-reason.svg'
                        alt='more'
                      />
                    </IconButton>
                  ) : null}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QuoteStatusChip
                    size='small'
                    label={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                    status={
                      typeof project.status === 'number'
                        ? getStatusNameFromCode(project.status)
                        : project.status
                    }
                  />
                  {(project.status === 'Revision requested' ||
                    project.status === 'Rejected' ||
                    project.status === 'Canceled') && (
                    <IconButton
                      onClick={() => {
                        project.reason &&
                          onClickReason(
                            project.reason.type === 'revision-request'
                              ? 'Requested'
                              : project.reason.type?.replace(/^[a-z]/, char =>
                                  char.toUpperCase(),
                                ),
                            project.reason,
                          )
                      }}
                    >
                      <img
                        src='/images/icons/onboarding-icons/more-reason.svg'
                        alt='more'
                      />
                    </IconButton>
                  )}
                </Box>
              )} */}
            </LabelContainer>
          </Grid>
          {role.name === 'CLIENT' ? (
            <Grid item xs={6}>
              <LabelContainer>
                <CustomTypo fontSize={14} fontWeight={600}>
                  Contact person
                </CustomTypo>
                {contactPersonEdit ? (
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={contactPersonList
                        .filter(item => item.id !== contactPersonId)
                        .map(value => ({
                          value: value.value,
                          label: value.label,
                        }))}
                      onChange={(e, v) => {
                        // onChange(v.value)
                        const res = contactPersonList.filter(
                          item => item.id === Number(v.value),
                        )
                        setContactPersonId(
                          res.length ? res[0].id! : Number(v.value)!,
                        )
                      }}
                      disableClearable
                      // disabled={type === 'request'}
                      value={
                        contactPersonList
                          .filter(value => value.id === contactPersonId)
                          .map(value => ({
                            value: value.value,
                            label: value.label,
                          }))[0] || { value: '', label: '' }
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          autoComplete='off'
                          size='small'
                          // label='Contact person*'
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                    <Box
                      sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                    >
                      <Button
                        variant='outlined'
                        sx={{
                          width: '26px !important',
                          height: '26px',
                          minWidth: '26px !important',
                          padding: '0 !important',
                          border: 'none',
                          color: 'rgba(76, 78, 100, 0.6)',
                        }}
                        onClick={() => setContactPersonEdit(false)}
                      >
                        <Icon icon='ic:outline-close' fontSize={20} />
                      </Button>
                      <Button
                        variant='contained'
                        sx={{
                          width: '26px !important',
                          height: '26px',
                          minWidth: '26px !important',
                          padding: '0 !important',
                        }}
                        onClick={onClickEditSaveContactPerson}
                      >
                        <Icon icon='mdi:check' fontSize={20} />
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <CustomTypo
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    {type !== 'history'
                      ? getLegalName({
                          firstName: client?.contactPerson?.firstName,
                          middleName: client?.contactPerson?.middleName,
                          lastName: client?.contactPerson?.lastName,
                        })
                      : getLegalName({
                          firstName: project?.contactPerson?.firstName,
                          middleName: project?.contactPerson?.middleName,
                          lastName: project?.contactPerson?.lastName,
                        })}
                    {type !== 'history'
                      ? client?.contactPerson?.jobTitle
                        ? ` / ${client?.contactPerson?.jobTitle}`
                        : ''
                      : project?.contactPerson?.jobTitle
                        ? ` / ${project?.contactPerson?.jobTitle}`
                        : ''}
                    {type === 'history' ||
                    project.status === 'Changed into order' ||
                    project.status === 'Rejected' ||
                    project.status === 'Canceled' ? null : (
                      <IconButton onClick={() => setContactPersonEdit(true)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    )}
                  </CustomTypo>
                )}
              </LabelContainer>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontSize={14} fontWeight={600}>
                Work name
              </CustomTypo>
              <CustomTypo variant='body2'>{project.workName ?? '-'}</CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Category</CustomTypo>
              <Box>
                {!project.category ? (
                  '-'
                ) : (
                  <JobTypeChip
                    size='small'
                    label={project.category}
                    type={project.category}
                  />
                )}
              </Box>
            </LabelContainer>
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{ alignItems: 'start' }}>
              <CustomTypo fontSize={14} fontWeight={600}>
                Service type
              </CustomTypo>
              <Box
                display='flex'
                // alignItems='center'
                gap='8px'
                sx={{ width: '100%', flexWrap: 'wrap' }}
              >
                {project.serviceType && project.serviceType.length > 0
                  ? project.serviceType
                      .filter(
                        (item, index, self) => self.indexOf(item) === index,
                      )
                      .map((item, idx) => (
                        <ServiceTypeChip key={idx} label={item} size='small' />
                      ))
                  : '-'}
              </Box>
            </LabelContainer>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer style={{ alignItems: 'start' }}>
              <CustomTypo fontWeight={600}>Area of expertise</CustomTypo>
              <CustomTypo variant='body2'>
                {project.genre?.join(', ') ?? '-'}
              </CustomTypo>
            </LabelContainer>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {role.name === 'CLIENT' ? (
            <>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>
                    Estimated delivery date
                  </CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.estimatedAt,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Project due date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.projectDueAt,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.quoteExpiryDate,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Quote deadline</CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.quoteDeadline,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.quoteExpiryDate,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>
                    Estimated delivery date
                  </CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.estimatedAt,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Project due date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {convertTimeToTimezone(
                      project.projectDueAt,
                      auth.getValue().user?.timezone!,
                      timezone.getValue(),
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                Project description
              </Typography>
              {role.name === 'CLIENT' ? null : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    opacity: project.status === 'Canceled' ? 0.5 : 1,
                  }}
                >
                  <Checkbox
                    value={project.showDescription}
                    onChange={e => {
                      onClickShowDescription(e.target.checked)
                    }}
                    checked={project.showDescription}
                    disabled={!canCheckboxEdit}
                  />

                  <Typography
                    variant='body1'
                    fontSize={14}
                    fontWeight={400}
                    lineHeight='21px'
                    letterSpacing='0.15px'
                    sx={{ minWidth: 230 }}
                  >
                    Show project description to client
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                width: '73.45%',
              }}
            >
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={400}
                lineHeight='21px'
                letterSpacing='0.15px'
                sx={{ minWidth: 230 }}
              >
                {role.name === 'CLIENT'
                  ? project.projectDescription &&
                    project.showDescription &&
                    project.projectDescription !== ''
                    ? project.projectDescription
                    : '-'
                  : project.projectDescription || '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Fragment>
  )
}

const LabelContainer = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  /* grid-template-columns: repeat(2, 1fr); */
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`