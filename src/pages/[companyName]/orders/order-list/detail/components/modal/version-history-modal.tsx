import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  styled,
  Switch,
  Tab,
  Typography,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'
import TabContext from '@mui/lab/TabContext'
import { MouseEvent, SyntheticEvent, useEffect, useState } from 'react'
import ProjectInfo from '../project-info'
import OrderDetailClient from '../client'
import ProjectTeam from '../project-team'
import {
  OrderDownloadData,
  ProjectInfoType,
  ProjectTeamListType,
  VersionHistoryType,
} from '@src/types/orders/order-detail'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import ClientOrder from '../client-order'
import LanguageAndItem from '../language-item'
import { languageType } from 'src/pages/[companyName]/orders/add-new'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { ItemType } from '@src/types/common/item.type'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { itemSchema } from '@src/types/schema/item.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import {
  MemberType,
  projectTeamSchema,
  ProjectTeamType,
} from '@src/types/schema/project-team.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'

type Props = {
  history: VersionHistoryType
  project: ProjectInfoType
  onClose: any
  onClick: any
  canUseDisableButton?: boolean
  statusList: {
    value: number
    label: string
  }[]
}

const VersionHistoryModal = ({
  history,
  onClose,
  onClick,
  project,
  canUseDisableButton,
  statusList,
}: Props) => {
  const fieldOrder = ['supervisorId', 'projectManagerId', 'member']
  const teamOrder = ['supervisor', 'projectManager', 'member']
  const auth = useRecoilValueLoadable(authState)
  const [downloadData, setDownloadData] = useState<OrderDownloadData | null>(
    null,
  )
  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const [teams, setTeams] = useState<ProjectTeamListType[]>([])

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const currentRole = getCurrentRole()
  const [value, setValue] = useState<string>(
    currentRole?.name === 'CLIENT' ? '0' : '1',
  )
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
  } = useForm<{ items: ItemType[]; languagePairs: languageType[] }>({
    mode: 'onBlur',
    defaultValues: { items: [], languagePairs: [] },
    resolver: yupResolver(itemSchema) as unknown as Resolver<{
      items: ItemType[]
      languagePairs: languageType[]
    }>,
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
    fields: languagePairs,
    append: appendLanguagePairs,
    remove: removeLanguagePairs,
    update: updateLanguagePairs,
  } = useFieldArray({
    control: itemControl,
    name: 'languagePairs',
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
          id: auth.getValue().user?.userId!,
          name: getLegalName({
            firstName: auth.getValue().user?.firstName!,
            middleName: auth.getValue().user?.middleName,
            lastName: auth.getValue().user?.lastName!,
          }),
        },
        { type: 'member', id: null },
      ],
    },
    resolver: yupResolver(projectTeamSchema) as Resolver<ProjectTeamType>,
  })

  const { data: priceUnitsList } = useGetAllClientPriceList()

  useEffect(() => {
    makePdfData()
    const { items, projectTeam, projectInfo } = history
    if (items) {
      const itemLangPairs = items?.items?.map(item => ({
        id: String(item.id),
        source: item.source!,
        target: item.target!,
        price: {
          id: item.initialPrice?.priceId!,
          isStandard: item.initialPrice?.isStandard!,
          priceName: item.initialPrice?.name!,
          groupName: 'Current price',
          category: item.initialPrice?.category!,
          serviceType: item.initialPrice?.serviceType!,
          currency: item.initialPrice?.currency!,
          catBasis: item.initialPrice?.calculationBasis!,
          decimalPlace: item.initialPrice?.numberPlace!,
          roundingProcedure:
            RoundingProcedureList[item.initialPrice?.rounding!]?.label,
          languagePairs: [],
          priceUnit: [],
          catInterface: { phrase: [], memoQ: [] },
        },
      }))!
      const result = items?.items?.map(item => {
        return {
          id: item.id,
          name: item.itemName,
          itemName: item.itemName,
          source: item.sourceLanguage,
          target: item.targetLanguage,
          priceId: item.priceId,
          detail: !item?.detail?.length
            ? []
            : item.detail.map(value => ({
                ...value,
                priceUnit: value.priceUnit ?? value.initialPriceUnit?.title,
              })),
          contactPerson: item.contactPerson,
          contactPersonId: Number(item.contactPerson?.userId!),
          description: item.description,
          analysis: item.analysis ?? [],
          totalPrice: item?.totalPrice ?? 0,
          dueAt: item?.dueAt,
          showItemDescription: item.showItemDescription,
          initialPrice: item.initialPrice,
          minimumPrice: item.minimumPrice,
          minimumPriceApplied: item.minimumPriceApplied,
        }
      })
      itemReset({ items: result, languagePairs: itemLangPairs })
    }
    if (projectTeam) {
      let viewTeams: ProjectTeamListType[] = [...projectTeam].map(value => ({
        ...value,
        id: uuidv4(),
      }))

      if (!viewTeams.some(item => item.position === 'supervisor')) {
        viewTeams.unshift({
          id: uuidv4(),
          position: 'supervisor',
          userId: -1,
          firstName: '',
          middleName: '',
          lastName: '',
          jobTitle: '',
          email: '',
        })
      }
      if (!viewTeams.some(item => item.position === 'member')) {
        viewTeams.push({
          id: uuidv4(),
          position: 'member',
          userId: 0,
          firstName: '',
          middleName: '',
          lastName: '',
          jobTitle: '',
          email: '',
        })
      }

      const res = viewTeams.sort((a, b) => {
        const aIndex = teamOrder.indexOf(a.position)
        const bIndex = teamOrder.indexOf(b.position)
        return aIndex - bIndex
      })

      if (viewTeams.length) setTeams(res)

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
      if (!teams.some(item => item.type === 'supervisorId')) {
        teams.unshift({ type: 'supervisorId', id: null, name: '' })
      }

      if (!teams.some(item => item.type === 'member')) {
        teams.push({ type: 'member', id: null, name: '' })
      }
      if (teams.length) {
        const res = teams.sort((a, b) => {
          const aIndex = fieldOrder.indexOf(a.type)
          const bIndex = fieldOrder.indexOf(b.type)
          return aIndex - bIndex
        })

        resetTeam({ teams: res })
      }
    }
  }, [history])

  function makePdfData() {
    const pm = history?.projectTeam?.find(
      value => value.position === 'projectManager',
    )

    const res: OrderDownloadData = {
      orderId: Number(history.id),
      adminCompanyName: 'GloZ Inc.',
      companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
      corporationId: history?.projectInfo!.corporationId,
      orderedAt: history?.projectInfo!.orderedAt,
      projectDueAt: {
        date: history?.projectInfo!.projectDueAt,
        timezone: history?.projectInfo!.projectDueTimezone,
      },
      pm: {
        firstName: pm?.firstName!,
        lastName: pm?.lastName!,
        email: pm?.email!,
        middleName: pm?.middleName!,
      },
      companyName: history?.client!.client.name,
      projectName: history?.projectInfo!.projectName,
      client: history?.client!,
      contactPerson: history?.client!.contactPerson,
      clientAddress: history?.client!.clientAddress,
      langItem: history?.items!,
      subtotal: history?.projectInfo!.subtotal,
    }

    setDownloadData(res)
  }

  const isIncludeProjectTeam = () => {
    return Boolean(
      (currentRole?.name !== 'CLIENT' &&
        (currentRole?.type === 'Master' || currentRole?.type === 'Manager')) ||
        (currentRole?.type === 'General' &&
          history.projectTeam?.length &&
          history.projectTeam.some(
            item => item.userId === auth.getValue().user?.id!,
          )),
    )
  }

  return (
    <Box
      sx={{
        maxWidth: '1266px',
        width: '100%',
        maxHeight: '900px',
        // height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img src='/images/icons/order-icons/book.png' alt='' />
          <Typography variant='h5'>{`[Ver. ${history.version}] ${history.projectInfo.corporationId}`}</Typography>
        </Box>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            {currentRole?.name !== 'CLIENT' ? null : (
              <CustomTap
                value='0'
                label='Order'
                iconPosition='start'
                icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}
            <CustomTap
              value='1'
              label='Project info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='2'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {currentRole && currentRole.name === 'CLIENT' ? null : (
              <CustomTap
                value='3'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}

            <CustomTap
              value='4'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel
            value='0'
            sx={{
              height: '100%',
              maxHeight: '552px',
              minHeight: '552px',
              overflow: 'scroll',
            }}
          >
            {downloadData ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'start', mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={downloadLanguage === 'KO' ? 400 : 600}
                      color={downloadLanguage === 'KO' ? '#BDBDBD' : '#666CFF'}
                    >
                      English
                    </Typography>
                    <Switch
                      checked={downloadLanguage === 'KO'}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setDownloadLanguage &&
                          setDownloadLanguage(
                            event.target.checked ? 'KO' : 'EN',
                          )
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                      sx={{
                        '.MuiSwitch-switchBase:not(.Mui-checked)': {
                          color: '#666CFF',
                          '.MuiSwitch-thumb': {
                            color: '#666CFF',
                          },
                        },
                        '.MuiSwitch-track': {
                          backgroundColor: '#666CFF',
                        },
                      }}
                    />
                    <Typography
                      fontSize={14}
                      fontWeight={downloadLanguage === 'KO' ? 600 : 400}
                      color={downloadLanguage === 'KO' ? '#666CFF' : '#BDBDBD'}
                    >
                      Korean
                    </Typography>
                  </Box>
                </Box>
                <Card>
                  <ClientOrder
                    downloadData={downloadData!}
                    user={auth.getValue().user!}
                    downloadLanguage={downloadLanguage}
                    setDownloadLanguage={setDownloadLanguage}
                    type='history'
                    statusList={statusList!}
                    project={project!}
                  />
                </Card>
              </>
            ) : null}
          </TabPanel>
          <TabPanel
            value='1'
            sx={{
              height: '100%',
              maxHeight: '552px',
              minHeight: '552px',
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <ProjectInfo
              type='history'
              project={history.projectInfo}
              isUpdatable={false}
              role={currentRole!}
              canUseFeature={() => false}
              jobInfo={[]}
              statusList={statusList}
              client={{ ...history.client, isEnrolledClient: true }}
            />
          </TabPanel>
          <TabPanel
            value='2'
            // sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <Card
              sx={{
                padding: '0 24px 24px 24px',
                overflow: 'scroll',
                maxHeight: '552px',
              }}
            >
              <LanguageAndItem
                // languagePairs={languagePairs!}
                setLanguagePairs={(languagePair: languageType[]) =>
                  setItem('languagePairs', languagePair)
                }
                clientId={history.client.client.clientId}
                itemControl={itemControl}
                getItem={getItem}
                setItem={setItem}
                itemTrigger={itemTrigger}
                itemErrors={itemErrors}
                priceUnitsList={priceUnitsList || []}
                items={items}
                removeItems={removeItems}
                getTeamValues={getTeamValues}
                appendItems={appendItems}
                orderId={Number(project.id!)}
                langItemsEdit={false}
                project={history.projectInfo!}
                isIncludeProjectTeam={isIncludeProjectTeam()}
                type='history'
                languagePairs={languagePairs}
                appendLanguagePairs={appendLanguagePairs}
                updateLanguagePairs={updateLanguagePairs}
              />
            </Card>
          </TabPanel>
          <TabPanel
            value='3'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <OrderDetailClient
              type='history'
              client={history.client}
              project={history.projectInfo}
            />
          </TabPanel>
          <TabPanel
            value='4'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <ProjectTeam
              type='history'
              list={teams}
              listCount={history.projectTeam.length}
              columns={getProjectTeamColumns(currentRole?.name)}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </TabPanel>
        </TabContext>
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant='outlined'
            color='secondary'
            sx={{ width: '226px' }}
            onClick={onClose}
          >
            Close
          </Button>
          {canUseDisableButton ? (
            <Button
              variant='contained'
              sx={{ width: '226px' }}
              onClick={onClick}
              // disabled={canUseDisableButton}
            >
              Restore this version
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default VersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
