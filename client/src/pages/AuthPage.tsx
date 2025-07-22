import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';
import { TeamBuildingLoader } from '@/components/loaders/TeamBuildingLoader';
import { useAuthFlow } from '@/hooks/useAuthFlow';

export function AuthPage() {
  const { isBuilding, handleAuth } = useAuthFlow();
  
  if (isBuilding) return <TeamBuildingLoader />;
  
  return (
    <AuthLayout>
      <LoginForm onSubmit={handleAuth} />
    </AuthLayout>
  );
}