import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Card, Tab, Typography, styled } from '@mui/material'
import Chip from '@src/@core/components/mui/chip'
import { RoleType } from '@src/context/types'
import { useGetCompanyInfo } from '@src/queries/company/company-info.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  Suspense,
  MouseEvent,
  useState,
  SyntheticEvent,
  useEffect,
} from 'react'
import CompanyInfoCard from './components/info-card'
import CompanyInfoOverview from './components/overview'
import CompanyInfoAddress from './components/address'
import useModal from '@src/hooks/useModal'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  lpmCompanyAddressSchema,
  lpmCompanyInfoSchema,
} from '@src/types/schema/lpm-company-info.schema'
import {
  CompanyAddressFormType,
  CompanyInfoFormType,
  CompanyInfoType,
} from '@src/types/company/info'
import { set } from 'nprogress'
import { c } from 'msw/lib/glossary-de6278a9'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'

const CompanyInfo = () => {
  const { openModal, closeModal } = useModal()

  const [tab, setTab] = useState<string>('overview')

  const { data: companyInfo } = useGetCompanyInfo()

  const [infoEdit, setInfoEdit] = useState(false)
  const [addressEdit, setAddressEdit] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>>({
    mode: 'onChange',
    resolver: yupResolver(lpmCompanyInfoSchema),
  })

  const {
    control: addressControl,

    getValues: addressGetValues,
    watch: addressWatch,
    reset: addressReset,
    formState: { errors: addressErrors, isValid: addressIsValid },
  } = useForm<{ address: Array<CompanyAddressFormType> }>({
    mode: 'onChange',
    resolver: yupResolver(lpmCompanyAddressSchema),
  })

  const {
    fields: ceoFields,
    append: appendCeo,
    remove: removeCeo,
    update: updateCeo,
  } = useFieldArray({
    control: control,
    name: 'ceo',
  })

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control: addressControl,
    name: 'address',
  })

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    if (infoEdit || addressEdit) {
      openModal({
        type: 'EditAlertModal',
        children: (
          <EditAlertModal
            onClose={() => closeModal('EditAlertModal')}
            onClick={() => {
              closeModal('EditAlertModal')
              setTab(newValue)
              setInfoEdit(false)
              setAddressEdit(false)
            }}
          />
        ),
      })

      return
    }
    setTab(newValue)
  }

  const handleCancel = () => {
    setInfoEdit(false)
    setAddressEdit(false)
    reset({
      ...companyInfo,

      headquarter: {
        value: companyInfo?.headquarter!,
        label: companyInfo?.headquarter!,
      },
    })
    addressReset({
      address: companyInfo?.address?.map(item => ({
        ...item,
        country: {
          label: item.country,
          value: item.country,
        },
      })),
    })
  }

  const onClickCancel = () => {
    openModal({
      type: 'CancelEditCompanyInfoModal',
      children: (
        <DiscardChangesModal
          onClose={() => closeModal('CancelEditCompanyInfoModal')}
          onDiscard={handleCancel}
        />
      ),
    })
  }

  const handleSave = () => {
    setInfoEdit(false)
    setAddressEdit(false)
    // TODO API call
  }

  const onClickSave = () => {
    openModal({
      type: 'SaveEditCompanyInfoModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('SaveEditCompanyInfoModal')}
          onClick={handleSave}
        />
      ),
    })
  }

  const onClickAddCeo = () => {
    appendCeo({
      firstName: '',
      middleName: '',
      lastName: '',
    })
  }

  const onClickDeleteCeo = (id: string) => {
    const idx = ceoFields.map(item => item.id as string).indexOf(id)
    idx !== -1 && removeCeo(idx)
  }

  useEffect(() => {
    if (companyInfo) {
      reset({
        ...companyInfo,

        headquarter: {
          value: companyInfo.headquarter!,
          label: companyInfo.headquarter!,
        },
      })
      addressReset({
        address: companyInfo?.address.map(item => ({
          ...item,
          country: {
            label: item.country,
            value: item.country,
          },
        })),
      })

      if (companyInfo.ceo && companyInfo.ceo.length === 0) {
        appendCeo({
          firstName: '',
          middleName: '',
          lastName: '',
        })
      } else if (companyInfo.address && companyInfo.address.length === 0) {
        appendAddress({
          officeName: '',
          baseAddress: '',
          detailAddress: '',
          city: '',
          state: '',
          country: {
            value: '',
            label: '',
          },
          zipCode: '',
        })
      }
    }
  }, [companyInfo])

  return (
    <Suspense>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <CompanyInfoCard companyInfo={companyInfo!} />
        <TabContext value={tab}>
          <TabList
            onChange={handleChange}
            aria-label='Pro detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='overview'
              label='Overview'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />

            <CustomTab
              value='billingPlan'
              label='Billing Plan'
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='overview'>
            {!addressEdit && (
              <CompanyInfoOverview
                companyInfo={companyInfo!}
                edit={infoEdit}
                setEdit={setInfoEdit}
                control={control}
                ceoFields={ceoFields}
                watch={watch}
                onClickCancel={onClickCancel}
                onClickSave={onClickSave}
                onClickAddCeo={onClickAddCeo}
                onClickDeleteCeo={onClickDeleteCeo}
                isValid={isValid}
              />
            )}
            {!infoEdit && (
              <CompanyInfoAddress
                companyInfo={companyInfo!}
                edit={addressEdit}
                setEdit={setAddressEdit}
                control={addressControl}
                isValid={addressIsValid}
                addressFields={addressFields}
              />
            )}
          </TabPanel>

          <TabPanel value='billingPlan'></TabPanel>
        </TabContext>
      </Box>
    </Suspense>
  )
}

export default CompanyInfo

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`

CompanyInfo.acl = {
  subject: 'company_info',
  action: 'read',
}
