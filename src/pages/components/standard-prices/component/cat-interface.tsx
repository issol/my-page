import {
  Button,
  Card,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material'
import Box from '@mui/material/Box'

import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import {
  PriceUnitListType,
  PriceUnitListWithHeaders,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { v4 as uuidv4 } from 'uuid'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { ChangeEvent, useState, MouseEvent, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { CatInterfaceChip } from '@src/@core/components/chips/chips'
import { useGetCatInterface } from '@src/queries/company/standard-price'

type Props = {
  priceUnitList: PriceUnitListType[]
  priceData: StandardPriceListType
  existPriceUnit: boolean
}
const CatInterface = ({ priceUnitList, priceData, existPriceUnit }: Props) => {
  const [alignment, setAlignment] = useState<string>('Memsource')
  const [isEditingCatInterface, setIsEditingCatInterface] = useState(false)
  const { data: catInterface, isLoading } = useGetCatInterface(alignment!)

  const [priceUnitListWithHeaders, setPriceUnitListWithHeaders] = useState<
    PriceUnitListWithHeaders[]
  >([])

  const [headers, setHeaders] = useState<
    Array<{ value: string; selected: boolean; tmpSelected: boolean }>
  >([])

  const handleAlignment = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment)
  }
  function getKeyByValue<T extends { [key: string]: string }>(
    object: T,
    value: string,
  ): keyof T | undefined {
    return Object.keys(object).find(key => object[key] === value) as
      | keyof T
      | undefined
  }

  const rounding = getKeyByValue(
    PriceRoundingResponseEnum,
    priceData.roundingProcedure,
  )

  const [name, setName] = useState<number>(1)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(parseFloat(event.target.value))
  }

  const onClickEditCatInterface = () => {
    setIsEditingCatInterface(true)
  }

  const onClickCancelEditCatInterface = () => {
    setIsEditingCatInterface(false)
  }

  const onClickSaveEditCatInterface = () => {
    setIsEditingCatInterface(false)
  }

  const onClickRangeChip = (
    data: { value: string; selected: boolean },
    value: PriceUnitListWithHeaders,
  ) => {
    setHeaders(prevHeaders => {
      const updatedHeaders = prevHeaders.map(obj => {
        if (obj.value === data.value) {
          return {
            ...obj,
            selected: !obj.selected,
            tmpSelected: !obj.selected, // 선택된 상태를 반전시킴
          }
        }
        return obj
      })
      return updatedHeaders
    })

    setPriceUnitListWithHeaders(prevState => {
      const concatPrev = prevState
      const res = prevState.find(data => data.id === value.id)
      const resIndex = prevState.findIndex(data => data.id === value.id)
      if (res) {
        const updatedHeaders = res.headers.map(obj => {
          if (obj.value === data.value) {
            return {
              ...obj,
              selected: !obj.selected,
              tmpSelected: !obj.selected, // 선택된 상태를 반전시킴
            }
          }
          return obj
        })
        res['headers'] = updatedHeaders
        concatPrev[resIndex] = res

        return concatPrev
      } else {
        return prevState
      }
    })
  }

  useEffect(() => {
    if (!isLoading && catInterface && priceUnitList) {
      const formattedHeader = catInterface.headers.map(value => ({
        value: value,
        selected: false,
        tmpSelected: false,
      }))
      setHeaders(formattedHeader)
      const withHeaders = priceUnitList.map(value => ({
        ...value,
        headers: formattedHeader,
      }))

      setPriceUnitListWithHeaders(withHeaders)
    }
  }, [catInterface, isLoading, priceUnitList])

  return (
    <Card
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Typography variant='h6'>CAT Interface</Typography>
          <Box>
            <ToggleGroup
              exclusive
              color='primary'
              value={alignment}
              onChange={handleAlignment}
              sx={{ border: '1px solid #666CFF' }}
            >
              <ToggleButton value='Memsource' sx={{ color: '#666CFF' }}>
                Memsource
              </ToggleButton>
              <ToggleButton value='memoQ' sx={{ color: '#666CFF' }}>
                memoQ
              </ToggleButton>
            </ToggleGroup>
          </Box>
        </Box>

        {isEditingCatInterface ? (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant='contained'
              color='secondary'
              sx={{
                width: '36px',
                height: '36px',
                minWidth: '36px !important',
              }}
              onClick={onClickCancelEditCatInterface}
            >
              <img
                src='/images/icons/price-icons/interface-cancel.svg'
                alt=''
              />
            </Button>
            <Button
              variant='contained'
              sx={{
                width: '36px',
                height: '36px',
                minWidth: '36px !important',
              }}
              onClick={onClickSaveEditCatInterface}
            >
              <img src='/images/icons/price-icons/interface-check.svg' alt='' />
            </Button>
          </Box>
        ) : !isEditingCatInterface && existPriceUnit ? (
          <IconButton onClick={onClickEditCatInterface}>
            <Icon icon='mdi:pencil-outline'></Icon>
          </IconButton>
        ) : null}
      </Box>
      <Box sx={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        {!isLoading && priceUnitListWithHeaders.length ? (
          priceUnitListWithHeaders.map(value => {
            return (
              <Box
                key={uuidv4()}
                sx={{
                  border: '1px solid rgba(76, 78, 100, 0.22)',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                    {rounding === 'Type_0'
                      ? value.price.toFixed(priceData.decimalPlace)
                      : value.price}
                    &nbsp;
                    {priceData.currency}&nbsp;per&nbsp;
                    {value.unit && value.unit === 'Percent'
                      ? 1
                      : value.quantity}
                    &nbsp;
                    {value.unit && value.unit !== 'Percent'
                      ? value.unit
                      : value.unit && value.unit === 'Percent'
                      ? ''
                      : ''}
                    &nbsp;
                    {value.title}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <TextField
                      value={name}
                      onChange={handleChange}
                      id='controlled-text-field'
                      InputProps={{
                        style: {
                          width: '36px',
                          height: '36px',
                        },
                      }}
                    />
                    <Typography variant='body2' sx={{}}>
                      Words
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '1%', overflow: 'scroll' }}>
                  {value.headers.map(data => {
                    return (
                      <CatInterfaceChip
                        label={data.value}
                        size='medium'
                        clickable={isEditingCatInterface}
                        status={data.selected}
                        key={uuidv4()}
                        sx={{
                          display: 'flex',
                          '& .Mui-disabled': { opacity: 1 },
                        }}
                        onClick={() =>
                          isEditingCatInterface
                            ? onClickRangeChip(data, value)
                            : null
                        }
                        icon={
                          data.tmpSelected ? (
                            <img
                              src='/images/icons/price-icons/check-chip.svg'
                              alt=''
                            />
                          ) : undefined
                        }
                      />
                    )
                  })}
                </Box>
              </Box>
            )
          })
        ) : (
          <Box
            key={uuidv4()}
            sx={{
              border: '1px solid rgba(76, 78, 100, 0.22)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                -
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                -
                <Typography variant='body2' sx={{}}>
                  Words
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '1%', overflow: 'scroll' }}>
              {headers.map(value => {
                return (
                  <CatInterfaceChip
                    label={value.value}
                    size='medium'
                    status={false}
                    key={uuidv4()}
                    sx={{ display: 'flex' }}
                  />
                )
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  )
}

export const ToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  height: '38px',
  '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-of-type".)': {
    borderLeftColor: '#666CFF', // 가운데 선의 색상을 변경할 수 있습니다.
  },
}))

export default CatInterface
