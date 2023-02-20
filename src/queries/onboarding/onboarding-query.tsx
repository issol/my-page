import { useQuery, UseQueryResult } from 'react-query'
import { getReviewer } from 'src/apis/onboarding.api'
import {
  getOnboardingProDetails,
  getOnboardingProList,
  getResume,
} from 'src/apis/onboarding-real.api'
import {
  OnboardingJobInfoType,
  OnboardingListType,
} from 'src/types/onboarding/list'
import { OnboardingProDetailsType } from 'src/types/onboarding/details'
import { AxiosResponse } from 'axios'

// const defaultValue: OnboardingProDetailsType = {
//   id: '',
//   userId: 0,
//   email: '',
//   firstName: '',
//   middleName: null,
//   lastName: '',
//   experience: '',
//   jobInfo: [],
//   isOnboarded: false,
//   notesFromUser: null,
//   isActive: false,
//   legalNamePronunciation: null,
//   pronounce: null,
//   preferredName: null,
//   preferredNamePronunciation: null,
//   timezone: {
//     code: 'ko',
//     label: '',
//     phone: '',
//   },
//   mobile: null,
//   phone: null,
//   resume: [{ uri: '', fileName: '', fileType: '' }],
//   contracts: [{ uri: '', fileName: '', fileType: '' }],
//   specialties: [''],
//   commentsOnPro: [],
//   corporationId: '',
//   createdAt: '',
//   updatedAt: '',
//   deletedAt: '',
//   fromSNS: false,
//   havePreferredName: false,
//   company: '',
// }

export const useGetReviewerList = () => {
  return useQuery(
    'reviewers',
    () => {
      return getReviewer()
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetOnboardingProList = () => {
  return useQuery<{ data: OnboardingListType[]; totalCount: number }>(
    'onboarding-pro-list',
    () => {
      return getOnboardingProList()
    },
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetOnboardingProDetails = (userId: string | string[]) => {
  const id = typeof userId === 'string' ? userId : ''
  return useQuery<OnboardingProDetailsType, Error, OnboardingProDetailsType>(
    `${userId}`,
    () => {
      return getOnboardingProDetails(id)
    },

    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      select: (data: OnboardingProDetailsType) => {
        const resume = [
          {
            id: 1,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/resume-sample.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2YTDNGRR7FPPMHNY%2F20230220%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230220T043500Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEBMaDBRSLhIBPKkhGcKbtSKGAaYDEdyfzsNYKP5puXltuUfcubqVrbNDqQNBiym1lK2ZFHtcOrx6r9SklQZdVqIeUsJ869bIlkPA3PLZXZAkduk97QgMqpO639FhVIFXTikZzaxoRlbGFcxzABImK5ozywGA7T9l8W6hRdT%2BVSVGWlUYZBmVieqzlgqd%2FDJLBauJVoP1i4c%2FKKeWy58GMihJ3ikCz%2BaC8gi8yoJZBybuqNPdDITPBPOaDZQfgyusR1nxP2By9bW1&X-Amz-Signature=82af1768b9ed2a6132e9541488241ee8993b0b6ed068ceef9ccbef8de6aca880',
            fileName: 'sample',
            fileType: 'docx',
          },
          {
            id: 2,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2YTDNGRR7FPPMHNY%2F20230220%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230220T060608Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEBMaDBRSLhIBPKkhGcKbtSKGAaYDEdyfzsNYKP5puXltuUfcubqVrbNDqQNBiym1lK2ZFHtcOrx6r9SklQZdVqIeUsJ869bIlkPA3PLZXZAkduk97QgMqpO639FhVIFXTikZzaxoRlbGFcxzABImK5ozywGA7T9l8W6hRdT%2BVSVGWlUYZBmVieqzlgqd%2FDJLBauJVoP1i4c%2FKKeWy58GMihJ3ikCz%2BaC8gi8yoJZBybuqNPdDITPBPOaDZQfgyusR1nxP2By9bW1&X-Amz-Signature=ef6857acc09b33538fc3c377cfdb978d5b9370106aaaa2db8c9af4462b86190c',
            fileName: 'sample',
            fileType: 'pdf',
          },
          {
            id: 3,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2YTDNGRR7FPPMHNY%2F20230220%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230220T060508Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEBMaDBRSLhIBPKkhGcKbtSKGAaYDEdyfzsNYKP5puXltuUfcubqVrbNDqQNBiym1lK2ZFHtcOrx6r9SklQZdVqIeUsJ869bIlkPA3PLZXZAkduk97QgMqpO639FhVIFXTikZzaxoRlbGFcxzABImK5ozywGA7T9l8W6hRdT%2BVSVGWlUYZBmVieqzlgqd%2FDJLBauJVoP1i4c%2FKKeWy58GMihJ3ikCz%2BaC8gi8yoJZBybuqNPdDITPBPOaDZQfgyusR1nxP2By9bW1&X-Amz-Signature=504f62ef0ce13986a52f5ad463d3294bf3eacebf59021de27a7d5acc600e970a',
            fileName: 'sample',
            fileType: 'png',
          },
          {
            id: 4,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2YTDNGRR7FPPMHNY%2F20230220%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230220T060551Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEBMaDBRSLhIBPKkhGcKbtSKGAaYDEdyfzsNYKP5puXltuUfcubqVrbNDqQNBiym1lK2ZFHtcOrx6r9SklQZdVqIeUsJ869bIlkPA3PLZXZAkduk97QgMqpO639FhVIFXTikZzaxoRlbGFcxzABImK5ozywGA7T9l8W6hRdT%2BVSVGWlUYZBmVieqzlgqd%2FDJLBauJVoP1i4c%2FKKeWy58GMihJ3ikCz%2BaC8gi8yoJZBybuqNPdDITPBPOaDZQfgyusR1nxP2By9bW1&X-Amz-Signature=e47cbfcaf7464b37d9b57819b4cd92a9a335ca93ac6391fb1634b740baae7f2d',
            fileName: 'sample',
            fileType: 'jpg',
          },
          {
            id: 5,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2YTDNGRR7FPPMHNY%2F20230220%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20230220T060628Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEBMaDBRSLhIBPKkhGcKbtSKGAaYDEdyfzsNYKP5puXltuUfcubqVrbNDqQNBiym1lK2ZFHtcOrx6r9SklQZdVqIeUsJ869bIlkPA3PLZXZAkduk97QgMqpO639FhVIFXTikZzaxoRlbGFcxzABImK5ozywGA7T9l8W6hRdT%2BVSVGWlUYZBmVieqzlgqd%2FDJLBauJVoP1i4c%2FKKeWy58GMihJ3ikCz%2BaC8gi8yoJZBybuqNPdDITPBPOaDZQfgyusR1nxP2By9bW1&X-Amz-Signature=1a474486b1b5813523cc42fa41095706834873fa07ade03fc3dd14cbb9104e13',
            fileName: 'sample',
            fileType: 'csv',
          },
        ]
        const jobInfo = data.jobInfo.map((value: OnboardingJobInfoType) => ({
          ...value,
          source: value.source?.toUpperCase(),
          target: value.target?.toUpperCase(),
          selected: false,
        }))

        const res = data
        res['resume'] = resume
        res['jobInfo'] = jobInfo

        return res!
      },
    },
  )
}

export const useGetResume = () => {
  return useQuery(
    'resume',
    () => getResume(),

    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}
