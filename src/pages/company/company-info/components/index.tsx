import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, styled, Tab } from '@mui/material'
import { useGetCompanyInfo } from '@src/queries/company/company-info.query'
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'

import useModal from '@src/hooks/useModal'
import EditAlertModal from '@src/@core/components/common-modal/edit-alert-modal'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  lpmCompanyAddressSchema,
  lpmCompanyInfoSchema,
} from '@src/types/schema/lpm-company-info.schema'
import {
  CompanyAddressFormType,
  CompanyAddressParamsType,
  CompanyInfoFormType,
  CompanyInfoParamsType,
} from '@src/types/company/info'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useMutation } from 'react-query'
import {
  patchCompanyAddress,
  patchCompanyInfo,
} from '@src/apis/company/company-info.api'
import { getCurrentRole } from '@src/shared/auth/storage'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import CompanyInfoCard from './info-card'
import CompanyInfoOverview from './overview'
import CompanyInfoAddress from './address'
import BillingPlan from './billing-plan'
import { useRouter } from 'next/router'

interface FileProp {
  name: string
  type: string
  size: number
}

type tabMenu = 'overview' | 'billing'

const CompanyInfoPageComponent = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const tabQuery = router.query.tab as tabMenu

  const [tab, setTab] = useState<string>('overview')

  const auth = useRecoilValueLoadable(authState)

  const { data: companyInfo, refetch } = useGetCompanyInfo(
    auth.getValue().user?.company!,
  )

  const [infoEdit, setInfoEdit] = useState(false)
  const [addressEdit, setAddressEdit] = useState(false)
  const [file, setFile] = useState<File | null>()
  const [logoURL, setlogoURL] = useState<string>(
    '/images/company/default-company-logo.svg',
  )

  const currentRole = getCurrentRole()

  const isUpdatable =
    currentRole &&
    (currentRole.type === 'Master' || currentRole.type === 'Manager')

  const patchCompanyInfoMutation = useMutation(
    (data: CompanyInfoParamsType) => patchCompanyInfo(data),
    {
      onSuccess: data => {
        refetch()
        setInfoEdit(false)
        closeModal('SaveEditCompanyInfoModal')
      },
    },
  )

  const patchCompanyAddressMutation = useMutation(
    (data: { address: Array<CompanyAddressParamsType>; companyId: string }) =>
      patchCompanyAddress(data.address, data.companyId),
    {
      onSuccess: data => {
        refetch()
      },
    },
  )
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
    resolver: yupResolver(lpmCompanyInfoSchema) as unknown as Resolver<
      Omit<CompanyInfoFormType, 'billingPlan' | 'logo' | 'address'>
    >,
  })

  const {
    control: addressControl,
    getValues: addressGetValues,
    watch: addressWatch,
    reset: addressReset,
    formState: { errors: addressErrors, isValid: addressIsValid },
  } = useForm<{ address: Array<CompanyAddressFormType> }>({
    mode: 'onChange',
    resolver: yupResolver(lpmCompanyAddressSchema) as Resolver<{
      address: Array<CompanyAddressFormType>
    }>,
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
              // setTab(newValue)
              router.push({ pathname: '/company/company-info/', query: { tab: newValue } })
              setInfoEdit(false)
              setAddressEdit(false)
            }}
          />
        ),
      })

      return
    }
    router.push({ pathname: '/company/company-info/', query: { tab: newValue } })
    // setTab(newValue)
  }

  const handleCancel = (type: 'info' | 'address') => {
    if (type === 'info') {
      setInfoEdit(false)
      reset({
        ...companyInfo,

        headquarter: {
          value: companyInfo?.headquarter!,
          label: companyInfo?.headquarter!,
        },
      })
      if (companyInfo && companyInfo.ceo === null) {
        appendCeo({
          firstName: '',
          middleName: '',
          lastName: '',
        })
      }
    } else {
      setAddressEdit(false)

      addressReset({
        address:
          (companyInfo?.companyAddresses?.map(item => ({
            ...item,
            country: {
              label: item.country,
              value: item.country,
            },
          })) as Array<CompanyAddressFormType>) || [],
      })

      if (companyInfo && companyInfo.companyAddresses.length === 0) {
        appendAddress({
          name: '',
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
  }

  const onClickCancel = (type: 'info' | 'address') => {
    openModal({
      type: `CancelEditCompany${type}Modal`,
      children: (
        <DiscardChangesModal
          onClose={() => closeModal(`CancelEditCompany${type}Modal`)}
          onDiscard={() => handleCancel(type)}
        />
      ),
    })
  }

  const handleSave = (type: 'info' | 'address') => {
    if (companyInfo) {
      if (type === 'info') {
        const data = getValues()
        if (file) {
          uploadCompanyLogo(file)
        }
        const res = {
          ...data,
          headquarter: data.headquarter?.value,
          logo: file ? makeCompanyLogoPath(file.name) : '',
          ceo:
            data.ceo &&
            data.ceo.filter(
              value => value.firstName !== '' && value.lastName !== '',
            ).length > 0
              ? data.ceo
              : undefined,
        }
        patchCompanyInfoMutation.mutate({ ...res })
        setInfoEdit(false)
      } else {
        const data = addressGetValues()
        // console.log(data)

        const res: Array<CompanyAddressParamsType> = data.address.map(
          value => ({
            ...value,
            country: value.country?.value,
          }),
        )

        patchCompanyAddressMutation.mutate({
          address: res,
          companyId: companyInfo.id!,
        })
        setAddressEdit(false)
      }
    }
  }

  const onClickSave = (type: 'info' | 'address') => {
    openModal({
      type: `SaveEditCompany${type}Modal`,
      children: (
        <EditSaveModal
          onClose={() => closeModal(`SaveEditCompany${type}Modal`)}
          onClick={() => handleSave(type)}
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

  const onClickAddAddress = () => {
    appendAddress({
      name: '',
      baseAddress: '',
      detailAddress: '',
      country: {
        label: '',
        value: '',
      },
      city: '',
      state: '',
      zipCode: '',
    })
  }

  const onClickDeleteCeo = (id: string) => {
    const idx = ceoFields.map(item => item.id as string).indexOf(id)
    idx !== -1 && removeCeo(idx)
  }

  const onClickDeleteAddress = (id: string) => {
    const idx = addressFields.map(item => item.id as string).indexOf(id)
    idx !== -1 && removeAddress(idx)
  }

  const onClickUploadLogo = (file: File | null) => {
    if (file) setFile(file)
    else setFile(null)
  }

  const uploadCompanyLogo = (file: File) => {
    const filePath = makeCompanyLogoPath(file.name)
    getUploadUrlforCommon(S3FileType.COMPANY_LOGO, filePath).then(res => {
      uploadFileToS3(res, file)
    })
  }

  const makeCompanyLogoPath = (fileName: string, company?: string) => {
    const comp = company ? company : 'GloZ'
    return `company/${comp}/logo/${fileName}`
  }

  useEffect(() => {
    if (companyInfo?.logo) {
      getDownloadUrlforCommon(S3FileType.COMPANY_LOGO, companyInfo?.logo).then(
        res => {
          setlogoURL(res)
        },
      )
    } else {
      setlogoURL('/images/company/default-company-logo.svg')
    }
  }, [companyInfo])

  useEffect(() => {
    if (companyInfo) {
      reset({
        ...companyInfo,

        headquarter: {
          value: companyInfo.headquarter!,
          label: companyInfo.headquarter!,
        },
        companyId: companyInfo.id,
      })
      addressReset({
        address:
          (companyInfo.companyAddresses?.map(item => ({
            ...item,
            country: {
              label: item.country,
              value: item.country,
            },
          })) as Array<CompanyAddressFormType>) || [],
      })

      if (companyInfo.ceo === null) {
        appendCeo({
          firstName: '',
          middleName: '',
          lastName: '',
        })
      }
      if (companyInfo.companyAddresses.length === 0) {
        // console.log('hi')

        appendAddress({
          name: '',
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

  useEffect(() => {
    if (tabQuery && ['overview', 'billing'].includes(tabQuery)) setTab(tabQuery)
  }, [tabQuery])

  return (
    <Suspense>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <CompanyInfoCard companyInfo={companyInfo!} companyLogoURL={logoURL} />
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
              value='billing'
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
                onClickUploadLogo={onClickUploadLogo}
                companyLogoURL={logoURL}
                isValid={isValid}
                isUpdatable={isUpdatable!}
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
                onClickCancel={onClickCancel}
                onClickSave={onClickSave}
                onClickAddAddress={onClickAddAddress}
                onClickDeleteAddress={onClickDeleteAddress}
                isUpdatable={isUpdatable!}
              />
            )}
          </TabPanel>

          <TabPanel value='billing'>
            <BillingPlan
              auth={auth.getValue()}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Suspense>
  )
}

export default CompanyInfoPageComponent

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`
