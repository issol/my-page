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
import { saveJobInfo, saveJobPrices } from '@src/apis/job-detail.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'

// ** types & schema
import {
  SaveJobInfoParamsType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import { yupResolver } from '@hookform/resolvers/yup'
import { editJobInfoSchema } from '@src/types/schema/job-detail'

import { toast } from 'react-hot-toast'
import { ItemType } from '@src/types/common/item.type'
import { jobItemSchema } from '@src/types/schema/item.schema'
import ViewPrices from './components/prices'
import EditPrices from '@src/pages/orders/job-list/detail-view/components/prices/edit-prices'
import { PriceUnitListType } from '@src/types/common/standard-price'

type Props = {
  id: number
  priceUnitsList: Array<PriceUnitListType>
  onClose: () => void
}
type MenuType = 'jobInfo' | 'prices'

export default function JobDetail({ id, priceUnitsList, onClose }: Props) {
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const [value, setValue] = useState<MenuType>('jobInfo')
  const [edit, setEdit] = useState<MenuType | null>(null)

  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string; userId: any }[]
  >([])

  const { data: jobInfo, isLoading } = useGetJobInfo(id, false)
  const { data: jobPrices } = useGetJobPrices(id, false)
  const { data: projectTeam } = useGetProjectTeam(jobInfo?.order.id!)

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
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    trigger: itemTrigger,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [] },
    resolver: yupResolver(jobItemSchema),
  })

  const {
    fields: items,
    append: appendItems,
    remove: removeItems,
    update: updateItems,
  } = useFieldArray({
    control: itemControl,
    name: 'items',
  })

  useEffect(() => {
    if (jobPrices) {
      const result = [
        {
          id: jobPrices.id!,
          name: jobPrices.priceName!,
          source: jobPrices.source!,
          target: jobPrices.target!,
          priceId: jobPrices.priceId!,
          detail: !jobPrices.datas.length ? [] : jobPrices.datas!,

          totalPrice: Number(jobPrices?.totalPrice!),
        },
      ]
      // console.log(result)

      itemReset({ items: result })
    } else {
      appendItems({
        itemName: '',
        source: 'en',
        target: 'ko',
        priceId: null,
        detail: [],
        totalPrice: 0,
        minimumPrice: null,
        minimumPriceApplied: false,
        priceFactor: 0,
      })
    }
  }, [jobPrices])

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

  const onPricesSave = () => {
    const data = getItem(`items.${0}`)

    const res: SaveJobPricesParamsType = {
      jobId: id,
      priceId: data.priceId!,
      totalPrice: data.totalPrice,
      currency: data.detail![0].currency,
      detail: data.detail!,
    }

    openModal({
      type: 'saveJobInfo',
      children: (
        <ConfirmSaveAllChanges
          onClose={() => closeModal('saveJobInfo')}
          onSave={() => {
            saveJobPricesMutation.mutate({ jobId: id, prices: res })
          }}
        />
      ),
    })
  }

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
        setEdit(null)
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

  const saveJobPricesMutation = useMutation(
    (data: { jobId: number; prices: SaveJobPricesParamsType }) =>
      saveJobPrices(data.jobId, data.prices),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobPrices')
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

  function renderEditButton() {
    return (
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <Box display='flex' alignItems='center' gap='8px' marginBottom='20px'>
          <Typography variant='body2'>
            *Changes will also be applied to the invoice
          </Typography>
          <Button
            variant='outlined'
            startIcon={<Icon icon='mdi:pencil-outline' />}
            onClick={() => setEdit(value)}
          >
            Edit
          </Button>
        </Box>
      </Grid>
    )
  }

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
              {edit === 'jobInfo' ? (
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
                      onClick={() => setEdit(null)}
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
                  {renderEditButton()}
                  <Grid item xs={12}>
                    {jobInfo && <ViewJobInfo row={jobInfo} />}
                  </Grid>
                </Fragment>
              )}
            </TabPanel>
            <TabPanel value='prices'>
              <Fragment>
                {edit === 'prices' ? (
                  <Fragment>
                    <Grid item xs={12}>
                      {jobPrices && jobInfo && (
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
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display='flex'
                      justifyContent='center'
                      gap='16px'
                      marginTop='24px'
                    >
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() => setEdit(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        disabled={!isItemValid}
                        onClick={onPricesSave}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Fragment>
                ) : (
                  <Fragment>
                    {renderEditButton()}
                    <Grid item xs={12}>
                      {jobPrices && jobInfo && (
                        <ViewPrices prices={jobPrices} jobInfo={jobInfo} />
                      )}
                    </Grid>
                  </Fragment>
                )}
              </Fragment>
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
