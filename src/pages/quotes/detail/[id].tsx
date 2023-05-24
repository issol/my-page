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

// ** contexts
import { AuthContext } from '@src/context/AuthContext'

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
import { QuotesProjectInfoFormType } from '@src/types/common/quotes.type'
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
} from '@src/queries/quotes.query'
import { getPriceList } from '@src/apis/company-price.api'
import { DataGrid } from '@mui/x-data-grid'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import ProjectTeamFormContainer from '../components/form-container/project-team-container'
type MenuType = 'project' | 'history' | 'team' | 'client' | 'item'

/**
 * TODO
 * save, delete함수 추가
 * download quote, create order기능 구현
 * version history구현
 */

export default function QuotesDetail() {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { id } = router.query

  const { openModal, closeModal } = useModal()

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('project')

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
    mode: 'onBlur',
    defaultValues: quotesProjectInfoDefaultValue,
    resolver: yupResolver(quotesProjectInfoSchema),
  })

  useEffect(() => {
    if (!isProjectLoading && project) {
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
          timezone: project.projectDueTimezone,
        },
        quoteDeadline: {
          date: project.quoteDeadline,
          timezone: project.quoteDeadlineTimezone,
        },
        quoteExpiryDate: {
          date: project.quoteExpiryDate,
          timezone: project.quoteExpiryDateTimezone,
        },
        estimatedDeliveryDate: {
          date: project.estimatedDeliveryDate,
          timezone: project.estimatedDeliveryDateTimezone,
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

  function onClientSave() {
    //
  }

  function onDiscard(callback: () => void) {
    openModal({
      type: 'DiscardModal',
      children: (
        <DiscardModal
          onClose={() => {
            callback()
            closeModal('DiscardModal')
          }}
          onClick={() => {
            setEditClient(false)
            closeModal('DiscardModal')
          }}
        />
      ),
    })
  }

  function renderSubmitButton(
    onCancel: () => void,
    onSave: () => void,
    isValid: boolean,
  ) {
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
            {/* {projectInfoEdit ||
            projectTeamEdit ||
            clientEdit ||
            langItemsEdit ? null : (
              <IconButton
                sx={{ padding: '0 !important', height: '24px' }}
                onClick={() => router.push('/orders/order-list')}
              >
                <Icon icon='mdi:chevron-left' width={24} height={24} />
              </IconButton>
            )} */}
            <IconButton
              sx={{ padding: '0 !important', height: '24px' }}
              onClick={() => router.push('/quotes')}
            >
              <Icon icon='mdi:chevron-left' width={24} height={24} />
            </IconButton>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src='/images/icons/quotes-icons/book.png' alt='' />
              {/* <Typography variant='h5'>{projectInfo?.corporationId}</Typography> */}
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
                      {renderSubmitButton(
                        () =>
                          onDiscard(() => {
                            setEditProject(false)
                          }),
                        () => null,
                        isProjectInfoValid,
                      )}
                    </Grid>
                  </DatePickerWrapper>
                </Card>
              ) : (
                <Fragment>
                  <Card sx={{ padding: '24px' }}>
                    <QuotesProjectInfoDetail
                      project={project}
                      setEditMode={setEditProject}
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
                          // onClick={onClickDelete}
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
                />
                {editItems
                  ? renderSubmitButton(
                      () =>
                        onDiscard(() => {
                          setEditItems(false)
                        }),
                      () => null,
                      isItemValid,
                    )
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
                    {renderSubmitButton(
                      () =>
                        onDiscard(() => {
                          setEditClient(false)
                        }),
                      () =>
                        openModal({
                          type: 'EditSaveModal',
                          children: (
                            <EditSaveModal
                              onClose={() => closeModal('EditSaveModal')}
                              onClick={onClientSave}
                            />
                          ),
                        }),
                      isClientValid,
                    )}
                  </Grid>
                </Grid>
              ) : (
                <QuotesClientDetail
                  client={client}
                  setIsEditMode={setEditClient}
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
                    {renderSubmitButton(
                      () =>
                        onDiscard(() => {
                          setEditTeam(false)
                        }),
                      () =>
                        openModal({
                          type: 'EditSaveModal',
                          children: (
                            <EditSaveModal
                              onClose={() => closeModal('EditSaveModal')}
                              onClick={onClientSave}
                            />
                          ),
                        }),
                      isTeamValid,
                    )}
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
                    <IconButton onClick={() => setEditTeam(!editTeam)}>
                      <Icon icon='mdi:pencil-outline' />
                    </IconButton>
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
            {/* <VersionHistory
                list={versionHistory!}
                listCount={versionHistory?.length!}
                columns={versionHistoryColumns}
                page={versionHistoryListPage}
                setPage={setVersionHistoryListPage}
                pageSize={versionHistoryListPageSize}
                setPageSize={setVersionHistoryListPageSize}
                onClickRow={onClickVersionHistoryRow}
              /> */}
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
