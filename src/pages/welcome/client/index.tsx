// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** Style components
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { Grid, OutlinedInput, Radio } from '@mui/material'
import { Icon } from '@iconify/react'

// ** Hooks

// ** layout
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** NextJS
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  CompanyListByBusinessType,
  getCompanyInfoByBusinessNumber,
} from '@src/apis/common.api'
import { DataGrid, GridColumns, GridOverlay } from '@mui/x-data-grid'
import { BorderBox } from '@src/@core/components/detail-info'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { requestJoinToCompany } from '@src/apis/user.api'
import { toast } from 'react-hot-toast'
import { getCurrentRole } from '@src/shared/auth/storage'
import useAuth from '@src/hooks/useAuth'
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'

export default function ClientInformationHome() {
  const { logout } = useAuth()

  const { company, user } = useRecoilValue(authState)

  const roles = getCurrentRole()

  const { openModal, closeModal } = useModal()

  const router = useRouter()

  const [businessNumber, setBusinessNumber] = useState<string>('')
  const [companyList, setCompanyList] = useState<CompanyListByBusinessType[]>(
    [],
  )
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<CompanyListByBusinessType | null>(
    null,
  )

  useEffect(() => {
    if (company?.name || roles?.name !== 'CLIENT') {
      router.push('/')
    }
  }, [company])

  function requestJoin() {
    if (!!selected && user) {
      openModal({
        type: 'request',
        children: (
          <CustomModal
            vary='successful'
            title='Are you sure you want to request to join this company?'
            subtitle={selected.name}
            subtitleColor='primary'
            onClose={() => closeModal('request')}
            onClick={() => {
              closeModal('request')
              requestJoinToCompany({
                userId: user.userId,
                email: user.email,
                companyId: selected.id,
              })
                .then(() => {
                  toast.success(
                    'The source code has been copied to your clipboard.',
                    {
                      duration: 3000,
                      position: 'bottom-left',
                    },
                  )
                  setTimeout(() => {
                    logout()
                  }, 1000)
                })
                .catch(() => {
                  toast.error(
                    'Something went wrong while uploading files. Please try again.',
                    {
                      position: 'bottom-left',
                    },
                  )
                })
            }}
            rightButtonText='Request'
          />
        ),
      })
    }
  }

  function handleSearch() {
    getCompanyInfoByBusinessNumber('Client', businessNumber).then(
      (res: CompanyListByBusinessType[]) => {
        setCompanyList(res)
        setSearched(true)
      },
    )
  }

  const columns: GridColumns<CompanyListByBusinessType> = [
    {
      flex: 0.005,
      minWidth: 30,
      field: 'select',
      headerName: 'select',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => {
        return null
      },
      renderCell: ({ row }: { row: CompanyListByBusinessType }) => {
        return (
          <Radio
            id='client'
            checked={row.id === selected?.id}
            onChange={() => setSelected(row)}
          />
        )
      },
    },
    {
      flex: 0.05,
      minWidth: 214,
      field: 'name',
      headerName: 'Company name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: { row: CompanyListByBusinessType }) => {
        return (
          <Typography>
            <label htmlFor='client'>{row.name}</label>
          </Typography>
        )
      },
    },
  ]

  function NoList() {
    return (
      <GridOverlay style={{ zIndex: 5, pointerEvents: 'all' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Typography variant='body2'>Can’t find your company?</Typography>
          <Button variant='contained'>
            <Link
              href='/welcome/client/add-new'
              style={{ color: '#ffffff', textDecoration: 'none' }}
            >
              Can’t find your company?
            </Link>
          </Button>
        </Box>
      </GridOverlay>
    )
  }

  return (
    <Box className='content-center'>
      <Box
        sx={{
          top: 30,
          left: 40,
          display: 'flex',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src='/images/logos/gloz-logo.svg'
          alt='logo'
          width={44}
          height={24}
        />
      </Box>
      <Grid container spacing={6} sx={{ maxWidth: '820px' }}>
        <Grid item xs={12}>
          <Link
            href='/welcome/client/add-new'
            style={{ textDecoration: 'none' }}
          >
            <Box
              display='flex'
              alignItems='center'
              gap='2px'
              justifyContent='end'
            >
              <Typography
                variant='body2'
                sx={{ textDecoration: 'underline', textAlign: 'right' }}
              >
                Register new company
              </Typography>
              <Icon
                icon='basil:arrow-right-outline'
                color='rgba(76, 78, 100, 0.54)'
              />
            </Box>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>Search Company</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor='icons-adornment-password'>
              Business registration number
            </InputLabel>
            <OutlinedInput
              label='Business registration number'
              value={businessNumber}
              id='icons-adornment-password'
              onChange={e => setBusinessNumber(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleSearch}
                    disabled={!businessNumber}
                    aria-label='Business registration number input'
                  >
                    <Icon fontSize={20} icon='material-symbols:search' />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='end'>
          <Button
            variant='contained'
            onClick={handleSearch}
            disabled={!businessNumber?.length}
          >
            Search
          </Button>
        </Grid>
        {!searched ? null : (
          <>
            <Grid item xs={12}>
              <BorderBox
                padding={0}
                sx={{
                  height: '500px',
                  '& .MuiDataGrid-columnHeaderTitle': {
                    textTransform: 'none',
                  },
                }}
              >
                <DataGrid
                  components={{
                    NoRowsOverlay: () => NoList(),
                    NoResultsOverlay: () => NoList(),
                  }}
                  autoPageSize
                  columns={columns}
                  rows={companyList ?? []}
                  disableSelectionOnClick
                />
              </BorderBox>
            </Grid>
            {!companyList.length ? null : (
              <Grid item xs={12} display='flex' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={!selected}
                  onClick={requestJoin}
                >
                  Request to join
                </Button>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  )
}

ClientInformationHome.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

ClientInformationHome.acl = {
  subject: 'client',
  action: 'update',
}
