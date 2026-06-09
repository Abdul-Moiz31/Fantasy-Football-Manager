import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<any>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const emailError = !formData.email
      ? 'Email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? 'Please enter a valid email'
      : '';
    const passwordError = !formData.password
      ? 'Password is required'
      : formData.password.length < 6
      ? 'Password must be at least 6 characters'
      : '';

    setValidationErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-[#E0E0E0] bg-white">
      <CardHeader className="text-center pb-2 pt-8">
        {/* Mobile logo */}
        <div className="w-14 h-14 bg-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-5 lg:hidden">
          <img src="/football.svg" alt="Football" className="w-9 h-9" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#212121]">Welcome</CardTitle>
        <p className="text-sm text-[#424242]/60 mt-2">
          Enter your email and password to sign in or create an account
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        {/* Auto-account hint */}
        <div className="mb-5 flex items-center gap-2.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl p-3">
          <Zap className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
          <p className="text-xs text-[#2E7D32] font-medium">
            New user? Your account and squad are created automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-[#424242] font-medium text-sm">
              Email address
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424242]/40 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 text-sm border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32] ${
                  validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="you@example.com"
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-[#424242] font-medium text-sm">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424242]/40 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-12 text-sm border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32] ${
                  validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#424242]/40 hover:text-[#424242] transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Server error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:bg-[#E0E0E0] disabled:text-[#424242]/50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-[#424242]/50 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}
