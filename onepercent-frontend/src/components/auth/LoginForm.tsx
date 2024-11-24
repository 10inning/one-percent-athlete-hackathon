// src/components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/store/userAuth';
import { AtSign, KeyRound, Loader2, Github, Chrome } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setUser(userCredential.user);
      setToken(token);
      localStorage.setItem('auth-token', token);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : 'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/50 backdrop-blur-sm border-b border-gray-200">
       
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-gray-500">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 p-4 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                               bg-white/50  transition duration-200
                               placeholder-gray-400 text-gray-900"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl 
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                               bg-white/50 transition duration-200
                               placeholder-gray-400 text-gray-900"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Stay signed in
                  </label>
                </div>

                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
                           bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                           text-white text-sm font-semibold shadow-lg shadow-indigo-500/30
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    'Sign in to your account'
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 
                             rounded-xl bg-white hover:bg-gray-50 transition duration-200"
                  >
                    <Chrome className="h-5 w-5 text-gray-700" />
                    <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 
                             rounded-xl bg-white hover:bg-gray-50 transition duration-200"
                  >
                    <Github className="h-5 w-5 text-gray-700" />
                    <span className="ml-2 text-sm font-medium text-gray-700">GitHub</span>
                  </button>
                </div>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create one now
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Background Image/Pattern */}
        <div className="hidden lg:block lg:w-[55%] bg-gradient-to-br from-indigo-500 to-blue-600 relative overflow-hidden">



  <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:16px_16px]" />
  <div className="absolute h-full w-full flex items-center justify-center p-8">
    <div className="max-w-md text-center">


    <div className="relative z-50 text-white text-4xl font-bold mb-4 tracking-wider">
  Welcome to <span className="text-yellow-400">One Percent Athlete</span>
</div>
<p className="relative z-50 text-red-100 text-lg italic mb-6">
  "Unlock your potential and push beyond your limits. It's not just a brand; it's a mindset."
</p>




    </div>
  </div>
  {/* Overlay for enhanced visuals */}
  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-blue-600/30" />
  {/* Add decorative athletic visual elements */}
  <div className="absolute bottom-20 left-0 w-full flex justify-center">
    <img
      src="https://i.ibb.co/YQFXL71/logo.png"
      alt="Athlete Silhouette"
      className="h-90 w-auto opacity-15"
    />
  </div>
</div>

      </div>
    </div>
  );
}