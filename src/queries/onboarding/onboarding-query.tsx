import { useQuery } from 'react-query'

import {
  getAppliedRole,
  getCertifiedRole,
  getHistory,
  getOnboardingProDetails,
  getOnboardingProList,
  getOnboardingStatistic,
  getResume,
  getReviewer,
  getStatistic,
} from 'src/apis/onboarding.api'
import {
  OnboardingFilterType,
  OnboardingJobInfoType,
  OnboardingListType,
} from 'src/types/onboarding/list'
import {
  AppliedRoleType,
  CertifiedRoleType,
  OnboardingProDetailsType,
} from 'src/types/onboarding/details'
import { Dispatch, SetStateAction } from 'react'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import _ from 'lodash'

export const useGetOnboardingProList = (filters: OnboardingFilterType) => {
  return useQuery<{ data: OnboardingListType[]; totalCount: number }>(
    ['onboarding-pro-list', filters],
    () => getOnboardingProList(filters),
    {
      staleTime: 60 * 1000, // 1
      keepPreviousData: true,
      suspense: true,

      useErrorBoundary: (error: any) => error.response?.status >= 500,
    },
  )
}

export const useGetOnboardingProDetails = (userId: number) => {
  const id = typeof userId === 'number' ? userId : 0
  return useQuery<DetailUserType, Error, DetailUserType>(
    `${userId}`,
    () => getOnboardingProDetails(id!),
    {
      staleTime: 60 * 1000, // 1
      suspense: true,
      useErrorBoundary: (error: any) => error.response?.status >= 400,
      select: (data: DetailUserType) => {
        const res = data
        const resume = [
          {
            id: 1,
            url: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/demo.docx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaDmFwLW5vcnRoZWFzdC0yIkcwRQIgQKysVhzDi7fCFbu%2FGvpabW9vewBXtZDB43OAN6LUJYwCIQDkHTFf1hKL48ULIEvI6AQSY9%2B2w5yA0ekh%2FnJBmOClqyqSAwjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMVoUGe6iQ6cJzow4KKuYChNjkH3VRs4InzTqdXqnbyTHP5VCA%2F5QbaUtG9zB90JmVMjaEap0VtMSBxNZj42g5tIs6OgNE0mBE8Hi7WwsBNUj8uoZ7ZnbGLe6lfaTgQheGMdelnlr19brHOPoX5XFhktdP3Ok3WxwrRC2DWc%2B%2BoWHUKv0SeZFUoVLfkHY%2BiA9VfxrgX0Td%2BkzxE%2FGP7VQYeAXetMLnZyNbn1vo8xi4fSoOKHvbs3f%2FSUytbXQSbaITlUy%2FhPM5El7Vox%2Bve2lpg6Y2picWGRV%2FkQ9cmfbGPi4%2Fy2HhIHhRuG5tNa0xOlguT00G52egYPIpPZebDSOvt%2FtvxMOjY2JUhckpxochcZl5eWJIVJ0kYcKX2RdQkc2L6ZuGlYSdK0zgdi9dPepcSMbSmQRLxGDevdioH3LxjS7SvuiCWHboeDLugnqaBHQ5M9E95KTWRQcsyTgcvBsVhPS2VSjmn357RgDDNc0eRez2PyX27zD%2F4NWfBjqzAtCAJUvaEjodaXSHW0WWNkct6idbUSDLsn5w48bYD6oJOv4g0KiQxBJxZcPKlhO0NMy%2BlflC7%2FECT0FBLZNYheo7tWnZFVHqdOlIorgjnOkuDOL6OEKUd4p03gUzRUVXqEnz6w4oUaAomcYdHq7ZJ1%2Bky94mVEu9QjEo6qFT%2BBcqdObp4UVqJOkr2g2067xn8eqnUUfqUt%2BpqHVSc4t3E1Yzy1KQ2v9hBtiAzqVCMVt1xC3MVDuWUx%2Fkn6XX33EY60IWfs4im%2F1kYRh0Htt7xGCzTJlKnqZqo7zBiLxI3qdPaVNBWn%2BDmStga9xarcKOmJzPj3hws5J%2Blbw1u%2FHfpiMRULD4ALZpzyWIj9LHozRNhvUOLxA0Uana8kV2CuzjORlqzMt9TXCXc%2BTah4IqIU8P1Ps%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230222T015832Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRVRGJXWV6%2F20230222%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=08846db879a917296f3d4125c8f82a03a082174651f0a246092a33f14cd2ff76',
            fileName: 'sample',
            fileExtension: 'docx',
          },
          {
            id: 2,
            url: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaDmFwLW5vcnRoZWFzdC0yIkcwRQIgQKysVhzDi7fCFbu%2FGvpabW9vewBXtZDB43OAN6LUJYwCIQDkHTFf1hKL48ULIEvI6AQSY9%2B2w5yA0ekh%2FnJBmOClqyqSAwjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMVoUGe6iQ6cJzow4KKuYChNjkH3VRs4InzTqdXqnbyTHP5VCA%2F5QbaUtG9zB90JmVMjaEap0VtMSBxNZj42g5tIs6OgNE0mBE8Hi7WwsBNUj8uoZ7ZnbGLe6lfaTgQheGMdelnlr19brHOPoX5XFhktdP3Ok3WxwrRC2DWc%2B%2BoWHUKv0SeZFUoVLfkHY%2BiA9VfxrgX0Td%2BkzxE%2FGP7VQYeAXetMLnZyNbn1vo8xi4fSoOKHvbs3f%2FSUytbXQSbaITlUy%2FhPM5El7Vox%2Bve2lpg6Y2picWGRV%2FkQ9cmfbGPi4%2Fy2HhIHhRuG5tNa0xOlguT00G52egYPIpPZebDSOvt%2FtvxMOjY2JUhckpxochcZl5eWJIVJ0kYcKX2RdQkc2L6ZuGlYSdK0zgdi9dPepcSMbSmQRLxGDevdioH3LxjS7SvuiCWHboeDLugnqaBHQ5M9E95KTWRQcsyTgcvBsVhPS2VSjmn357RgDDNc0eRez2PyX27zD%2F4NWfBjqzAtCAJUvaEjodaXSHW0WWNkct6idbUSDLsn5w48bYD6oJOv4g0KiQxBJxZcPKlhO0NMy%2BlflC7%2FECT0FBLZNYheo7tWnZFVHqdOlIorgjnOkuDOL6OEKUd4p03gUzRUVXqEnz6w4oUaAomcYdHq7ZJ1%2Bky94mVEu9QjEo6qFT%2BBcqdObp4UVqJOkr2g2067xn8eqnUUfqUt%2BpqHVSc4t3E1Yzy1KQ2v9hBtiAzqVCMVt1xC3MVDuWUx%2Fkn6XX33EY60IWfs4im%2F1kYRh0Htt7xGCzTJlKnqZqo7zBiLxI3qdPaVNBWn%2BDmStga9xarcKOmJzPj3hws5J%2Blbw1u%2FHfpiMRULD4ALZpzyWIj9LHozRNhvUOLxA0Uana8kV2CuzjORlqzMt9TXCXc%2BTah4IqIU8P1Ps%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230222T013214Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRVRGJXWV6%2F20230222%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=55ac9dfb8461037c27ae9475e890f7970c6f5c4be136d764e717d4747e020943',
            fileName: 'sample',
            fileExtension: 'pdf',
          },
          {
            id: 3,
            url: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=2cb1668c8dbee356087c04a3134d8df6060eb1b4eabc11f13fe49322f1c9920e',
            fileName: 'sample',
            fileExtension: 'png',
          },
          {
            id: 4,
            url: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032914Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=bd0be1fdfa5e34d3eae3df8f964ba831ea0e9cea5745b3d71c988fd7d9143cab',
            fileName: 'sample',
            fileExtension: 'jpg',
          },
          {
            id: 5,
            url: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.csv?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032809Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=cbe82b9e51d31c6fcea4dd101ab9b0e97b0a927154f545f6b428303c5943cd5e',
            fileName: 'sample',
            fileExtension: 'csv',
          },
        ]

        // 배열의 길이
        const arrLength = 300

        // 시작일과 종료일 설정
        const startDate = new Date(2022, 0, 1) // 2000년 1월 1일
        const endDate = new Date(2024, 3, 21) // 현재 날짜

        // 랜덤한 날짜 생성
        const generateRandomDate = (
          startDate: Date,
          endDate: Date,
          usedDates: any,
        ) => {
          let randomDate
          do {
            const timeRange = endDate.getTime() - startDate.getTime()
            const randomTime = Math.floor(Math.random() * timeRange)
            randomDate = new Date(startDate.getTime() + randomTime)
          } while (usedDates.has(randomDate.getTime()))
          return randomDate
        }

        // 랜덤한 날짜를 yyyy-MM-dd 포맷의 문자열로 변환
        const formatDate = (date: Date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        // 랜덤한 날짜를 생성하여 배열에 추가
        const dates: Date[] = []
        const off: Date[] = []
        const usedDates = new Set()
        for (let i = 0; i < arrLength; i++) {
          const randomDate = generateRandomDate(startDate, endDate, usedDates)
          usedDates.add(randomDate.getTime())
          const formattedDate = new Date(formatDate(randomDate))
          dates.push(formattedDate)
        }

        for (let j = 0; j < arrLength; j++) {
          const randomDate = generateRandomDate(startDate, endDate, usedDates)

          usedDates.add(randomDate.getTime())
          const formattedDate = new Date(formatDate(randomDate))
          off.push(formattedDate)
        }

        // 배열 출력

        res['offDate'] = off
        res['availableDate'] = dates
        res['resume'] = resume
        res['contracts'] = resume
        res['dateOfBirth'] = '2023-03-05T09:38:00.564Z'
        res['status'] = 'Onboard'
        res['residence'] = 'South Korea (Seoul)'

        return res
      },
      // select: (data: OnboardingProDetailsType) => {
      // const resume = [
      //   {
      //     id: 1,
      //     uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/demo.docx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaDmFwLW5vcnRoZWFzdC0yIkcwRQIgQKysVhzDi7fCFbu%2FGvpabW9vewBXtZDB43OAN6LUJYwCIQDkHTFf1hKL48ULIEvI6AQSY9%2B2w5yA0ekh%2FnJBmOClqyqSAwjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMVoUGe6iQ6cJzow4KKuYChNjkH3VRs4InzTqdXqnbyTHP5VCA%2F5QbaUtG9zB90JmVMjaEap0VtMSBxNZj42g5tIs6OgNE0mBE8Hi7WwsBNUj8uoZ7ZnbGLe6lfaTgQheGMdelnlr19brHOPoX5XFhktdP3Ok3WxwrRC2DWc%2B%2BoWHUKv0SeZFUoVLfkHY%2BiA9VfxrgX0Td%2BkzxE%2FGP7VQYeAXetMLnZyNbn1vo8xi4fSoOKHvbs3f%2FSUytbXQSbaITlUy%2FhPM5El7Vox%2Bve2lpg6Y2picWGRV%2FkQ9cmfbGPi4%2Fy2HhIHhRuG5tNa0xOlguT00G52egYPIpPZebDSOvt%2FtvxMOjY2JUhckpxochcZl5eWJIVJ0kYcKX2RdQkc2L6ZuGlYSdK0zgdi9dPepcSMbSmQRLxGDevdioH3LxjS7SvuiCWHboeDLugnqaBHQ5M9E95KTWRQcsyTgcvBsVhPS2VSjmn357RgDDNc0eRez2PyX27zD%2F4NWfBjqzAtCAJUvaEjodaXSHW0WWNkct6idbUSDLsn5w48bYD6oJOv4g0KiQxBJxZcPKlhO0NMy%2BlflC7%2FECT0FBLZNYheo7tWnZFVHqdOlIorgjnOkuDOL6OEKUd4p03gUzRUVXqEnz6w4oUaAomcYdHq7ZJ1%2Bky94mVEu9QjEo6qFT%2BBcqdObp4UVqJOkr2g2067xn8eqnUUfqUt%2BpqHVSc4t3E1Yzy1KQ2v9hBtiAzqVCMVt1xC3MVDuWUx%2Fkn6XX33EY60IWfs4im%2F1kYRh0Htt7xGCzTJlKnqZqo7zBiLxI3qdPaVNBWn%2BDmStga9xarcKOmJzPj3hws5J%2Blbw1u%2FHfpiMRULD4ALZpzyWIj9LHozRNhvUOLxA0Uana8kV2CuzjORlqzMt9TXCXc%2BTah4IqIU8P1Ps%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230222T015832Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRVRGJXWV6%2F20230222%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=08846db879a917296f3d4125c8f82a03a082174651f0a246092a33f14cd2ff76',
      //     fileName: 'sample',
      //     fileType: 'docx',
      //   },
      //   {
      //     id: 2,
      //     uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaDmFwLW5vcnRoZWFzdC0yIkcwRQIgQKysVhzDi7fCFbu%2FGvpabW9vewBXtZDB43OAN6LUJYwCIQDkHTFf1hKL48ULIEvI6AQSY9%2B2w5yA0ekh%2FnJBmOClqyqSAwjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMVoUGe6iQ6cJzow4KKuYChNjkH3VRs4InzTqdXqnbyTHP5VCA%2F5QbaUtG9zB90JmVMjaEap0VtMSBxNZj42g5tIs6OgNE0mBE8Hi7WwsBNUj8uoZ7ZnbGLe6lfaTgQheGMdelnlr19brHOPoX5XFhktdP3Ok3WxwrRC2DWc%2B%2BoWHUKv0SeZFUoVLfkHY%2BiA9VfxrgX0Td%2BkzxE%2FGP7VQYeAXetMLnZyNbn1vo8xi4fSoOKHvbs3f%2FSUytbXQSbaITlUy%2FhPM5El7Vox%2Bve2lpg6Y2picWGRV%2FkQ9cmfbGPi4%2Fy2HhIHhRuG5tNa0xOlguT00G52egYPIpPZebDSOvt%2FtvxMOjY2JUhckpxochcZl5eWJIVJ0kYcKX2RdQkc2L6ZuGlYSdK0zgdi9dPepcSMbSmQRLxGDevdioH3LxjS7SvuiCWHboeDLugnqaBHQ5M9E95KTWRQcsyTgcvBsVhPS2VSjmn357RgDDNc0eRez2PyX27zD%2F4NWfBjqzAtCAJUvaEjodaXSHW0WWNkct6idbUSDLsn5w48bYD6oJOv4g0KiQxBJxZcPKlhO0NMy%2BlflC7%2FECT0FBLZNYheo7tWnZFVHqdOlIorgjnOkuDOL6OEKUd4p03gUzRUVXqEnz6w4oUaAomcYdHq7ZJ1%2Bky94mVEu9QjEo6qFT%2BBcqdObp4UVqJOkr2g2067xn8eqnUUfqUt%2BpqHVSc4t3E1Yzy1KQ2v9hBtiAzqVCMVt1xC3MVDuWUx%2Fkn6XX33EY60IWfs4im%2F1kYRh0Htt7xGCzTJlKnqZqo7zBiLxI3qdPaVNBWn%2BDmStga9xarcKOmJzPj3hws5J%2Blbw1u%2FHfpiMRULD4ALZpzyWIj9LHozRNhvUOLxA0Uana8kV2CuzjORlqzMt9TXCXc%2BTah4IqIU8P1Ps%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230222T013214Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRVRGJXWV6%2F20230222%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=55ac9dfb8461037c27ae9475e890f7970c6f5c4be136d764e717d4747e020943',
      //     fileName: 'sample',
      //     fileType: 'pdf',
      //   },
      //   {
      //     id: 3,
      //     uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=2cb1668c8dbee356087c04a3134d8df6060eb1b4eabc11f13fe49322f1c9920e',
      //     fileName: 'sample',
      //     fileType: 'png',
      //   },
      //   {
      //     id: 4,
      //     uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032914Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=bd0be1fdfa5e34d3eae3df8f964ba831ea0e9cea5745b3d71c988fd7d9143cab',
      //     fileName: 'sample',
      //     fileType: 'jpg',
      //   },
      //   {
      //     id: 5,
      //     uri: 'https://s3.ap-northeast-2.amazonaws.com/enough-upload-dev.gloground.com/sample.csv?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMsR%2FgeS%2BN%2BSaNm7MV6jYxnNOOPvgNTpo%2FaE0Va%2BJmr5AiBnMgfl8%2BXxFunqSpUsc3wymgoevZBPkT7SDpXQ6F%2B4cSqSAwi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDc0MDAxNjYwMDE2MyIMWJKpmJkDGbC7mnLmKuYCAjpELj%2FrGYlCZSXcc%2FipvizyTkDZosKCIUCGQB1vUHoisvSTv3gRdkfwYD9Rt7bYwpXd4hvHQlv5c7vygl5viJRE2WQGmnmFXR7mqJki6XvxK41clFya8O7ZUBeNgJe05F9XQOURI8mgLL24v3aGdyYyta%2BaT%2F9hO8p2crOUzKivR%2Ftatp%2BQ%2B9Y3H0%2F9EfybMl2mGlXTUB45xFMP0dpf%2BeW366kImn4qSvkr91cm6wrS8c78AosKrHDHEMS3vqpQNhhM%2BfDLhzzo5OiDpEuvuw2K8gcGX1jo2a0E5T%2Fx0066LV7Cx%2FER7WyITf9rxVndeOb2F3n60lHMCAFakDmlV0Bs894ko6Xca99Za6c%2BFOwhwkYltcfNooXsp4d9r1Kf3ibpUmWtU3f6zutLc7nlHLAQC48ZGkwzlfwi%2Fxd2RJGB89lxEsgRQv5steQELgvkD%2FDGUnUt35S1xLGbLx7cCwC1pL6GEjCf89CfBjqzAo%2FXt2IIjAgE1ik8xMRANnFKnaGWFC%2BGertn0AbGQqmRFKu473PZo7QV4ec97LOMjrVBUlJewagtGVy6wLdyCElXQX5g4%2BQ1m5bLFIHZcV0N9wVYsKrgJFZLLcb2lLwgAWarE6bqxdmwj%2BM4bQ89WZ1AVcmgdSTZzP48D0HjKPWnwi0jxkVAvhtsBc7rGo48tcjPm4uGlFkr%2BrNOxAyT7GLqC5SUopg98DRha9O42OwXrIWvIvRCH7yVGCtIMB3BbUt9PyaxvkGq7ZiP4NVoIf21QT8ex%2BIYBHp79i3E66ocXRjNsCnugdW5uPDP9dLOWydSYPIxhRxGSUvp16QDeVX9hQ8Gk8Pbb0NBUgtoPgCKHrcPxum%2F%2BpXKX892TVwx9zBty7wHVHuSrRGykPz%2FmhLo8G8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230221T032809Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2YTDNGRRS5TKMKEW%2F20230221%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=cbe82b9e51d31c6fcea4dd101ab9b0e97b0a927154f545f6b428303c5943cd5e',
      //     fileName: 'sample',
      //     fileType: 'csv',
      //   },
      // ]
      // const jobInfo = data.jobInfo.map((value: OnboardingJobInfoType) => ({
      //   ...value,
      //   source: value.source?.toUpperCase(),
      //   target: value.target?.toUpperCase(),
      //   selected: false,
      // }))

      // const res = data
      // res['resume'] = resume
      // res['contracts'] = resume
      //   res['jobInfo'] = jobInfo

      //   return res!
      // },
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

export const useGetStatistic = () => {
  return useQuery<{ todayRegisteredUser: number; totalUser: number }>(
    'statistic',
    () => getStatistic(),
    {
      staleTime: 60 * 1000,
      suspense: true,
    },
  )
}

export const useGetOnboardingStatistic = () => {
  return useQuery<{ onboarded: number; testing: number; waiting: number }>(
    'onboarding-status',
    () => getOnboardingStatistic(),
    {
      staleTime: 60 * 1000,
      suspense: true,
    },
  )
}

export const useGetAppliedRole = (userId: number) => {
  const id = typeof userId === 'number' ? userId : 0
  return useQuery<Array<AppliedRoleType>>(
    `applied-role-${id}`,
    () => getAppliedRole(id!),
    {
      staleTime: 60 * 1000,
      suspense: true,
      enabled: !!id,
    },
  )
}

export const useGetCertifiedRole = (id: number) => {
  return useQuery<Array<CertifiedRoleType>>(
    `certified-role-${id}`,
    () => getCertifiedRole(id!),
    {
      staleTime: 60 * 1000,
      suspense: true,
      enabled: !!id,
    },
  )
}

// export const useGetHistory = (testId: number) => {
//   return useQuery(
//     'history',
//     () => {
//       return getHistory(testId)
//     },
//     {
//       staleTime: 60 * 1000, // 1
//       keepPreviousData: true,
//       suspense: true,

//       useErrorBoundary: (error: any) => error.response?.status >= 500,
//     },
//   )
// }
