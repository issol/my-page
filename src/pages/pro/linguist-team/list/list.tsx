import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'

import { v4 as uuidv4 } from 'uuid'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import languageHelper from '@src/shared/helpers/language.helper'
import { Icon } from '@iconify/react'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getLinguistTeamColumns } from '@src/shared/const/columns/linguist-team'
import { useRouter } from 'next/router'
import { MenuType } from '..'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { InfiniteData } from 'react-query'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import { FilterType } from 'src/pages/pro/linguist-team/index'

type Props = {
  serviceTypeList: Array<{
    value: number
    label: string
  }>
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  setListCount: (num: number) => void
  clientList: {
    clientId: number
    name: string
  }[]
  activeFilter: FilterType
}

const LinguistTeamList = ({
  serviceTypeList,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  setListCount,
  clientList,
  activeFilter,
}: Props) => {
  const router = useRouter()

  const { data: linguistList, isLoading } = useGetLinguistTeam(activeFilter)

  useEffect(() => {
    let listCount = 0
    if (linguistList && linguistList.totalCount) {
      listCount = linguistList.totalCount
    } 
    setListCount(listCount)
  }, [linguistList])

  console.log("linguistList",linguistList)
  return (
    <Box
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          textTransform: 'none',
        },
      }}
    >
      <DataGrid
        autoHeight
        components={{
          NoRowsOverlay: () => NoList('There are no linguist teams'),
          NoResultsOverlay: () => NoList('There are no linguist teams'),
        }}
        sx={{
          overflowX: 'scroll',
          '& .MuiDataGrid-row': { cursor: 'pointer' },
        }}
        columns={getLinguistTeamColumns(serviceTypeList, clientList)}
        rows={linguistList?.data ?? []}
        rowCount={linguistList?.totalCount ?? 0}
        loading={isLoading}
        rowsPerPageOptions={[10, 25, 50]}
        onCellClick={params => {
          router.push(`/pro/linguist-team/detail/${params.id}`)
        }}
        pagination
        page={skip}
        pageSize={pageSize}
        paginationMode='server'
        onPageChange={setSkip}
        disableSelectionOnClick
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Box>
  )
}

export default LinguistTeamList
