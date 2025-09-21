import { useState } from 'react';
import { api } from '../lib/api';

export default function ChatAdvisor() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!query.trim()) return;
    setAnswer('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/chat', { query });
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("AI failed to respond. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-2">AI Career Advisor</h3>
      <textarea
        className="input h-28 w-full"
        placeholder="Ask anything about careers, skills, roadmap…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        className="btn btn-primary mt-3"
        onClick={ask}
        disabled={loading}
      >
        {loading ? 'Thinking…' : 'Get Advice'}
      </button>
      {answer && (
        <div className="mt-4 prose max-w-none whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}
