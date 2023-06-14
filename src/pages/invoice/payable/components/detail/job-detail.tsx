import {
  SyntheticEvent,
  useState,
  MouseEvent,
  Suspense,
  useEffect,
  useContext,
  Fragment,
} from 'react'

// ** style components
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  IconButton,
  Tab,
  Typography,
  Grid,
  styled,
  DialogTitle,
  Button,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import CloseIcon from '@mui/icons-material/Close'

// ** components
import FallbackSpinner from '@src/@core/components/spinner'
import ViewJobInfo from './components/job-info'
import EditJobInfo from './components/job-info-form'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** apis
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import { useGetProjectTeam } from '@src/queries/order/order.query'
import { saveJobInfo } from '@src/apis/job-detail.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'

// ** types & schema
import { SaveJobInfoParamsType } from '@src/types/orders/job-detail'
import { yupResolver } from '@hookform/resolvers/yup'
import { editJobInfoSchema } from '@src/types/schema/job-detail'

import { toast } from 'react-hot-toast'

type Props = {
  id: number
  onClose: () => void
}
type MenuType = 'jobInfo' | 'prices'

export default function JobDetail({ id, onClose }: Props) {
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const [value, setValue] = useState<MenuType>('jobInfo')
  const [editJobInfo, setEditJobInfo] = useState(false)
  const [editPrices, setEditPrices] = useState(false)

  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string; userId: any }[]
  >([])

  const { data: jobInfo, isLoading } = useGetJobInfo(id, false)
  const { data: jobPrices } = useGetJobPrices(id, false)
  const { data: projectTeam } = useGetProjectTeam(jobInfo?.order.id!)

  console.log('jobPrices', jobPrices)

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (projectTeam) {
      const contactPerson = projectTeam.map(value => ({
        label: getLegalName({
          firstName: value.firstName,
          middleName: value.middleName,
          lastName: value.lastName,
        }),
        value: getLegalName({
          firstName: value.firstName,
          middleName: value.middleName,
          lastName: value.lastName,
        }),
        userId: Number(value.userId),
      }))
      setContactPersonList(contactPerson)
    }
  }, [projectTeam])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<{
    name: string
    contactPersonId: number
  }>({
    mode: 'onChange',
    resolver: yupResolver(editJobInfoSchema),
  })

  useEffect(() => {
    if (jobInfo) {
      reset({
        name: jobInfo.name ?? '',
        contactPersonId: jobInfo?.contactPerson?.userId,
      })
    }
  }, [jobInfo])

  const onJobInfoSave = () => {
    const data = getValues()
    openModal({
      type: 'saveJobInfo',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('saveJobInfo')}
          onSave={() => {
            saveJobInfoMutation.mutate({
              jobId: id,
              data: { name: data.name, contactPersonId: data.contactPersonId },
            })
          }}
        />
      ),
    })
  }

  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobInfo')
      },
      onError: () => {
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        )
      },
    },
  )

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box display='flex' gap='8px' alignItems='center'>
              <img src='/images/icons/order-icons/job-detail.svg' alt='' />
              <Typography variant='h5'>{jobInfo?.corporationId}</Typography>
            </Box>
            <IconButton aria-label='close' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        </Grid>
        <TabContext value={value}>
          <Grid item xs={12}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{
                borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              }}
            >
              <CustomTab
                value='jobInfo'
                label='Job info'
                iconPosition='start'
                icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTab
                value='prices'
                label='Prices'
                iconPosition='start'
                icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            </TabList>
          </Grid>

          <Grid item xs={12}>
            <TabPanel value='jobInfo'>
              {editJobInfo ? (
                <Fragment>
                  <Grid item xs={12}>
                    {jobInfo && (
                      <EditJobInfo
                        control={control}
                        errors={errors}
                        row={jobInfo}
                        contactPersonList={contactPersonList}
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display='flex'
                    justifyContent='center'
                    gap='16px'
                  >
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={() => setEditJobInfo(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      disabled={!isValid}
                      onClick={onJobInfoSave}
                    >
                      Save
                    </Button>
                  </Grid>
                </Fragment>
              ) : (
                <Fragment>
                  <Grid item xs={12} display='flex' justifyContent='flex-end'>
                    <Box
                      display='flex'
                      alignItems='center'
                      gap='8px'
                      marginBottom='20px'
                    >
                      <Typography variant='body2'>
                        *Changes will also be applied to the invoice
                      </Typography>
                      <Button
                        variant='outlined'
                        startIcon={<Icon icon='mdi:pencil-outline' />}
                        onClick={() => setEditJobInfo(true)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    {jobInfo && <ViewJobInfo row={jobInfo} />}
                  </Grid>
                </Fragment>
              )}
            </TabPanel>
            <TabPanel value='prices' sx={{ pt: '30px' }}>
              {/* {jobPrices?.priceId === null || editPrices ? (
                    <EditPrices
                      priceUnitsList={priceUnitsList ?? []}
                      itemControl={itemControl}
                      itemErrors={itemErrors}
                      getItem={getItem}
                      setItem={setItem}
                      itemTrigger={itemTrigger}
                      itemReset={itemReset}
                      isItemValid={isItemValid}
                      appendItems={appendItems}
                      fields={items}
                      row={jobInfo}
                      jobPrices={jobPrices!}
                    />
                  ) : (
                    <ViewPrices
                      row={jobInfo}
                      priceUnitsList={priceUnitsList ?? []}
                      itemControl={itemControl}
                      itemErrors={itemErrors}
                      getItem={getItem}
                      setItem={setItem}
                      itemTrigger={itemTrigger}
                      itemReset={itemReset}
                      isItemValid={isItemValid}
                      appendItems={appendItems}
                      fields={items}
                      setEditPrices={setEditPrices}
                      type='view'
                    />
                  )} */}
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </Suspense>
  )
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
