import { rest } from 'msw'
import { Book, Review } from './types'

// 이 부분 글로벌 const로 빠져야 합니다.
export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-enough-dev.gloground.com'

export const handlers = [
  // Handles a GET /user request
  rest.get(BASEURL+'/api/enough/u/pu/r-check?email=', (req, res, ctx) => {
    const userEmail = req.url.searchParams.get('email')
    if(userEmail!='jay@glozinc.com') {
      return res(
        ctx.status(200),
        ctx.body('good to go!'),
      );
    }
    else {
      return res(
        ctx.status(409),
        ctx.json({
          statusCode: 409,
          message: "Email: jay@glozinc.com 이미 가입된 계정입니다.",
          error: "Conflict"}),
      );
    }
  }),
];

