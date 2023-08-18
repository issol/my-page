/**
 * companyName: CLIENT회원이 가입 후
 * 어떤 회사 소속인지 선택 후 해당 회사에 join request를 한 상태에서
 * 아직 승인이 나지 않은 경우, accessToken은 null로 오며
 * join신청한 회사의 이름이 companyName에 들어가게 됨
 * (승인이 진행중이라는 alert모달에 company name을 보여줘야 하므로)
 */
export type loginResType = {
  userId: number
  email: string
  accessToken: string
  companyName?: string
}

export type LoginResTypeWithOptionalAccessToken = loginResType & {
  accessToken?: string
}
