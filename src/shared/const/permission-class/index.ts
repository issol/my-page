export class job_posting {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(job_posting.prototype.constructor, 'name', {
      value: 'job_posting',
    })
  }
}
export class recruiting {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(recruiting.prototype.constructor, 'name', {
      value: 'recruiting',
    })
  }
}

export class client_guideline {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(client_guideline.prototype.constructor, 'name', {
      value: 'client_guideline',
    })
  }
}

export class contract {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(contract.prototype.constructor, 'name', {
      value: 'contract',
    })
  }
}
