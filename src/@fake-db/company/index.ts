import mock from 'src/@fake-db/mock'
import { SignUpRequestsType } from 'src/pages/tad/company/types'

const requests: SignUpRequestsType[] = [
  {
    id: 1,
    email: 'lmerriment0@pbs.org',
    permission: 'General',

    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
  },
  {
    id: 5,
    email: 'brookesby4@gizmodo.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 6,
    email: 'egonsalvo5@tamu.edu',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 7,
    email: 'pdrewry6@google.com.au',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 8,
    email: 'gwollen7@vimeo.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 9,
    email: 'lbellis8@wordpress.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 10,
    email: 'mkinastan9@livejournal.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 11,
    email: 'pfultona@google.co.jp',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 12,
    email: 'hembletonb@weebly.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 13,
    email: 'idowsingc@bloglines.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 14,
    email: 'mkitchingd@nih.gov',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 15,
    email: 'jbradwelle@furl.net',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 16,
    email: 'jbreckwellf@cargocollective.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 17,
    email: 'aclingang@google.com.br',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 18,
    email: 'pcucinottah@webmd.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 19,
    email: 'acavillai@blinklist.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 20,
    email: 'ipetzoldj@nytimes.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 21,
    email: 'bcluleyk@e-recht24.de',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 22,
    email: 'sbishoppl@photobucket.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 23,
    email: 'dbarwellm@intel.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 24,
    email: 'sthioliern@thetimes.co.uk',
    permission: 'General',
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
  },
  {
    id: 35,
    email: 'klemoucheuxy@redcross.org',
    permission: 'General',
    role: ['LPM', 'TAD'],
  },
  {
    id: 36,
    email: 'hduthiez@craigslist.org',
    permission: 'General',
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
  },
  {
    id: 43,
    email: 'gvangiffen16@miitbeian.gov.cn',
    permission: 'General',
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
  },
  {
    id: 48,
    email: 'rtombs1b@livejournal.com',
    permission: 'General',
    role: ['LPM', 'TAD'],
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
    role: ['LPM', 'TAD'],
  },
]

mock.onGet('/api/company/signup-requests').reply(() => {
  return [200, requests]
})
