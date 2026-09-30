export const orientations = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Queer',
  'Questioning',
  'Demisexual',
] as const

export const mainGenders = ['Man', 'Woman'] as const

export const moreGenders = [
  'Non-binary',
  'Trans Man',
  'Trans Woman',
  'Genderfluid',
  'Agender',
  'Two-Spirit',
  'Bigender',
  'Other',
] as const

export const availablePositions = [
  'Missionary',
  'Doggy Style',
  'Cowgirl',
  'Reverse Cowgirl',
  'Standing',
] as const

export const kinkCatalog = [
  { name: 'Oral Sex', description: 'Enjoying pleasure through oral stimulation.' },
  { name: 'Handjob', description: 'Using hands for pleasure.' },
  { name: 'Rimming', description: 'Oral stimulation of the anus.' },
  { name: 'Choking', description: 'Light breath play through controlled pressure.' },
  { name: 'Hair Pulling', description: 'Tugging on hair to enhance sensation.' },
  { name: 'Spanking', description: 'Impact play using hands or paddles.' },
  { name: 'Handcuffs', description: 'Restraining wrists using cuffs or similar devices.' },
  { name: 'Biting', description: 'Using teeth for controlled pleasure.' },
  { name: 'Spitting', description: 'Using saliva as an element of intimacy.' },
  { name: 'Threesomes', description: 'Exploring intimacy with two partners.' },
  { name: 'Gangbangs', description: 'Engaging in intimacy with multiple partners.' },
  { name: 'Bondage', description: 'The use of restraints for pleasure, such as ropes, cuffs, or tape.' },
  { name: 'Roleplay', description: 'Acting out different scenarios, characters, or power dynamics for enjoyment.' },
  { name: 'Voyeurism', description: 'Enjoyment from watching others engage in intimate activities.' },
  { name: 'Dominance', description: 'Taking control in a power exchange dynamic.' },
  { name: 'Submission', description: 'Enjoying surrendering control in a power exchange dynamic.' },
  { name: 'Impact Play', description: 'Sensory play involving spanking, flogging, paddling, etc.' },
  { name: 'Sensory Deprivation', description: 'Using blindfolds, headphones, or gags to heighten other senses.' },
  { name: 'Exhibitionism', description: 'Deriving pleasure from being seen by others.' },
  { name: 'Pet Play', description: 'Roleplaying as a pet or handler in a power dynamic.' },
  { name: 'Electrostimulation', description: 'Using controlled electric shocks for sensation play.' },
] as const

export const allKinks = kinkCatalog.map((kink) => kink.name)
