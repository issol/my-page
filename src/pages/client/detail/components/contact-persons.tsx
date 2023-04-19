import { useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import styled from 'styled-components'

// ** types
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'
import ContactPersonList from '../../components/list/contact-person-list'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { GridColumns } from '@mui/x-data-grid'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'

type Props = {
  clientInfo: ClientDetailType
}

export default function ContactPersons({ clientInfo }: Props) {
  const [pageSize, setPageSize] = useState(10)
  const { contactPersons } = clientInfo

  const columns: GridColumns<ContactPersonType> = [
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Company name / Email</Box>,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>
              {getLegalName({
                firstName: row.firstName!,
                middleName: row?.middleName,
                lastName: row.lastName!,
              })}
            </Typography>
            <Typography variant='body2'>{row?.email}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'department',
      headerName: 'Department',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Department</Box>,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return <Typography>{row.department}</Typography>
      },
    },
    {
      flex: 0.05,
      minWidth: 180,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job title</Box>,
    },
    {
      flex: 0.05,
      minWidth: 180,
      field: 'action',
      headerName: '',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return (
          <Box>
            {/* <IconButton onClick={() => updateContactPerson(row.id!)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton onClick={() => removeContactPerson(row.id!)}>
              <Icon icon='mdi:trash-outline' />
            </IconButton> */}
          </Box>
        )
      },
    },
  ]

  return (
    <Card>
      <ContactPersonList
        fields={contactPersons}
        columns={columns}
        pageSize={pageSize}
        setPageSize={setPageSize}
        openForm={() => ({})}
      />
    </Card>
  )
}
