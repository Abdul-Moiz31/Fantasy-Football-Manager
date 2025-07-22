import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/contexts/TeamContext';
import { teamApi } from '@/services/api';
import { ROUTES } from '@/constants';

export const useAuthFlow = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const { user, unifiedAuth } = useAuth();
  const { setTeam } = useTeam();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isBuilding) {
      navigate(ROUTES.HOME);
    }
  }, [user, isBuilding, navigate]);

  // Poll for team completion
  useEffect(() => {
    if (!isBuilding) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await teamApi.getMyTeam();
        if (response.success && response.data?.players?.length > 0) {
          setTeam(response.data);
          setIsBuilding(false);
          navigate(ROUTES.HOME);
        }
      } catch (err) {
        console.error('Error checking team status:', err);
        setIsBuilding(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isBuilding, navigate, setTeam]);

  const handleAuth = async (formData: { email: string; password: string }) => {
    const result = await unifiedAuth(formData);
    const team = (result as any)?.data?.team;
    
    if (result.success && team) {
      if (!team.players || team.players.length === 0) {
        setTeam(team);
        setIsBuilding(true);
      } else {
        setTeam(team);
        navigate(ROUTES.HOME);
      }
    }
    
    return result;
  };

  return {
    isBuilding,
    handleAuth,
  };
}; 