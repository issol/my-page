import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import languageHelper from '@src/shared/helpers/language.helper'
import { LanguagePairListType } from '@src/types/common/standard-price'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: LanguagePairListType[]
  listCount: number
  isLoading: boolean
  listPage: number
  setListPage: Dispatch<SetStateAction<number>>
  listPageSize: number
  setListPageSize: Dispatch<SetStateAction<number>>
  onCellClick: (params: any, event: any) => void
}

const LanguagePair = ({
  list,
  listCount,
  isLoading,
  listPage,
  setListPage,
  listPageSize,
  setListPageSize,
  onCellClick,
}: Props) => {
  const columns: GridColumns<LanguagePairListType> = [
    {
      flex: 0.15,
      minWidth: 120,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Box>
          <Box key={row.id}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              {row.source && row.target ? (
                <>
                  {languageHelper(row.source)} &rarr;{' '}
                  {languageHelper(row.target)}
                </>
              ) : (
                '-'
              )}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'priceFactor',
      headerName: 'Price factor',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Price factor</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Box>
          {row.currency === 'USD' || row.currency === 'SGD'
            ? '$'
            : row.currency === 'KRW'
            ? '₩'
            : row.currency === 'JPY'
            ? '¥'
            : '-'}
          &nbsp;
          {row.priceFactor}
        </Box>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'minPrice',
      headerName: 'Min. price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Min. price</Box>,
      renderCell: ({ row }: { row: LanguagePairListType }) => (
        <Box>
          {row.currency === 'USD' || row.currency === 'SGD'
            ? '$'
            : row.currency === 'KRW'
            ? '₩'
            : row.currency === 'JPY'
            ? '¥'
            : '-'}
          &nbsp;{row.minimumPrice}
        </Box>
      ),
    },
  ]

  return (
    <Card
      sx={{
        padding: '20px 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 20px 20px',
        }}
      >
        <Typography variant='h6'>Language pairs ({listCount ?? 0})</Typography>
        <Button variant='contained' disabled>
          Add new pair
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          components={{
            NoRowsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              )
            },
            NoResultsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              )
            },
          }}
          columns={columns}
          loading={isLoading}
          rows={list ?? []}
          autoHeight
          // disableSelectionOnClick
          hideFooterSelectedRowCount
          paginationMode='server'
          pageSize={listPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={listPage}
          rowCount={listCount ?? 0}
          onCellClick={onCellClick}
          onPageChange={(newPage: number) => {
            // setFilters((prevState: OnboardingFilterType) => ({
            //   ...prevState,
            //   skip: newPage * onboardingListPageSize,
            // }))
            setListPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            // setFilters((prevState: OnboardingFilterType) => ({
            //   ...prevState,
            //   take: newPageSize,
            // }))
            setListPageSize(newPageSize)
          }}
        />
      </Box>
    </Card>
  )
}

export default LanguagePair
