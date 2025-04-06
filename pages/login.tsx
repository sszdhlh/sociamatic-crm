import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { authService } from '../services/api';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login page
 */
const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset login state and local storage
  const resetLoginState = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.reload(); // Refresh page to reset authentication state
  };

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    } else {
      // Check if we have stored email
      const storedEmail = localStorage.getItem('rememberedEmail');
      if (storedEmail) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to login with email: ${email}`);
      
      // Call authentication context login method
      const user = await login(email, password);
      
      // Remember email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Manually redirect to homepage after successful login
      console.log('Login successful, redirecting to homepage');
      router.push('/');
    } catch (err: any) {
      console.error('Login error details:', err);
      
      // Enhanced error handling with better network error support
      if (err.message?.includes('Unable to connect to server') || err.message === 'Network Error') {
        setError('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (err.response?.status === 404) {
        setError('User not found. Please check your email or register a new account.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later or contact support.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Added for testing purpose
  const testLoginNow = () => {
    setEmail('test@example.com');
    setPassword('password');
  };

  return (
    <>
      <Head>
        <title>Login | Sociamatic CRM</title>
        <meta name="description" content="Login to Sociamatic CRM system" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
        <div className="text-center mb-10 max-w-md px-4">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Sociamatic CRM</h1>
          <p className="text-gray-600 mt-3 text-lg">Customer Relationship Management System</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember email
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <Link href="/register" className="text-blue-500 hover:underline ml-1">
                Register new account
              </Link>
            </p>
          </div>
          
          {/* Debug buttons */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={resetLoginState}
              className="text-sm text-red-500 hover:underline"
            >
              Reset Login State
            </button>
            <button
              onClick={testLoginNow}
              className="text-sm text-blue-500 hover:underline"
            >
              Use Test Account
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Need help? Contact <a href="mailto:support@sociamatic.com" className="text-blue-500 hover:underline">support@sociamatic.com</a></p>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 