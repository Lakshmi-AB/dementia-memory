export type AppLanguage = 'assamese' | 'khasi' | 'manipuri' | 'english';

export interface TranslationStrings {
  // Navigation / buttons
  navGame: string;
  navReminders: string;
  navVoice: string;
  navProgress: string;
  back: string;
  caregiverQuickActions: string;
  // Header
  appName: string;
  appTaglineElderly: string;
  appTaglineCaregiver: string;
  switchToCaregiver: string;
  switchToCaregiverShort: string;
  switchToElderly: string;
  switchToElderlyShort: string;
  // Home
  morningGreeting: string;
  homePrompt: string;
  tapToSpeak: string;
  listening: string;
  youSaid: string;
  // Reminders
  remindersSubtitle: string;
  loading: string;
  noReminders: string;
  // Progress
  progressSubtitle: string;
  gamesPlayed: string;
  bestScore: string;
  accuracy: string;
  remindersDone: string;
  today: string;
  points: string;
  correctAnswers: string;
  completed: string;
  goalMet: string;
  // Voice assistant
  voiceAssistantTitle: string;
  voiceAssistantSubtitle: string;
  tapToSpeakVoice: string;
  thinking: string;
  hereIsWhat: string;
  voiceHint: string;
  // Voice responses
  respGame: string;
  respReminder: string;
  respProgress: string;
  respHello: string;
  respHelp: string;
  respWater: string;
  respMedicine: string;
  respDefault: string;
  respCatch: string;
  respUnavailable: string;
  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  onboardingConfirmed: string;
  onboardingTransition: string;
  onboardingChooseTitle: string;
  onboardingChooseSubtitle: string;
  onboardingCantVoice: string;
  onboardingHeard: string;
  // Misc
  fallback: string;
  goodJob: string;
  languageUpdated: string;
  prompt: string;
  confirmation: string;
}

export interface LanguageConfig {
  id: AppLanguage;
  englishName: string;
  nativeName: string;
  nativeScript: string;
  bcp47: string;
  ttsLang: string;
  t: TranslationStrings;
}

export const languages: LanguageConfig[] = [
  {
    id: 'assamese',
    englishName: 'Assamese',
    nativeName: 'Assamese',
    nativeScript: 'অসমীয়া',
    bcp47: 'as-IN',
    ttsLang: 'as-IN',
    t: {
      navGame: 'খেল খেলোঁ',
      navReminders: 'মোৰ সোঁৱৰণী',
      navVoice: 'শুনা মোড',
      navProgress: 'মোৰ উন্নতি',
      back: 'পাছলৈ',
      caregiverQuickActions: 'তত্ত্বাৱধায়কৰ খৰতকীয়া কাম',
      appName: 'MindSpark',
      appTaglineElderly: 'MindCare',
      appTaglineCaregiver: 'জ্ঞানমূলক যত্ন প্লেটফৰ্ম',
      switchToCaregiver: 'তত্ত্বাৱধায়ক ডেশ্ববৰ্ডলৈ যাওক',
      switchToCaregiverShort: 'তত্ত্বাৱধায়ক',
      switchToElderly: 'বয়স্ক মোডলৈ যাওক',
      switchToElderlyShort: 'বয়স্ক',
      morningGreeting: 'সুপ্ৰভাত! আজি আপোনালৈ স্বাগত।',
      homePrompt: 'আপুনি কি কৰিব বিচাৰে? খেলিবলৈ ব’লক, অনুস্মাৰক চাবলৈ ব’লক, বা আপোনাৰ উন্নতি চাবলৈ ব’লক।',
      tapToSpeak: 'কমান্ড দিবলৈ টিপক',
      listening: 'শুনি আছো...',
      youSaid: 'আপুনি ক’লে:',
      remindersSubtitle: 'আজিৰ আপোনাৰ সূচি',
      loading: 'লোড হৈ আছে...',
      noReminders: 'আজিৰ বাবে কোনো সোঁৱৰণী নাই।',
      progressSubtitle: 'আজি আপুনি কেনেদৰে আছে চাওক',
      gamesPlayed: 'খেলা খেল',
      bestScore: 'শ্ৰেষ্ঠ স্ক’ৰ',
      accuracy: 'নিখুঁততা',
      remindersDone: 'সম্পূৰ্ণ সোঁৱৰণী',
      today: 'আজি',
      points: 'পইন্ট',
      correctAnswers: 'শুদ্ধ উত্তৰ',
      completed: 'সম্পূৰ্ণ',
      goalMet: 'লক্ষ্য অৰ্জিত!',
      voiceAssistantTitle: 'কণ্ঠ সহায়ক',
      voiceAssistantSubtitle: 'মাইক্ৰ’ফ’ন টিপি মোৰ লগত কথা পাতক',
      tapToSpeakVoice: 'কথা পাতিবলৈ টিপক',
      thinking: 'ভাবি আছো...',
      hereIsWhat: 'মই যি পালো সেইটো:',
      voiceHint: 'ব’লক: "খেল খেলোঁ", "মোৰ সোঁৱৰণী কি?", বা "মোৰ উন্নতি দেখুৱাক"',
      respGame: 'আহক স্মৃতি খেল খেলোঁ! মই আপোনাক খেলৰ ঠাইলৈ লৈ যাম।',
      respReminder: 'ইয়াত আজিৰ আপোনাৰ সোঁৱৰণীবোৰ আছে। সম্পূৰ্ণ কৰাৰ লগে লগে টিক মাৰক।',
      respProgress: 'আপুনি ভাল কৰি আছে! মই আজিৰ আপোনাৰ উন্নতি দেখুৱাম।',
      respHello: 'নমস্কাৰ! মই আপোনাৰ স্মৃতি সহায়ক। মই খেল, সোঁৱৰণী বা উন্নতি চাবলৈ সহায় কৰিম।',
      respHelp: 'মই তিনিটা কামত সহায় কৰিব পাৰো: খেল খেলো, সোঁৱৰণী চাওক, বা উন্নতি চাওক।',
      respWater: 'পানী খোৱাৰ সময়! পানী খোলে মন তীক্ষ্ণ থাকে।',
      respMedicine: 'অনুগ্ৰহ কৰি সময়মতে ঔষধ লওক। আপোনাৰ তত্ত্বাৱধায়ক খুশী হ’ব।',
      respDefault: 'মই শুনিলো! মই খেল, সোঁৱৰণী আৰু উন্নতিত সহায় কৰিম।',
      respCatch: 'মই ভালদৰে শুনিব নোৱাৰিলো। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
      respUnavailable: 'দুখিত, এই ব্ৰাউজাৰত কণ্ঠ চিনাক্তি নাই। কিন্তু বুটাম ব্যৱহাৰ কৰিব পাৰে!',
      onboardingTitle: 'MindSparkলৈ স্বাগত',
      onboardingSubtitle: 'অনুগ্ৰহ কৰি আপোনাৰ ভাষাৰ নাম কওক',
      onboardingConfirmed: 'ভাষা নিশ্চিত!',
      onboardingTransition: 'আপোনাক ঘৰৰ স্ক্ৰিনলৈ লৈ যোৱা হৈছে...',
      onboardingChooseTitle: 'আপোনাৰ ভাষা বাচি লওক',
      onboardingChooseSubtitle: 'এই ব্ৰাউজাৰত কণ্ঠ সুবিধা নাই, কিন্তু তলৰ পৰা ভাষা বাচি ল’ব পাৰে।',
      onboardingCantVoice: 'কণ্ঠ ব্যৱহাৰ কৰিব নোৱাৰে? এটা ভাষা টিপক:',
      onboardingHeard: 'মই শুনিলো:',
      fallback: 'মই বুজিব নোৱাৰিলো। অনুগ্ৰহ কৰি পুনৰ কওক।',
      goodJob: 'ৱল ডন! আপুনি ভাল কৰিলে!',
      languageUpdated: 'ভাষা আপডেট কৰা হৈছে। অসমীয়া ভাষা এতিয়া সক্ৰিয়।',
      prompt: "If you want Assamese, say 'Assamese' or 'অসমীয়া'.",
      confirmation: 'অসমীয়া ভাষা বাচনি কৰা হৈছে। ব’লক, এতিয়া খেলোঁ ব’লক!',
    },
  },
  {
    id: 'khasi',
    englishName: 'Khasi',
    nativeName: 'Khasi',
    nativeScript: 'Khasi',
    bcp47: 'kha-IN',
    ttsLang: 'en-IN',
    t: {
      navGame: 'Lehkhai',
      navReminders: 'Ki Jingkynmaw',
      navVoice: 'Pynshah',
      navProgress: 'Kaba Shaid',
      back: 'Dien',
      caregiverQuickActions: 'Kam Caregiver',
      appName: 'MindSpark',
      appTaglineElderly: 'MindCare',
      appTaglineCaregiver: 'Cognitive Care Platform',
      switchToCaregiver: 'Switch to Caregiver Dashboard',
      switchToCaregiverShort: 'Caregiver',
      switchToElderly: 'Switch to Elderly Mode',
      switchToElderlyShort: 'Elderly',
      morningGreeting: 'Khublei! Nga don ki kumno nga ai ia ngi hangne.',
      homePrompt: 'Ka jingpyrshad nga wan? Pynkam ia kane, pynkam ia kane, bad pynkam ia ka progress.',
      tapToSpeak: 'Tap to speak a command',
      listening: 'Listening...',
      youSaid: 'YOU SAID:',
      remindersSubtitle: 'Your schedule for today',
      loading: 'Loading...',
      noReminders: 'No reminders for today.',
      progressSubtitle: 'Here is how you are doing today',
      gamesPlayed: 'Games Played',
      bestScore: 'Best Score',
      accuracy: 'Accuracy',
      remindersDone: 'Reminders Done',
      today: 'today',
      points: 'points',
      correctAnswers: 'correct answers',
      completed: 'completed',
      goalMet: 'Goal Met!',
      voiceAssistantTitle: 'Voice Assistant',
      voiceAssistantSubtitle: 'Tap the microphone and speak to me',
      tapToSpeakVoice: 'Tap to speak',
      thinking: 'Thinking...',
      hereIsWhat: 'Here is what I found:',
      voiceHint: 'Try saying: "Play a game", "What are my reminders?", or "Show my progress"',
      respGame: "Let's play a memory game! I'll take you to the Game Station.",
      respReminder: 'Here are your reminders for today. Check them off as you complete each one.',
      respProgress: "You're doing great! Let me show you your progress for today.",
      respHello: "Hello! I'm your memory assistant. I can help with games, reminders, and progress.",
      respHelp: 'I can help with three things: play a game, check reminders, or see your progress.',
      respWater: 'Time to drink some water! Staying hydrated helps keep your mind sharp.',
      respMedicine: "Please take your medicine as scheduled. Your caregiver will be happy to know.",
      respDefault: "I heard you! I'm here to help with games, reminders, and your progress.",
      respCatch: "I didn't quite catch that. Could you try again?",
      respUnavailable: "Voice recognition isn't available, but you can still use the buttons!",
      onboardingTitle: 'Welcome to MindSpark',
      onboardingSubtitle: 'Please say the name of your language',
      onboardingConfirmed: 'Language Confirmed!',
      onboardingTransition: 'Taking you to your home screen...',
      onboardingChooseTitle: 'Choose Your Language',
      onboardingChooseSubtitle: "Voice features aren't available, but you can select your language below.",
      onboardingCantVoice: "Can't use voice? Tap a language to continue:",
      onboardingHeard: 'I HEARD:',
      fallback: 'Nga iathuh khann. Pynreh ia ngi.',
      goodJob: 'Khublei! I la pynsuk ia kane!',
      languageUpdated: 'Language updated. Khasi language is now active.',
      prompt: "If you want Khasi, say 'Khasi'.",
      confirmation: 'Khasi language khia ba kiwei. Wat la kumno, tam ha iing khia!',
    },
  },
  {
    id: 'manipuri',
    englishName: 'Manipuri',
    nativeName: 'Manipuri',
    nativeScript: 'মণিপুরী',
    bcp47: 'mni-IN',
    ttsLang: 'en-IN',
    t: {
      navGame: 'শান্নসি',
      navReminders: 'অহাক নিংশিংবশিং',
      navVoice: 'তাশিনবা মোদ',
      navProgress: 'ঐগী চাউখৎপা',
      back: 'অহনবা',
      caregiverQuickActions: 'কেয়রগিভর থবক',
      appName: 'MindSpark',
      appTaglineElderly: 'MindCare',
      appTaglineCaregiver: 'Cognitive Care Platform',
      switchToCaregiver: 'Switch to Caregiver Dashboard',
      switchToCaregiverShort: 'Caregiver',
      switchToElderly: 'Switch to Elderly Mode',
      switchToElderlyShort: 'Elderly',
      morningGreeting: 'নুংথিল পাল্লব! তৌগী ফজবনা য়াম্মি।',
      homePrompt: 'নহাক করগনি খেল্লগনি? খেল, রিমাইন্দার, নত্রগী পোত্থোক চে।',
      tapToSpeak: 'তাশিনবা কমান্দ পীনবা',
      listening: 'তাশিনরি...',
      youSaid: 'নহাক হায়খ্রে:',
      remindersSubtitle: 'তৌগী নহাক্কী সূচি',
      loading: 'লোদ তৌরি...',
      noReminders: 'তৌগী অহাক নিংশিংবশিং লৈতে।',
      progressSubtitle: 'তৌগী নহাক করম্বা তৌরিবগী চাউখৎপা',
      gamesPlayed: 'খেলফম খেল',
      bestScore: 'চাং স্কোর',
      accuracy: 'চেকশিন',
      remindersDone: 'অহাক নিংশিংবশিং তৌরে',
      today: 'তৌ',
      points: 'পয়েন্ত',
      correctAnswers: 'য়াবা উত্তর',
      completed: 'তৌরে',
      goalMet: 'লক্ষ্য পুথোক!',
      voiceAssistantTitle: 'তাশিনবা মোদ',
      voiceAssistantSubtitle: 'মাইক্রোফোন তিপি ঐগী মথক্তা য়াওকনরো',
      tapToSpeakVoice: 'য়াওকনবা',
      thinking: 'ভাবরি...',
      hereIsWhat: 'ঐ পুরিবগী অসি:',
      voiceHint: 'হায়শিন্নরো: "শান্নসি", "ঐগী নিংশিংবশিং করিনো?", নত্রগা "ঐগী চাউখৎপা উত্লু"',
      respGame: 'শান্নসি খেল্লগনি! ঐ নহাক্কী খেলগী মফমদা লচিল্লগনি।',
      respReminder: 'অসিদি তৌগী নহাক্কী অহাক নিংশিংবশিং। তৌরিবা মখোয় তিপি।',
      respProgress: 'নহাক য়াম্মি তৌরে! ঐ তৌগী চাউখৎপা উত্লগনি।',
      respHello: 'নুংথিল! ঐ নহাক্কী স্মৃতি সহায়কনি। খেল, নিংশিংবশিং, চাউখৎপা সহায় তৌগনি।',
      respHelp: 'ঐ মথম অনিতা সহায় তৌবা য়ামি: খেল, নিংশিংবশিং, নত্রগা চাউখৎপা।',
      respWater: 'ইশিং থুবা মতম! ইশিং থুলে মন চাংশিনগনি।',
      respMedicine: 'অনুগ্রহ করিবদি মতম মথন্তা মাইথি লৌ। নহাক্কী কেয়রগিভর খুশি য়াগনি।',
      respDefault: 'ঐ তাখ্রে! ঐ খেল, নিংশিংবশিং, চাউখৎপাদা সহায় তৌগনি।',
      respCatch: 'ঐ য়াম্মি তাখিদ্রে। অনুগ্রহ করিবদি পুন্ন চেষ্টা তৌশিন্নু।',
      respUnavailable: 'এই ব্রাউজরদা তাশিনবা সুবিধা লৈতে। অদুবু বুতন শিল্লগনি!',
      onboardingTitle: 'MindSparkদা য়াওথোক',
      onboardingSubtitle: 'অনুগ্রহ করিবদি নহাক্কী ভাষাগী মমিং হায়শিন্নু',
      onboardingConfirmed: 'ভাষা য়াংলে!',
      onboardingTransition: 'নহাক্কী ইংদা লচিল্লরি...',
      onboardingChooseTitle: 'নহাক্কী ভাষা খন্নু',
      onboardingChooseSubtitle: 'এই ব্রাউজরদা তাশিনবা সুবিধা লৈতে, অদুবু মখাগী ভাষা খন্নবা য়াম্মি।',
      onboardingCantVoice: 'তাশিনবা শিল্লবা য়াদ্রে? অমতা ভাষা তিপু:',
      onboardingHeard: 'ঐ তাখ্রে:',
      fallback: 'মচিন খরিবনি। অদুগা নুংঙি তৌবিয়ু।',
      goodJob: 'থৌৱাই! নহাক য়াম্মি তৌরে!',
      languageUpdated: 'ভাষা আপডেট তৌরে। মণিপুরী ভাষা এতিয়া সক্ৰিয়।',
      prompt: "If you want Manipuri, say 'Manipuri' or 'মণিপুরী'.",
      confirmation: 'মণিপুরী ভাষা তৌরবীৰে। চে, নুংঙি খেল্লোগনি!',
    },
  },
  {
    id: 'english',
    englishName: 'English',
    nativeName: 'English',
    nativeScript: 'English',
    bcp47: 'en-US',
    ttsLang: 'en-US',
    t: {
      navGame: 'Play Game',
      navReminders: 'My Reminders',
      navVoice: 'Listen Mode',
      navProgress: 'My Progress',
      back: 'Back',
      caregiverQuickActions: 'Caregiver Quick Actions',
      appName: 'MindSpark',
      appTaglineElderly: 'MindCare',
      appTaglineCaregiver: 'Cognitive Care Platform',
      switchToCaregiver: 'Switch to Caregiver Dashboard',
      switchToCaregiverShort: 'Caregiver',
      switchToElderly: 'Switch to Elderly Mode',
      switchToElderlyShort: 'Elderly',
      morningGreeting: 'Good morning! Welcome to your MindCare app.',
      homePrompt: 'What would you like to do? Say play a game, check my reminders, or see my progress.',
      tapToSpeak: 'Tap to speak a command',
      listening: 'Listening...',
      youSaid: 'YOU SAID:',
      remindersSubtitle: 'Your schedule for today',
      loading: 'Loading...',
      noReminders: 'No reminders for today.',
      progressSubtitle: 'here is how you are doing today',
      gamesPlayed: 'Games Played',
      bestScore: 'Best Score',
      accuracy: 'Accuracy',
      remindersDone: 'Reminders Done',
      today: 'today',
      points: 'points',
      correctAnswers: 'correct answers',
      completed: 'completed',
      goalMet: 'Goal Met!',
      voiceAssistantTitle: 'Voice Assistant',
      voiceAssistantSubtitle: 'Tap the microphone and speak to me',
      tapToSpeakVoice: 'Tap to speak',
      thinking: 'Thinking...',
      hereIsWhat: 'Here is what I found:',
      voiceHint: 'Try saying: "Play a game", "What are my reminders?", or "Show my progress"',
      respGame: "Let's play a memory game! I'll take you to the Game Station where you can choose from fun brain exercises.",
      respReminder: 'Here are your reminders for today. You can check them off as you complete each one.',
      respProgress: "You're doing great! Let me show you your progress for today.",
      respHello: "Hello! I'm your memory assistant. I can help you play games, check reminders, or see your progress. What would you like to do?",
      respHelp: 'I can help you with three things: play a brain game, check your daily reminders, or see your progress. Just tell me what you need!',
      respWater: 'Time to drink some water! Staying hydrated helps keep your mind sharp.',
      respMedicine: "Please take your medicine as scheduled. Your caregiver will be happy to know you're staying on track.",
      respDefault: "I heard you! I'm here to help with games, reminders, and your progress. What would you like to do?",
      respCatch: "I didn't quite catch that. Could you try again?",
      respUnavailable: "I'm sorry, voice recognition isn't available in your browser. But I can still help you — just use the buttons on the home screen!",
      onboardingTitle: 'Welcome to MindSpark',
      onboardingSubtitle: 'Please say the name of your language',
      onboardingConfirmed: 'Language Confirmed!',
      onboardingTransition: 'Taking you to your home screen...',
      onboardingChooseTitle: 'Choose Your Language',
      onboardingChooseSubtitle: "Voice features aren't available in this browser, but you can still select your language below.",
      onboardingCantVoice: "Can't use voice? Tap a language to continue:",
      onboardingHeard: 'I HEARD:',
      fallback: "I didn't catch that. Please try again.",
      goodJob: 'Well done! You did great!',
      languageUpdated: 'Language updated. English is now active.',
      prompt: "If you want English, say 'English'.",
      confirmation: "English language selected. Let's start playing!",
    },
  },
];

export function getLanguageConfig(id: AppLanguage): LanguageConfig {
  return languages.find((l) => l.id === id) ?? languages[3];
}

export function detectLanguageFromSpeech(text: string): AppLanguage | null {
  const lower = text.toLowerCase().trim();
  if (lower.includes('assamese') || lower.includes('অসমীয়া') || lower.includes('asamiya')) return 'assamese';
  if (lower.includes('khasi')) return 'khasi';
  if (lower.includes('manipuri') || lower.includes('মণিপুরী')) return 'manipuri';
  if (lower.includes('english')) return 'english';
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
