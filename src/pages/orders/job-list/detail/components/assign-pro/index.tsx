import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Grid,
  Popover,
  Switch,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import {
  DataGrid,
  GridCallbackDetails,
  GridSelectionModel,
} from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { Icon } from '@iconify/react'

import {
  useGetLinguistTeam,
  useGetLinguistTeamDetail,
} from '@src/queries/pro/linguist-team'
import { getProJobAssignColumns } from '@src/shared/const/columns/pro-job-assgin'
import { JobType } from '@src/types/common/item.type'
import {
  LinguistTeamDetailType,
  LinguistTeamProListFilterType,
} from '@src/types/pro/linguist-team'
import { ProListType } from '@src/types/pro/list'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { TabType } from '../..'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import _ from 'lodash'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import {
  CategoryList,
  CategoryListPair,
} from '@src/shared/const/category/categories'
import { Category } from '@src/shared/const/category/category.enum'

type Props = {
  jobInfo: JobType
  serviceTypeList: Array<{ value: number; label: string }>
  clientList: Array<{ clientId: number; name: string }>
  selectedRows: {
    [key: string]: {
      data: ProListType[]
      isPrivate?: boolean
      isPrioritized?: boolean
    }
  }
  setSelectedRows: Dispatch<
    SetStateAction<{
      [key: string]: {
        data: ProListType[]
        isPrivate?: boolean
        isPrioritized?: boolean
      }
    }>
  >
  selectionModel: { [key: string]: GridSelectionModel }
  setSelectionModel: Dispatch<
    SetStateAction<{ [key: string]: GridSelectionModel }>
  >
  isLoading: boolean
  linguistTeamList: Array<{ value: number; label: string }>
  selectedLinguistTeam: { value: number; label: string } | null
  detail: LinguistTeamDetailType
  setSelectedLinguistTeam: Dispatch<
    SetStateAction<{ value: number; label: string } | null>
  >
  menu: TabType
  setMenu: Dispatch<SetStateAction<TabType>>

  proList: { data: Array<ProListType>; totalCount: number }
  setPastLinguistTeam: Dispatch<
    SetStateAction<{
      value: number
      label: string
    } | null>
  >
  pastLinguistTeam: { value: number; label: string } | null
  filter: LinguistTeamProListFilterType
  setFilter: Dispatch<SetStateAction<LinguistTeamProListFilterType>>
  setActiveFilter: Dispatch<SetStateAction<LinguistTeamProListFilterType>>
  activeFilter: LinguistTeamProListFilterType
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
}

function loadServerRows(
  page: number,
  pageSize: number,
  data: ProListType[],
): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data.slice(page * pageSize, (page + 1) * pageSize))
    }, 500)
  })
}

const AssignPro = ({
  jobInfo,
  serviceTypeList,
  clientList,
  selectedRows,
  setSelectedRows,
  selectionModel,
  setSelectionModel,
  isLoading,
  linguistTeamList,
  selectedLinguistTeam,
  detail,
  setSelectedLinguistTeam,
  menu,
  setMenu,

  proList,
  setPastLinguistTeam,
  pastLinguistTeam,
  filter,
  setFilter,
  setActiveFilter,
  activeFilter,
  languageList,
}: Props) => {
  console.log(proList)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<{ [key: string]: Array<ProListType> }>({})
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [sourceMultiple, setSourceMultiple] = useState<boolean>(false)
  const [targetMultiple, setTargetMultiple] = useState<boolean>(false)
  const [serviceTypeFormList, setServiceTypeFormList] =
    useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log(filter)

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    if (detail && menu === 'linguistTeam') {
      const selectedPros =
        detail?.pros.filter(pro => selectionModel.includes(pro.userId)) ?? []

      setSelectedRows(prev => {
        if (detail?.isPrioritized) {
          selectedPros.sort((a, b) => a.order! - b.order!)
        } else {
          // detail.isPrioritized가 false이면 selectionModel의 순서에 따라 정렬합니다.
          selectedPros.sort(
            (a, b) =>
              selectionModel.indexOf(a.userId) -
              selectionModel.indexOf(b.userId),
          )
        }

        // 기존 데이터와 새로운 데이터를 합칩니다.
        const newData = [...selectedPros]

        return {
          ...prev,
          [selectedLinguistTeam?.label || '']: {
            data: newData,
            isPrivate: detail.isPrivate,
            isPrioritized: detail.isPrioritized,
          },
        }
      })

      const result = {
        [selectedLinguistTeam?.label || '']: selectionModel,
      }

      setSelectionModel(prev => ({ ...prev, ...result }))
    } else if (menu === 'pro' && proList.data.length > 0) {
      console.log(proList.data)

      const selectedPros =
        proList.data.filter(pro => selectionModel.includes(pro.userId)) ?? []

      setSelectedRows(prev => {
        // detail.isPrioritized가 false이면 selectionModel의 순서에 따라 정렬합니다.
        selectedPros.sort(
          (a, b) =>
            selectionModel.indexOf(a.userId) - selectionModel.indexOf(b.userId),
        )

        // 기존 데이터와 새로운 데이터를 합칩니다.
        const newData = [...selectedPros]

        return {
          ...prev,
          [selectedLinguistTeam?.label || '']: {
            data: newData,
          },
        }
      })

      const result = {
        [selectedLinguistTeam?.label || '']: selectionModel,
      }

      setSelectionModel(prev => ({ ...prev, ...result }))
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      if (detail && detail.pros) {
        setLoading(true)
        const newRows = await loadServerRows(page, pageSize, detail.pros || [])

        if (!active) {
          return
        }

        setRows(prev => {
          return {
            ...prev,
            [selectedLinguistTeam?.label || '']: newRows,
          }
        })
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [page, detail, pageSize])

  useEffect(() => {
    if (proList && proList.data && menu === 'pro') {
      console.log(proList.data)

      setRows(prev => {
        return {
          ...prev,
          [selectedLinguistTeam?.label || '']: proList.data,
        }
      })
    }
  }, [proList, filter.take, filter.skip, menu])

  useEffect(() => {
    if (
      selectedRows[selectedLinguistTeam?.label || '']?.data.map(
        pro => pro.userId,
      )
    ) {
      setSelectionModel(prev => ({
        ...prev,
        [selectedLinguistTeam?.label || '']:
          selectedRows[selectedLinguistTeam?.label || '']?.data.map(
            pro => pro.userId,
          ) || [],
      }))
    }
  }, [selectedLinguistTeam])

  console.log(rows)

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          padding: '32px 20px 24px 20px',
          justifyContent: 'space-between',
        }}
      >
        <ButtonGroup variant='outlined'>
          <CustomBtn
            value='linguistTeam'
            $focus={menu === 'linguistTeam'}
            onClick={e => {
              setPastLinguistTeam(null)
              setSelectedLinguistTeam(pastLinguistTeam)
              setMenu(e.currentTarget.value as TabType)
            }}
          >
            Linguist team
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'pro'}
            value='pro'
            onClick={e => {
              setPastLinguistTeam(selectedLinguistTeam)
              setSelectedLinguistTeam({
                value: 0,
                label: 'Searched Pros',
              })
              setMenu(e.currentTarget.value as TabType)
            }}
          >
            Search Pro
          </CustomBtn>
        </ButtonGroup>
        {menu === 'pro' ? (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography
                fontSize={14}
                fontWeight={400}
                color='rgba(76,78,100, 0.60)'
              >
                Hide off-boarded Pros
              </Typography>
              <Switch
                checked={activeFilter.hide === '1'}
                onChange={e =>
                  setActiveFilter({
                    ...activeFilter,
                    hide: e.target.checked ? '1' : '0',
                  })
                }
              />
            </Box>
            <Box>
              <Button
                startIcon={
                  <Icon
                    icon='ion:filter-outline'
                    fontSize={20}
                    color='#8D8E9A'
                  />
                }
                sx={{ color: '#8D8E9A', fontWeight: 500 }}
                aria-describedby={id}
                onClick={handleClick}
              >
                Filters
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                // sx={{ left: '700px' }}
                sx={{
                  '& .MuiPaper-root': {
                    left: '40% !important',
                  },
                }}
              >
                <Grid
                  container
                  spacing={4}
                  rowSpacing={4}
                  sx={{ padding: '20px', minWidth: '567px', width: '100%' }}
                >
                  <Grid item xs={6}>
                    <Box className='filterFormAutoComplete'>
                      <Autocomplete
                        multiple
                        fullWidth
                        onChange={(event, item) => {
                          if (targetMultiple) {
                            setSourceMultiple(false)
                            if (item.length > 1) {
                              item[0] = item[1]
                              item.splice(1)
                            }
                          } else {
                            if (item.length > 1) setSourceMultiple(true)
                            else setSourceMultiple(false)
                          }
                          setFilter({
                            ...filter,
                            sourceLanguage: item.map(i => i.value),
                          })
                        }}
                        value={languageList.filter(value =>
                          filter.sourceLanguage?.includes(value.value),
                        )}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        disableCloseOnSelect
                        limitTags={1}
                        options={_.uniqBy(languageList, 'value')}
                        id='source'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Source language'
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            {option.label}
                          </li>
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className='filterFormAutoComplete'>
                      <Autocomplete
                        multiple
                        fullWidth
                        onChange={(event, item) => {
                          if (sourceMultiple) {
                            setTargetMultiple(false)
                            if (item.length > 1) {
                              item[0] = item[1]
                              item.splice(1)
                            }
                          } else {
                            if (item.length > 1) setTargetMultiple(true)
                            else setTargetMultiple(false)
                          }
                          setFilter({
                            ...filter,
                            targetLanguage: item.map(i => i.value),
                          })
                        }}
                        value={languageList.filter(value =>
                          filter.targetLanguage?.includes(value.value),
                        )}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        disableCloseOnSelect
                        limitTags={1}
                        options={_.uniqBy(languageList, 'value')}
                        id='source'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Target language'
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            {option.label}
                          </li>
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className='filterFormAutoComplete'>
                      <Autocomplete
                        fullWidth
                        multiple
                        limitTags={1}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        onChange={(event, item) => {
                          if (item) {
                            const arr: {
                              label: ServiceType
                              value: ServiceType
                            }[] = []

                            item.map(value => {
                              /* @ts-ignore */
                              const res = ServiceTypePair[value.value]
                              arr.push(...res)
                            })
                            setFilter({
                              ...filter,
                              category: item.map(i => i.value),
                            })
                            setServiceTypeFormList(_.uniqBy(arr, 'value'))
                          } else {
                            setFilter({
                              ...filter,
                              category: undefined,
                            })
                            setServiceTypeFormList(ServiceTypeList)
                          }
                        }}
                        value={
                          categoryList.filter(value =>
                            filter.category?.includes(value.value),
                          ) || null
                        }
                        options={categoryList}
                        id='category'
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Category'
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            {option.label}
                          </li>
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className='filterFormAutoComplete'>
                      <Autocomplete
                        fullWidth
                        multiple
                        disableCloseOnSelect
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        onChange={(event, item) => {
                          if (item.length) {
                            const arr: {
                              label: Category
                              value: Category
                            }[] = []

                            item.map(value => {
                              /* @ts-ignore */
                              const res = CategoryListPair[value.value]
                              arr.push(...res)
                            })
                            const selectedId = item.map(i => i.value.toString())
                            const serviceTypeId = serviceTypeList.filter(
                              value => selectedId.includes(value.label),
                            )
                            setFilter({
                              ...filter,
                              serviceTypeId: serviceTypeId.map(
                                value => value.value,
                              ),
                            })
                            setCategoryList(arr)
                          } else {
                            setCategoryList(CategoryList)
                          }
                        }}
                        value={
                          serviceTypeFormList.filter(value =>
                            serviceTypeList
                              .filter(item =>
                                filter.serviceTypeId?.includes(item.value),
                              )
                              .map(sorted => sorted.label)
                              .includes(value.label.toString()),
                          ) ?? null
                        }
                        options={serviceTypeFormList}
                        id='ServiceType'
                        limitTags={1}
                        getOptionLabel={option => option.label || ''}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Service type'
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            {option.label}
                          </li>
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
              </Popover>
            </Box>
          </Box>
        ) : (
          <Box
            className='filterFormSoloAutoComplete'
            sx={{
              width: '291px',
              '& .MuiInputBase-root': {
                padding: '0px 12px !important',
              },
            }}
          >
            <Autocomplete
              fullWidth
              loading={isLoading}
              options={linguistTeamList}
              getOptionLabel={option => option.label}
              value={selectedLinguistTeam}
              onChange={(e, v) => {
                if (v) {
                  setSelectedLinguistTeam(v)
                } else {
                  setSelectedLinguistTeam(null)
                  // setRows([])
                }
              }}
              renderInput={params => (
                <TextField {...params} placeholder='Select linguist team' />
              )}
            />
          </Box>
        )}
      </Box>
      {menu === 'linguistTeam' ? (
        <Box
          sx={{
            height: '100%',
          }}
        >
          <DataGrid
            // autoHeight
            sx={{
              height: 'calc(85vh - 100px)',
            }}
            // sx={{ minHeight: '644px', height: '100%' }}
            rows={rows[selectedLinguistTeam?.label || ''] ?? []}
            components={{
              NoRowsOverlay: () => NoList('There are no linguist teams'),
              NoResultsOverlay: () => NoList('There are no linguist teams'),
            }}
            columns={getProJobAssignColumns(
              detail?.isPrioritized ?? false,
              false,
            )}
            checkboxSelection
            selectionModel={
              selectionModel[selectedLinguistTeam?.label || ''] || []
            }
            isRowSelectable={row => {
              return !Object.entries(selectionModel)
                .filter(([key]) => key !== selectedLinguistTeam?.label)
                .map(([, value]) => value)
                .flat()
                .includes(row.row.userId)
            }}
            onSelectionModelChange={handleSelectionModelChange}
            keepNonExistentRowsSelected
            getRowId={row => row.userId}
            pagination
            paginationMode='server'
            page={page}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            rowCount={detail?.pros?.length || 0}
            loading={loading}
            onPageChange={newPage => {
              setPage(newPage)
            }}
            onPageSizeChange={newPageSize => {
              setPageSize(newPageSize)
            }}
            hideFooterSelectedRowCount
          />
        </Box>
      ) : menu === 'pro' ? (
        <Box sx={{ height: '100%' }}>
          <DataGrid
            // autoHeight
            sx={{
              height: 'calc(85vh - 100px)',
            }}
            rows={rows[selectedLinguistTeam?.label || ''] ?? []}
            components={{
              NoRowsOverlay: () => NoList('There are no Pros'),
              NoResultsOverlay: () => NoList('There are no Pros'),
            }}
            columns={getProJobAssignColumns(false, false)}
            checkboxSelection
            selectionModel={
              selectionModel[selectedLinguistTeam?.label || ''] || []
            }
            isRowSelectable={row => {
              return !Object.entries(selectionModel)
                .filter(([key]) => key !== selectedLinguistTeam?.label)
                .map(([, value]) => value)
                .flat()
                .includes(row.row.userId)
            }}
            onSelectionModelChange={handleSelectionModelChange}
            keepNonExistentRowsSelected
            getRowId={row => row.userId}
            pagination
            paginationMode='server'
            page={filter.skip}
            pageSize={filter.take}
            rowsPerPageOptions={[10, 25, 50]}
            rowCount={proList.totalCount || 0}
            loading={loading}
            onPageChange={(n: number) => {
              setFilter({ ...filter, skip: n })
              setActiveFilter({ ...activeFilter, skip: n * activeFilter.take! })
            }}
            onPageSizeChange={(n: number) => {
              setFilter({ ...filter, take: n })
              setActiveFilter({ ...activeFilter, take: n })
            }}
            hideFooterSelectedRowCount
          />
        </Box>
      ) : null}
    </Box>
  )
}

export default AssignPro

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
