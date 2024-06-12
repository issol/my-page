import {
  Fragment,
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'

// ** style components
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Tab,
  Typography,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import CloseIcon from '@mui/icons-material/Close'

// ** components
import FallbackSpinner from '@src/@core/components/spinner'
import ViewJobInfo from './components/job-info'
import EditJobInfo from './components/job-info-form'
import ConfirmSaveAllChanges from 'src/pages/[companyName]/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** apis
import {
  useGetJobDetails,
  useGetJobInfo,
  useGetJobPrices,
} from '@src/queries/order/job.query'
import { useGetProjectTeam } from '@src/queries/order/order.query'
import { saveJobInfo, saveJobPrices } from '@src/apis/jobs/job-detail.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
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
import { ItemType, JobItemType, JobType } from '@src/types/common/item.type'
import { jobItemSchema } from '@src/types/schema/item.schema'
import ViewPrices from './components/prices'

import { PriceUnitListType } from '@src/types/common/standard-price'
import { useGetStatusList } from '@src/queries/common.query'
import { languageType } from 'src/pages/[companyName]/orders/add-new'
import { useGetProPriceList } from '@src/queries/company/standard-price'
import {
  jobPriceHistoryType,
  JobPricesDetailType,
} from '@src/types/jobs/jobs.type'
import EditPrices from 'src/pages/[companyName]/orders/job-list/detail/components/prices/edit-prices'

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

  const { data: jobInfo } = useGetJobInfo(id, false) as { data: JobType }
  const { data: jobPrices } = useGetJobPrices(id, false) as {
    data: JobPricesDetailType | jobPriceHistoryType
  }
  const { data: projectTeam } = useGetProjectTeam(jobInfo?.order.id!)
  const { data: statusList } = useGetStatusList('Job')
  const { data: jobDetails } = useGetJobDetails(jobInfo?.order.id!, true)

  const { data: prices, isSuccess } = useGetProPriceList({})
  const [priceId, setPriceId] = useState<number | null>(null)
  const [isNotApplicable, setIsNotApplicable] = useState<boolean>(false)

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
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(jobItemSchema) as unknown as Resolver<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
    context: {
      priceId: priceId,
    },
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
          detail: !jobPrices.detail?.length
            ? []
            : jobPrices.detail.map(value => ({
                ...value,
                priceUnitId: value.priceUnitId ?? value.id,
              })),
          minimumPrice: jobPrices.minimumPrice,
          minimumPriceApplied: jobPrices.minimumPriceApplied,
          initialPrice: jobPrices.initialPrice,
          totalPrice: Number(jobPrices?.totalPrice!),
          priceFactor: Number(jobPrices.languagePair?.priceFactor ?? 0),
        },
      ]

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
        currency: null,
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

  function findItemWithJobId(
    data: {
      id: number
      cooperationId: string
      items: JobItemType[]
    },
    jobId: number,
  ) {
    // `data.items` 배열을 순회하면서 `jobId`와 일치하는 `id`를 포함하는 `item`을 찾습니다.
    for (const item of data.items) {
      // `item.jobs` 배열 내에서 `jobId`와 일치하는 `id`를 가진 `job`을 찾습니다.
      const foundJob = item.jobs.find(job => job.id === jobId)
      // 일치하는 `job`을 찾았다면, 해당 `item`을 반환합니다.
      if (foundJob) {
        return item
      }
    }
    // 일치하는 `item`을 찾지 못했다면, `null`을 반환합니다.
    // return null;
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
                    {jobInfo && (
                      <ViewJobInfo row={jobInfo} jobStatusList={statusList!} />
                    )}
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
                          orderItems={[]}
                          item={findItemWithJobId(jobDetails!, jobInfo.id!)}
                          prices={prices}
                          setPriceId={setPriceId}
                          isNotApplicable={isNotApplicable}
                          setIsNotApplicable={setIsNotApplicable}
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
