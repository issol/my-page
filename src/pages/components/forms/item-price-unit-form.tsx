// ** react
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import styled from 'styled-components'

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { languageType } from '@src/pages/orders/add-new'

import { v4 as uuidv4 } from 'uuid'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { defaultOption } from '../form-container/languages-and-items/languages-and-items-container'
import languageHelper from '@src/shared/helpers/language.helper'

export default function ItemPriceUnitForm() {
  return <div></div>
}

const HeaderCell = styled(TableCell)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  height: 20px;
  position: relative;
  text-transform: none;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`
