import {
  Fragment,
  MouseEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'

// ** style components
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import Icon from '@src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import TabContext from '@mui/lab/TabContext'

import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'

// ** types
import {
  QuoteDownloadData,
  VersionHistoryType,
} from '@src/types/common/quotes.type'

// ** components
import QuotesProjectInfoDetail from './project-info'
import QuotesClientDetail from './client'
import LanguagePairTable from '@src/pages/components/language-pair-detail'
import { useGetClientPriceList } from '@src/queries/company/standard-price'
import ItemDetail from '@src/pages/components/item-detail'
import { getCurrentRole } from '@src/shared/auth/storage'
import ClientQuote from './client-quote'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { useGetStatusList } from '@src/queries/common.query'
import { StandardPriceListType } from '@src/types/common/standard-price'

type Props = {
  id?: number
  history: VersionHistoryType
}

const VersionHistoryModal = ({ id, history }: Props) => {
  const currentRole = getCurrentRole()
  const [value, setValue] = useState<string>(
    currentRole && currentRole.name === 'CLIENT' ? 'quote' : 'project',
  )
  const { data: statusList } = useGetStatusList('Quote')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const [downloadData, setDownloadData] = useState<QuoteDownloadData | null>(
    null,
  )

  const [pageSize, setPageSize] = useState<number>(10)
  // const { data: priceList, isLoading: priceDataLoading } = useGetClientPriceList({ clientId: id })
  // console.log("priceList",priceList)
  // const priceInfo = priceList?.find(
  //   value => value.id === history.items?.items[0].priceId,
  // )
  const [downloadLanguage, setDownloadLanguage] = useState<'EN' | 'KO'>('EN')

  const auth = useRecoilValueLoadable(authState)

  useEffect(() => {
    if (history) {
      const { projectInfo, client, projectTeam, items } = history
      const pm = projectTeam?.members.find(
        value => value.position === 'projectManager',
      )

      const res: QuoteDownloadData = {
        quoteId: Number(id!),
        adminCompanyName: 'GloZ Inc.',
        companyAddress: '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010',
        corporationId: projectInfo?.corporationId ?? '',
        quoteDate: {
          date: projectInfo?.quoteDate ?? '',
          timezone: projectInfo?.quoteDateTimezone,
        },
        projectDueDate: {
          date: projectInfo?.projectDueAt ?? '',
          timezone: projectInfo?.projectDueTimezone,
        },
        quoteDeadline: {
          date: projectInfo?.quoteDeadline ?? '',
          timezone: projectInfo?.quoteDeadlineTimezone,
        },
        quoteExpiryDate: {
          date: projectInfo?.quoteExpiryDate ?? '',
          timezone: projectInfo?.quoteExpiryDateTimezone,
        },
        estimatedDeliveryDate: {
          date: projectInfo?.estimatedDeliveryDate ?? '',
          timezone: projectInfo?.estimatedDeliveryDateTimezone,
        },
        pm: {
          firstName: pm?.firstName!,
          lastName: pm?.lastName!,
          email: pm?.email!,
          middleName: pm?.middleName!,
        },
        companyName: client!.client.name,
        projectName: projectInfo?.projectName ?? '',
        client: client,
        contactPerson: client?.contactPerson ?? null,
        clientAddress: client?.clientAddress ?? [],
        langItem: items,
        subtotal: projectInfo?.subtotal
      }

      setDownloadData(res)
    }
  }, [history])

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        display='flex'
        gap='8px'
        alignItems='center'
        padding='20px'
      >
        <img
          src='/images/icons/quotes-icons/book.png'
          alt=''
          width='50px'
          height='50px'
        />
        <Typography variant='h5'>{`[Ver.${history.version}] ${history.id}`}</Typography>
      </Grid>

      <Grid item xs={12}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{
              marginBottom: '12px',
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            {currentRole && currentRole.name === 'CLIENT' ? (
              <CustomTap
                value='quote'
                label='Quote'
                iconPosition='start'
                icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            ) : null}

            <CustomTap
              value='project'
              label='Project info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='items'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {currentRole && currentRole.name === 'CLIENT' ? null : (
              <CustomTap
                value='client'
                label='Client'
                iconPosition='start'
                icon={
                  <Icon icon='mdi:account-star-outline' fontSize={'18px'} />
                }
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            )}

            <CustomTap
              value='team'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>

          <TabPanel value='quote' sx={{ pt: '24px' }}>
            {downloadData ? (
              <ClientQuote
                downloadData={downloadData!}
                user={auth.getValue().user!}
                downloadLanguage={downloadLanguage}
                setDownloadLanguage={setDownloadLanguage}
                type='history'
                statusList={statusList!}
                project={history.projectInfo}
                // onClickDownloadQuotes={onClickDownloadQuotes}
              />
            ) : null}
          </TabPanel>

          <TabPanel value='project'>
            <Card sx={{ padding: '24px' }}>
              <QuotesProjectInfoDetail
                project={history.projectInfo}
                setEditMode={() => null}
                isUpdatable={false}
                canCheckboxEdit={false}
                role={currentRole!}
                type='history'
                statusList={statusList!}
              />
            </Card>
          </TabPanel>

          <TabPanel value='items'>
            <Card sx={{ padding: '24px' }}>
              {currentRole && currentRole.name === 'CLIENT' ? null : (
                <>
                  <HeaderBox item xs={12}>
                    <Typography variant='h6'>
                      Language pairs (
                      {history?.items?.items?.length ?? 0})
                    </Typography>
                  </HeaderBox>
                  <LanguagePairTable
                    languagePairs={history?.items?.languagePairs}
                    items={history?.items?.items}
                  />
                </>
              )}

              <HeaderBox item xs={12} sx={{ margin: '24px 0' }}>
                <Typography variant='h6'>
                  Items ({history?.items?.items?.length ?? 0})
                </Typography>
              </HeaderBox>
              {history.items.items.map((item, idx) => {
                const [open, setOpen] = useState(true)
                return (
                  <Grid
                    container
                    key={item.id}
                    style={{
                      padding: '24px',
                      border: '1px solid #F5F5F7',
                      borderRadius: '8px',
                      marginBottom: '14px',
                    }}
                  >
                    <Grid item xs={12}>
                      <Box display='flex' alignItems='center' gap='8px'>
                        <IconButton onClick={() => setOpen(!open)}>
                          <Icon
                            icon={`${
                              open
                                ? 'material-symbols:keyboard-arrow-up'
                                : 'material-symbols:keyboard-arrow-down'
                            }`}
                          />
                        </IconButton>
                        <Typography fontWeight={500}>
                          {idx + 1 <= 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                          &nbsp;
                          {item.itemName}
                        </Typography>
                      </Box>
                    </Grid>
                    {open ? (
                      <ItemDetail
                        item={item}
                        price={item.initialPrice}
                        role={currentRole!}
                      />
                    ) : null}
                    
                  </Grid>
                )
              })}

              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      borderBottom: '2px solid #666CFF',
                      justifyContent: 'center',
                      width: '257px',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{
                        padding: '16px 16px 16px 20px',
                        flex: 1,
                        textAlign: 'right',
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      fontWeight={600}
                      variant='subtitle1'
                      sx={{ padding: '16px 16px 16px 20px', flex: 1 }}
                    >
                      {formatCurrency(
                        formatByRoundingProcedure(
                          Number(history.projectInfo?.subtotal),
                          history.items?.items[0]?.initialPrice?.numberPlace!,
                          history.items?.items[0]?.initialPrice?.rounding!,
                          history.items?.items[0]?.initialPrice?.currency ?? 'KRW',
                        ),
                        history.items?.items[0]?.initialPrice?.currency ?? 'KRW',
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* tax */}
              {currentRole?.name === 'CLIENT' ? null : (
                <Grid
                  item
                  xs={12}
                  display='flex'
                  padding='24px'
                  alignItems='center'
                  justifyContent='space-between'
                  mt={6}
                  mb={6}
                  sx={{ background: '#F5F5F7', marginBottom: '24px' }}
                >
                  <Box display='flex' alignItems='center' gap='4px'>

                    <Typography>Tax</Typography>
                  </Box>
                  <Box display='flex' alignItems='center' gap='4px'>
                      <Box>{history.projectInfo?.isTaxable ? `${history.projectInfo?.tax} %` : '-'} </Box>
                  </Box>
                </Grid>
              )} 
            </Card>
          </TabPanel>

          <TabPanel value='client'>
            <Card sx={{ padding: '24px' }}>
              <QuotesClientDetail
                client={history.client}
                setIsEditMode={() => null}
                isUpdatable={false}
              />
            </Card>
          </TabPanel>

          <TabPanel value='team'>
            <Card>
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
                  columns={getProjectTeamColumns(
                    currentRole ? currentRole.name : '',
                  )}
                  rows={history.projectTeam.members ?? []}
                  rowsPerPageOptions={[10, 25, 50]}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  disableSelectionOnClick
                />
              </Box>
            </Card>
          </TabPanel>
        </TabContext>
      </Grid>
    </Fragment>
  )
}

export default VersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`

const HeaderBox = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #f5f5f7;
  margin-bottom: 24px;
`
