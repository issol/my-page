import { CardContent, Grid } from '@mui/material'
import AddLanguagePairForm from '../../forms/add-language-pair-form'
import { Dispatch, SetStateAction } from 'react'
import { languageType } from '@src/pages/orders/add-new'
import { useGetPriceList } from '@src/queries/company/standard-price'

type Props = {
  languagePairs: languageType[]
  setLanguagePairs: Dispatch<SetStateAction<languageType[]>>
  clientId: number | null
}
export default function LanguagesAndItemsContainer({
  languagePairs,
  setLanguagePairs,
  clientId,
}: Props) {
  const { data: prices } = useGetPriceList({})

  function getPriceOptions(source: string, target: string) {
    //clientId
    //source, target
    //api새로 추가되면 그거 쓰기..
    if (clientId && prices?.data) {
      prices?.data.filter(price => price?.client)
    }
  }
  return (
    <Grid container>
      <AddLanguagePairForm
        languagePairs={languagePairs}
        setLanguagePairs={setLanguagePairs}
      />
    </Grid>
  )
}
