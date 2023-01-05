import mock from 'src/@fake-db/mock'
import { MembersType, SignUpRequestsType } from 'src/pages/tad/company/types'

const requests: SignUpRequestsType[] = [
  {
    id: 1,
    email: 'lmerriment0@pbs.org',
    permission: 'General',

    role: ['TAD', 'LPM'],
  },
  {
    id: 2,
    email: 'eriall1@sohu.com',
    permission: 'General',

    role: ['LPM'],
  },
  {
    id: 3,
    email: 'mdebruyne2@gizmodo.com',
    permission: 'General',

    role: ['TAD'],
  },
  {
    id: 4,
    email: 'tcast3@amazon.co.jp',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 5,
    email: 'brookesby4@gizmodo.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 6,
    email: 'egonsalvo5@tamu.edu',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 7,
    email: 'pdrewry6@google.com.au',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 8,
    email: 'gwollen7@vimeo.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 9,
    email: 'lbellis8@wordpress.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 10,
    email: 'mkinastan9@livejournal.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 11,
    email: 'pfultona@google.co.jp',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 12,
    email: 'hembletonb@weebly.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 13,
    email: 'idowsingc@bloglines.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 14,
    email: 'mkitchingd@nih.gov',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 15,
    email: 'jbradwelle@furl.net',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 16,
    email: 'jbreckwellf@cargocollective.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 17,
    email: 'aclingang@google.com.br',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 18,
    email: 'pcucinottah@webmd.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 19,
    email: 'acavillai@blinklist.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 20,
    email: 'ipetzoldj@nytimes.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 21,
    email: 'bcluleyk@e-recht24.de',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 22,
    email: 'sbishoppl@photobucket.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 23,
    email: 'dbarwellm@intel.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 24,
    email: 'sthioliern@thetimes.co.uk',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 25,
    email: 'dmcclounano@indiatimes.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 26,
    email: 'syarrantonp@sphinn.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 27,
    email: 'dtonkesq@1688.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 28,
    email: 'tbelverstoner@cloudflare.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 29,
    email: 'fmoutrayreads@nyu.edu',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 30,
    email: 'haikenheadt@hao123.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 31,
    email: 'rchapleou@miibeian.gov.cn',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 32,
    email: 'dsomersv@economist.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 33,
    email: 'tscholew@scribd.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 34,
    email: 'telijahx@spotify.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 35,
    email: 'klemoucheuxy@redcross.org',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 36,
    email: 'hduthiez@craigslist.org',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 37,
    email: 'icreber10@bing.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 38,
    email: 'ogahagan11@etsy.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 39,
    email: 'rsmall12@behance.net',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 40,
    email: 'jdignall13@prnewswire.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 41,
    email: 'pcraik14@meetup.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 42,
    email: 'jpettingall15@slashdot.org',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 43,
    email: 'gvangiffen16@miitbeian.gov.cn',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 44,
    email: 'asimco17@bloomberg.com',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 45,
    email: 'wloddon18@tamu.edu',
    permission: 'General',
    role: ['TAD'],
  },
  {
    id: 46,
    email: 'nmaxweell19@microsoft.com',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 47,
    email: 'doliveti1a@dropbox.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 48,
    email: 'rtombs1b@livejournal.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
  {
    id: 49,
    email: 'cdrakeford1c@gov.uk',
    permission: 'General',
    role: ['LPM'],
  },
  {
    id: 50,
    email: 'druckhard1d@cnn.com',
    permission: 'General',
    role: ['TAD', 'LPM'],
  },
]

const members: MembersType[] = [
  {
    id: 1,
    email: 'lcavil0@google.com.hk',
    permission: 'General',
    firstName: 'Lock',
    middleName: null,
    lastName: 'Cavil',
    jobTitle: null,
    createdAt: 1667681222,
    role: ['TAD'],
  },
  {
    id: 2,
    email: 'drebichon1@sun.com',
    permission: 'General',
    firstName: 'Dorelia',
    middleName: 'drebichon1',
    lastName: 'Rebichon',
    jobTitle: 'Information Systems Manager',
    createdAt: 1671432230,
    role: ['TAD'],
  },
  {
    id: 3,
    email: 'cewers2@cyberchimps.com',
    permission: 'General',
    firstName: 'Celie',
    middleName: 'cewers2',
    lastName: 'Ewers',
    jobTitle: 'Assistant Manager',
    createdAt: 1647242512,
    role: ['TAD', 'LPM'],
  },
  {
    id: 4,
    email: 'jsommer3@umn.edu',
    permission: 'General',
    firstName: 'Janine',
    middleName: 'jsommer3',
    lastName: 'Sommer',
    jobTitle: 'Analyst Programmer',
    createdAt: 1668235684,
    role: ['TAD', 'LPM'],
  },
  {
    id: 5,
    email: 'gperrin4@nature.com',
    permission: 'General',
    firstName: 'Gloriana',
    middleName: 'gperrin4',
    lastName: 'Perrin',
    jobTitle: 'Help Desk Operator',
    createdAt: 1654979323,
    role: ['TAD', 'LPM'],
  },
  {
    id: 6,
    email: 'gspackman5@behance.net',
    permission: 'General',
    firstName: 'Gayleen',
    middleName: 'gspackman5',
    lastName: 'Spackman',
    jobTitle: 'Dental Hygienist',
    createdAt: 1647547351,
    role: ['TAD', 'LPM'],
  },
  {
    id: 7,
    email: 'apaolucci6@omniture.com',
    permission: 'General',
    firstName: 'Allistir',
    middleName: 'apaolucci6',
    lastName: 'Paolucci',
    jobTitle: 'Senior Sales Associate',
    createdAt: 1642023383,
    role: ['TAD', 'LPM'],
  },
  {
    id: 8,
    email: 'hfoulger7@edublogs.org',
    permission: 'General',
    firstName: 'Hammad',
    middleName: 'hfoulger7',
    lastName: 'Foulger',
    jobTitle: 'Marketing Assistant',
    createdAt: 1671599709,
    role: ['TAD', 'LPM'],
  },
  {
    id: 9,
    email: 'sedensor8@dailymail.co.uk',
    permission: 'General',
    firstName: 'Sumner',
    middleName: 'sedensor8',
    lastName: 'Edensor',
    jobTitle: 'Software Test Engineer II',
    createdAt: 1656746359,
    role: ['LPM'],
  },
  {
    id: 10,
    email: 'llambkin9@slideshare.net',
    permission: 'General',
    firstName: 'Larissa',
    middleName: null,
    lastName: 'Lambkin',
    jobTitle: null,
    createdAt: 1651945853,
    role: ['TAD', 'LPM'],
  },
  {
    id: 11,
    email: 'yparkina@nbcnews.com',
    permission: 'General',
    firstName: 'Yetty',
    middleName: 'yparkina',
    lastName: 'Parkin',
    jobTitle: 'Software Test Engineer III',
    createdAt: 1658926655,
    role: ['TAD', 'LPM'],
  },
  {
    id: 12,
    email: 'bcroseb@unc.edu',
    permission: 'General',
    firstName: 'Brendan',
    middleName: 'bcroseb',
    lastName: 'Crose',
    jobTitle: 'Information Systems Manager',
    createdAt: 1651784540,
    role: ['LPM'],
  },
  {
    id: 13,
    email: 'lstaynesc@archive.org',
    permission: 'General',
    firstName: 'Linn',
    middleName: 'lstaynesc',
    lastName: 'Staynes',
    jobTitle: 'Developer I',
    createdAt: 1666220740,
    role: ['TAD', 'LPM'],
  },
  {
    id: 14,
    email: 'apharrowd@istockphoto.com',
    permission: 'General',
    firstName: 'Ardelis',
    middleName: 'apharrowd',
    lastName: 'Pharrow',
    jobTitle: 'Research Assistant I',
    createdAt: 1642762847,
    role: ['LPM'],
  },
  {
    id: 15,
    email: 'bblackbourne@google.co.uk',
    permission: 'General',
    firstName: 'Barrie',
    middleName: 'bblackbourne',
    lastName: 'Blackbourn',
    jobTitle: 'Programmer Analyst III',
    createdAt: 1655589803,
    role: ['LPM'],
  },
  {
    id: 16,
    email: 'mministerf@technorati.com',
    permission: 'General',
    firstName: 'Mariette',
    middleName: 'mministerf',
    lastName: 'Minister',
    jobTitle: 'Nurse Practicioner',
    createdAt: 1652690645,
    role: ['TAD', 'LPM'],
  },
  {
    id: 17,
    email: 'erodwayg@multiply.com',
    permission: 'General',
    firstName: 'Elwood',
    middleName: null,
    lastName: 'Rodway',
    jobTitle: null,
    createdAt: 1671418238,
    role: ['LPM'],
  },
  {
    id: 18,
    email: 'joxburghh@skype.com',
    permission: 'General',
    firstName: 'Jorie',
    middleName: 'joxburghh',
    lastName: 'Oxburgh',
    jobTitle: 'VP Product Management',
    createdAt: 1661775358,
    role: ['TAD', 'LPM'],
  },
  {
    id: 19,
    email: 'tlockeyi@wunderground.com',
    permission: 'General',
    firstName: 'Titus',
    middleName: 'tlockeyi',
    lastName: 'Lockey',
    jobTitle: 'Compensation Analyst',
    createdAt: 1651624994,
    role: ['TAD'],
  },
  {
    id: 20,
    email: 'jdacej@reverbnation.com',
    permission: 'General',
    firstName: 'Jilly',
    middleName: 'jdacej',
    lastName: 'Dace',
    jobTitle: 'Junior Executive',
    createdAt: 1665977606,
    role: ['TAD'],
  },
  {
    id: 21,
    email: 'gmcgloughlink@moonfruit.com',
    permission: 'General',
    firstName: 'Giffer',
    middleName: 'gmcgloughlink',
    lastName: 'McGloughlin',
    jobTitle: 'Dental Hygienist',
    createdAt: 1656385909,
    role: ['TAD'],
  },
  {
    id: 22,
    email: 'aburrenl@acquirethisname.com',
    permission: 'General',
    firstName: 'Alvinia',
    middleName: 'aburrenl',
    lastName: 'Burren',
    jobTitle: 'Financial Advisor',
    createdAt: 1646409437,
    role: ['LPM'],
  },
  {
    id: 23,
    email: 'aniasm@typepad.com',
    permission: 'General',
    firstName: 'Alan',
    middleName: 'aniasm',
    lastName: 'Nias',
    jobTitle: 'Associate Professor',
    createdAt: 1670513258,
    role: ['LPM'],
  },
  {
    id: 24,
    email: 'hkylesn@si.edu',
    permission: 'General',
    firstName: 'Hartley',
    middleName: null,
    lastName: 'Kyles',
    jobTitle: null,
    createdAt: 1668827004,
    role: ['TAD'],
  },
  {
    id: 25,
    email: 'mbattamso@skype.com',
    permission: 'General',
    firstName: 'Murray',
    middleName: 'mbattamso',
    lastName: 'Battams',
    jobTitle: 'Staff Accountant I',
    createdAt: 1648451734,
    role: ['TAD', 'LPM'],
  },
  {
    id: 26,
    email: 'knapletonp@hud.gov',
    permission: 'General',
    firstName: 'Kassey',
    middleName: 'knapletonp',
    lastName: 'Napleton',
    jobTitle: 'Internal Auditor',
    createdAt: 1667412391,
    role: ['TAD', 'LPM'],
  },
  {
    id: 27,
    email: 'fferiaq@ning.com',
    permission: 'General',
    firstName: 'Fredelia',
    middleName: null,
    lastName: 'Feria',
    jobTitle: null,
    createdAt: 1658128348,
    role: ['LPM'],
  },
  {
    id: 28,
    email: 'tcrampinr@abc.net.au',
    permission: 'General',
    firstName: 'Tersina',
    middleName: null,
    lastName: 'Crampin',
    jobTitle: null,
    createdAt: 1668603791,
    role: ['LPM'],
  },
  {
    id: 29,
    email: 'tgrations@plala.or.jp',
    permission: 'General',
    firstName: 'Tony',
    middleName: null,
    lastName: 'Gration',
    jobTitle: null,
    createdAt: 1648216881,
    role: ['TAD'],
  },
  {
    id: 30,
    email: 'asurbyt@wordpress.org',
    permission: 'General',
    firstName: 'Anne-marie',
    middleName: 'asurbyt',
    lastName: 'Surby',
    jobTitle: 'Assistant Manager',
    createdAt: 1646550771,
    role: ['TAD', 'LPM'],
  },
]

mock.onGet('/api/company/signup-requests').reply(() => {
  return [200, requests]
})

mock.onDelete('/api/company/delete').reply(config => {
  const userId = config.data

  const userIndex = requests.findIndex(t => t.id === userId)
  requests.splice(userIndex, 1)

  return [200]
})

mock.onPost('/api/company/undo').reply(config => {
  const user = JSON.parse(config.data).user

  requests.unshift(user)
  requests.sort((x, y) => x.id - y.id)

  return [201]
})

mock.onGet('/api/company/members').reply(() => {
  members.sort((x, y) => y.createdAt - x.createdAt)

  return [200, members]
})

mock.onPost('/api/company/approve-members').reply(config => {
  const user = JSON.parse(config.data).user

  console.log(user)

  // const { length } = members

  // let lastIndex = 0
  // if (length) {
  //   lastIndex = members[length - 1].id
  // }

  // user.id = lastIndex + 1

  members.unshift(user)
  members.sort((x, y) => y.createdAt - x.createdAt)

  console.log(members)

  return [200]
})

mock.onDelete('/api/company/undo-member').reply(config => {
  console.log(config)

  const userId = config.data

  console.log(userId)

  const userIndex = members.findIndex(t => t.id === userId)
  members.splice(userIndex, 1)

  return [200]
})
