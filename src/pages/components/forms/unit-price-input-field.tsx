import { TextField } from '@mui/material'
import { ItemDetailType } from '@src/types/common/item.type'
import { useRef } from 'react'

type Props = {
  value: number
  savedValue: ItemDetailType
  onChange: (...event: any[]) => void
  unitPrice: string
  setCurrentPrice: (v: number | string) => void
}
export default function UnitPriceInputField({
  value,
  savedValue,
  onChange,
  unitPrice,
  setCurrentPrice,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleMaskedFieldClick = () => {
    if (inputRef.current) inputRef.current.focus()
  }
  return (
    <>
      <TextField
        placeholder='Input'
        value={value}
        disabled={savedValue.unit === 'Percent'}
        sx={{ maxWidth: '80px', padding: 0 }}
        inputRef={inputRef}
        onChange={e => {
          // ** TODO 나중에 계산할 시 아래 계산식 사용하기
          //   const newValue = formatByRoundingProcedure(
          //     getPrice(e.target.value, priceFactor),
          //     priceData?.decimalPlace!,
          //     priceData?.roundingProcedure!,
          //     savedValue.currency,
          //   )
          onChange(e)
          setCurrentPrice(e.target.value)
        }}
        style={{ position: 'absolute', opacity: 0 }}
      />
      <TextField
        placeholder='0.00'
        value={unitPrice}
        onClick={handleMaskedFieldClick}
        sx={{ maxWidth: '80px', padding: 0 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </>
  )
}
