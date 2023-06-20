export const S3FileType = {
  RESUME: 'resume',
  CONTRACTS: 'contracts',
  GUIDELINE: 'guideline',
  JOB: 'job',
  CLIENT_GUIDELINE: 'client-guideline',
  PRO_PAYMENT_INFO: 'pro-payment-info',
  TEST_GUIDELINE: 'test-guideline',
  DOCUMENT_FORM: 'document-form', // 각종 FORM을 PDF로 떨궈서 S3에 업로드하는 케이스 있을때 쓸 예정(현재는 없음)
} as const
