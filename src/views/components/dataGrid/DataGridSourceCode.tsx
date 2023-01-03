export const BasicJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

const columns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'ID'
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'full_name',
    headerName: 'Name'
  },
  {
    flex: 0.25,
    minWidth: 230,
    field: 'email',
    headerName: 'Email'
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'start_date',
    headerName: 'Date'
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'experience',
    headerName: 'Experience'
  },
  {
    flex: 0.1,
    field: 'age',
    minWidth: 80,
    headerName: 'Age'
  }
]

const TableBasic = () => {
  return (
    <Card>
      <CardHeader title='Basic' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  )
}

export default TableBasic
  `}</code>
  </pre>
)

export const FilterJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
 // ** React Imports
 import { ChangeEvent, useState } from 'react'
 
 // ** MUI Imports
 import Box from '@mui/material/Box'
 import Card from '@mui/material/Card'
 import Typography from '@mui/material/Typography'
 import CardHeader from '@mui/material/CardHeader'
 import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
 
 // ** Custom Components
 import CustomChip from 'src/@core/components/mui/chip'
 import CustomAvatar from 'src/@core/components/mui/avatar'
 import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
 
 // ** Types Imports
 import { ThemeColor } from 'src/@core/layouts/types'
 import { DataGridRowType } from 'src/@fake-db/types'
 
 // ** Utils Import
 import { getInitials } from 'src/@core/utils/get-initials'
 
 // ** Data Import
 import { rows } from 'src/@fake-db/table/static-data'
 
 interface StatusObj {
   [key: number]: {
     title: string
     color: ThemeColor
   }
 }
 
 // ** renders client column
 const renderClient = (params: GridRenderCellParams) => {
   const { row } = params
   const stateNum = Math.floor(Math.random() * 6)
   const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
   const color = states[stateNum]
 
   if (row.avatar.length) {
     return <CustomAvatar src={"/images/avatars/" + {row.avatar}} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
   } else {
     return (
       <CustomAvatar
         skin='light'
         color={color as ThemeColor}
         sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
       >
         {getInitials(row.full_name ? row.full_name : 'John Doe')}
       </CustomAvatar>
     )
   }
 }
 
 const statusObj: StatusObj = {
   1: { title: 'current', color: 'primary' },
   2: { title: 'professional', color: 'success' },
   3: { title: 'rejected', color: 'error' },
   4: { title: 'resigned', color: 'warning' },
   5: { title: 'applied', color: 'info' }
 }
 
 const escapeRegExp = (value: string) => {
   return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
 }
 
 const columns: GridColumns = [
   {
     flex: 0.275,
     minWidth: 290,
     field: 'full_name',
     headerName: 'Name',
     renderCell: (params: GridRenderCellParams) => {
       const { row } = params
 
       return (
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
           {renderClient(params)}
           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
             <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
               {row.full_name}
             </Typography>
             <Typography noWrap variant='caption'>
               {row.email}
             </Typography>
           </Box>
         </Box>
       )
     }
   },
   {
     flex: 0.2,
     minWidth: 120,
     headerName: 'Date',
     field: 'start_date',
     renderCell: (params: GridRenderCellParams) => (
       <Typography variant='body2' sx={{ color: 'text.primary' }}>
         {params.row.start_date}
       </Typography>
     )
   },
   {
     flex: 0.2,
     minWidth: 110,
     field: 'salary',
     headerName: 'Salary',
     renderCell: (params: GridRenderCellParams) => (
       <Typography variant='body2' sx={{ color: 'text.primary' }}>
         {params.row.salary}
       </Typography>
     )
   },
   {
     flex: 0.125,
     field: 'age',
     minWidth: 80,
     headerName: 'Age',
     renderCell: (params: GridRenderCellParams) => (
       <Typography variant='body2' sx={{ color: 'text.primary' }}>
         {params.row.age}
       </Typography>
     )
   },
   {
     flex: 0.2,
     minWidth: 140,
     field: 'status',
     headerName: 'Status',
     renderCell: (params: GridRenderCellParams) => {
       const status = statusObj[params.row.status]
 
       return (
         <CustomChip
           size='small'
           skin='light'
           color={status.color}
           label={status.title}
           sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
         />
       )
     }
   }
 ]
 
 const TableColumns = () => {
   // ** States
   const [data] = useState<DataGridRowType[]>(rows)
   const [pageSize, setPageSize] = useState<number>(7)
   const [searchText, setSearchText] = useState<string>('')
   const [filteredData, setFilteredData] = useState<DataGridRowType[]>([])
 
   const handleSearch = (searchValue: string) => {
     setSearchText(searchValue)
     const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
     const filteredRows = data.filter(row => {
       return Object.keys(row).some(field => {
         // @ts-ignore
         return searchRegex.test(row[field].toString())
       })
     })
     if (searchValue.length) {
       setFilteredData(filteredRows)
     } else {
       setFilteredData([])
     }
   }
 
   return (
     <Card>
       <CardHeader title='Quick Filter' />
       <DataGrid
         autoHeight
         columns={columns}
         pageSize={pageSize}
         rowsPerPageOptions={[7, 10, 25, 50]}
         components={{ Toolbar: QuickSearchToolbar }}
         rows={filteredData.length ? filteredData : data}
         onPageSizeChange={newPageSize => setPageSize(newPageSize)}
         componentsProps={{
           baseButton: {
             variant: 'outlined'
           },
           toolbar: {
             value: searchText,
             clearSearch: () => handleSearch(''),
             onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
           }
         }}
       />
     </Card>
   )
 }
 
 export default TableColumns
 
  `}</code>
  </pre>
)

export const TableColumnsJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar.length) {
    return <CustomAvatar src={"/images/avatars/" + {row.avatar}} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

// ** Full Name Getter
const getFullName = (params: GridRenderCellParams) =>
  toast(
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {renderClient(params)}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.row.full_name}
        </Typography>
      </Box>
    </Box>
  )

const TableColumns = () => {
  // ** States
  const [pageSize, setPageSize] = useState<number>(7)
  const [hideNameColumn, setHideNameColumn] = useState(false)

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      hide: hideNameColumn,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: 'Date',
      field: 'start_date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'salary',
      headerName: 'Salary',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.salary}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.age}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.125,
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button size='small' variant='outlined' color='secondary' onClick={() => getFullName(params)}>
            Get Name
          </Button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Column'
        action={
          <div>
            <Button size='small' variant='contained' onClick={() => setHideNameColumn(!hideNameColumn)}>
              Toggle Name Column
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default TableColumns

  `}</code>
  </pre>
)

export const EditableJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
   // ** MUI Imports
   import Box from '@mui/material/Box'
   import Card from '@mui/material/Card'
   import { DataGrid } from '@mui/x-data-grid'
   import CardHeader from '@mui/material/CardHeader'
   
   // ** Data Import
   import { rows } from 'src/@fake-db/table/static-data'
   
   const columns = [
     {
       flex: 0.1,
       field: 'id',
       minWidth: 80,
       headerName: 'ID'
     },
     {
       flex: 0.25,
       minWidth: 200,
       editable: true,
       field: 'full_name',
       headerName: 'Name'
     },
     {
       flex: 0.25,
       minWidth: 230,
       field: 'email',
       editable: true,
       headerName: 'Email'
     },
     {
       flex: 0.15,
       type: 'date',
       minWidth: 130,
       editable: true,
       field: 'start_date',
       headerName: 'Date'
     },
     {
       flex: 0.15,
       minWidth: 120,
       editable: true,
       field: 'experience',
       headerName: 'Experience'
     },
     {
       flex: 0.1,
       field: 'age',
       minWidth: 80,
       type: 'number',
       editable: true,
       headerName: 'Age'
     }
   ]
   
   const TableEditable = () => {
     return (
       <Card>
         <CardHeader title='Editable' />
         <Box sx={{ height: 500 }}>
           <DataGrid columns={columns} rows={rows.slice(0, 10)} />
         </Box>
       </Card>
     )
   }
   
   export default TableEditable
   
    `}</code>
  </pre>
)

export const SortingJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar.length) {
    return <CustomAvatar src={"/images/avatars/" + {row.avatar}} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const TableSort = () => {
  // ** States
  const [pageSize, setPageSize] = useState<number>(7)
  const [isNameSortable, setIsNameSortable] = useState(true)

  const columns: GridColDef[] = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Date',
      field: 'start_date',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'salary',
      headerName: 'Salary',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.salary}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.age}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Sorting'
        action={
          <div>
            <Button size='small' variant='contained' onClick={() => setIsNameSortable(!isNameSortable)}>
              Disable Sorting: {!isNameSortable}
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default TableSort
  `}</code>
  </pre>
)

export const SelectionJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
  // ** React Import
  import { useState } from 'react'
  
  // ** MUI Imports
  import Box from '@mui/material/Box'
  import Card from '@mui/material/Card'
  import Typography from '@mui/material/Typography'
  import CardHeader from '@mui/material/CardHeader'
  import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
  
  // ** Custom Components
  import CustomChip from 'src/@core/components/mui/chip'
  import CustomAvatar from 'src/@core/components/mui/avatar'
  
  // ** Types Imports
  import { ThemeColor } from 'src/@core/layouts/types'
  
  // ** Utils Import
  import { getInitials } from 'src/@core/utils/get-initials'
  
  // ** Data Import
  import { rows } from 'src/@fake-db/table/static-data'
  
  interface StatusObj {
    [key: number]: {
      title: string
      color: ThemeColor
    }
  }
  
  // ** renders client column
  const renderClient = (params: GridRenderCellParams) => {
    const { row } = params
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
  
    if (row.avatar.length) {
      return <CustomAvatar src={"/images/avatars/" + {row.avatar}} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={color as ThemeColor}
          sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
        >
          {getInitials(row.full_name ? row.full_name : 'John Doe')}
        </CustomAvatar>
      )
    }
  }
  
  const statusObj: StatusObj = {
    1: { title: 'current', color: 'primary' },
    2: { title: 'professional', color: 'success' },
    3: { title: 'rejected', color: 'error' },
    4: { title: 'resigned', color: 'warning' },
    5: { title: 'applied', color: 'info' }
  }
  
  const columns: GridColumns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: 'Date',
      field: 'start_date',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'salary',
      headerName: 'Salary',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.salary}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.age}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]
  
        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    }
  ]
  
  const TableSelection = () => {
    // ** State
    const [pageSize, setPageSize] = useState<number>(7)
  
    return (
      <Card>
        <CardHeader title='Selection' />
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          checkboxSelection
          pageSize={pageSize}
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </Card>
    )
  }
  
  export default TableSelection
  
  `}</code>
  </pre>
)

export const ServerSideJSXCode = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
    // ** React Imports
    import { useEffect, useState, useCallback, ChangeEvent } from 'react'
    
    // ** MUI Imports
    import Box from '@mui/material/Box'
    import Card from '@mui/material/Card'
    import Typography from '@mui/material/Typography'
    import CardHeader from '@mui/material/CardHeader'
    import { DataGrid, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
    
    // ** ThirdParty Components
    import axios from 'axios'
    
    // ** Custom Components
    import CustomChip from 'src/@core/components/mui/chip'
    import CustomAvatar from 'src/@core/components/mui/avatar'
    import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
    
    // ** Types Imports
    import { ThemeColor } from 'src/@core/layouts/types'
    import { DataGridRowType } from 'src/@fake-db/types'
    
    // ** Utils Import
    import { getInitials } from 'src/@core/utils/get-initials'
    
    interface StatusObj {
      [key: number]: {
        title: string
        color: ThemeColor
      }
    }
    
    type SortType = 'asc' | 'desc' | undefined | null
    
    // ** renders client column
    const renderClient = (params: GridRenderCellParams) => {
      const { row } = params
      const stateNum = Math.floor(Math.random() * 6)
      const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
      const color = states[stateNum]
    
      if (row.avatar.length) {
        return <CustomAvatar src={"/images/avatars/" + {row.avatar}} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
      } else {
        return (
          <CustomAvatar
            skin='light'
            color={color as ThemeColor}
            sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
          >
            {getInitials(row.full_name ? row.full_name : 'John Doe')}
          </CustomAvatar>
        )
      }
    }
    
    const statusObj: StatusObj = {
      1: { title: 'current', color: 'primary' },
      2: { title: 'professional', color: 'success' },
      3: { title: 'rejected', color: 'error' },
      4: { title: 'resigned', color: 'warning' },
      5: { title: 'applied', color: 'info' }
    }
    
    const columns: GridColumns = [
      {
        flex: 0.25,
        minWidth: 290,
        field: 'full_name',
        headerName: 'Name',
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params
    
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderClient(params)}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {row.full_name}
                </Typography>
                <Typography noWrap variant='caption'>
                  {row.email}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        flex: 0.175,
        minWidth: 120,
        headerName: 'Date',
        field: 'start_date',
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.start_date}
          </Typography>
        )
      },
      {
        flex: 0.175,
        minWidth: 110,
        field: 'salary',
        headerName: 'Salary',
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.salary}
          </Typography>
        )
      },
      {
        flex: 0.125,
        field: 'age',
        minWidth: 80,
        headerName: 'Age',
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.age}
          </Typography>
        )
      },
      {
        flex: 0.175,
        minWidth: 140,
        field: 'status',
        headerName: 'Status',
        renderCell: (params: GridRenderCellParams) => {
          const status = statusObj[params.row.status]
    
          return (
            <CustomChip
              size='small'
              skin='light'
              color={status.color}
              label={status.title}
              sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
            />
          )
        }
      }
    ]
    
    const TableServerSide = () => {
      // ** State
      const [page, setPage] = useState(0)
      const [total, setTotal] = useState<number>(0)
      const [sort, setSort] = useState<SortType>('asc')
      const [pageSize, setPageSize] = useState<number>(7)
      const [rows, setRows] = useState<DataGridRowType[]>([])
      const [searchValue, setSearchValue] = useState<string>('')
      const [sortColumn, setSortColumn] = useState<string>('full_name')
    
      function loadServerRows(currentPage: number, data: DataGridRowType[]) {
        return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
      }
    
      const fetchTableData = useCallback(
        async (sort: SortType, q: string, column: string) => {
          await axios
            .get('/api/table/data', {
              params: {
                q,
                sort,
                column
              }
            })
            .then(res => {
              setTotal(res.data.total)
              setRows(loadServerRows(page, res.data.data))
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [page, pageSize]
      )
    
      useEffect(() => {
        fetchTableData(sort, searchValue, sortColumn)
      }, [fetchTableData, searchValue, sort, sortColumn])
    
      const handleSortModel = (newModel: GridSortModel) => {
        if (newModel.length) {
          setSort(newModel[0].sort)
          setSortColumn(newModel[0].field)
          fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
        } else {
          setSort('asc')
          setSortColumn('full_name')
        }
      }
    
      const handleSearch = (value: string) => {
        setSearchValue(value)
        fetchTableData(sort, value, sortColumn)
      }
    
      return (
        <Card>
          <CardHeader title='Server Side' />
          <DataGrid
            autoHeight
            pagination
            rows={rows}
            rowCount={total}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            sortingMode='server'
            paginationMode='server'
            onSortModelChange={handleSortModel}
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageChange={newPage => setPage(newPage)}
            components={{ Toolbar: ServerSideToolbar }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            componentsProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                value: searchValue,
                clearSearch: () => handleSearch(''),
                onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
              }
            }}
          />
        </Card>
      )
    }
    
    export default TableServerSide
      `}</code>
  </pre>
)
