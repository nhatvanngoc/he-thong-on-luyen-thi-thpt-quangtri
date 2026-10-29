import React, { useState } from 'react';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';
import { loginAccount, registerAccount } from '../../services/firebase';

export const AccountGate: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const cleanName = name.trim().normalize('NFC');
    if (cleanName.length < 2 || cleanName.length > 50) {
      setError('Tên cần có từ 2 đến 50 ký tự.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu cần có ít nhất 6 ký tự.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'register') await registerAccount(cleanName, password);
      else await loginAccount(cleanName, password);
    } catch (cause) {
      const code = (cause as { code?: string })?.code;
      setError(code === 'auth/email-already-in-use'
        ? 'Tên này đã được đăng ký. Hãy đăng nhập hoặc chọn tên khác.'
        : code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
        ? 'Tên hoặc mật khẩu chưa đúng.'
        : code === 'auth/weak-password'
        ? 'Mật khẩu cần có ít nhất 6 ký tự.'
        : cause instanceof Error ? cause.message : 'Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-center text-2xl font-extrabold">Tài khoản ôn luyện</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Dùng cùng tên và mật khẩu trên các thiết bị.</p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-800 p-1">
          <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${mode === 'login' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
            <LogIn className="mr-1.5 inline h-4 w-4" />Đăng nhập
          </button>
          <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${mode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
            <UserPlus className="mr-1.5 inline h-4 w-4" />Tạo tài khoản
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Tên tài khoản
            <input autoComplete="username" value={name} onChange={(event) => setName(event.target.value)} required maxLength={50} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Nhập tên của bạn" />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Mật khẩu
            <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500" placeholder="Ít nhất 6 ký tự" />
          </label>
          {error && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>
        {mode === 'register' && <p className="mt-4 text-center text-xs text-slate-500">Tên tài khoản không phân biệt chữ hoa, chữ thường và không được trùng.</p>}
      </section>
    </main>
  );
};
