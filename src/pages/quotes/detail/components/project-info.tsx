// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { JobTypeChip } from '@src/@core/components/chips/chips'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import styled from 'styled-components'

// ** values
import { QuotesStatus } from '@src/shared/const/status/statuses'
import { ProjectInfoType, QuoteStatusType } from '@src/types/common/quotes.type'
import { Fragment, useEffect, useState } from 'react'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'
import { QuoteStatusChip } from '@src/@core/components/chips/chips'
import { UserRoleType } from '@src/context/types'
import { ClientType } from '@src/types/orders/order-detail'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useGetClientList } from '@src/queries/client.query'
import { getClientDetail } from '@src/apis/client.api'
import { ClientDetailType } from '@src/types/client/client'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import useModal from '@src/hooks/useModal'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import { UseMutationResult } from 'react-query'
import { updateProjectInfoType } from '../[id]'
import { update } from 'lodash'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'

type Props = {
  project: ProjectInfoType | undefined
  setEditMode: (v: boolean) => void
  isUpdatable: boolean
  updateStatus?: (status: QuoteStatusType) => void
  role: UserRoleType
  client?: ClientType
  type: 'detail' | 'history'
  updateProject?: UseMutationResult<
    void,
    unknown,
    updateProjectInfoType,
    unknown
  >
}

export default function QuotesProjectInfoDetail({
  project,
  setEditMode,
  isUpdatable,
  updateStatus,
  role,
  client,
  type,
  updateProject,
}: Props) {
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

  const onClickReason = (status: string) => {
    openModal({
      type: `${status}ReasonModal`,
      children: (
        <ReasonModal
          onClose={() => closeModal(`${status}ReasonModal`)}
          messageToUser=''
          reason=''
          type={status}
          vary='info'
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

  console.log(contactPersonId)

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
            <LabelContainer>
              <CustomTypo fontWeight={600}>Quote date</CustomTypo>
              <CustomTypo variant='body2'>
                {FullDateHelper(project.quoteDate)}
              </CustomTypo>
            </LabelContainer>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Status</CustomTypo>
              {isUpdatable ? (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={QuotesStatus}
                  onChange={(e, v) => {
                    if (updateStatus && v?.value) {
                      updateStatus(v.value as QuoteStatusType)
                    }
                  }}
                  value={
                    QuotesStatus.find(item => item.value === project.status) ||
                    null
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
              ) : (
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <QuoteStatusChip
                    size='small'
                    label={project.status}
                    status={project.status}
                  />
                  {role.name === 'CLIENT' &&
                    (project.status === 'Revision requested' ||
                      project.status === 'Rejected' ||
                      project.status === 'Canceled') && (
                      <IconButton
                        onClick={() =>
                          onClickReason(
                            project.status === 'Revision requested'
                              ? 'Requested'
                              : project.status,
                          )
                        }
                      >
                        <img
                          src='/images/icons/onboarding-icons/more-reason.svg'
                          alt='more'
                        />
                      </IconButton>
                    )}
                </Box>
              )}
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
                    {getLegalName({
                      firstName: client?.contactPerson?.firstName,
                      middleName: client?.contactPerson?.middleName,
                      lastName: client?.contactPerson?.lastName,
                    })}
                    {client?.contactPerson?.jobTitle
                      ? ` / ${client?.contactPerson?.jobTitle}`
                      : ''}
                    {type === 'history' ? null : (
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
              <CustomTypo variant='body2'>{project.workName}</CustomTypo>
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
            <LabelContainer>
              <CustomTypo fontSize={14} fontWeight={600}>
                Service type
              </CustomTypo>
              <Box display='flex' alignItems='center' gap='8px'>
                {project.serviceType?.map((item, idx) => (
                  <ServiceTypeChip key={idx} label={item} size='small' />
                ))}
              </Box>
            </LabelContainer>
          </Grid>

          <Grid item xs={6}>
            <LabelContainer>
              <CustomTypo fontWeight={600}>Area of expertise</CustomTypo>
              <CustomTypo variant='body2'>
                {project.expertise ?? '-'}
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
                    {FullDateTimezoneHelper(
                      project.estimatedDeliveryDate,
                      project.estimatedDeliveryDateTimezone,
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Project due date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {FullDateTimezoneHelper(
                      project.projectDueAt,
                      project.projectDueTimezone,
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {FullDateTimezoneHelper(
                      project.quoteExpiryDate,
                      project.quoteExpiryDateTimezone,
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
                    {FullDateTimezoneHelper(
                      project.quoteDeadline,
                      project.quoteDeadlineTimezone,
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Quote expiry date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {FullDateTimezoneHelper(
                      project.quoteExpiryDate,
                      project.quoteExpiryDateTimezone,
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
                    {FullDateTimezoneHelper(
                      project.estimatedDeliveryDate,
                      project.estimatedDeliveryDateTimezone,
                    )}
                  </CustomTypo>
                </LabelContainer>
              </Grid>
              <Grid item xs={6}>
                <LabelContainer>
                  <CustomTypo fontWeight={600}>Project due date</CustomTypo>
                  <CustomTypo variant='body2'>
                    {FullDateTimezoneHelper(
                      project.projectDueAt,
                      project.projectDueTimezone,
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
            <CustomTypo fontWeight={600} mb={6}>
              Project description
            </CustomTypo>
            <CustomTypo variant='body2'>
              {project.projectDescription ?? '-'}
            </CustomTypo>
          </Grid>
        </Grid>
      )}
    </Fragment>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  /* grid-template-columns: repeat(2, 1fr); */
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`
