'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { email } = JSON.parse(userData);
      setUserEmail(email);
    }

    // Start resend countdown
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Clear error when user types
    if (error) setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 4) {
      setError('Lütfen 4 haneli doğrulama kodunu girin.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Demo verification code: 1234
      if (code === '1234') {
        setSuccess(true);
        setIsLoading(false);
        
        // Mark user as verified
        localStorage.setItem('isEmailVerified', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Doğrulama kodu hatalı. Lütfen tekrar deneyin.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card>
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">E-posta Doğrulandı!</h2>
              <p className="text-gray-600 mb-6">
                Hesabınız başarıyla doğrulandı. Dashboard'a yönlendiriliyorsunuz...
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Demo:</strong> Gerçek bir e-posta doğrulaması yapılmaz.
                </p>
              </div>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Dashboard'a Git
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">MelikShop</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">E-posta Doğrulama</h1>
          <p className="text-gray-600">
            {userEmail} adresine gönderdiğimiz 4 haneli kodu girin
          </p>
        </div>

        {/* Verification Form */}
        <Card>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Verification Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Doğrulama Kodu
                </label>
                <div className="flex space-x-3 justify-center">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Demo kodu: <strong>1234</strong>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || verificationCode.join('').length !== 4}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Doğrulanıyor...
                  </div>
                ) : (
                  'Doğrula'
                )}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Kod gelmedi mi?
              </p>
              <button
                onClick={handleResend}
                disabled={resendCountdown > 0}
                className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendCountdown > 0 
                  ? `${resendCountdown} saniye sonra tekrar gönder` 
                  : 'Tekrar gönder'
                }
              </button>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Giriş sayfasına dön
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Doğrulama kodu 5 dakika içinde geçerliliğini yitirir.</p>
        </div>
      </div>
    </div>
  );
} 