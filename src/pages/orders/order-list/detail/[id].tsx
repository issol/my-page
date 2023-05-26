import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import {
  ChangeEvent,
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import ProjectInfo from './components/project-info'
import OrderDetailClient from './components/client'
import {
  OrderDownloadData,
  ProjectTeamCellType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { GridColumns } from '@mui/x-data-grid'
import ProjectTeam from './components/project-team'
import VersionHistory from './components/version-history'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { AuthContext } from '@src/context/AuthContext'
import useModal from '@src/hooks/useModal'
import VersionHistoryModal from './components/modal/version-history-modal'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { useRouter } from 'next/router'
import {
  useGetClient,
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
  useGetVersionHistory,
} from '@src/queries/order/order.query'
import DownloadOrderModal from './components/modal/download-order-modal'
import OrderPreview from './components/order-preview'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import { setOrder, setOrderLang } from '@src/store/order'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import { useMutation, useQueryClient } from 'react-query'
import { deleteOrder } from '@src/apis/order-detail.api'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import LanguageAndItem from './components/language-item'
import { defaultOption, languageType } from '../../add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useFieldArray, useForm } from 'react-hook-form'
import { ItemType } from '@src/types/common/item.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { itemSchema } from '@src/types/schema/item.schema'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
interface Detail {
  id: number
  quantity: number
  priceUnit: string
  unit: string
  price: number
  totalPrice: number
}

export interface Row {
  id: number
  name: string
  source: string
  target: string
  detail: Detail[]
}

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item'
const OrderDetail = () => {
  const router = useRouter()
  const menuQuery = router.query.menu as MenuType
  const { id } = router.query
  const { user } = useContext(AuthContext)

  const [value, setValue] = useState<MenuType>('project')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (
      menuQuery &&
      ['project', 'history', 'team', 'client', 'item'].includes(menuQuery)
    ) {
      setValue(menuQuery)
    }
  }, [menuQuery])

  // useEffect(() => {
  //   router.replace(`/orders/order-list/detail/${id}?menu=${value}`)
  // }, [value])

  const { data: projectInfo, isLoading: projectInfoLoading } =
    useGetProjectInfo(Number(id!))
  const { data: projectTeam, isLoading: projectTeamLoading } =
    useGetProjectTeam(Number(id!))
  const { data: client, isLoading: clientLoading } = useGetClient(Number(id!))

  const { data: versionHistory, isLoading: versionHistoryLoading } =
    useGetVersionHistory(Number(id!))
  const { data: langItem, isLoading: langItemLoading } = useGetLangItem(
    Number(id!),
  )

  const { data: priceUnitsList } = useGetAllPriceList()

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
    resolver: yupResolver(itemSchema),
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

  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    watch: teamWatch,
    reset: resetTeam,
    formState: { errors: teamErrors, isValid: isTeamValid },
  } = useForm<ProjectTeamType>({
    mode: 'onChange',
    defaultValues: {
      teams: [
        { type: 'supervisorId', id: null },
        {
          type: 'projectManagerId',
          id: user?.userId!,
          name: getLegalName({
            firstName: user?.firstName!,
            middleName: user?.middleName,
            lastName: user?.lastName!,
          }),
        },
        { type: 'member', id: null },
      ],
    },
    resolver: yupResolver(projectTeamSchema),
  })

  const {
    fields: members,
    append: appendMember,
    remove: removeMember,
    update: updateMember,
  } = useFieldArray({
    control: teamControl,
    name: 'teams',
  })

  const [projectInfoEdit, setProjectInfoEdit] = useState(false)
  const [clientEdit, setClientEdit] = useState(false)
  const [projectTeamEdit, setProjectTeamEdit] = useState(false)
  const [langItemsEdit, setLangItemsEdit] = useState(false)
  const order = useAppSelector(state => state.order)

  const [projectTeamListPage, setProjectTeamListPage] = useState<number>(0)
  const [projectTeamListPageSize, setProjectTeamListPageSize] =
    useState<number>(10)

  const [versionHistoryListPage, setVersionHistoryListPage] =
    useState<number>(0)

  const [versionHistoryListPageSize, setVersionHistoryListPageSize] =
    useState<number>(5)

  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const { data: prices, isSuccess } = useGetPriceList({
    clientId: client?.client.clientId,
  })

  function getPriceOptions(source: string, target: string) {
    if (!isSuccess) return [defaultOption]
    const filteredList = prices
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard client price' : 'Matching price',
        ...item,
      }))
    return [defaultOption].concat(filteredList)
  }

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

  const initializeData = () => {
    setLanguagePairs(
      langItem?.languagePairs?.map(item => ({
        id: String(item.id),
        source: item.source,
        target: item.target,
        price: !item?.price
          ? null
          : getPriceOptions(item.source, item.target).filter(
              price => price.id === item?.price?.id!,
            )[0],
      }))!,
    )
    const result = langItem?.items?.map(item => {
      return {
        id: item.id,
        name: item.name,
        source: item.source,
        target: item.target,
        priceId: item.priceId,
        detail: !item?.detail?.length ? [] : item.detail,
        contactPersonId: item.contactPersonId,
        description: item.description,
        analysis: item.analysis ?? [],
        totalPrice: item?.totalPrice ?? 0,
        dueAt: item?.dueAt,
      }
    })
    itemReset({ items: result })
    const teams: Array<{
      type: MemberType
      id: number | null
      name: string
    }> = projectTeam!.map(item => ({
      type:
        item.position === 'projectManager'
          ? 'projectManagerId'
          : item.position === 'supervisor'
          ? 'supervisorId'
          : 'member',
      id: item.userId,
      name: getLegalName({
        firstName: item?.firstName!,
        middleName: item?.middleName,
        lastName: item?.lastName!,
      }),
    }))
    resetTeam({ teams })
  }

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    if (projectInfoEdit || clientEdit || projectTeamEdit || langItemsEdit) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setValue(newValue)
              setProjectInfoEdit(false)
              setClientEdit(false)
              setProjectTeamEdit(false)
              setLangItemsEdit(false)
            }}
          />
        ),
      })
      return
    }

    if (newValue === 'item') {
      initializeData()
    }

    setValue(newValue)
  }

  const deleteOrderMutation = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('orderList')
      router.push('/orders/order-list')
    },
  })

  const handleRestoreVersion = () => {
    // TODO API 연결
  }

  const onClickRestoreVersion = () => {
    openModal({
      type: 'RestoreConfirmModal',
      children: (
        <CustomModal
          onClose={() => closeModal('RestoreConfirmModal')}
          onClick={() => {
            closeModal('RestoreConfirmModal')
            closeModal('VersionHistoryModal')
            handleRestoreVersion()
          }}
          title='Are you sure you want to restore this version?'
          vary='error'
          rightButtonText='Restore'
        />
      ),
    })
  }

  const onClickVersionHistoryRow = (history: VersionHistoryType) => {
    openModal({
      type: 'VersionHistoryModal',
      children: (
        <VersionHistoryModal
          history={history}
          onClose={() => closeModal('VersionHistoryModal')}
          onClick={onClickRestoreVersion}
        />
      ),
    })
  }

  const onClickPreview = (lang: 'EN' | 'KO') => {
    dispatch(setOrderLang(lang))
    openModal({
      type: 'PreviewModal',
      children: (
        <OrderPreview
          onClose={() => closeModal('PreviewModal')}
          data={order.orderTotalData!}
          lang={lang}
        />
      ),
    })
  }

  const onClickDownloadOrder = () => {
    openModal({
      type: 'DownloadOrderModal',
      children: (
        <DownloadOrderModal
          onClose={() => closeModal('DownloadOrderModal')}
          onClick={onClickPreview}
        />
      ),
    })
  }

  const versionHistoryColumns: GridColumns<VersionHistoryType> = [
    {
      field: 'position',
      flex: 0.3,
      minWidth: 419,
      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Version</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return <Box>Ver. {row.version}</Box>
      },
    },
    {
      minWidth: 420,
      field: 'member',
      headerName: 'Member',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Account</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return <Box>{row.email}</Box>
      },
    },
    {
      minWidth: 410,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date&Time</Box>,
      renderCell: ({ row }: { row: VersionHistoryType }) => {
        return (
          <Box>{FullDateTimezoneHelper(row.downloadedAt, user?.timezone!)}</Box>
        )
      },
    },
  ]

  useEffect(() => {
    if (
      !projectInfoLoading &&
      !projectTeamLoading &&
      !clientLoading &&
      !langItemLoading
    ) {
      const pm = projectTeam!.find(value => value.position === 'projectManager')

      const res: OrderDownloadData = {
        orderId: Number(id!),
        adminCompanyName: 'GloZ Inc.',
        companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
        corporationId: projectInfo!.corporationId,
        orderedAt: projectInfo!.orderedAt,
        projectDueAt: {
          date: projectInfo!.projectDueAt,
          timezone: projectInfo!.projectDueTimezone,
        },
        pm: {
          firstName: pm?.firstName!,
          lastName: pm?.lastName!,
          email: pm?.email!,
          middleName: pm?.middleName!,
        },
        companyName: client!.client.name,
        projectName: projectInfo!.projectName,
        client: client!,
        contactPerson: client!.contactPerson,
        clientAddress: client!.clientAddress,
        langItem: langItem!,
      }
      dispatch(setOrder(res))
    }
  }, [
    dispatch,
    projectInfoLoading,
    projectTeamLoading,
    clientLoading,
    langItemLoading,
  ])

  useEffect(() => {
    if (langItem) {
      setLanguagePairs(
        langItem?.languagePairs?.map(item => ({
          id: String(item.id),
          source: item.source,
          target: item.target,
          price: !item?.price
            ? null
            : getPriceOptions(item.source, item.target).filter(
                price => price.id === item?.price?.id!,
              )[0],
        }))!,
      )
      const result = langItem?.items?.map(item => {
        return {
          id: item.id,
          name: item.name,
          source: item.source,
          target: item.target,
          priceId: item.priceId,
          detail: !item?.detail?.length ? [] : item.detail,
          contactPersonId: item.contactPersonId,
          description: item.description,
          analysis: item.analysis ?? [],
          totalPrice: item?.totalPrice ?? 0,
          dueAt: item?.dueAt,
        }
      })
      itemReset({ items: result })
    }
    if (projectTeam) {
      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = projectTeam.map(item => ({
        type:
          item.position === 'projectManager'
            ? 'projectManagerId'
            : item.position === 'supervisor'
            ? 'supervisorId'
            : 'member',
        id: item.userId,
        name: getLegalName({
          firstName: item?.firstName!,
          middleName: item?.middleName,
          lastName: item?.lastName!,
        }),
      }))
      resetTeam({ teams })
    }
  }, [langItem, projectTeam])

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            background: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {projectInfoEdit ||
            projectTeamEdit ||
            clientEdit ||
            langItemsEdit ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/order-icons/book.svg' alt='' />
              <Typography variant='h5'>{projectInfo?.corporationId}</Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              onClick={onClickDownloadOrder}
            >
              <Icon icon='material-symbols:request-quote' />
              Download order
            </Button>
          </Box>
        </Box>
        <Box>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='Order detail Tab menu'
              style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              <CustomTap
                value='project'
                label='Project info'
                iconPosition='start'
                icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='item'
                label='Languages & Items'
                iconPosition='start'
                icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='client'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='team'
                label='Project team'
                iconPosition='start'
                icon={
                  <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
              <CustomTap
                value='history'
                label='Version history'
                iconPosition='start'
                icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            </TabList>
            <TabPanel value='project' sx={{ pt: '24px' }}>
              <Suspense>
                <ProjectInfo
                  type={'detail'}
                  projectInfo={projectInfo!}
                  edit={projectInfoEdit}
                  setEdit={setProjectInfoEdit}
                  orderId={Number(id!)}
                />
              </Suspense>
            </TabPanel>
            <TabPanel value='item' sx={{ pt: '24px' }}>
              <LanguageAndItem
                langItem={langItem!}
                languagePairs={languagePairs!}
                setLanguagePairs={setLanguagePairs}
                clientId={client?.client.clientId!}
                itemControl={itemControl}
                getItem={getItem}
                setItem={setItem}
                itemTrigger={itemTrigger}
                itemErrors={itemErrors}
                isItemValid={isItemValid}
                priceUnitsList={priceUnitsList || []}
                items={items}
                removeItems={removeItems}
                getTeamValues={getTeamValues}
                projectTax={projectInfo!.tax}
                appendItems={appendItems}
                orderId={Number(id!)}
                langItemsEdit={langItemsEdit}
                setLangItemsEdit={setLangItemsEdit}
              />
            </TabPanel>
            <TabPanel value='client' sx={{ pt: '24px' }}>
              <OrderDetailClient
                type={'detail'}
                client={client!}
                edit={clientEdit}
                setEdit={setClientEdit}
                orderId={Number(id!)}
              />
            </TabPanel>
            <TabPanel value='team' sx={{ pt: '24px' }}>
              <Suspense>
                <ProjectTeam
                  type='detail'
                  list={projectTeam!}
                  listCount={projectTeam?.length!}
                  columns={getProjectTeamColumns()}
                  page={projectTeamListPage}
                  setPage={setProjectTeamListPage}
                  pageSize={projectTeamListPageSize}
                  setPageSize={setProjectTeamListPageSize}
                  edit={projectTeamEdit}
                  setEdit={setProjectTeamEdit}
                  teamControl={teamControl}
                  members={members}
                  appendMember={appendMember}
                  removeMember={removeMember}
                  updateMember={updateMember}
                  getTeamValues={getTeamValues}
                  setTeamValues={setTeamValues}
                  teamErrors={teamErrors}
                  isTeamValid={isTeamValid}
                  teamWatch={teamWatch}
                  orderId={Number(id!)}
                />
              </Suspense>
            </TabPanel>
            <TabPanel value='history' sx={{ pt: '24px' }}>
              <VersionHistory
                list={versionHistory!}
                listCount={versionHistory?.length!}
                columns={versionHistoryColumns}
                page={versionHistoryListPage}
                setPage={setVersionHistoryListPage}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Grid>
  )
}

export default OrderDetail

OrderDetail.acl = {
  subject: 'order',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
