import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  TextField,
  styled,
} from '@mui/material'
import {
  DataGrid,
  GridCallbackDetails,
  GridSelectionModel,
} from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'

import {
  useGetLinguistTeam,
  useGetLinguistTeamDetail,
} from '@src/queries/pro/linguist-team'
import { getProJobAssignColumns } from '@src/shared/const/columns/pro-job-assgin'
import { JobType } from '@src/types/common/item.type'
import { ProListType } from '@src/types/pro/list'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

type MenuType = 'linguistTeam' | 'pro'

type Props = {
  jobInfo: JobType
  serviceTypeList: Array<{ value: number; label: string }>
  clientList: Array<{ clientId: number; name: string }>
  setSelectedRows: Dispatch<
    SetStateAction<{
      [key: string]: { data: ProListType[]; isPrivate: boolean }
    }>
  >
  selectionModel: GridSelectionModel
  setSelectionModel: Dispatch<SetStateAction<GridSelectionModel>>
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
  setSelectedRows,
  selectionModel,
  setSelectionModel,
}: Props) => {
  const [menu, setMenu] = useState<MenuType>('linguistTeam')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<{ [key: string]: Array<ProListType> }>({})

  const { data: linguistTeam, isLoading } = useGetLinguistTeam({
    take: 1000,
    skip: 0,
  })

  const linguistTeamList = useMemo(
    () =>
      linguistTeam?.data?.map(i => ({
        label: i.name,
        value: i.id,
        client: i.clientId,
        serviceType: i.serviceTypeId,
        sourceLanguage: i.sourceLanguage,
        targetLanguage: i.targetLanguage,
        pros: i.pros,
      })) || [],
    [linguistTeam],
  )

  const getDefaultLinguistTeam = () => {
    const serviceTypeId = serviceTypeList.find(
      value => value.label === jobInfo.serviceType,
    )?.value
    const defaultLinguistTeam = linguistTeamList.find(
      i =>
        i.client === jobInfo.clientId &&
        i.serviceType === serviceTypeId &&
        i.sourceLanguage === jobInfo.sourceLanguage &&
        i.targetLanguage === jobInfo.targetLanguage,
    )
    if (defaultLinguistTeam) {
      return {
        value: defaultLinguistTeam.value,
        label: defaultLinguistTeam.label,
      }
    }
    return null
  }

  const [selectedLinguistTeam, setSelectedLinguistTeam] = useState<{
    value: number
    label: string
  } | null>(getDefaultLinguistTeam())

  const { data: detail } = useGetLinguistTeamDetail(
    selectedLinguistTeam?.value || 0,
  )

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    const selectedPros =
      detail?.pros.filter(pro => selectionModel.includes(pro.userId)) ?? []

    console.log(selectedPros)

    setSelectedRows(prev => {
      return {
        ...prev,
        [selectedLinguistTeam?.label || '']: {
          data: selectedPros,
          isPrivate: detail?.isPrivate ?? false,
        },
      }
    })

    setSelectionModel(selectionModel)
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

  console.log(detail)

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
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Linguist team
          </CustomBtn>
          <CustomBtn
            $focus={menu === 'pro'}
            value='pro'
            onClick={e => setMenu(e.currentTarget.value as MenuType)}
          >
            Search Pro
          </CustomBtn>
        </ButtonGroup>
        <Box
          className='filterFormSoloAutoComplete'
          sx={{
            width: '291px',
            '& .MuiInputBase-root': {
              padding: '0 12px',
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
      </Box>
      <Box sx={{ height: '100%' }}>
        <DataGrid
          autoHeight
          sx={{ height: '100%', minHeight: '644px' }}
          // sx={{ minHeight: '644px', height: '100%' }}
          rows={rows[selectedLinguistTeam?.label || ''] ?? []}
          components={{
            NoRowsOverlay: () => NoList('There are no pros'),
            NoResultsOverlay: () => NoList('There are no pros'),
          }}
          columns={getProJobAssignColumns()}
          checkboxSelection
          selectionModel={selectionModel}
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
          // setProListPageSize(newPageSize)

          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  )
}

export default AssignPro

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
