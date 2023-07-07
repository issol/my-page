import { MembersType, SignUpRequestsType } from 'src/types/company/members'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColumns,
  GridEditRowsModel,
  GridEventListener,
  GridRowId,
} from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import RenderMembersChips from './render-members-chips'

import {
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { Icon } from '@iconify/react'
import useModal from '@src/hooks/useModal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import { UseMutationResult, useMutation } from 'react-query'
import { patchMember } from '@src/apis/company/company-members.api'
import toast from 'react-hot-toast'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useAppSelector } from 'src/hooks/useRedux'

interface CellType {
  row: MembersType
}

interface SelectedCellParams {
  id: GridRowId
  field: string
}

type Props = {
  membersPage: number
  setMembersPage: Dispatch<SetStateAction<number>>
  membersPageSize: number
  setMembersPageSize: Dispatch<SetStateAction<number>>
  memberList: MembersType[]
  patchMemberMutation: UseMutationResult<
    void,
    unknown,
    {
      userId: number
      permissionGroups: string[]
    },
    unknown
  >
  deleteMemberMutation: UseMutationResult<void, unknown, number, unknown>
  hasGeneralPermission: boolean
}
const MemberList = ({
  membersPage,
  setMembersPage,
  membersPageSize,
  setMembersPageSize,
  memberList,
  patchMemberMutation,
  deleteMemberMutation,
  hasGeneralPermission,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const [selectedMember, setSelectedMember] = useState<MembersType | null>(null)
  const [members, setMembers] = useState<Array<MembersType>>(memberList)
  const [editRow, setEditRow] = useState<boolean>(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const userAccess = useAppSelector(state => state.userAccess)
  const handleClick = (event: MouseEvent<HTMLElement>, member: MembersType) => {
    event.stopPropagation()
    setSelectedMember(member)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditCancel = () => {
    setEditRow(false)
    setSelectedMember(null)
  }

  const handleDeleteMember = () => {
    deleteMemberMutation.mutate(selectedMember!.id, {
      onSuccess: () => {
        setEditRow(false)
        setSelectedMember(null)
        setMembers(memberList)
        closeModal('DeleteMemberModal')
      },
      onError: () => {
        setEditRow(false)
        setSelectedMember(null)
        setMembers(memberList)
        closeModal('DeleteMemberModal')
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    })
  }

  const handleEditSave = () => {
    const res = members.find(value => value.id === selectedMember!.id)
    if (res) {
      patchMemberMutation.mutate(
        {
          userId: res!.id,
          permissionGroups: res!.role,
        },
        {
          onSuccess: () => {
            setEditRow(false)
            setMembers(memberList)
            closeModal('EditSaveMemberModal')
          },
          onError: () => {
            setEditRow(false)
            setMembers(memberList)
            closeModal('EditSaveMemberModal')
            toast.error('Something went wrong. Please try again.', {
              position: 'bottom-left',
            })
          },
        },
      )
    }

    // setSelectedMember(null)
  }

  const onClickEditSave = () => {
    if (selectedMember) {
      const obj: MembersType = members.find(
        value => value.id === selectedMember.id,
      )!
      if (selectedMember === obj) {
        setEditRow(false)
        setSelectedMember(null)
        // setMembers(memberList)
      } else {
        openModal({
          type: 'EditSaveMemberModal',
          children: (
            <EditSaveModal
              onClose={() => closeModal('EditSaveMemberModal')}
              onClick={handleEditSave}
            />
          ),
        })
      }
    }
  }

  const onClickEditMember = () => {
    setEditRow(true)
    handleClose()
  }

  const onClickDeleteMember = () => {
    handleClose()
    openModal({
      type: 'DeleteMemberModal',
      children: (
        <CustomModal
          onClose={() => closeModal('DeleteMemberModal')}
          onClick={handleDeleteMember}
          title={`Are you sure you want to delete ${getLegalName({
            firstName: selectedMember?.firstName,
            middleName: selectedMember?.middleName,
            lastName: selectedMember?.lastName,
          })} from the organization?`}
          vary='error'
          rightButtonText='Delete'
        />
      ),
    })
  }

  const onClickEditCancel = () => {
    if (selectedMember) {
      const obj: MembersType = members.find(
        value => value.id === selectedMember.id,
      )!
      if (selectedMember === obj) {
        setEditRow(false)
        setSelectedMember(null)
        setMembers(memberList)
      } else {
        openModal({
          type: 'EditCancelMemberModal',
          children: (
            <DiscardChangesModal
              onClose={() => closeModal('EditCancelMemberModal')}
              onDiscard={handleEditCancel}
            />
          ),
        })
      }
    }
  }

  const handleDeleteRole = (
    role: string,
    user: {
      id: number
      role: string[]
    },
  ) => {
    setMembers(prevState =>
      prevState.map(value => ({
        ...value,
        role:
          value.id === user.id
            ? value.role.filter(char => char !== role)
            : value.role,
      })),
    )
  }

  const handleAddRole = (
    role: string,
    user: {
      id: number
      role: string[]
    },
  ) => {
    setMembers(prevState =>
      prevState.map(value => ({
        ...value,
        role: value.id === user.id ? ['LPM', 'TAD'] : value.role,
      })),
    )
  }

  const columns: GridColumns<MembersType> = [
    {
      flex: 0.28,
      minWidth: 350,
      field: 'email',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography
              noWrap
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '.15px',
                color: 'rgba(76, 78, 100, 0.87)',
              }}
            >
              {`${row.firstName} ${
                row.middleName ? `(${row.middleName})` : ''
              } ${row.lastName}`}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '.15px',
                color: 'rgba(76, 78, 100, 0.6)',
              }}
            >
              {row.email}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.256,
      field: 'jobTitle',
      minWidth: 320,
      headerName: 'Job title',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.jobTitle ?? '-'}
          </Typography>
        )
      },
    },
    {
      field: 'role',
      minWidth: 201,
      flex: 0.1608,
      headerName: 'Role',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,

      renderCell: ({ row }: CellType) => {
        console.log("row",row)
        return (
          <Typography noWrap variant='body2'>
            {/* {row.role.map(value => {
              return <div>{value}</div>
            })} */}
            <RenderMembersChips
              user={{
                id: row.id,
                role: row.role,
              }}
              handleDeleteRole={handleDeleteRole}
              handleAddRole={handleAddRole}
              editRow={editRow}
            />
            {/* {RenderChips(row.role, handleDeleteRole)} */}
          </Typography>
        )
      },
    },
    {
      field: 'permission',
      minWidth: 160,
      flex: 0.128,
      headerName: 'Permission',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (

          <Typography noWrap variant='body2'>
            {
              row.permission.every(val => val === row.permission[0])
              ? row.permission[0]
              : row.permission.join(' / ')
            }
          </Typography>
        )
      },
    },
    {
      field: 'action',
      minWidth: 219,
      flex: 0.1752,
      headerName: 'Action',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {editRow ? (
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <Button variant='outlined' onClick={onClickEditCancel}>
                  Cancel
                </Button>
                <Button variant='contained' onClick={onClickEditSave}>
                  Save
                </Button>
              </Box>
            ) : (
              <IconButton
                sx={{ width: '24px', height: '24px', padding: 0 }}
                onClick={event => handleClick(event, row)}
              >
                <Icon icon='mdi:dots-horizontal' />
              </IconButton>
            )}
          </>
        )
      },
    },
  ]

  const GeneralColumns = columns.filter(column => column.field !== 'action')

  useEffect(() => {
    setMembers(memberList)
  }, [memberList])
  return (
    <Card>
      <CardHeader
        title={`Members (${memberList.length})`}
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
      <Box
        sx={{
          maxHeight: 610,
          width: '100%',
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <Menu
          elevation={8}
          anchorEl={anchorEl}
          id='customized-menu'
          onClose={handleClose}
          open={Boolean(anchorEl)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            sx={{ gap: 2 }}
            onClick={() => {
              selectedMember && onClickEditMember()
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '16px !important',
                marginRight: '0 !important',
              }}
            >
              <Icon icon='mdi:pencil-outline' fontSize={16} />
            </ListItemIcon>
            <ListItemText primary='Edit' />
          </MenuItem>
          <MenuItem
            sx={{ gap: 2 }}
            onClick={() => {
              selectedMember && onClickDeleteMember()
            }}
          >
            {/* onClick={() => onClickDeletePrice(row)} */}
            <ListItemIcon
              sx={{
                minWidth: '16px !important',
                marginRight: '0 !important',
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={16} />
            </ListItemIcon>
            <ListItemText primary='Delete' />
          </MenuItem>
        </Menu>
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
                >
                  <Typography variant='subtitle1'>
                    There are no members
                  </Typography>
                </Box>
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
                >
                  <Typography variant='subtitle1'>
                    There are no members
                  </Typography>
                </Box>
              )
            },
          }}
          columns={hasGeneralPermission ? GeneralColumns : columns}
          rows={members ?? []}
          // onCellClick={onCellClick}

          autoHeight
          disableSelectionOnClick
          pageSize={membersPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={membersPage}
          rowCount={members.length}
          onPageChange={(newPage: number) => {
            setMembersPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) =>
            setMembersPageSize(newPageSize)
          }
        />
      </Box>
    </Card>
  )
}

export default MemberList
