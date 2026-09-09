export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  fact: string;
}

const topicQuestions: Record<string, TriviaQuestion[]> = {
  'Bollywood classics': [
    {
      question: 'Which classic Bollywood film features the song "Mera Joota Hai Japani"?',
      options: ['Shree 420', 'Mother India', 'Pyaasa', 'Awaara'],
      correctIndex: 0,
      fact: '"Shree 420" (1955) starred Raj Kapoor and became famous across the world.',
    },
    {
      question: 'Who is known as the "Tragedy King" of Bollywood?',
      options: ['Raj Kapoor', 'Dilip Kumar', 'Dev Anand', 'Ashok Kumar'],
      correctIndex: 1,
      fact: 'Dilip Kumar earned this title for his powerful performances in tragic roles.',
    },
    {
      question: 'Which actress was known as the "Queen of Melody" in classic Bollywood?',
      options: ['Madhubala', 'Nargis', 'Meena Kumari', 'Waheeda Rehman'],
      correctIndex: 0,
      fact: 'Madhubala was one of the most iconic actresses of the golden era of Bollywood.',
    },
    {
      question: 'Which music director duo created timeless songs for many Raj Kapoor films?',
      options: ['Shankar-Jaikishan', 'Laxmikant-Pyarelal', 'Kalyanji-Anandji', 'Salil Chowdhury'],
      correctIndex: 0,
      fact: 'Shankar-Jaikishan composed some of the most memorable Bollywood melodies.',
    },
  ],
  'Indian independence': [
    {
      question: 'In which year did India gain independence?',
      options: ['1945', '1947', '1950', '1942'],
      correctIndex: 1,
      fact: 'India gained independence on August 15, 1947.',
    },
    {
      question: 'Who gave the famous "Quit India" speech?',
      options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel', 'Subhas Bose'],
      correctIndex: 1,
      fact: 'Mahatma Gandhi launched the Quit India Movement in August 1942.',
    },
    {
      question: 'Who was the first Prime Minister of independent India?',
      options: ['Mahatma Gandhi', 'Sardar Patel', 'Jawaharlal Nehru', 'Rajendra Prasad'],
      correctIndex: 2,
      fact: 'Jawaharlal Nehru served as Prime Minister from 1947 to 1964.',
    },
    {
      question: 'Which slogan inspired the independence movement: "Give me blood and I shall give you..."?',
      options: ['Freedom', 'Independence', 'A new India', 'Liberty'],
      correctIndex: 1,
      fact: 'Subhas Chandra Bose said "Give me blood and I shall give you independence."',
    },
  ],
  'Folk music': [
    {
      question: 'Which folk dance is associated with the harvest festival of Punjab?',
      options: ['Garba', 'Bhangra', 'Bihu', 'Lavani'],
      correctIndex: 1,
      fact: 'Bhangra is a lively folk dance performed during the harvest season in Punjab.',
    },
    {
      question: 'Which Indian folk instrument is a single-stringed bowed instrument?',
      options: ['Sarangi', 'Ektara', 'Tabla', 'Dholak'],
      correctIndex: 1,
      fact: 'The Ektara has a single string and is used in folk music across India.',
    },
    {
      question: 'Which state is famous for the "Bihu" folk dance and music?',
      options: ['Bengal', 'Assam', 'Odisha', 'Kerala'],
      correctIndex: 1,
      fact: 'Bihu is the traditional festival and folk dance of Assam.',
    },
  ],
  Cricket: [
    {
      question: 'In which year did India win its first Cricket World Cup?',
      options: ['1975', '1983', '1987', '2011'],
      correctIndex: 1,
      fact: 'India won the Cricket World Cup in 1983 under Kapil Dev\'s captaincy.',
    },
    {
      question: 'Who was the first Indian cricketer to score a century in Test cricket?',
      options: ['Sunil Gavaskar', 'Lala Amarnath', 'Vijay Hazare', 'Polly Umrigar'],
      correctIndex: 1,
      fact: 'Lala Amarnath scored India\'s first Test century in 1933.',
    },
    {
      question: 'Which Indian cricketer is known as the "Little Master"?',
      options: ['Sachin Tendulkar', 'Sunil Gavaskar', 'Rahul Dravid', 'Kapil Dev'],
      correctIndex: 1,
      fact: 'Sunil Gavaskar was the original "Little Master" of Indian cricket.',
    },
  ],
  Festivals: [
    {
      question: 'Which festival is known as the "Festival of Lights"?',
      options: ['Holi', 'Diwali', 'Navratri', 'Onam'],
      correctIndex: 1,
      fact: 'Diwali is celebrated by lighting lamps (diyas) across India.',
    },
    {
      question: 'Which festival celebrates the harvest with kite flying?',
      options: ['Makar Sankranti', 'Pongal', 'Lohri', 'Baisakhi'],
      correctIndex: 0,
      fact: 'Makar Sankranti is celebrated with kite flying in many parts of India.',
    },
    {
      question: 'Which spring festival is known for colors?',
      options: ['Diwali', 'Holi', 'Eid', 'Christmas'],
      correctIndex: 1,
      fact: 'Holi is the festival of colors, celebrating the arrival of spring.',
    },
  ],
  'Indian cuisine': [
    {
      question: 'Which spice is known as the "King of Spices"?',
      options: ['Cardamom', 'Black Pepper', 'Clove', 'Cinnamon'],
      correctIndex: 1,
      fact: 'Black pepper was historically known as the "King of Spices" in trade.',
    },
    {
      question: 'Which Indian bread is traditionally cooked in a tandoor?',
      options: ['Roti', 'Naan', 'Dosa', 'Paratha'],
      correctIndex: 1,
      fact: 'Naan is baked in a clay tandoor oven for its distinctive texture.',
    },
    {
      question: 'Which dish is a rice preparation popular across South India?',
      options: ['Biryani', 'Sambar', 'Dosa', 'Idli'],
      correctIndex: 0,
      fact: 'Biryani is a fragrant rice dish with roots in Mughal cuisine.',
    },
  ],
  'Village life': [
    {
      question: 'What is the traditional name for an Indian village council?',
      options: ['Panchayat', 'Municipality', 'Sabha', 'Samiti'],
      correctIndex: 0,
      fact: 'A Gram Panchayat is the traditional village-level governing body.',
    },
    {
      question: 'Which animal is most commonly used for farming in Indian villages?',
      options: ['Horse', 'Bullock', 'Camel', 'Goat'],
      correctIndex: 1,
      fact: 'Bullocks (castrated bulls) have been used for plowing fields for centuries.',
    },
    {
      question: 'What is a common gathering place in the center of an Indian village?',
      options: ['Mall', 'Chaupal', 'Bazaar', 'Stadium'],
      correctIndex: 1,
      fact: 'The chaupal is a central meeting place where villagers gather and discuss.',
    },
  ],
  'Classical dance': [
    {
      question: 'Which classical dance form originated in Kerala?',
      options: ['Bharatanatyam', 'Kathakali', 'Odissi', 'Manipuri'],
      correctIndex: 1,
      fact: 'Kathakali is known for its elaborate makeup and expressive gestures.',
    },
    {
      question: 'Which classical dance is associated with temples of Tamil Nadu?',
      options: ['Kathak', 'Bharatanatyam', 'Mohiniyattam', 'Kuchipudi'],
      correctIndex: 1,
      fact: 'Bharatanatyam is one of the oldest classical dance forms of India.',
    },
    {
      question: 'Which dance form features rapid footwork and spins, often telling stories?',
      options: ['Kathak', 'Odissi', 'Sattriya', 'Manipuri'],
      correctIndex: 0,
      fact: 'Kathak is known for its intricate footwork and storytelling through dance.',
    },
  ],
};

const generalQuestions: TriviaQuestion[] = [
  {
    question: 'What is the capital of India?',
    options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
    correctIndex: 1,
    fact: 'New Delhi has been the capital of India since 1911.',
  },
  {
    question: 'Which river is considered the holiest in India?',
    options: ['Yamuna', 'Ganga', 'Saraswati', 'Godavari'],
    correctIndex: 1,
    fact: 'The Ganga (Ganges) is the most sacred river in Hindu culture.',
  },
  {
    question: 'Which is the national animal of India?',
    options: ['Lion', 'Elephant', 'Bengal Tiger', 'Peacock'],
    correctIndex: 2,
    fact: 'The Bengal Tiger is the national animal of India.',
  },
  {
    question: 'Which is the national flower of India?',
    options: ['Rose', 'Lotus', 'Marigold', 'Jasmine'],
    correctIndex: 1,
    fact: 'The Lotus is the national flower of India.',
  },
];

export function generateTrivia(topics: string[], count: number = 5): TriviaQuestion[] {
  const pool: TriviaQuestion[] = [];

  for (const topic of topics) {
    const qs = topicQuestions[topic];
    if (qs) pool.push(...qs);
  }

  if (pool.length < count) {
    pool.push(...generalQuestions);
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const availableTopics = Object.keys(topicQuestions);
