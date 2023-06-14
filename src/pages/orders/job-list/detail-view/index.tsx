'use client'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, IconButton, Tab, Typography, styled } from '@mui/material'
import Icon from '@src/@core/components/icon'
import useModal from '@src/hooks/useModal'
import {
  SyntheticEvent,
  useState,
  MouseEvent,
  Suspense,
  useEffect,
  useContext,
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
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import {
  useGetAssignProList,
  useGetJobInfo,
  useGetJobPrices,
} from '@src/queries/order/job.query'
import { AuthContext } from '@src/context/AuthContext'

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
} from 'react-query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'

const JobInfoDetailView = ({ tab, row, orderDetail, item, refetch }: Props) => {
  const { openModal, closeModal } = useModal()
  const [value, setValue] = useState<string>(tab ?? 'jobInfo')
  const [success, setSuccess] = useState(false)
  const { user } = useContext(AuthContext)
  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string; userId: any }[]
  >([])

  const [editJobInfo, setEditJobInfo] = useState(false)
  const [editPrices, setEditPrices] = useState(false)

  const { data: jobInfo, isLoading } = useGetJobInfo(row.id, false)
  const { data: jobPrices } = useGetJobPrices(row.id, false)
  const { data: priceUnitsList } = useGetAllClientPriceList()
  const { data: projectTeam } = useGetProjectTeam(orderDetail.id)
  const { data: langItem } = useGetLangItem(orderDetail.id)

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

  console.log(isItemValid)
  console.log(getItem())

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
      console.log(jobPrices)

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
      console.log(result)

      itemReset({ items: result })
    } else {
      appendItems({
        name: '',
        source: 'en',
        target: 'ko',
        priceId: null,
        detail: [],
        totalPrice: 0,
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
                  />
                )}
              </TabPanel>
              <TabPanel value='prices' sx={{ pt: '30px' }}>
                <Suspense>
                  {jobPrices?.priceId === null || editPrices ? (
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
                  )}
                </Suspense>
              </TabPanel>
              <TabPanel value='assignPro' sx={{ pt: '30px' }}>
                <AssignPro
                  user={user!}
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
