// ─── API LAYER ─── Mock data layer, structured for future backend replacement

export type Category = 'math' | 'physics' | 'science' | 'biology';
export type Difficulty = 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  minAge: number;
  difficulty: Difficulty;
  description: string;
  icon: string; // emoji glyph
  missionCount: number;
}

export interface Exercise {
  id: string;
  topicId: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
}

export interface InfoScroll {
  id: string;
  topicId: string;
  title: string;
  content: string;
  funFact: string;
}

const TOPICS: Topic[] = [
  { id: 'math-tables', title: 'Multiplication Arts', category: 'math', minAge: 6, difficulty: 'D-Rank', description: 'Master the ancient art of multiplication tables. Every ninja needs quick calculations!', icon: '✖️', missionCount: 8 },
  { id: 'math-fractions', title: 'Fraction Jutsu', category: 'math', minAge: 8, difficulty: 'C-Rank', description: 'Slice and divide with precision. Fractions are the hidden weapons of math.', icon: '🔪', missionCount: 6 },
  { id: 'math-geometry', title: 'Sacred Geometry', category: 'math', minAge: 10, difficulty: 'B-Rank', description: 'Shapes hold secret power. Unlock the geometry dimension.', icon: '📐', missionCount: 7 },
  { id: 'physics-gravity', title: 'Gravity Manipulation', category: 'physics', minAge: 10, difficulty: 'B-Rank', description: 'Why do things fall? Learn to understand the invisible force that binds the world.', icon: '🍎', missionCount: 5 },
  { id: 'physics-energy', title: 'Energy Transfer', category: 'physics', minAge: 12, difficulty: 'A-Rank', description: 'Energy cannot be created or destroyed — only transformed. Master the flow.', icon: '⚡', missionCount: 6 },
  { id: 'physics-motion', title: 'Laws of Motion', category: 'physics', minAge: 11, difficulty: 'B-Rank', description: 'Newton\'s three sacred laws. The foundation of all movement jutsu.', icon: '🚀', missionCount: 5 },
  { id: 'science-atoms', title: 'Atomic Structure', category: 'science', minAge: 10, difficulty: 'B-Rank', description: 'Everything is made of atoms. Peer into the building blocks of reality.', icon: '⚛️', missionCount: 6 },
  { id: 'science-elements', title: 'Elemental Mastery', category: 'science', minAge: 9, difficulty: 'C-Rank', description: 'The periodic table holds the secrets of all matter. Begin your elemental training.', icon: '🧪', missionCount: 8 },
  { id: 'science-reactions', title: 'Chemical Reactions', category: 'science', minAge: 12, difficulty: 'A-Rank', description: 'Combine elements to create explosive new substances. Handle with care!', icon: '💥', missionCount: 5 },
  { id: 'bio-cells', title: 'Cell Division', category: 'biology', minAge: 8, difficulty: 'C-Rank', description: 'Every living thing is made of cells. Learn the art of cellular multiplication.', icon: '🧬', missionCount: 6 },
  { id: 'bio-ecosystems', title: 'Ecosystem Wars', category: 'biology', minAge: 9, difficulty: 'C-Rank', description: 'Predators, prey, and the balance of nature. Understand the food chain battlefield.', icon: '🌿', missionCount: 5 },
  { id: 'bio-human', title: 'Human Body Fortress', category: 'biology', minAge: 11, difficulty: 'B-Rank', description: 'Your body is the ultimate machine. Map the organs, muscles, and systems within.', icon: '🫀', missionCount: 7 },
];

const EXERCISES: Record<string, Exercise[]> = {
  'math-tables': [
    { id: 'mt-1', topicId: 'math-tables', type: 'multiple-choice', question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correctAnswer: '56', explanation: '7 × 8 = 56. Think of it as 7 groups of 8!', xpReward: 10 },
    { id: 'mt-2', topicId: 'math-tables', type: 'multiple-choice', question: 'What is 9 × 6?', options: ['45', '54', '56', '63'], correctAnswer: '54', explanation: '9 × 6 = 54. A trick: 6 × 9 = 54 (commutative property!)', xpReward: 10 },
    { id: 'mt-3', topicId: 'math-tables', type: 'fill-blank', question: '12 × 12 = ___', correctAnswer: '144', explanation: '12 × 12 = 144. This is called "twelve squared"!', xpReward: 15 },
    { id: 'mt-4', topicId: 'math-tables', type: 'true-false', question: '11 × 11 = 111', options: ['True', 'False'], correctAnswer: 'False', explanation: '11 × 11 = 121, not 111!', xpReward: 10 },
  ],
  'math-fractions': [
    { id: 'mf-1', topicId: 'math-fractions', type: 'multiple-choice', question: 'What is 1/2 + 1/4?', options: ['2/6', '3/4', '1/6', '2/4'], correctAnswer: '3/4', explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4', xpReward: 15 },
    { id: 'mf-2', topicId: 'math-fractions', type: 'true-false', question: '1/3 is greater than 1/2', options: ['True', 'False'], correctAnswer: 'False', explanation: '1/2 = 0.5 and 1/3 ≈ 0.33, so 1/2 is greater!', xpReward: 10 },
  ],
  'physics-gravity': [
    { id: 'pg-1', topicId: 'physics-gravity', type: 'multiple-choice', question: 'What keeps us on the ground?', options: ['Magnetism', 'Gravity', 'Wind', 'Magic'], correctAnswer: 'Gravity', explanation: 'Gravity is the force that pulls objects toward each other. Earth\'s gravity keeps us grounded!', xpReward: 10 },
    { id: 'pg-2', topicId: 'physics-gravity', type: 'true-false', question: 'A feather and a bowling ball fall at the same speed in a vacuum', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Without air resistance, all objects fall at the same rate regardless of mass!', xpReward: 20 },
  ],
  'science-elements': [
    { id: 'se-1', topicId: 'science-elements', type: 'multiple-choice', question: 'What is the chemical symbol for Water?', options: ['Wa', 'H2O', 'O2', 'HO'], correctAnswer: 'H2O', explanation: 'Water is made of 2 Hydrogen atoms and 1 Oxygen atom: H₂O!', xpReward: 10 },
    { id: 'se-2', topicId: 'science-elements', type: 'multiple-choice', question: 'What element do we breathe?', options: ['Nitrogen', 'Carbon', 'Oxygen', 'Hydrogen'], correctAnswer: 'Oxygen', explanation: 'We breathe in Oxygen (O₂) and breathe out Carbon Dioxide (CO₂)!', xpReward: 10 },
  ],
  'bio-cells': [
    { id: 'bc-1', topicId: 'bio-cells', type: 'multiple-choice', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell Wall'], correctAnswer: 'Mitochondria', explanation: 'Mitochondria generate most of the cell\'s ATP energy. Power up!', xpReward: 15 },
    { id: 'bc-2', topicId: 'bio-cells', type: 'true-false', question: 'Plant cells have a cell wall but animal cells do not', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Plant cells have a rigid cell wall for structure. Animal cells only have a cell membrane!', xpReward: 10 },
  ],
};

const INFO_SCROLLS: Record<string, InfoScroll[]> = {
  'math-tables': [
    { id: 'ms-1', topicId: 'math-tables', title: 'The Power of Patterns', content: 'Multiplication tables are full of hidden patterns. The 9 times table digits always add up to 9 (e.g., 9×3=27, 2+7=9). The 5 times table always ends in 0 or 5.', funFact: 'Ancient Babylonians had multiplication tables carved in clay over 4,000 years ago!' },
    { id: 'ms-2', topicId: 'math-tables', title: 'Speed Calculation Jutsu', content: 'To multiply any number by 11, split the digits and add them in the middle. Example: 11×36 → 3_(3+6)_6 = 396!', funFact: 'The world record for mental multiplication of two 8-digit numbers is under 1 minute!' },
  ],
  'physics-gravity': [
    { id: 'pg-s1', topicId: 'physics-gravity', title: 'The Gravity Scroll', content: 'Gravity is one of the four fundamental forces. It pulls any two objects with mass toward each other. The more massive the object, the stronger its gravitational pull.', funFact: 'You weigh about 1/6th on the Moon what you weigh on Earth!' },
    { id: 'pg-s2', topicId: 'physics-gravity', title: 'Free Fall Training', content: 'In free fall, you feel weightless because you and everything around you are falling at the same rate. This is how astronauts float in the space station!', funFact: 'The ISS falls around Earth at 28,000 km/h but never hits the ground because Earth curves away!' },
  ],
  'science-elements': [
    { id: 'se-s1', topicId: 'science-elements', title: 'The Periodic Scroll', content: 'The Periodic Table organizes all known elements by their atomic number. Elements in the same column share similar properties — like a clan of ninjas with the same jutsu!', funFact: 'There are 118 confirmed elements, but scientists keep trying to create new ones!' },
  ],
  'bio-cells': [
    { id: 'bc-s1', topicId: 'bio-cells', title: 'Cell Architecture', content: 'Cells are the smallest unit of life. Your body has about 37 trillion of them! Each cell has a nucleus (the brain), mitochondria (the power plant), and ribosomes (the protein factories).', funFact: 'Red blood cells are the only cells in your body without a nucleus!' },
  ],
};

// Default exercises/scrolls for topics without specific content
const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'def-1', topicId: 'default', type: 'multiple-choice', question: 'Training mission coming soon! What rank do you want to achieve?', options: ['D-Rank', 'C-Rank', 'B-Rank', 'S-Rank'], correctAnswer: 'S-Rank', explanation: 'That\'s the spirit! Aim for the highest rank!', xpReward: 5 },
];

const DEFAULT_SCROLLS: InfoScroll[] = [
  { id: 'def-s1', topicId: 'default', title: 'Scroll Under Construction', content: 'Our scribes are still writing this scroll. Check back soon for ancient knowledge!', funFact: 'Knowledge is the ultimate power-up!' },
];

// ─── Simulated API calls ───

const simulateLatency = () => new Promise(res => setTimeout(res, 600 + Math.random() * 400));

export const MockAPI = {
  getTopics: async (age: number): Promise<Topic[]> => {
    await simulateLatency();
    return TOPICS.filter(t => age >= t.minAge);
  },

  getTopicById: async (topicId: string): Promise<Topic | null> => {
    await simulateLatency();
    return TOPICS.find(t => t.id === topicId) ?? null;
  },

  getExercises: async (topicId: string): Promise<Exercise[]> => {
    await simulateLatency();
    return EXERCISES[topicId] ?? DEFAULT_EXERCISES.map(e => ({ ...e, topicId }));
  },

  getInfoScrolls: async (topicId: string): Promise<InfoScroll[]> => {
    await simulateLatency();
    return INFO_SCROLLS[topicId] ?? DEFAULT_SCROLLS.map(s => ({ ...s, topicId }));
  },

  getAllCategories: async (): Promise<{ id: Category; label: string; icon: string }[]> => {
    await simulateLatency();
    return [
      { id: 'math', label: 'MATH', icon: '🔢' },
      { id: 'physics', label: 'PHYSICS', icon: '⚡' },
      { id: 'science', label: 'SCIENCE', icon: '🧪' },
      { id: 'biology', label: 'BIOLOGY', icon: '🧬' },
    ];
  },
};
