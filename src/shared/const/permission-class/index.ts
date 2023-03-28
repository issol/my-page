// TODO : index.ts파일은 삭제하고 나중에 필요한 파일을 생성해서 사용해주시면 됩니다
// 또는 index.ts에 permission-class디렉토리의 파일들을 전부 import해서 export될 수 있게 하는 것도 좋을 것 같아요.

export class job_posting {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
  }
}
export class recruiting {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
  }
}

export class client_guideline {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
  }
}

export class contract {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
  }
}
