import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import Icon from '@src/@core/components/icon'
import { patchItemsForOrder, patchLangPairForOrder } from '@src/apis/order.api'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import AddLanguagePairForm from '@src/pages/components/forms/add-language-pair-form'
import ItemForm from '@src/pages/components/forms/items-form'
import { defaultOption, languageType } from '@src/pages/orders/add-new'
import { useGetClientPriceList } from '@src/queries/company/standard-price'

import languageHelper from '@src/shared/helpers/language.helper'
import { ItemType, PostItemType } from '@src/types/common/item.type'
import {
  LanguagePairsPostType,
  LanguagePairsType,
} from '@src/types/common/orders-and-quotes.type'
import { PriceUnitListType } from '@src/types/common/standard-price'
import {
  LanguageAndItemType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'

import { ProjectTeamType } from '@src/types/schema/project-team.schema'

import { Dispatch, SetStateAction } from 'react'
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import { updateOrderType } from '../[id]'

type Props = {
  langItem: LanguageAndItemType
  languagePairs: Array<languageType>
  setLanguagePairs: Dispatch<SetStateAction<Array<languageType>>>
  clientId: number
  itemControl: Control<
    {
      items: ItemType[]
    },
    any
  >
  getItem: UseFormGetValues<{
    items: ItemType[]
  }>
  setItem: UseFormSetValue<{
    items: ItemType[]
  }>
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
  }>
  itemErrors: FieldErrors<{
    items: ItemType[]
  }>
  isItemValid: boolean
  priceUnitsList: PriceUnitListType[]
  items: FieldArrayWithId<
    {
      items: ItemType[]
    },
    'items',
    'id'
  >[]
  removeItems: UseFieldArrayRemove
  getTeamValues: UseFormGetValues<ProjectTeamType>
  projectTax: number
  appendItems: UseFieldArrayAppend<
    {
      items: ItemType[]
    },
    'items'
  >
  orderId: number
  setLangItemsEdit: Dispatch<SetStateAction<boolean>>
  langItemsEdit: boolean
  project?: ProjectInfoType
  updateItems?: UseMutationResult<
    any,
    unknown,
    {
      id: number
      items: PostItemType[]
    },
    unknown
  >
}

const LanguageAndItem = ({
  langItem,
  clientId,
  languagePairs,
  setLanguagePairs,
  itemControl,
  getItem,
  setItem,
  itemTrigger,
  itemErrors,
  isItemValid,
  priceUnitsList,
  items,
  removeItems,
  getTeamValues,
  projectTax,
  appendItems,
  orderId,
  setLangItemsEdit,
  langItemsEdit,
  project,
  updateItems,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const { data: prices, isSuccess } = useGetClientPriceList({
    clientId: clientId,
  })

  const patchLanguagePairs = useMutation(
    (data: { id: number; langPair: LanguagePairsType[] }) =>
      patchLangPairForOrder(data.id, data.langPair),
  )

  const patchItems = useMutation(
    (data: { id: number; items: PostItemType[] }) =>
      patchItemsForOrder(data.id, data.items),
  )

  const handleBack = () => {
    setLangItemsEdit(false)
  }

  const onSubmit = () => {
    const items: PostItemType[] = getItem().items.map(item => ({
      ...item,
      analysis: item.analysis?.map(anal => anal?.data?.id!) || [],
      showItemDescription: item.showItemDescription ? '1' : '0',
    }))
    const langs: LanguagePairsPostType[] = languagePairs.map(item => {
      if (item?.price?.id) {
        return {
          langPairId: Number(item.id),
          source: item.source,
          target: item.target,
          priceId: item.price.id,
        }
      }
      return {
        langPairId: Number(item.id),
        source: item.source,
        target: item.target,
      }
    })

    patchLanguagePairs.mutate(
      { id: orderId, langPair: langs },
      {
        onSuccess: () => {
          patchItems.mutate(
            { id: orderId, items: items },
            {
              onSuccess: () => {
                setLangItemsEdit(false)
                queryClient.invalidateQueries(`LangItem-${orderId}`)
                closeModal('LanguageAndItemEditModal')
              },
            },
          )
        },
      },
    )
  }

  const onClickSave = () => {
    openModal({
      type: 'LanguageAndItemEditModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('LanguageAndItemEditModal')}
          onClick={onSubmit}
        />
      ),
    })
  }

  function getPriceOptions(source: string, target: string) {
    if (!isSuccess) return [defaultOption]
    const filteredList = prices
      .filter(item => {
        const matchingPairs = item.languagePairs.filter(
          pair => pair.source === source && pair.target === target,
        )
        return matchingPairs.length > 0
      })
      .map(item => ({
        groupName: item.isStandard ? 'Standard client price' : 'Matching price',
        ...item,
      }))
    return [defaultOption].concat(filteredList)
  }

  function isAddItemDisabled(): boolean {
    if (!languagePairs.length) return true
    return languagePairs.some(item => !item?.price)
  }

  function addNewItem() {
    const teamMembers = getTeamValues()?.teams
    const projectManager = teamMembers.find(
      item => item.type === 'projectManagerId',
    )
    appendItems({
      name: '',
      source: '',
      target: '',
      contactPersonId: projectManager?.id!,
      priceId: null,
      detail: [],
      totalPrice: 0,
      showItemDescription: false,
    })
  }

  function onDeleteLanguagePair(row: languageType) {
    const isDeletable = !getItem()?.items?.length
      ? true
      : !getItem().items.some(
          item => item.source === row.source && item.target === row.target,
        )
    if (isDeletable) {
      openModal({
        type: 'delete-language',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this language pair?'
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onDelete={deleteLanguage}
            onClose={() => closeModal('delete-language')}
          />
        ),
      })
    } else {
      openModal({
        type: 'cannot-delete-language',
        children: (
          <SimpleAlertModal
            message='This language pair cannot be deleted because it’s already being used in the item.'
            title={`${languageHelper(row.source)} -> ${languageHelper(
              row.target,
            )}`}
            onClose={() => closeModal('cannot-delete-language')}
          />
        ),
      })
    }

    function deleteLanguage() {
      const idx = languagePairs.map(item => item.id).indexOf(row.id)
      const copyOriginal = [...languagePairs]
      copyOriginal.splice(idx, 1)
      setLanguagePairs([...copyOriginal])
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          variant='outlined'
          sx={{ display: 'flex', gap: '8px', mb: '24px' }}
          disabled={
            items.length < 1 ||
            project?.status === 'Paid' ||
            project?.status === 'Canceled'
          }
        >
          <Icon icon='ic:baseline-splitscreen' />
          Split order
        </Button>
        {project &&
        project.status !== 'Invoiced' &&
        project.status !== 'Paid' &&
        project.status !== 'Canceled' ? (
          <IconButton onClick={() => setLangItemsEdit(!langItemsEdit)}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        ) : null}
      </Box>
      <Grid item xs={12}>
        <AddLanguagePairForm
          languagePairs={languagePairs}
          setLanguagePairs={setLanguagePairs}
          getPriceOptions={getPriceOptions}
          type={langItemsEdit ? 'edit' : 'detail'}
          onDeleteLanguagePair={onDeleteLanguagePair}
        />
      </Grid>
      <Grid item xs={12} mt={6} mb={6}>
        <ItemForm
          control={itemControl}
          getValues={getItem}
          setValue={setItem}
          errors={itemErrors}
          fields={items}
          remove={removeItems}
          isValid={isItemValid}
          teamMembers={getTeamValues()?.teams}
          languagePairs={languagePairs}
          getPriceOptions={getPriceOptions}
          priceUnitsList={priceUnitsList || []}
          type={langItemsEdit ? 'edit' : 'detail'}
          itemTrigger={itemTrigger}
          project={project}
          updateItems={updateItems}
        />
      </Grid>
      {langItemsEdit ? (
        <Grid item xs={12}>
          <Button
            startIcon={<Icon icon='material-symbols:add' />}
            disabled={isAddItemDisabled()}
            onClick={addNewItem}
          >
            <Typography
              color={isAddItemDisabled() ? 'secondary' : 'primary'}
              sx={{ textDecoration: 'underline' }}
            >
              Add new item
            </Typography>
          </Button>
        </Grid>
      ) : null}
    </>
  )
}

export default LanguageAndItem
