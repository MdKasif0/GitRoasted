export const FETCH_STEPS = [
  {
    id: 1,
    name: 'Fetching Profile',
    description: 'Loading user profile information...',
    progressRange: [0, 15],
    estimatedTime: 300,
    required: true
  },
  {
    id: 2,
    name: 'Analyzing Repositories',
    description: 'Scanning all public repositories...',
    progressRange: [15, 40],
    estimatedTime: 650,
    required: true
  },
  {
    id: 3,
    name: 'Checking Activity',
    description: 'Reviewing recent contributions...',
    progressRange: [40, 60],
    estimatedTime: 550,
    required: true
  },
  {
    id: 4,
    name: 'Calculating Contributions',
    description: 'Analyzing contribution history...',
    progressRange: [60, 80],
    estimatedTime: 800,
    required: true
  },
  {
    id: 5,
    name: 'Loading Social Data',
    description: 'Fetching organizations and connections...',
    progressRange: [80, 90],
    estimatedTime: 300,
    required: false
  },
  {
    id: 6,
    name: 'Generating Roast',
    description: 'Calculating score and crafting your roast...',
    progressRange: [90, 100],
    estimatedTime: 750,
    required: true
  }
];
