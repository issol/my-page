import { Typography } from '@mui/material'
import styled from 'styled-components'

//output : 3줄부터 ...처리
export const TitleTypography = styled(Typography)`
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`
export const TableTitleTypography = styled(Typography)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
