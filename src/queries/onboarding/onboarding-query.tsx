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
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/resume-sample.docx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032545Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=c6fddce374ea653973000f3f8b82966d94cdb242e698195087f0ddc938b123e1',
            fileName: 'sample',
            fileType: 'docx',
          },
          {
            id: 2,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032840Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=205807e703a9110d5d6427162b5ded03d6d9bbbe04047f4a91c3b979ffb221a6',
            fileName: 'sample',
            fileType: 'pdf',
          },
          {
            id: 3,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=2cb1668c8dbee356087c04a3134d8df6060eb1b4eabc11f13fe49322f1c9920e',
            fileName: 'sample',
            fileType: 'png',
          },
          {
            id: 4,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032914Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=bd0be1fdfa5e34d3eae3df8f964ba831ea0e9cea5745b3d71c988fd7d9143cab',
            fileName: 'sample',
            fileType: 'jpg',
          },
          {
            id: 5,
            uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.csv?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032809Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=cbe82b9e51d31c6fcea4dd101ab9b0e97b0a927154f545f6b428303c5943cd5e',
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
