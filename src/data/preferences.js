const tetraHebrew = 'יהוה';

export const divineName = {
  god: {
    defLow: 'God',
    defUp: 'God',
    voc: 'God'
  },
  holyOne: {
    defLow: 'the Holy&nbsp;One',
    defUp: 'The Holy&nbsp;One',
    voc: 'Holy&nbsp;One'
  },
  tetraLatin: {
    defLow: 'yhwh',
    defUp: 'yhwh',
    voc: 'yhwh'
  },
  tetraHebrew: {
    defLow: `&#x200A;&#x2060;${tetraHebrew}&#8239;`,
    defUp: `&#x200A;&#x2060;${tetraHebrew}&#8239;`,
    voc: `&#x200A;&#x2060;${tetraHebrew}&#8239;`
  }
}

export const pronouns = {
  god: {
    pnSubUp: 'God',
    pnSubLow: 'God',
    pnObLow: 'God',
    pnPlUp: 'God\'s',
    pnPlLow: 'God\'s',
    pos: 'God\'s',
    pnVbIs: 'is',
    pnVbWas: 'was',
    pnVbHas: 'has',
    pnVbS: [0, 's'],
    pnVbEs: [0, 'es'],
    pnVbIes: [-1, 'ies']
  },
  theyThem: {
    pnSubUp: 'They',
    pnSubLow: 'they',
    pnObLow: 'them',
    pnPlUp: 'Their',
    pnPlLow: 'their',
    pos: 'theirs',
    pnVbIs: 'are',
    pnVbWas: 'were',
    pnVbHas: 'have',
    pnVbS: [-1, ''],
    pnVbEs: [-2, ''],
    pnVbIes: [-3, 'y']
  }
}

export const king = {
  historical: {
    kg1: 'king',
    kg2: 'son',
    kg3: 'daughter',
    kg4: 'her',
    kg5: 'She',
    kg6: 'her',
    kg7: 'he is',
    kg8: 'him',
    kg9: 'he',
    kg10: 'his',
    kg11: 'He'
  },
  messianic: {
    kg1: 'King',
    kg2: 'Son',
    kg3: 'child',
    kg4: 'their',
    kg5: 'They',
    kg6: 'them',
    kg7: 'he is',
    kg8: 'him',
    kg9: 'he',
    kg10: 'his',
    kg11: 'He'
  },
  genderNeutral: {
    kg1: 'sovereign',
    kg2: 'child',
    kg3: 'child',
    kg4: 'thein',
    kg5: 'They',
    kg6: 'them',
    kg7: 'they are',
    kg8: 'them',
    kg9: 'they',
    kg10: 'their',
    kg11: 'They'
  }
}

export const messianic = {
  enabled: {
    ms1: 'Son of Man',
    ms2: 'no man',
    ms3: 'He',
    ms4: 'him',
    ms5: 'Lord'
  },
  disabled: {
    ms1: 'mortal',
    ms2: 'not human',
    ms3: 'They',
    ms4: 'them',
    ms5: 'ruler'
  }
}