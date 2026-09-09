import { useState, useCallback } from 'react';
import { Brain, Sparkles, Check, X, RotateCcw, Trophy, Star, MessageSquareHeart } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useTriviaRounds } from '@/hooks/useTriviaRounds';
import { generateTrivia, availableTopics, type TriviaQuestion } from '@/lib/triviaData';
import type { TriviaRoundInsert } from '@/types';

const colorMap: Record<string, string> = {
  teal: '#14b8a6',
  blue: '#3b82f6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  emerald: '#10b981',
};

type Phase = 'setup' | 'playing' | 'feedback' | 'finished';

export default function MemoryAssistant() {
  const { patients, loading, error } = usePatients();
  const { addRound } = useTriviaRounds();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [engagement, setEngagement] = useState<number>(3);
  const [saving, setSaving] = useState(false);

  const patient = patients.find((p) => p.id === selectedPatient);

  const startTrivia = useCallback(() => {
    if (!selectedPatient) return;
    const topics: string[] = [];
    if (selectedTopic) topics.push(selectedTopic);
    if (patient?.favorite_topics) {
      topics.push(...patient.favorite_topics.filter((t) => t !== selectedTopic));
    }
    const trivia = generateTrivia(topics.length > 0 ? topics : availableTopics, 5);
    setQuestions(trivia);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPhase('playing');
  }, [selectedPatient, selectedTopic, patient]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentQ].correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setPhase('feedback');
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const finishRound = async () => {
    if (!selectedPatient || !selectedTopic) return;
    setSaving(true);
    try {
      await addRound({
        patient_id: selectedPatient,
        topic: selectedTopic,
        question_count: questions.length,
        correct_count: correctCount,
        engagement_score: (engagement / 5) * 100,
      });
    } catch {
      // don't block the experience on save failure
    } finally {
      setSaving(false);
    }
    setPhase('finished');
  };

  const reset = () => {
    setPhase('setup');
    setSelectedTopic(null);
    setQuestions([]);
    setEngagement(3);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-semibold text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-error-50 border-2 border-error-200 px-4 py-3 text-error-700 font-semibold">
        {error}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="card-pad text-center">
        <Brain className="mx-auto h-16 w-16 text-slate-300" />
        <h3 className="mt-4 text-xl font-bold text-slate-700">No patients available</h3>
        <p className="mt-1 text-lg font-semibold text-slate-500">
          Please add a patient from the Caregiver Dashboard first.
        </p>
      </div>
    );
  }

  const allTopics = Array.from(new Set([...availableTopics, ...(patient?.favorite_topics ?? [])]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Memory Assistant</h1>
        <p className="mt-1 text-lg font-semibold text-slate-500">
          Generate personalized trivia to spark memories and conversation
        </p>
      </div>

      {/* Setup Phase */}
      {phase === 'setup' && (
        <div className="space-y-6 animate-fade-in">
          {/* Select Patient */}
          <div>
            <p className="label">1. Select Patient</p>
            <div className="flex flex-wrap gap-3">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p.id)}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                    selectedPatient === p.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-slate-300 bg-white hover:border-brand-400'
                  }`}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: colorMap[p.avatar_color] ?? '#14b8a6' }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-bold text-slate-900">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Topic */}
          {selectedPatient && (
            <div className="animate-fade-in">
              <p className="label">2. Choose a Memory Topic</p>
              {patient?.favorite_topics && patient.favorite_topics.length > 0 && (
                <p className="mb-3 text-base font-semibold text-brand-700">
                  Recommended topics for {patient.name}: {patient.favorite_topics.join(', ')}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`rounded-full border-2 px-5 py-3 text-lg font-bold transition-all ${
                      selectedTopic === topic
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {selectedPatient && selectedTopic && (
            <div className="animate-fade-in">
              <button onClick={startTrivia} className="btn-accent text-xl">
                <Sparkles className="h-6 w-6" /> Generate Trivia Questions
              </button>
            </div>
          )}

          {!selectedPatient && (
            <div className="card-pad text-center">
              <Brain className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-lg font-semibold text-slate-500">
                Select a patient above to begin
              </p>
            </div>
          )}
        </div>
      )}

      {/* Playing Phase */}
      {phase === 'playing' && questions.length > 0 && (
        <div className="card-pad animate-fade-in">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">
                  QUESTION {currentQ + 1} OF {questions.length}
                </p>
                <p className="text-lg font-bold text-slate-900 capitalize">{selectedTopic}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-8 rounded-full ${i <= currentQ ? 'bg-brand-500' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 text-balance">
              {questions[currentQ].question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions[currentQ].options.map((option, i) => {
              const isCorrect = i === questions[currentQ].correctIndex;
              const isSelected = i === selectedAnswer;
              let style = 'border-slate-300 bg-white text-slate-900 hover:border-brand-400';
              if (showResult) {
                if (isCorrect) {
                  style = 'border-success-500 bg-success-50 text-success-800';
                } else if (isSelected) {
                  style = 'border-error-500 bg-error-50 text-error-800';
                } else {
                  style = 'border-slate-200 bg-slate-50 text-slate-400';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={`flex items-center justify-between rounded-xl border-2 px-5 py-4 text-lg font-bold transition-all ${style}`}
                >
                  <span>{option}</span>
                  {showResult && isCorrect && <Check className="h-6 w-6 text-success-600" />}
                  {showResult && isSelected && !isCorrect && <X className="h-6 w-6 text-error-600" />}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 animate-fade-in">
              <div
                className={`rounded-xl border-2 p-4 ${
                  selectedAnswer === questions[currentQ].correctIndex
                    ? 'border-success-300 bg-success-50'
                    : 'border-brand-200 bg-brand-50'
                }`}
              >
                <p className="text-lg font-bold text-slate-900">
                  {selectedAnswer === questions[currentQ].correctIndex
                    ? 'Correct! Great memory!'
                    : 'Not quite, but here is something interesting:'}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-700">
                  {questions[currentQ].fact}
                </p>
              </div>
              <button onClick={nextQuestion} className="btn-primary mt-4">
                {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Feedback Phase */}
      {phase === 'feedback' && (
        <div className="card-pad text-center animate-fade-in">
          <MessageSquareHeart className="mx-auto h-16 w-16 text-accent-500" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            How was the session with {patient?.name}?
          </h2>
          <p className="mt-1 text-lg font-semibold text-slate-500">
            Rate the patient's engagement and responsiveness
          </p>

          <div className="my-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setEngagement(star)}
                className="p-2"
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-12 w-12 transition-all ${
                    star <= engagement ? 'fill-accent-400 text-accent-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-50 p-4">
              <p className="text-3xl font-bold text-brand-700">
                {correctCount}/{questions.length}
              </p>
              <p className="text-base font-semibold text-slate-600">Correct Answers</p>
            </div>
            <div className="rounded-xl bg-accent-50 p-4">
              <p className="text-3xl font-bold text-accent-700">
                {Math.round((correctCount / questions.length) * 100)}%
              </p>
              <p className="text-base font-semibold text-slate-600">Accuracy</p>
            </div>
          </div>

          <button onClick={finishRound} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Session'}
          </button>
        </div>
      )}

      {/* Finished Phase */}
      {phase === 'finished' && (
        <div className="card-pad text-center animate-pop">
          <Trophy className="mx-auto h-20 w-20 text-accent-500" />
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Session Complete!</h2>
          <p className="mt-2 text-lg font-semibold text-slate-500">
            {patient?.name} answered {correctCount} out of {questions.length} questions correctly.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 ${
                  star <= engagement ? 'fill-accent-400 text-accent-400' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <button onClick={reset} className="btn-primary mt-6">
            <RotateCcw className="h-5 w-5" /> Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
