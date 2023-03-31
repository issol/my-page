class pro_comment {
  authorId: number
  constructor(authorId: number) {
    this.authorId = authorId
    Object.defineProperty(pro_comment.prototype.constructor, 'name', {
      value: 'pro_comment',
    })
  }
}

export default pro_comment
