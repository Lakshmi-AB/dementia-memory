export interface CulturalIcon {
  emoji: string;
  name: string;
}

// Local NER (North East Region) cultural assets
// Using emoji that closely represent traditional NER items
export const culturalIcons: CulturalIcon[] = [
  { emoji: '👒', name: 'Bamboo Hat (Japi)' },
  { emoji: '🦏', name: 'One-Horned Rhino' },
  { emoji: '🍵', name: 'Tea Leaves' },
  { emoji: '🍚', name: 'Rice (Bhaat)' },
  { emoji: '🐟', name: 'Fish (Masor Tenga)' },
  { emoji: '🥭', name: 'Jackfruit (Kothal)' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦚', name: 'Peacock' },
  { emoji: '🎋', name: 'Bamboo' },
  { emoji: '🎭', name: 'Bihu Mask' },
  { emoji: '🪕', name: 'Gogona (Instrument)' },
  { emoji: '🌺', name: 'Kopou Phul (Orchid)' },
];

export const culturalObjectSets: CulturalIcon[][] = [
  [
    { emoji: '🍎', name: 'Apple' },
    { emoji: '🕐', name: 'Clock' },
    { emoji: '🔑', name: 'Key' },
    { emoji: '📕', name: 'Book' },
    { emoji: '☂️', name: 'Umbrella' },
  ],
  [
    { emoji: '👒', name: 'Japi (Bamboo Hat)' },
    { emoji: '🦏', name: 'Rhino' },
    { emoji: '🍵', name: 'Tea Leaves' },
    { emoji: '🐟', name: 'Fish' },
    { emoji: '🥭', name: 'Jackfruit' },
  ],
  [
    { emoji: '🎋', name: 'Bamboo' },
    { emoji: '🦚', name: 'Peacock' },
    { emoji: '🎭', name: 'Bihu Mask' },
    { emoji: '🌺', name: 'Kopou Phul' },
    { emoji: '🪕', name: 'Gogona' },
  ],
  [
    { emoji: '🍚', name: 'Rice (Bhaat)' },
    { emoji: '🐘', name: 'Elephant' },
    { emoji: '🍵', name: 'Tea' },
    { emoji: '👒', name: 'Japi' },
    { emoji: '🐟', name: 'Fish' },
  ],
];

export const patternShapes = [
  { id: 0, bg: 'bg-rose-500', lit: 'bg-rose-300', border: 'border-rose-600', label: 'Red (Laal)' },
  { id: 1, bg: 'bg-brand-500', lit: 'bg-brand-300', border: 'border-brand-600', label: 'Blue (Nila)' },
  { id: 2, bg: 'bg-accent-500', lit: 'bg-accent-300', border: 'border-accent-600', label: 'Yellow (Holudi)' },
  { id: 3, bg: 'bg-success-500', lit: 'bg-success-300', border: 'border-success-600', label: 'Green (Sobuj)' },
  { id: 4, bg: 'bg-violet-500', lit: 'bg-violet-300', border: 'border-violet-600', label: 'Purple (Beguni)' },
];
