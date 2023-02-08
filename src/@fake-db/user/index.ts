import mock from 'src/@fake-db/mock'
import { OnboardingUserType } from 'src/types/onboarding/list'

export const onboardingUser: OnboardingUserType[] = [
  {
    id: 'SC-15',
    userId: 1,
    email: 'ddwelly0@nbcnews.com',
    firstName: 'Isadore',
    middleName: 'Davine',
    lastName: 'Dwelly',
    experience: 'No experience',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'DTP',
        role: 'Dubbing script translator',
        source: null,
        target: null,
        status: 'Awaiting Assignment',
      },

      {
        id: 2,
        jobType: 'Webcomics',
        role: 'SDH QCer',
        source: 'KO',
        target: 'EN',
        status: 'Awaiting Assignment',
      },
      {
        id: 3,
        jobType: 'Dubbing',
        role: 'Dubbing QCer',
        source: 'ID',
        target: 'PL',
        status: 'Test assigned',
      },
      {
        id: 4,
        jobType: 'OTT/Subtitle',
        role: 'Subtitle author',
        source: 'MK',
        target: 'CN',
        status: 'Reviewing',
      },
      {
        id: 5,
        jobType: 'Webnovel',
        role: 'Audio description QCer',
        source: 'BA',
        target: 'PL',
        status: 'Test in progress',
      },
      {
        id: 6,
        jobType: 'Misc.',
        role: 'Audio description QCer',
        source: 'RU',
        target: 'ID',
        status: 'General in progress',
      },
      {
        id: 7,
        jobType: 'YouTube',
        role: 'DTPer',
        source: 'ID',
        target: 'PH',
        status: 'Test failed',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: null,
    pronounce: null,
    preferredName: null,
    preferredNamePronunciation: null,
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '814-968-1048',
    phone: '386-364-4659',
    resume: ['UltricesPhasellus.mp3'],
    specialties: [
      'Juncaceae',
      'Asteraceae',
      'Liliaceae',
      'Acanthaceae',
      'Acanthaceae',
      'Acanthaceae',
    ],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Isadore',
        middleName: 'Davine',
        lastName: 'Dwelly',
        email: 'ddwelly0@nbcnews.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'US-FL',
    userId: 2,
    email: 'otoffetto1@facebook.com',
    firstName: 'Olin',
    middleName: null,
    lastName: 'Toffetto',
    experience: '3-5 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: false,
    jobInfo: [
      {
        id: 1,
        jobType: 'Webcomics',
        role: 'SDH QCer',
        source: 'PH',
        target: 'HR',
        status: 'General failed',
      },
      {
        id: 2,
        jobType: 'OTT/Subtitle',
        role: 'Copywriter',
        source: 'PL',
        target: 'ID',
        status: 'Awaiting assignment',
      },
      {
        id: 3,
        jobType: 'OTT/Subtitle',
        role: 'SDH QCer',
        source: 'BR',
        target: 'PT',
        status: 'Awaiting assignment',
      },
    ],

    isOnboarded: true,
    legalNamePronunciation: 'otoffetto1',
    pronounce: 'NONE',
    preferredName: 'Olin Toffetto',
    preferredNamePronunciation: 'Olin Toffetto',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: null,
    phone: null,
    resume: [],
    specialties: ['Rubiaceae', 'Solanaceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'FJ-N',
    userId: 3,
    email: 'dwalkinshaw2@illinois.edu',
    firstName: 'Noemi',
    middleName: 'Danna',
    lastName: 'Walkinshaw',
    experience: '10+ years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'OTT/Subtitle',
        role: 'Editor',
        source: 'EG',
        target: 'CN',
        status: 'Test submitted',
      },
    ],

    isOnboarded: true,
    legalNamePronunciation: 'dwalkinshaw2',
    pronounce: 'SHE',
    preferredName: 'Danna Walkinshaw',
    preferredNamePronunciation: 'Danna Walkinshaw',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '381-532-9634',
    phone: '257-125-1944',
    resume: ['Imperdiet.tiff'],
    specialties: [],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'PK-BA',
    userId: 4,
    email: 'lrobez3@shareasale.com',
    firstName: 'Luca',
    middleName: null,
    lastName: 'Robez',
    experience: '6-9 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'YouTube',
        role: 'DTPer',
        source: 'ID',
        target: 'PH',
        status: 'Reviewing',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: 'lrobez3',
    pronounce: 'NONE',
    preferredName: 'Luca Robez',
    preferredNamePronunciation: 'Luca Robez',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: null,
    phone: null,
    resume: [],
    specialties: ['Cyperaceae', 'Poaceae', 'Brassicaceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [],
  },
  {
    id: 'ET-AM',
    userId: 5,
    email: 'cmulliner4@va.gov',
    firstName: 'Cirilo',
    middleName: null,
    lastName: 'Mulliner',
    experience: '3-5 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'YouTube',
        role: 'Template QCer',
        source: 'RU',
        target: 'NG',
        status: 'Awaiting assignment',
      },
      {
        id: 2,
        jobType: 'YouTube',
        role: 'QCer',
        source: 'CN',
        target: 'PH',
        status: 'Review completed',
      },
      {
        id: 3,
        jobType: 'OTT/Subtitle',
        role: 'Subtitle author',
        source: 'MK',
        target: 'CN',
        status: 'General passed',
      },
      {
        id: 4,
        jobType: 'Webnovel',
        role: 'Audio description QCer',
        source: 'BA',
        target: 'PL',
        status: 'Test in progress',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: null,
    pronounce: null,
    preferredName: null,
    preferredNamePronunciation: null,
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: null,
    phone: null,
    resume: [],
    specialties: ['Orchidaceae', 'Piperaceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'CY-04',
    userId: 6,
    email: 'swolfe5@bing.com',
    firstName: 'Greg',
    middleName: 'Sibyl',
    lastName: 'Wolfe',
    experience: '3-5 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: false,
    jobInfo: [
      {
        id: 1,
        jobType: 'Dubbing',
        role: 'Dubbing QCer',
        source: 'ID',
        target: 'PL',
        status: 'General failed',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: null,
    pronounce: null,
    preferredName: null,
    preferredNamePronunciation: null,
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '396-762-0782',
    phone: '916-559-7859',
    resume: ['OrciVehicula.avi', 'Cursus.tiff'],
    specialties: [],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'ID-JA',
    userId: 7,
    email: 'mchorlton6@yellowpages.com',
    firstName: 'Margalo',
    middleName: null,
    lastName: 'Chorlton',
    experience: '1-2 year(s)',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'DTP',
        role: 'Subtitle QCer',
        source: 'PS',
        target: 'PT',
        status: 'General passed',
      },
      {
        id: 2,
        jobType: 'Interpretation',
        role: 'Audio description QCer',
        source: 'ID',
        target: 'RU',
        status: 'General passed',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: 'mchorlton6',
    pronounce: 'HE',
    preferredName: 'Margalo Chorlton',
    preferredNamePronunciation: 'Margalo Chorlton',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: null,
    phone: null,
    resume: [],
    specialties: ['Polypodiaceae', 'Dryopteridaceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'US-AK',
    userId: 8,
    email: 'rheinz7@barnesandnoble.com',
    firstName: 'Lilas',
    middleName: 'Rea',
    lastName: 'Heinz',
    experience: '6-9 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'Interpretation',
        role: 'QCer',
        source: 'MN',
        target: 'RU',
        status: 'Awaiting assignment',
      },
      {
        id: 2,
        jobType: 'Webnovel',
        role: 'Webnovel translator',
        source: 'PH',
        target: 'US',
        status: 'Awaiting assignment',
      },
    ],

    isOnboarded: true,
    legalNamePronunciation: 'rheinz7',
    pronounce: 'THEY',
    preferredName: 'Rea Heinz',
    preferredNamePronunciation: 'Rea Heinz',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '177-580-2963',
    phone: '787-800-3975',
    resume: ['IntegerANibh.mp3', 'Libero.mp3'],
    specialties: ['Asteraceae', 'Nyctaginaceae', 'Pyrolaceae', 'Pannariaceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'SK-PV',
    userId: 9,
    email: 'arichmont8@addthis.com',
    firstName: 'Indira',
    middleName: 'Allina',
    lastName: 'Richmont',
    experience: '3-5 years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: false,
    jobInfo: [
      {
        id: 1,
        jobType: 'Interpretation',
        role: 'Dubbing QCer',
        source: 'CD',
        target: 'ZW',
        status: 'Reviewing',
      },
      {
        id: 2,
        jobType: 'Webcomics',
        role: 'Dubbing script translator',
        source: 'NO',
        target: 'RU',
        status: 'Awaiting assignment',
      },
      {
        id: 3,
        jobType: 'Dubbing',
        role: 'Subtitle QCer',
        source: 'CN',
        target: 'PH',
        status: 'Awaiting assignment',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: 'arichmont8',
    pronounce: 'NONE',
    preferredName: 'Allina Richmont',
    preferredNamePronunciation: 'Allina Richmont',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '737-823-1207',
    phone: '844-401-3720',
    resume: [],
    specialties: ['Cladoniaceae', 'Asteraceae'],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
  {
    id: 'JP-47',
    userId: 10,
    email: 'ahintze9@nytimes.com',
    firstName: 'Janifer',
    middleName: 'Anselma',
    lastName: 'Hintze',
    experience: '10+ years',
    notesFromPro:
      'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance project!',
    isActive: true,
    jobInfo: [
      {
        id: 1,
        jobType: 'Dubbing',
        role: 'Audio description QCer',
        source: 'AR',
        target: 'CN',
        status: 'General in progress',
      },
      {
        id: 2,
        jobType: 'Misc.',
        role: 'Audio description QCer',
        source: 'RU',
        target: 'ID',
        status: 'General in progress',
      },
    ],

    isOnboarded: false,
    legalNamePronunciation: 'ahintze9',
    pronounce: 'NONE',
    preferredName: 'Anselma Hintze',
    preferredNamePronunciation: 'Anselma Hintze',
    timezone: {
      phone: '672',
      code: 'AQ',
      label: 'Antarctica',
    },
    mobile: '811-815-1209',
    phone: '979-888-2975',
    resume: ['Euismod.mp3', 'ArcuSedAugue.ppt', 'HabitassePlatea.mp3'],
    specialties: [],
    contracts: [
      'Leo.avi',
      'PotentiInEleifend.mp3',
      'Maecenas.ppt',
      'UrnaUt.mp3',
      'Velit.tiff',
    ],
    commentsOnPro: [
      {
        id: 1,
        userId: 1,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 1,
        userId: 10,
        firstName: 'Clotilda',
        middleName: null,
        lastName: 'Held',
        email: 'cheld0@jiathis.com',
        createdAt: '2022-04-27T14:13:15Z',
        updatedAt: '2023-01-13T21:40:10Z',
        comment:
          'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      },
      {
        id: 2,
        userId: 11,
        firstName: 'Laina',
        middleName: 'Gannon',
        lastName: 'Kingzeth',
        email: 'gkingzeth1@examiner.com',
        createdAt: '2022-12-02T06:24:54Z',
        updatedAt: '2022-08-15T12:06:38Z',
        comment:
          'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
      },
      {
        id: 3,
        userId: 12,
        firstName: 'Nigel',
        middleName: 'Delmore',
        lastName: 'Falcus',
        email: 'dfalcus2@reddit.com',
        createdAt: '2022-09-26T21:46:08Z',
        updatedAt: '2022-12-09T18:55:02Z',
        comment:
          'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.',
      },
      {
        id: 4,
        userId: 13,
        firstName: 'Goddard',
        middleName: 'Peirce',
        lastName: 'Ilyinykh',
        email: 'pilyinykh0@youtube.com',
        createdAt: '2023-02-05T04:24:48Z',
        updatedAt: '2022-10-26T14:59:24Z',
        comment:
          'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      },
      {
        id: 5,
        userId: 14,
        firstName: 'Constantino',
        middleName: 'Piotr',
        lastName: 'Kingzett',
        email: 'pkingzett1@last.fm',
        createdAt: '2022-12-24T16:03:38Z',
        updatedAt: '2022-02-23T01:01:41Z',
        comment:
          'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
      },
    ],
  },
]

mock.onGet('/api/pro/details').reply(request => {
  const { id } = request.params

  const result = onboardingUser.filter(value => value.userId === id)

  return [200, ...result]
})

mock.onDelete('/api/pro/details/jobInfo').reply(request => {
  const { userId, id } = request.params

  // Convert Id to number
  const eventId = Number(id)
  const matchedUser = onboardingUser.filter(value => value.userId === userId)
  const matchedUserIndex = onboardingUser.findIndex(
    value => value.userId === userId,
  )
  const matchedJobInfo = matchedUser[0].jobInfo.findIndex(
    ev => ev.id === eventId,
  )

  onboardingUser[matchedUserIndex].jobInfo.splice(matchedJobInfo, 1)

  return [200]
})

mock.onPost('/api/pro/details/jobInfo/item').reply(request => {
  const { userId, id, status } = JSON.parse(request.data).data

  const eventId = Number(id)
  const matchedUser = onboardingUser.filter(value => value.userId === userId)
  const matchedUserIndex = onboardingUser.findIndex(
    value => value.userId === userId,
  )

  const matchedJobInfo = matchedUser[0].jobInfo.map(value => {
    if (value.id === eventId) {
      return {
        ...value,
        status:
          status === 'Awaiting assignment'
            ? 'Test assigned'
            : status === 'Proceed'
            ? 'General in progress'
            : status === 'Skipped'
            ? 'Test in progress'
            : value.status,
      }
    } else {
      return { ...value }
    }
  })

  onboardingUser[matchedUserIndex].jobInfo = matchedJobInfo
  return [200]
})
