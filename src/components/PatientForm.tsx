import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { PatientInsert, CareLevel } from '@/types';

interface PatientFormProps {
  onSubmit: (patient: PatientInsert) => Promise<unknown>;
  onClose: () => void;
}

const careLevels: { value: CareLevel; label: string }[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
];

const colorOptions = ['teal', 'blue', 'amber', 'rose', 'violet', 'emerald'];

const suggestedTopics = [
  'Bollywood classics',
  'Indian independence',
  'Folk music',
  'Cricket',
  'Festivals',
  'Indian cuisine',
  'Village life',
  'Classical dance',
];

export default function PatientForm({ onSubmit, onClose }: PatientFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [careLevel, setCareLevel] = useState<CareLevel>('mild');
  const [notes, setNotes] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [avatarColor, setAvatarColor] = useState('teal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const addCustomTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics((prev) => [...prev, trimmed]);
    }
    setTopicInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        age: age ? parseInt(age, 10) : null,
        care_level: careLevel,
        notes: notes.trim(),
        favorite_topics: topics,
        avatar_color: avatarColor,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save patient.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-900">Add New Patient</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="label" htmlFor="name">Patient Name</label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patient's full name"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                className="input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 78"
                min="0"
                max="120"
              />
            </div>
            <div>
              <label className="label">Care Level</label>
              <div className="flex gap-2">
                {careLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setCareLevel(level.value)}
                    className={`flex-1 rounded-xl border-2 px-3 py-3 text-base font-bold transition-all ${
                      careLevel === level.value
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Favorite Topics</label>
            <p className="mb-3 text-sm font-semibold text-slate-500">
              These topics will be used to personalize trivia questions.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border-2 px-4 py-2 text-base font-semibold transition-all ${
                    topics.includes(topic)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTopic();
                  }
                }}
                placeholder="Add a custom topic..."
              />
              <button type="button" onClick={addCustomTopic} className="btn-secondary">
                <Plus className="h-5 w-5" /> Add
              </button>
            </div>
            {topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span key={topic} className="badge bg-brand-100 text-brand-800">
                    {topic}
                    <button type="button" onClick={() => toggleTopic(topic)}>
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label" htmlFor="avatar">Avatar Color</label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`h-12 w-12 rounded-full border-4 transition-all ${
                    avatarColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorValue(color) }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="notes">Caregiver Notes</label>
            <textarea
              id="notes"
              className="input min-h-[100px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about the patient's condition, preferences, or care instructions..."
            />
          </div>

          {error && (
            <div className="rounded-xl bg-error-50 border-2 border-error-200 px-4 py-3 text-error-700 font-semibold">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t-2 border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function colorValue(color: string): string {
  const map: Record<string, string> = {
    teal: '#14b8a6',
    blue: '#3b82f6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    violet: '#8b5cf6',
    emerald: '#10b981',
  };
  return map[color] ?? '#14b8a6';
}
