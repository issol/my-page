import { useContext, useEffect, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

import { DataGrid, GridRowId } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { UserDataType } from 'src/context/types'
import { fetchTestUser, updatePolicy } from 'src/store/apps/test-user'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import { AuthContext } from 'src/context/AuthContext'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'

import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import Icon from 'src/@core/components/icon'
import { PolicyType } from 'src/configs/acl'

interface CellType {
  row: UserDataType
}

const rolesArr: string[] = [
  'dashboard',
  'account',
  'email',
  'quotes',
  'quoteList',
  'quoteCreate',
  'orders',
  'orderList',
  'invoices',
  'clientInvoiceList',
  'roles',
]

const AllPermission: string[] = [
  'dashboard-read',
  'dashboard-create',
  'dashboard-update',
  'dashboard-delete',
  'account-read',
  'account-create',
  'account-update',
  'account-delete',
  'email-read',
  'email-create',
  'email-update',
  'email-delete',
  'quotes-read',
  'quotes-create',
  'quotes-update',
  'quotes-delete',
  'quoteList-read',
  'quoteList-create',
  'quoteList-update',
  'quoteList-delete',
  'quoteCreate-read',
  'quoteCreate-create',
  'quoteCreate-update',
  'quoteCreate-delete',
  'orders-read',
  'orders-create',
  'orders-update',
  'orders-delete',
  'orderList-read',
  'orderList-create',
  'orderList-update',
  'orderList-delete',
  'invoices-read',
  'invoices-create',
  'invoices-update',
  'invoices-delete',
  'clientInvoiceList-read',
  'clientInvoiceList-create',
  'clientInvoiceList-update',
  'clientInvoiceList-delete',
  'roles-read',
  'roles-create',
  'roles-update',
  'roles-delete',
]

const ClientManageRoles = () => {
  const ability = useContext(AbilityContext)

  const [pageSize, setPageSize] = useState<number>(10)
  const [open, setOpen] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>({})
  const [selectedUserId, setSelectedUserId] = useState<number>(0)
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] =
    useState<boolean>(false)

  const returnRules = (row: PolicyType) => {
    const result = Object.entries(row)
      .map(([key, value]) => {
        const res = Object.entries(value).map(([permission, data]) => {
          return data ? `${key}-${permission}` : ''
        })

        return res
      })
      .flat()
      .filter(value => value)

    return result
  }

  const handleClickOpen = (policy: PolicyType, id: number) => {
    setSelectedPolicy(policy)
    setSelectedUserId(id)

    setOpen(true)
    setSelectedCheckbox(returnRules(policy))
  }

  const handleClose = () => {
    setOpen(false)
    // setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.testUser)
  const auth = useContext(AuthContext)

  const togglePermission = (id: string) => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        togglePermission(`${row}-read`)
        togglePermission(`${row}-update`)
        togglePermission(`${row}-create`)
        togglePermission(`${row}-delete`)
      })
    }
  }

  const handleUpdatePolicy = (policy: string[]) => {
    console.log(policy)

    console.log(AllPermission)

    const diff = AllPermission.filter(value => !policy.includes(value))
    console.log(diff)

    const result2 = diff.reduce((acc: any, value, index) => {
      if (acc[value.split('-')[0]]) {
        if (value.split('-')[1] === 'create') {
          acc[value.split('-')[0]]['create'] = false
        } else if (value.split('-')[1] === 'read') {
          acc[value.split('-')[0]]['read'] = false
        } else if (value.split('-')[1] === 'update') {
          acc[value.split('-')[0]]['update'] = false
        } else if (value.split('-')[1] === 'delete') {
          acc[value.split('-')[0]]['delete'] = false
        }
      } else {
        acc[value.split('-')[0]] = {
          create: !(value.split('-')[1] === 'create'),
          read: !(value.split('-')[1] === 'read'),
          update: !(value.split('-')[1] === 'update'),
          delete: !(value.split('-')[1] === 'delete'),
        }
      }

      return acc
    }, {})

    console.log(result2)

    const result = policy.reduce((acc: any, value, index) => {
      if (acc[value.split('-')[0]]) {
        if (value.split('-')[1] === 'create') {
          acc[value.split('-')[0]]['create'] = true
        } else if (value.split('-')[1] === 'read') {
          acc[value.split('-')[0]]['read'] = true
        } else if (value.split('-')[1] === 'update') {
          acc[value.split('-')[0]]['update'] = true
        } else if (value.split('-')[1] === 'delete') {
          acc[value.split('-')[0]]['delete'] = true
        }
      } else {
        acc[value.split('-')[0]] = {
          create: value.split('-')[1] === 'create',
          read: value.split('-')[1] === 'read',
          update: value.split('-')[1] === 'update',
          delete: value.split('-')[1] === 'delete',
        }
      }

      return acc
    }, {})

    dispatch(
      updatePolicy({
        id: selectedUserId,
        policy: Object.assign({}, selectedPolicy, result, result2),
      }),
    )
  }

  useEffect(() => {
    if (
      selectedCheckbox.length > 0 &&
      selectedCheckbox.length < rolesArr.length * 4
    ) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])
  useEffect(() => {
    dispatch(
      fetchTestUser({
        role: auth.user ? auth.user.role[0] : '',
      }),
    )
  }, [dispatch])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        const { username } = row

        return (
          <Typography variant='body2' noWrap>
            {row.username}
          </Typography>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>
            {row.email}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 150,
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
          >
            {row.role}
          </Typography>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <IconButton
          // onClick={() => {
          //   handleClickOpen(row.policy, row.id)
          // }}
          disabled={!ability.can('roles-update', 'CLIENT')}
        >
          <Icon icon='mdi:eye-outline' />
        </IconButton>
      ),
    },
  ]

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        open={open}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant='h5' component='span'>
            {`${dialogTitle} Role`}
          </Typography>
          <Typography variant='body2'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <TextField label='Role Name' placeholder='Enter Role Name' />
            </FormControl>
          </Box>
          <Typography variant='h6'>Role Permissions</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' },
                      }}
                    >
                      Administrator Access
                      <Tooltip
                        placement='top'
                        title='Allows a full access to the system'
                      >
                        <Box sx={{ display: 'flex' }}>
                          <Icon
                            icon='mdi:information-outline'
                            fontSize='1rem'
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <FormControlLabel
                      label='Select All'
                      sx={{
                        '& .MuiTypography-root': {
                          textTransform: 'capitalize',
                        },
                      }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={
                            selectedCheckbox.length === rolesArr.length * 4
                          }
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rolesArr.map((i: string, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '& .MuiTableCell-root:first-of-type': {
                          pl: '0 !important',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          color: theme =>
                            `${theme.palette.text.primary} !important`,
                        }}
                      >
                        {i}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read'
                          control={
                            <Checkbox
                              size='small'
                              id={`${i}-read`}
                              onChange={() => togglePermission(`${i}-read`)}
                              checked={selectedCheckbox.includes(`${i}-read`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Write'
                          control={
                            <Checkbox
                              size='small'
                              id={`${i}-update`}
                              onChange={() => togglePermission(`${i}-update`)}
                              checked={selectedCheckbox.includes(`${i}-update`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Create'
                          control={
                            <Checkbox
                              size='small'
                              id={`${i}-create`}
                              onChange={() => togglePermission(`${i}-create`)}
                              checked={selectedCheckbox.includes(`${i}-create`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Delete'
                          control={
                            <Checkbox
                              size='small'
                              id={`${i}-delete`}
                              onChange={() => togglePermission(`${i}-delete`)}
                              checked={selectedCheckbox.includes(`${i}-delete`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}
        >
          <Box className='demo-space-x'>
            <Button
              size='large'
              type='submit'
              variant='contained'
              onClick={() => {
                handleUpdatePolicy(selectedCheckbox)
                handleClose()
              }}
            >
              Submit
            </Button>
            <Button
              size='large'
              color='secondary'
              variant='outlined'
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <div>Client Manage Roles</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('roles-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('roles-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('roles-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('roles-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
      <>
        <Box sx={{ height: 600 }}>
          <DataGrid
            autoHeight
            rows={store.users}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Box>
      </>
    </>
  )
}

export default ClientManageRoles

ClientManageRoles.acl = {
  action: 'roles-read',
  subject: 'CLIENT',
}
