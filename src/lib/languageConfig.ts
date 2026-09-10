export type AppLanguage = 'assamese' | 'khasi' | 'manipuri' | 'english';

export interface LanguageConfig {
  id: AppLanguage;
  englishName: string;
  nativeName: string;
  nativeScript: string;
  bcp47: string;
  ttsLang: string;
  prompt: string;
  confirmation: string;
  morningGreeting: string;
  homePrompt: string;
  navGame: string;
  navReminders: string;
  navVoice: string;
  navProgress: string;
  fallback: string;
  goodJob: string;
}

export const languages: LanguageConfig[] = [
  {
    id: 'assamese',
    englishName: 'Assamese',
    nativeName: 'Assamese',
    nativeScript: 'অসমীয়া',
    bcp47: 'as-IN',
    ttsLang: 'as-IN',
    prompt: "If you want Assamese, say 'Assamese' or 'অসমীয়া'.",
    confirmation: 'অসমীয়া ভাষা বাচনি কৰা হৈছে। ব’লক, এতিয়া খেলোঁ ব’লক!',
    morningGreeting: 'সুপ্ৰভাত! আজি আপোনালৈ স্বাগত।',
    homePrompt: 'আপুনি কি কৰিব বিচাৰে? খেলিবলৈ ব’লক, অনুস্মাৰক চাবলৈ ব’লক, বা আপোনাৰ উন্নতি চাবলৈ ব’লক।',
    navGame: 'খেল',
    navReminders: 'অনুস্মাৰক',
    navVoice: 'কণ্ঠ সহায়ক',
    navProgress: 'উন্নতি',
    fallback: 'মই বুজিব নোৱাৰিলো। অনুগ্ৰহ কৰি পুনৰ কওক।',
    goodJob: 'ৱল ডন! আপুনি ভাল কৰিলে!',
  },
  {
    id: 'khasi',
    englishName: 'Khasi',
    nativeName: 'Khasi',
    nativeScript: 'Khasi',
    bcp47: 'kha-IN',
    ttsLang: 'en-IN',
    prompt: "If you want Khasi, say 'Khasi'.",
    confirmation: 'Khasi language khia ba kiwei. Wat la kumno, tam ha iing khia!',
    morningGreeting: 'Khublei! Nga don ki kumno nga ai ia ngi hangne.',
    homePrompt: 'Ka jingpyrshad nga wan? Pynkam ia kane, pynkam ia kane, bad pynkam ia ka progress.',
    navGame: 'Kane ka khana',
    navReminders: 'Ka rympei',
    navVoice: 'Ka voice',
    navProgress: 'Ka progress',
    fallback: 'Nga iathuh khann. Pynreh ia ngi.',
    goodJob: 'Khublei! I la pynsuk ia kane!',
  },
  {
    id: 'manipuri',
    englishName: 'Manipuri',
    nativeName: 'Manipuri',
    nativeScript: 'মণিপুরী',
    bcp47: 'mni-IN',
    ttsLang: 'en-IN',
    prompt: "If you want Manipuri, say 'Manipuri' or 'মণিপুরী'.",
    confirmation: 'মণিপুরী ভাষা তৌরবীৰে। চে, নুংঙি খেল্লোগনি!',
    morningGreeting: 'নুংথিল পাল্লব! তৌগী ফজবনা য়াম্মি।',
    homePrompt: 'নহাক করগনি খেল্লগনি? খেল, রিমাইন্দার, নত্রগী পোত্থোক চে।',
    navGame: 'খেল',
    navReminders: 'রিমাইন্দার',
    navVoice: 'ভোইচ',
    navProgress: 'পোত্থোক',
    fallback: 'মচিন খরিবনি। অদুগা নুংঙি তৌবিয়ু।',
    goodJob: 'থৌৱাই! নহাক য়াম্মি তৌরে!',
  },
  {
    id: 'english',
    englishName: 'English',
    nativeName: 'English',
    nativeScript: 'English',
    bcp47: 'en-US',
    ttsLang: 'en-US',
    prompt: "If you want English, say 'English'.",
    confirmation: "English language selected. Let's start playing!",
    morningGreeting: 'Good morning! Welcome to your MindCare app.',
    homePrompt: 'What would you like to do? Say play a game, check my reminders, or see my progress.',
    navGame: 'Play Game',
    navReminders: 'My Reminders',
    navVoice: 'Voice Assistant',
    navProgress: 'My Progress',
    fallback: "I didn't catch that. Please try again.",
    goodJob: 'Well done! You did great!',
  },
];

export function getLanguageConfig(id: AppLanguage): LanguageConfig {
  return languages.find((l) => l.id === id) ?? languages[3];
}

export function detectLanguageFromSpeech(text: string): AppLanguage | null {
  const lower = text.toLowerCase().trim();
  if (lower.includes('assamese') || lower.includes('অসমীয়া') || lower.includes('asamiya')) return 'assamese';
  if (lower.includes('khasi') || lower.includes('khasi')) return 'khasi';
  if (lower.includes('manipuri') || lower.includes('মণিপুরী') || lower.includes('manipuri')) return 'manipuri';
  if (lower.includes('english') || lower.includes('english')) return 'english';
  return null;
}

const STORAGE_KEY = 'mindspark_language';

export function getStoredLanguage(): AppLanguage | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && languages.some((l) => l.id === stored)) {
      return stored as AppLanguage;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

export function storeLanguage(lang: AppLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage not available
  }
}

export function clearStoredLanguage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}
