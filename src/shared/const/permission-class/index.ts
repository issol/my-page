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
export class company_price {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(company_price.prototype.constructor, 'name', {
      value: 'company_price',
    })
  }
}

export class client {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(client.prototype.constructor, 'name', {
      value: 'client',
    })
  }
}
export class client_comment {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(client_comment.prototype.constructor, 'name', {
      value: 'client_comment',
    })
  }
}

export class job_list {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(job_list.prototype.constructor, 'name', {
      value: 'job_list',
    })
  }
}
export class quotes {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(quotes.prototype.constructor, 'name', {
      value: 'quotes',
    })
  }
}
export class invoice {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(invoice.prototype.constructor, 'name', {
      value: 'invoice',
    })
  }
}
