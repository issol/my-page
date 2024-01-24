import Link from 'next/link'
import { styled } from '@mui/system'

export const StyledNextLink = styled(Link)<{
  color?: 'primary' | 'secondary' | 'white' | 'black'
}>`
  text-decoration: none;
  color: ${({ color }) =>
    color === 'secondary'
      ? '#6D788D'
      : color === 'white'
        ? '#ffffff'
        : color === 'black'
          ? 'rgba(76, 78, 100, 0.87);'
          : '#666cff'};
`
