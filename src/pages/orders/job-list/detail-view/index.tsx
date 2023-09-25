'use client'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, IconButton, Tab, Typography, styled } from '@mui/material'
import Icon from '@src/@core/components/icon'
import useModal from '@src/hooks/useModal'
import {
  SyntheticEvent,
  useState,
  MouseEvent,
  Suspense,
  useEffect,
  useContext,
  Fragment,
} from 'react'

import Prices from './components/prices/edit-prices'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { useFieldArray, useForm } from 'react-hook-form'
import { ItemType, JobItemType, JobType } from '@src/types/common/item.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema, jobItemSchema } from '@src/types/schema/item.schema'
import { is } from 'date-fns/locale'
import AssignPro from './components/assign-pro/assign-pro'
import {
  AssignProFilterPostType,
  SaveJobPricesParamsType,
} from '@src/types/orders/job-detail'
import {
  useGetAssignableProList,
  useGetJobInfo,
  useGetJobPrices,
} from '@src/queries/order/job.query'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { roleState } from '@src/states/permission'

type Props = {
  tab?: string
  row: JobType
  orderDetail: ProjectInfoType
  item: JobItemType
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
}
import JobHistory from './components/history'
import EditJobInfo from './components/job-info/edit-job-info'
import ViewJobInfo from './components/job-info/view-job-info'
import ViewPrices from './components/prices/view-prices'
import EditPrices from './components/prices/edit-prices'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  useGetLangItem,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { saveJobPrices } from '@src/apis/job-detail.api'
import { useGetStatusList } from '@src/queries/common.query'
import { toast } from 'react-hot-toast'

const JobInfoDetailView = ({ tab, row, orderDetail, item, refetch }: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>(tab ?? 'jobInfo')
  const [success, setSuccess] = useState(false)
  const auth = useRecoilValueLoadable(authState)
  const role = useRecoilValueLoadable(roleState)

  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string; userId: any }[]
  >([])
  const [jobId, setJobId] = useState(row.id)
  const [editJobInfo, setEditJobInfo] = useState(false)
  const [editPrices, setEditPrices] = useState(false)

  const { data: jobInfo, isLoading } = useGetJobInfo(jobId, false)
  // const { data: jobAssignProList } = useGetAssignProList(row.id, {}, false)
  const { data: jobPrices } = useGetJobPrices(jobId, false)
  const { data: priceUnitsList } = useGetAllClientPriceList()
  const { data: projectTeam } = useGetProjectTeam(orderDetail.id)
  const { data: langItem } = useGetLangItem(orderDetail.id)
  const { data: statusList } = useGetStatusList('Job')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

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

  // console.log(isItemValid)
  // console.log(getItem())

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
      console.log("jobPrices-init",jobPrices)

      const result = [
        {
          id: jobPrices.id!,
          name: jobPrices.priceName!,
          itemName: jobPrices.priceName!,
          source: jobPrices.source!,
          target: jobPrices.target!,
          priceId: jobPrices.priceId!,
          detail: !jobPrices.detail?.length ? [] : jobPrices.detail,
          minimumPrice: jobPrices.minimumPrice,
          minimumPriceApplied: jobPrices.minimumPriceApplied,
          initialPrice: jobPrices.initialPrice,
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
        initialPrice: null,
        priceFactor: 0,
      })
    }
  }, [jobPrices])

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [success])

  const saveJobPricesMutation = useMutation(
    (data: { jobId: number; prices: SaveJobPricesParamsType }) =>
      saveJobPrices(data.jobId, data.prices),
    {
      onSuccess: (data, variables) => {
        toast.success('Job info added successfully', {
          position: 'bottom-left',
        })
        setSuccess(true)
        if (data.id === variables.jobId) {
          queryClient.invalidateQueries('jobPrices')
        } else {
          setJobId(data.id)
        }
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      }
    },
  )
  
  const onSubmit = () => {
    const data = getItem(`items.${0}`)

    // toast('Job info added successfully')

    const res: SaveJobPricesParamsType = {
      jobId: row.id,
      priceId: data.priceId!,
      totalPrice: data.totalPrice,
      currency: data.detail![0].currency,
      detail: data.detail!,
    }
    saveJobPricesMutation.mutate({ jobId: row.id, prices: res })
  }
  // console.log(jobPrices)

  const hasGeneralPermission = () => {
    let flag = false
    if (role.state === 'hasValue' && role.getValue()) {
      role.getValue().map(item => {
        if (
          (item.name === 'LPM' ||
            item.name === 'TAD') &&
          item.type === 'General'
        )
          flag = true
      })
    }
    return flag
  }

  // const isJobMember = () => {

  // }

  // export type JobFeatureType = [
  //   | 'button-jobInfo-Edit'
  //   | 'dropdown-jobInfo-Status'
  // ]

  // const canUseFeature = (featureName: JobFeatureType): boolean => {
  //   let flag = false
  
  //   switch (featureName) {
  //     case 'button-jobInfo-Edit':
  //       if (!hasGeneralPermission() ||
  //         (hasGeneralPermission() && )
  //       )
  //   }
    
  //   return flag
  // }
  console.log("role",role.getValue())
  return (
    <>
      {!isLoading && jobInfo ? (
        <Box sx={{ padding: '50px 60px', position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', top: '20px', right: '20px' }}
            onClick={() => closeModal('JobDetailViewModal')}
          >
            <Icon icon='mdi:close'></Icon>
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {success && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 40,
                  left: 40,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',

                  background: ' #FFFFFF',

                  boxShadow: '0px 4px 8px -4px rgba(76, 78, 100, 0.42)',
                  borderRadius: '8px',
                  padding: '12px 10px',
                }}
              >
                <img src='/images/icons/order-icons/success.svg' alt='' />
                Saved successfully
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <img src='/images/icons/order-icons/job-detail.svg' alt='' />
              <Typography variant='h5'>{jobInfo.corporationId}</Typography>
            </Box>

            <TabContext value={value}>
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
                  icon={
                    <Icon icon='iconoir:large-suitcase' fontSize={'18px'} />
                  }
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTab
                  value='prices'
                  label='Prices'
                  iconPosition='start'
                  icon={<Icon icon='mdi:dollar' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTab
                  value='assignPro'
                  label='Assign pro'
                  iconPosition='start'
                  icon={<Icon icon='mdi:account-outline' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
                <CustomTab
                  value='history'
                  label='Request history'
                  iconPosition='start'
                  icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                />
              </TabList>
              <TabPanel value='jobInfo' sx={{ pt: '30px' }}>
                {jobInfo.name === null || editJobInfo ? (
                  <EditJobInfo
                    row={jobInfo}
                    orderDetail={orderDetail}
                    item={item}
                    languagePair={langItem?.languagePairs || []}
                    refetch={refetch!}
                    contactPersonList={contactPersonList}
                    success={success}
                    setSuccess={setSuccess}
                    setEditJobInfo={setEditJobInfo}
                    statusList={statusList!}
                    setJobId={setJobId}
                  />
                ) : (
                  <ViewJobInfo
                    row={jobInfo}
                    setEditJobInfo={setEditJobInfo}
                    type='view'
                    projectTeam={projectTeam || []}
                    item={item}
                    setSuccess={setSuccess}
                    refetch={refetch!}
                    statusList={statusList}
                    auth={auth.getValue()}
                    role={role.getValue()}
                  />
                )}
              </TabPanel>
              <TabPanel value='prices' sx={{ pt: '30px' }}>
                <Suspense>
                  {jobPrices?.priceId === null || editPrices ? (
                    <Fragment>
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
                        setJobId={setJobId}
                      />
                      <Box
                        mt='20px'
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          width: '100%',
                        }}
                      >
                        <Button
                          variant='contained'
                          onClick={onSubmit}
                          disabled={!isItemValid}
                        >
                          Save draft
                        </Button>
                      </Box>
                    </Fragment>
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
                  )}
                </Suspense>
              </TabPanel>
              <TabPanel value='assignPro' sx={{ pt: '30px' }}>
                <AssignPro
                  user={auth.getValue().user!}
                  row={jobInfo}
                  orderDetail={orderDetail}
                  type='view'
                  item={item}
                  refetch={refetch!}
                />
              </TabPanel>
              <TabPanel value='assignPro' sx={{ pt: '30px' }}></TabPanel>
              <TabPanel value='history' sx={{ pt: '30px' }}>
                <JobHistory
                  jobId={jobInfo.id}
                  jobCorId={jobInfo.corporationId}
                  orderDetail={orderDetail}
                  priceUnitsList={priceUnitsList ?? []}
                  item={item}
                  projectTeam={projectTeam || []}
                  statusList={statusList!}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </Box>
      ) : null}
    </>
  )
}

export default JobInfoDetailView

JobInfoDetailView.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
