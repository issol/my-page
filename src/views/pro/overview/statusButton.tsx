import React from 'react'
import { AppliedRoleType } from '@src/types/onboarding/details'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

interface StatusButtonProps {
  jobInfo: AppliedRoleType
}

const StatusButton = ({ jobInfo }: StatusButtonProps) => {
  return <div></div>
}

export const StatusCustomButton = styled(Button)<{
  bgColor: string
  textColor: string
}>(({ bgColor, textColor }) => {
  return {
    '&.Mui-disabled': {
      background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${bgColor}`,
      border: '1px solid rgba(255, 77, 73, 0.5)',
      color: `${textColor}`,
    },
  }
})
export default StatusButton
