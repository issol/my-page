import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { device } from '../shared/helpers/device.helper'
import pal from '../@core/theme/palette'
import { PaletteType } from '../@core/theme/palette/type'

interface CtaButtonProps {
  shape?: 'default' | 'square'
  color?: 'primary' | 'secondary' | 'primary-border' | 'secondary-border' | 'error'
  width?: string
  fontSize?: string
  mobileWidth?: string
  children?: ReactNode
  disabled?: boolean
}

interface ButtonProps {
  palette: PaletteType
}

const CtaButton = styled.button<CtaButtonProps & ButtonProps>`
  cursor: pointer;
  width: ${({ width }) => width ?? 'unset'};
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ shape }) => (shape === 'square' ? '4px' : '30px')};
  color: #fff;
  border: none;
  ${({ color, palette }) =>
    color === 'primary' &&
    `
      background: ${palette.primary.main};
    `}

  ${({ color, palette }) =>
    color === 'primary-border' &&
    `
      background: transparent;
      border: 1px solid ${palette.primary.main};
      color: ${palette.primary.main};
    `}
  ${({ color, palette }) =>
    color === 'secondary' &&
    `
      background: transparent;
      border: 1px solid ${palette.secondary.main};
      color: ${palette.secondary.main};
    `}
  ${({ color, palette }) =>
    color === 'secondary-border' &&
    `
      background: transparent;
      border: 1px solid ${palette.secondary.main};
      color: ${palette.secondary.main};
    `}
  ${({ color, palette }) =>
    color === 'error' &&
    `
      background: transparent;
      border: 1px solid ${palette.error.main};
      color: ${palette.error.main};
    `}
  padding: 12px 24px;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};
  font-weight: 700;
  :hover {
    ${({ color, palette }) =>
      color === 'primary' &&
      `
        background: ${palette.primary.dark};
      `}
    ${({ color, palette }) =>
      color === 'primary-border' &&
      `
        background: #fff;
        border: 1px solid ${palette.primary.dark};
        color: ${palette.primary.dark};
      `}
    ${({ color, palette }) =>
      color === 'secondary' &&
      `
        background: #fff;
        border: 1px solid ${palette.secondary.dark};
        color: ${palette.secondary.dark};
      `}
    ${({ color, palette }) =>
      color === 'secondary-border' &&
      `
        background: transparent;
        border: 1px solid ${palette.secondary.dark};
        color: ${palette.secondary.dark};
      `}

    ${({ color, palette }) =>
      color === 'error' &&
      `
        background: ${palette.error.dark};
        color: #ffffff;
      `}
  }
  :disabled {
    cursor: not-allowed;
    border: none;
    background: ${({ palette }) => palette.grey[400]};
    color: #ffffff;
    img {
      filter: opacity(0.5);
    }
  }
  @media ${device.mobile} {
    padding: 13px 26px;
    width: ${({ mobileWidth, width }) => (mobileWidth ? mobileWidth : width ? width : 'unset')};
  }
`
export const Cta = ({ children, ...rest }: CtaButtonProps) => {
  const palette = pal('light', 'default')

  return (
    <CtaButton {...rest} palette={palette}>
      {children}
    </CtaButton>
  )
}
