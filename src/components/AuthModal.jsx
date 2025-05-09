import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_BASE = import.meta.env.VITE_API_BASE;

const AuthModal = ({ type, onClose, onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchSearchHistory, login } = useContext(UserContext);

  const showSuccessAlert = (message) => {
    MySwal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      background: '#fff',
      color: '#1f2937',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      position: 'top-end',
      width: '20rem',
      padding: '0.75rem',
      customClass: {
        popup: 'text-sm rounded-md',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInRight animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight animate__faster',
      },
    });
  };

  const showErrorAlert = (message) => {
    MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      background: '#fff',
      color: '#1f2937',
      confirmButtonColor: '#3b82f6',
      width: '20rem',
      padding: '0.75rem',
      customClass: {
        popup: 'text-sm rounded-md',
      },
      showClass: {
        popup: 'animate__animated animate__headShake',
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = type === 'signup' ? '/api/signup' : '/api/login';
    const payload = { username, password };

    if (type === 'signup') {
      if (password !== confirmPassword) {
        showErrorAlert('Passwords do not match');
        setIsLoading(false);
        return;
      }
      payload.confirmPassword = confirmPassword;
    }

    try {
      const res = await fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorAlert(data.message || 'Something went wrong');
        setIsLoading(false);
      } else {
        localStorage.setItem('username', username);
        await fetchSearchHistory(); // Load search history from backend
        login(username); // Update user context
        onAuth(username); // Optional additional update

        showSuccessAlert(
          type === 'login'
            ? 'You have successfully logged in!'
            : 'Your account has been created!'
        );

        onClose();
      }
    } catch (err) {
      showErrorAlert('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {type === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 mt-1">
                {type === 'login' ? 'Sign in to continue' : 'Start your journey'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {type === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md flex items-center justify-center ${
                isLoading ? 'opacity-90 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {type === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                type === 'login' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              {type === 'login'
                ? 'Not ready to sign in?'
                : 'Already have an account?'}{' '}
              <span className="text-blue-600 hover:underline">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;