// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Default AuthConfig
import defaultAuthConfig from 'src/configs/auth'

// ** Types
import { UserDataType } from 'src/context/types'
import { data } from '../test-users'

const users: UserDataType[] = [
  {
    id: 1,
    role: 'CLIENT',
    password: 'j3EJA3JpBMxU',
    fullName: 'Stanwood Mil',
    username: 'smil0',
    email: 'smil0@51.la',
  },
  {
    id: 2,
    role: 'LPM',
    password: '5YTSLw',
    fullName: 'Konstantin Slixby',
    username: 'kslixby1',
    email: 'kslixby1@prlog.org',
  },
  {
    id: 3,
    role: 'PRO',
    password: 'tZYmiOhUdSBH',
    fullName: 'Andrej Fend',
    username: 'afend2',
    email: 'afend2@umn.edu',
  },
  {
    id: 4,
    role: 'PRO',
    password: 'bKNpR3yCF7q2',
    fullName: 'Kittie Skettles',
    username: 'kskettles3',
    email: 'kskettles3@networksolutions.com',
  },
  {
    id: 5,
    role: 'CLIENT',
    password: 'CcCWiSJ9Z',
    fullName: 'Ad Thurston',
    username: 'athurston4',
    email: 'athurston4@webeden.co.uk',
  },
  {
    id: 6,
    role: 'TAD',
    password: 'WNXmvsWWCtbp',
    fullName: 'Jordan Aindriu',
    username: 'jaindriu5',
    email: 'jaindriu5@jalbum.net',
  },
  {
    id: 7,
    role: 'TAD',
    password: 'yaMSYD2eV',
    fullName: 'Jimmie Delany',
    username: 'jdelany6',
    email: 'jdelany6@taobao.com',
  },
  {
    id: 8,
    role: 'CLIENT',
    password: 'FnksuZN',
    fullName: 'Danell Stoggles',
    username: 'dstoggles7',
    email: 'dstoggles7@shareasale.com',
  },
  {
    id: 9,
    role: 'CLIENT',
    password: '5W1TPKHI',
    fullName: 'Marnia Reuben',
    username: 'mreuben8',
    email: 'mreuben8@nbcnews.com',
  },
  {
    id: 10,
    role: 'LPM',
    password: 'WIFcJRKP',
    fullName: 'Teodor Yegorev',
    username: 'tyegorev9',
    email: 'tyegorev9@ehow.com',
  },
  {
    id: 11,
    role: 'TAD',
    password: 'KHV3pWY',
    fullName: 'Godard Stainton - Skinn',
    username: 'gstaintona',
    email: 'gstaintona@google.com.au',
  },
  {
    id: 12,
    role: 'PRO',
    password: 'XFtdCMPZ',
    fullName: 'Meg Cozby',
    username: 'mcozbyb',
    email: 'mcozbyb@creativecommons.org',
  },
  {
    id: 13,
    role: 'CLIENT',
    password: '145kB6',
    fullName: 'Olga Goodsall',
    username: 'ogoodsallc',
    email: 'ogoodsallc@weather.com',
  },
  {
    id: 14,
    role: 'LPM',
    password: 'GjLVte2D',
    fullName: 'Egon Barnson',
    username: 'ebarnsond',
    email: 'ebarnsond@parallels.com',
  },
  {
    id: 15,
    role: 'PRO',
    password: 'MbEyAth',
    fullName: 'Emogene Vanin',
    username: 'evanine',
    email: 'evanine@nydailynews.com',
  },
  {
    id: 16,
    role: 'LPM',
    password: 'vfEF1X',
    fullName: 'Kirsteni Bannell',
    username: 'kbannellf',
    email: 'kbannellf@facebook.com',
  },
  {
    id: 17,
    role: 'PRO',
    password: 'faejUTENaE',
    fullName: 'Hasty Wellwood',
    username: 'hwellwoodg',
    email: 'hwellwoodg@nasa.gov',
  },
  {
    id: 18,
    role: 'PRO',
    password: '6kokzw7Z',
    fullName: 'Christoper Warnes',
    username: 'cwarnesh',
    email: 'cwarnesh@ed.gov',
  },
  {
    id: 19,
    role: 'PRO',
    password: 'bgHHooCM48m',
    fullName: 'Helenelizabeth Hoggan',
    username: 'hhoggani',
    email: 'hhoggani@google.fr',
  },
  {
    id: 20,
    role: 'TAD',
    password: 'hKjZFg3Bq',
    fullName: 'Brittan Staresmeare',
    username: 'bstaresmearej',
    email: 'bstaresmearej@blog.com',
  },
  {
    id: 21,
    role: 'LPM',
    password: '4oIRc8XszRj',
    fullName: 'Cristine Ghest',
    username: 'cghestk',
    email: 'cghestk@github.com',
  },
  {
    id: 22,
    role: 'PRO',
    password: 'DTEHL3V2MH',
    fullName: "Danna O'Siaghail",
    username: 'dosiaghaill',
    email: 'dosiaghaill@nasa.gov',
  },
  {
    id: 23,
    role: 'CLIENT',
    password: '4OQFER',
    fullName: 'Meggi Wardale',
    username: 'mwardalem',
    email: 'mwardalem@narod.ru',
  },
  {
    id: 24,
    role: 'PRO',
    password: 'WNSQ1YcScNyG',
    fullName: 'Fey Budgeon',
    username: 'fbudgeonn',
    email: 'fbudgeonn@wikia.com',
  },
  {
    id: 25,
    role: 'TAD',
    password: '3RrTGQ4SHV79',
    fullName: 'Perl Wildey',
    username: 'pwildeyo',
    email: 'pwildeyo@soup.io',
  },
  {
    id: 26,
    role: 'TAD',
    password: 'ckhQmRuNP',
    fullName: 'Elsey Collete',
    username: 'ecolletep',
    email: 'ecolletep@telegraph.co.uk',
  },
  {
    id: 27,
    role: 'LPM',
    password: 'f4yu7e',
    fullName: 'Della Wythe',
    username: 'dwytheq',
    email: 'dwytheq@eepurl.com',
  },
  {
    id: 28,
    role: 'CLIENT',
    password: '0RJXJkDas5sz',
    fullName: 'Elisabet Pautard',
    username: 'epautardr',
    email: 'epautardr@multiply.com',
  },
  {
    id: 29,
    role: 'LPM',
    password: 'LaoMlAvrEpJI',
    fullName: 'Elliott Quixley',
    username: 'equixleys',
    email: 'equixleys@skype.com',
  },
  {
    id: 30,
    role: 'TAD',
    password: 'CHBw3oNRt',
    fullName: 'Kori Rosenboim',
    username: 'krosenboimt',
    email: 'krosenboimt@topsy.com',
  },
  {
    id: 31,
    role: 'LPM',
    password: 'jw1HJC',
    fullName: 'Roma Pococke',
    username: 'rpocockeu',
    email: 'rpocockeu@pinterest.com',
  },
  {
    id: 32,
    role: 'LPM',
    password: 'Q90rSsglH',
    fullName: 'Yvette Jendricke',
    username: 'yjendrickev',
    email: 'yjendrickev@privacy.gov.au',
  },
  {
    id: 33,
    role: 'CLIENT',
    password: 'qgQejw60o',
    fullName: 'Montgomery Kleinmann',
    username: 'mkleinmannw',
    email: 'mkleinmannw@guardian.co.uk',
  },
  {
    id: 34,
    role: 'CLIENT',
    password: 'O0wejRgvxOJZ',
    fullName: 'Belvia Toghill',
    username: 'btoghillx',
    email: 'btoghillx@dion.ne.jp',
  },
  {
    id: 35,
    role: 'LPM',
    password: 'x37ZvfHP6gYi',
    fullName: 'Gabriellia De Simone',
    username: 'gdey',
    email: 'gdey@w3.org',
  },
  {
    id: 36,
    role: 'PRO',
    password: 'KMWTuk',
    fullName: 'Teena Brisland',
    username: 'tbrislandz',
    email: 'tbrislandz@huffingtonpost.com',
  },
  {
    id: 37,
    role: 'TAD',
    password: 'LsW7fflVqGsv',
    fullName: 'Barrie Eley',
    username: 'beley10',
    email: 'beley10@utexas.edu',
  },
  {
    id: 38,
    role: 'PRO',
    password: 'd8vjsH7Mj',
    fullName: 'Ephraim Darwin',
    username: 'edarwin11',
    email: 'edarwin11@google.co.jp',
  },
  {
    id: 39,
    role: 'CLIENT',
    password: 'P6n9lo',
    fullName: 'Napoleon Le Brum',
    username: 'nle12',
    email: 'nle12@sina.com.cn',
  },
  {
    id: 40,
    role: 'CLIENT',
    password: 'Mhhpln705dtl',
    fullName: 'Orly Gomersall',
    username: 'ogomersall13',
    email: 'ogomersall13@themeforest.net',
  },

  {
    id: 41,
    role: 'CLIENT',
    password: 'admin',
    fullName: 'Leriel Kim',
    username: 'Leriel',
    email: 'leriel@glozinc.com',
  },
]

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET,
}

type ResponseType = [number, { [key: string]: any }]

mock.onPost('/jwt/login').reply(request => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong'],
  }

  const user = data.users.find(
    u => u.email === email && u.password === password,
  )

  if (user) {
    const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret as string, {
      expiresIn: jwtConfig.expirationTime,
    })

    const response = {
      accessToken,
      userData: { ...user, password: undefined },
    }

    return [200, response]
  } else {
    error = {
      email: ['email or Password is Invalid'],
    }

    return [400, { error }]
  }
})

mock.onPost('/jwt/register').reply(request => {
  if (request.data.length > 0) {
    const { email, password, username } = JSON.parse(request.data)
    const isEmailAlreadyInUse = users.find(user => user.email === email)
    const isUsernameAlreadyInUse = users.find(
      user => user.username === username,
    )
    const error = {
      email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
      username: isUsernameAlreadyInUse
        ? 'This username is already in use.'
        : null,
    }

    if (!error.username && !error.email) {
      const { length } = users
      let lastIndex = 0
      if (length) {
        lastIndex = users[length - 1].id
      }
      const userData: UserDataType = {
        id: lastIndex + 1,
        email,
        password,
        username,
        avatar: null,
        fullName: '',
        role: 'ADMIN',
      }

      users.push(userData)

      const accessToken = jwt.sign(
        { id: userData.id },
        jwtConfig.secret as string,
      )

      const user = { ...userData }
      delete user.password

      const response = { accessToken }

      return [200, response]
    }

    return [200, { error }]
  } else {
    return [401, { error: 'Invalid Data' }]
  }
})

mock.onGet('/auth/me').reply(config => {
  // ** Get token from header
  // @ts-ignore
  const token = config.headers.Authorization as string

  // ** Default response
  let response: ResponseType = [200, {}]

  // ** Checks if the token is valid or expired
  jwt.verify(token, jwtConfig.secret as string, (err, decoded) => {
    // ** If token is expired
    if (err) {
      // ** If onTokenExpiration === 'logout' then send 401 error
      if (defaultAuthConfig.onTokenExpiration === 'logout') {
        // ** 401 response will logout user from AuthContext file
        response = [401, { error: { error: 'Invalid User' } }]
      } else {
        // ** If onTokenExpiration === 'refreshToken' then generate the new token
        const oldTokenDecoded = jwt.decode(token, { complete: true })

        // ** Get user id from old token
        // @ts-ignore
        const { id: userId } = oldTokenDecoded.payload

        // ** Get user that matches id in token
        const user = users.find(u => u.id === userId)

        // ** Sign a new token
        const accessToken = jwt.sign(
          { id: userId },
          jwtConfig.secret as string,
          {
            expiresIn: jwtConfig.expirationTime,
          },
        )

        // ** Set new token in localStorage
        window.localStorage.setItem(
          defaultAuthConfig.storageTokenKeyName,
          accessToken,
        )

        const obj = { userData: { ...user, password: undefined } }

        // ** return 200 with user data
        response = [200, obj]
      }
    } else {
      // ** If token is valid do nothing
      // @ts-ignore
      const userId = decoded.id

      // ** Get user that matches id in token
      const userData = JSON.parse(
        JSON.stringify(users.find((u: UserDataType) => u.id === userId)),
      )

      delete userData.password

      // ** return 200 with user data
      response = [200, { userData }]
    }
  })

  return response
})
