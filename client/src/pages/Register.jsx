import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 card">
      <h2 className="text-2xl font-bold">Create Account</h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <input className="input mt-4" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="input mt-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="input mt-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary w-full mt-4" onClick={submit} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <p className="text-sm mt-3">
        Already have an account? <a className="underline" href="/login">Login</a>
      </p>
    </div>
  );
}
