import { useCallback, useEffect, useRef, useState } from 'react';
import type { Question } from '@personalidad/core';
import { api } from './services/api';
import { Background } from './components/Background';
import { OnlineUsersPanel } from './components/OnlineUsersPanel';
import { LoginView } from './components/LoginView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { AdminApp } from './admin/AdminApp';

type Screen = 'login' | 'quiz' | 'result';

const HEARTBEAT_MS = 60000;

function isAdminRoute(): boolean {
  return window.location.hash.toLowerCase().startsWith('#/admin');
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const onHash = () => setIsAdmin(isAdminRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [submitting, setSubmitting] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const answersRef = useRef(answers);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    api
      .getQuestions()
      .then((res) => setQuestions(res.questions))
      .catch(() => {});
  }, []);

  async function handleStart(name: string, email?: string) {
    setUser({ name, email });
    setCurrentIndex(0);
    setAnswers({});
    try {
      const res = await api.startSession(name, email);
      setSessionId(res.sessionId);
    } catch {
      // Sin seguimiento si la API no está disponible, pero el test continúa.
      setSessionId(null);
    }
    setScreen('quiz');
  }

  // Latido: mantiene al usuario "online" mientras está en el test.
  useEffect(() => {
    if (screen !== 'quiz') return;
    const beat = () => {
      if (sessionIdRef.current) api.heartbeat(sessionIdRef.current).catch(() => {});
    };
    beat();
    const id = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [screen]);

  const handleSelect = useCallback((value: 'A' | 'B') => {
    setAnswers((prev) => ({ ...prev, [currentIndex + 1]: value }));
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i < questions.length - 1 ? i + 1 : i));
  }, [questions.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const finalAnswers = answersRef.current;
    if (sessionIdRef.current) {
      await api.complete(sessionIdRef.current, finalAnswers).catch(() => {});
    }
    setSubmitting(false);
    setScreen('result');
  }, []);

  function handleRestart() {
    setScreen('login');
    setSessionId(null);
    setUser(null);
    setAnswers({});
    setCurrentIndex(0);
  }

  function handleClose() {
    setScreen('quiz');
  }

  if (isAdmin) {
    return (
      <AdminApp
        onExit={() => {
          window.location.hash = '';
          setIsAdmin(false);
        }}
      />
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "url('/img/fondo.png')" }}
    >
      <Background />
      <OnlineUsersPanel />

      {screen === 'login' && <LoginView onStart={handleStart} />}

      {screen === 'quiz' && (
        <QuizView
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          onSelect={handleSelect}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {screen === 'result' && user && (
        <ResultView
          answers={answers}
          name={user.name}
          email={user.email}
          onClose={handleClose}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
