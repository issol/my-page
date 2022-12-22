import pal from '../@core/theme/palette'
import { PaletteType } from '../@core/theme/palette/type'
import styled from '@emotion/styled'
import { InputHTMLAttributes } from 'react'

export const CustomRadio = styled.label<{ color?: 'primary' | 'secondary'; palette: PaletteType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
  position: relative;
  min-width: 18px;
  border-radius: 25px;
  align-self: center;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  input + span {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #ccc;
    border-radius: 50%;
  }
  input:checked + .dot {
    display: inline-block;
    border: 1px solid ${({ color, palette }) => (color === 'secondary' ? palette.secondary.main : palette.primary.main)};
  }
  .dot:after {
    content: '';
    display: none;
    position: absolute;
    background: ${({ color, palette }) => (color === 'secondary' ? palette.secondary.main : palette.primary.main)};
    transform: translate(50%, 50%);
    width: 8px;
    height: 8px;
    border-radius: 25px;
  }

  input:checked ~ .dot:after {
    display: block;
  }
`

type RadioProps = {
  htmlFor: string
  name: string
  checked?: boolean
  disabled?: boolean
  labelName?: string
  onChange: (e: InputHTMLAttributes<HTMLInputElement>) => void
  value?: any
  color?: 'primary' | 'secondary'
}

export function RadioButton({ htmlFor, name, disabled, checked, onChange, labelName, value, color }: RadioProps) {
  const palette = pal('light', 'default')
  CustomRadio.defaultProps = { htmlFor }

  return (
    <CustomRadio color={color} palette={palette}>
      <input
        type='radio'
        id={htmlFor}
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span className='dot'></span>
      <span>{labelName ?? null}</span>
    </CustomRadio>
  )
}
