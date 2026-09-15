import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@swadha.edu' && password === 'admin') {
        sessionStorage.setItem('adminToken', 'mock-token');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Use admin@swadha.edu / admin');
      }
    }, 800);
  };

  return (
    <section className="grid lg:grid-cols-2 min-h-[70vh]">
      <div
        className="relative hidden lg:block min-h-[560px] bg-cover bg-center"
        style={{ backgroundImage: "url('/slides/slide-4.jpg')" }}
      >
        <div className="absolute inset-0 bg-swadha-dark/70" />
        <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
          <p className="text-swadha-green text-xs font-semibold uppercase tracking-[0.2em]">Staff access</p>
          <h1 className="font-heading text-4xl font-bold mt-3 leading-tight">
            Keep every common machine accountable.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            Sign in to review live sessions, update machine status, and close student-reported issues.
          </p>
        </div>
      </div>

      <div className="bg-white flex items-center justify-center px-6 py-16">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          <div>
            <p className="text-swadha-orange text-xs font-semibold uppercase tracking-[0.18em]">Admin portal</p>
            <h2 className="font-heading text-3xl font-bold text-swadha-dark mt-2">Sign in</h2>
            <p className="text-sm text-swadha-gray mt-2">Centre coordinators and lab staff only.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 border border-red-100">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="admin@swadha.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </section>
  );
}
