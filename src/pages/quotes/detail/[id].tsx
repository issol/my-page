import {
  Fragment,
  MouseEvent,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react'

// ** style components
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tab,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** rdk
import { useAppDispatch } from '@src/hooks/useRedux'

// ** Next
import { useRouter } from 'next/router'

// ** components
import QuotesProjectInfoDetail from './components/project-info'
import QuotesLanguageItemsDetail from './components/language-items'
import QuotesClientDetail from './components/client'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import ProjectInfoForm from '@src/pages/components/forms/quotes-project-info-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import VersionHistory from './components/version-history'
import VersionHistoryModal from './components/version-history-detail'

// ** react hook form
import { useFieldArray, useForm } from 'react-hook-form'

// ** type & validation
import {
  MemberType,
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import {
  QuotesProjectInfoFormType,
  VersionHistoryType,
} from '@src/types/common/quotes.type'
import {
  quotesProjectInfoDefaultValue,
  quotesProjectInfoSchema,
} from '@src/types/schema/quotes-project-info.schema'
import { useGetPriceList } from '@src/queries/company/standard-price'
import { useGetAllPriceList } from '@src/queries/price-units.query'
import { ItemType } from '@src/types/common/item.type'
import { itemSchema } from '@src/types/schema/item.schema'
import { languageType } from '../add-new'

// ** hook
import useModal from '@src/hooks/useModal'

// ** apis
import {
  useGetClient,
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
  useGetVersionHistory,
} from '@src/queries/quotes.query'
import { deleteQuotes, restoreVersion } from '@src/apis/quotes.api'
import { getPriceList } from '@src/apis/company-price.api'

// ** helpers
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'

// ** react query
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'

// ** permission class
import { quotes } from '@src/shared/const/permission-class'

type MenuType = 'project' | 'history' | 'team' | 'client' | 'item'

/**
 * TODO
 * save 함수 추가
 * project info status변경 api추가
 * download quote, create order기능 구현
 * version history구현
 */

export default function QuotesDetail() {
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const { user } = useContext(AuthContext)
  const { id } = router.query

  const { openModal, closeModal } = useModal()

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('project')

  const User = new quotes(user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  const isCreatable = ability.can('create', User)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (
      menuQuery &&
      ['project', 'history', 'team', 'client', 'item'].includes(menuQuery)
    ) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    router.replace(`/quotes/detail/${id}?menu=${menu}`)
  }, [menu, id])

  const queryClient = useQueryClient()

  // ** 1. Project info
  const [editProject, setEditProject] = useState(false)
  const { data: project, isLoading: isProjectLoading } = useGetProjectInfo(
    Number(id),
  )
  const {
    control: projectInfoControl,
    getValues: getProjectInfoValues,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<QuotesProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: quotesProjectInfoDefaultValue,
    resolver: yupResolver(quotesProjectInfoSchema),
  })

  useEffect(() => {
    if (!isProjectLoading && project) {
      const defaultTimezone = {
        code: '',
        phone: '',
        label: '',
      }
      projectInfoReset({
        status: project.status,
        workName: project.workName,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        category: project.category,
        serviceType: project.serviceType,
        expertise: project.expertise,
        quoteDate: project.quoteDate,
        projectDueDate: {
          date: project.projectDueAt,
          timezone: project.projectDueTimezone ?? defaultTimezone,
        },
        quoteDeadline: {
          date: project.quoteDeadline,
          timezone: project.quoteDeadlineTimezone ?? defaultTimezone,
        },
        quoteExpiryDate: {
          date: project.quoteExpiryDate,
          timezone: project.quoteExpiryDateTimezone ?? defaultTimezone,
        },
        estimatedDeliveryDate: {
          date: project.estimatedDeliveryDate,
          timezone: project.estimatedDeliveryDateTimezone ?? defaultTimezone,
        },
      })
      setTax(project.tax)
    }
  }, [isProjectLoading])

  // ** 2. Language & Items
  const [editItems, setEditItems] = useState(false)
  const { data: itemsWithLang, isLoading: isItemLoading } = useGetLangItem(
    Number(id),
  )
  const [tax, setTax] = useState(0)
  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])
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

  useEffect(() => {
    if (!isItemLoading && itemsWithLang) {
      ;(async function () {
        const priceList = await getPriceList({})
        setLanguagePairs(
          itemsWithLang?.languagePairs?.map(item => {
            return {
              id: String(item.id),
              source: item.source,
              target: item.target,
              price: !item?.price
                ? null
                : priceList.find(price => price.id === item?.price?.id) || null,
            }
          }),
        )
        const result = itemsWithLang?.items?.map(item => {
          return {
            id: item.id,
            name: item.name,
            source: item.source,
            target: item.target,
            priceId: item.priceId,
            detail: !item?.detail?.length ? [] : item.detail,
            analysis: item.analysis ?? [],
            totalPrice: item?.totalPrice ?? 0,
          }
        })
        itemReset({ items: result })
        itemTrigger()
      })()
    }
  }, [isItemLoading])

  // ** 3. Client
  const [editClient, setEditClient] = useState(false)
  const { data: client, isLoading: isClientLoading } = useGetClient(Number(id))
  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    formState: { errors: clientErrors, isValid: isClientValid },
  } = useForm<ClientFormType>({
    mode: 'onChange',
    defaultValues: {
      clientId: null,
      contactPersonId: null,
      addressType: 'shipping',
    },
    resolver: yupResolver(clientSchema),
  })

  useEffect(() => {
    if (!isClientLoading && client) {
      const addressType = client.clientAddress.find(
        address => address.isSelected,
      )?.addressType
      clientReset({
        clientId: client.client.clientId,
        contactPersonId: client?.contactPerson?.id ?? null,
        addressType: addressType === 'additional' ? 'shipping' : addressType,
      })
    }
  }, [isClientLoading])

  // ** 4. Project team
  const [editTeam, setEditTeam] = useState(false)
  const [teamPage, setTeamPage] = useState(0)
  const [teamPageSize, setTeamPageSize] = useState(10)
  const { data: team, isLoading: isTeamLoading } = useGetProjectTeam(Number(id))
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    handleSubmit: submitTeam,
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

  useEffect(() => {
    if (!isTeamLoading && team) {
      const teams: Array<{
        type: MemberType
        id: number | null
        name: string
      }> = team.map(item => ({
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
  }, [isTeamLoading])

  const { data: prices, isSuccess } = useGetPriceList({
    clientId: getClientValue('clientId'),
  })
  const { data: priceUnitsList } = useGetAllPriceList()

  // ** Version history
  const [historyPageSize, setHistoryPageSize] = useState(10)
  const { data: versionHistory, isLoading: versionHistoryLoading } =
    useGetVersionHistory(Number(id!))

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

  const restoreMutation = useMutation((id: number) => restoreVersion(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(`quotes-history-${id}`)
    },
    onError: () => onMutationError(),
  })

  const onClickRestoreVersion = (id: number) => {
    openModal({
      type: 'RestoreConfirmModal',
      children: (
        <ModalWithButtonName
          message='Are you sure you want to restore this version?'
          onClick={() => restoreMutation.mutate(id)}
          onClose={() => closeModal('RestoreConfirmModal')}
          iconType='error'
          rightButtonName='Restore'
        />
      ),
    })
  }

  const onClickVersionHistoryRow = (history: VersionHistoryType) => {
    console.log(history)
    openModal({
      type: 'VersionHistoryModal',
      children: (
        <VersionHistoryModal
          history={history}
          onClose={() => closeModal('VersionHistoryModal')}
          onClick={onClickRestoreVersion}
          isUpdatable={isUpdatable}
        />
      ),
    })
  }

  // ** Submits(save)
  function onSave(callBack: () => void) {
    openModal({
      type: 'EditSaveModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('EditSaveModal')}
          onClick={callBack}
        />
      ),
    })
  }

  function onProjectInfoSave() {
    //
  }
  function onItemSave() {
    //
  }
  function onClientSave() {
    //
  }
  function onProjectTeamSave() {
    //
  }

  function onDiscard({ callback }: { callback: () => void }) {
    openModal({
      type: 'DiscardModal',
      children: (
        <DiscardModal
          onClose={() => {
            callback()
            closeModal('DiscardModal')
          }}
          onClick={() => {
            callback()
            closeModal('DiscardModal')
          }}
        />
      ),
    })
  }

  type RenderSubmitButtonProps = {
    onCancel: () => void
    onSave: () => void
    isValid: boolean
  }

  function renderSubmitButton({
    onCancel,
    onSave,
    isValid,
  }: RenderSubmitButtonProps) {
    return (
      <Grid item xs={12}>
        <Box display='flex' gap='16px' justifyContent='center'>
          <Button variant='outlined' color='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button variant='contained' disabled={!isValid} onClick={onSave}>
            Save
          </Button>
        </Box>
      </Grid>
    )
  }

  const deleteQuotesMutation = useMutation((id: number) => deleteQuotes(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-quotes/list', 'get-quotes/calendar'],
      })
      router.push('/quotes')
    },
    onError: () => onMutationError(),
  })

  const onClickDelete = () => {
    openModal({
      type: 'DeleteOrderModal',
      children: (
        <DeleteConfirmModal
          onClose={() => closeModal('DeleteOrderModal')}
          onDelete={() => deleteQuotesMutation.mutate(Number(id))}
          message='Are you sure you want to delete this order?'
          title={`[${project?.corporationId}] ${project?.projectName}`}
        />
      ),
    })
  }

  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
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
            {editProject || editItems || editClient || editTeam ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/quotes')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img
                src='/images/icons/quotes-icons/book.png'
                alt=''
                width='50px'
                height='50px'
              />
              <Typography variant='h5'>{project?.corporationId}</Typography>
            </Box>
          </Box>
          <Box display='flex' alignItems='center' gap='14px'>
            <Button
              variant='outlined'
              sx={{ display: 'flex', gap: '8px' }}
              // onClick={onClickDownloadOrder}
            >
              <Icon icon='material-symbols:request-quote' />
              Download quote
            </Button>
            <Button
              variant='outlined'
              // onClick={onClickDownloadOrder}
            >
              Create order
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={menu}>
          <TabList
            onChange={(e, v) => setMenu(v)}
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
              icon={<Icon icon='mdi:account-star-outline' fontSize={'18px'} />}
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
          {/* Project info */}
          <TabPanel value='project' sx={{ pt: '24px' }}>
            <Suspense>
              {editProject ? (
                <Card sx={{ padding: '24px' }}>
                  <DatePickerWrapper>
                    <Grid container spacing={6}>
                      <ProjectInfoForm
                        control={projectInfoControl}
                        setValue={setProjectInfo}
                        watch={projectInfoWatch}
                        errors={projectInfoErrors}
                        clientTimezone={getClientValue('contacts.timezone')}
                      />
                      {renderSubmitButton({
                        onCancel: () =>
                          onDiscard({ callback: () => setEditProject(false) }),
                        onSave: () => onSave(onProjectInfoSave),
                        isValid: isProjectInfoValid,
                      })}
                    </Grid>
                  </DatePickerWrapper>
                </Card>
              ) : (
                <Fragment>
                  <Card sx={{ padding: '24px' }}>
                    <QuotesProjectInfoDetail
                      project={project}
                      setEditMode={setEditProject}
                      isUpdatable={isUpdatable}
                    />
                  </Card>
                  <Grid container sx={{ mt: '24px' }}>
                    <Grid item xs={4}>
                      <Card sx={{ padding: '20px', width: '100%' }}>
                        <Button
                          variant='outlined'
                          fullWidth
                          color='error'
                          size='large'
                          disabled={!isDeletable}
                          onClick={onClickDelete}
                        >
                          Delete this quote
                        </Button>
                      </Card>
                    </Grid>
                  </Grid>
                </Fragment>
              )}
            </Suspense>
          </TabPanel>
          <TabPanel value='item' sx={{ pt: '24px' }}>
            <Card>
              <CardContent sx={{ padding: '24px' }}>
                <QuotesLanguageItemsDetail
                  languagePairs={languagePairs}
                  setLanguagePairs={setLanguagePairs}
                  clientId={getClientValue('clientId')}
                  priceUnitsList={priceUnitsList || []}
                  itemControl={itemControl}
                  items={items}
                  getItem={getItem}
                  setItem={setItem}
                  itemErrors={itemErrors}
                  isItemValid={isItemValid}
                  removeItems={removeItems}
                  getTeamValues={getTeamValues}
                  appendItems={appendItems}
                  tax={tax}
                  setTax={setTax}
                  isEditMode={editItems}
                  setIsEditMode={setEditItems}
                  isUpdatable={isUpdatable}
                />
                {editItems
                  ? renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditItems(false) }),
                      onSave: () => onSave(onItemSave),
                      isValid: isItemValid,
                    })
                  : null}
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value='client' sx={{ pt: '24px' }}>
            <Card sx={{ padding: '24px' }}>
              {editClient ? (
                <Grid container spacing={6}>
                  <ClientQuotesFormContainer
                    control={clientControl}
                    setValue={setClientValue}
                    watch={clientWatch}
                  />
                  <Grid item xs={12}>
                    {renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditClient(false) }),
                      onSave: () => onSave(onClientSave),
                      isValid: isClientValid,
                    })}
                  </Grid>
                </Grid>
              ) : (
                <QuotesClientDetail
                  client={client}
                  setIsEditMode={setEditClient}
                  isUpdatable={isUpdatable}
                />
              )}
            </Card>
          </TabPanel>
          <TabPanel value='team' sx={{ pt: '24px' }}>
            <Suspense>
              {editTeam ? (
                <Card sx={{ padding: '24px' }}>
                  <Grid container spacing={6}>
                    <ProjectTeamFormContainer
                      control={teamControl}
                      field={members}
                      append={appendMember}
                      remove={removeMember}
                      update={updateMember}
                      setValue={setTeamValues}
                      errors={teamErrors}
                      isValid={isTeamValid}
                      watch={teamWatch}
                    />
                    {renderSubmitButton({
                      onCancel: () =>
                        onDiscard({ callback: () => setEditTeam(false) }),
                      onSave: () => onSave(onProjectTeamSave),
                      isValid: isTeamValid,
                    })}
                  </Grid>
                </Card>
              ) : (
                <Card>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 20px',
                    }}
                  >
                    <Typography variant='h6'>Project team</Typography>
                    {isUpdatable ? (
                      <IconButton onClick={() => setEditTeam(!editTeam)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      '& .MuiDataGrid-columnHeaderTitle': {
                        textTransform: 'none',
                      },
                    }}
                  >
                    <DataGrid
                      autoHeight
                      getRowId={row => row.userId}
                      columns={getProjectTeamColumns()}
                      rows={team ?? []}
                      rowCount={team?.length ?? 0}
                      rowsPerPageOptions={[10, 25, 50]}
                      pagination
                      page={teamPage}
                      pageSize={teamPageSize}
                      onPageChange={setTeamPage}
                      onPageSizeChange={setTeamPageSize}
                      disableSelectionOnClick
                    />
                  </Box>
                </Card>
              )}
            </Suspense>
          </TabPanel>
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <VersionHistory
              list={versionHistory || []}
              listCount={versionHistory?.length!}
              columns={versionHistoryColumns}
              pageSize={historyPageSize}
              setPageSize={setHistoryPageSize}
              onClickRow={onClickVersionHistoryRow}
            />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

QuotesDetail.acl = {
  subject: 'quotes',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
