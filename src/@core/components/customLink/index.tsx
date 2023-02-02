import Link from 'next/link'
import styled from 'styled-components'

export const StyledNextLink = styled(Link)<{
  color?: 'primary' | 'secondary' | 'white'
}>`
  text-decoration: none;
  color: ${({ color }) =>
    color === 'secondary'
      ? '#6D788D'
      : color === 'white'
      ? '#ffffff'
      : '#666cff'};
`
