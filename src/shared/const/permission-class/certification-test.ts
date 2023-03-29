class certification_test {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(certification_test.prototype.constructor, 'name', {
      value: 'certification_test',
    })
  }
}

export default certification_test
