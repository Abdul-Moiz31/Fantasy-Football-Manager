import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AuthStats } from '@/components/auth/AuthStats';

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
    const emailError = !formData.email ? "Email is required" : 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "Please enter a valid email address" : "";
    const passwordError = !formData.password ? "Password is required" : 
      formData.password.length < 6 ? "Password must be at least 6 characters long" : "";
    
    setValidationErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-[#E0E0E0]">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4 lg:hidden">
          <img src="/football.svg" alt="Football" className="w-10 h-10" />
        </div>
        <CardTitle className="text-2xl text-[#424242] mb-2">Welcome Back</CardTitle>
        <p className="text-[#424242]/70">Sign in to your account</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-[#424242] font-medium">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#424242]/50 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32] ${
                  validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.email}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-[#424242] font-medium">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#424242]/50 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-12 border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-[#2E7D32] ${
                  validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#424242]/50 hover:text-[#424242] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.password}
              </p>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] hover:bg-[#43A047] text-white font-semibold py-3 transition-all duration-200 disabled:bg-[#E0E0E0] disabled:text-[#424242]/50"
          >
            {loading ? (
              <div className="flex items-center gap-2">Signing in...</div>
            ) : (
              <div className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
        
        {/* Footer Stats */}
        <div className="mt-8 pt-6 border-t border-[#E0E0E0]">
          <AuthStats />
        </div>
      </CardContent>
    </Card>
  );
} 