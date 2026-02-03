import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export const ResetPasswordGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid URL or token. Redirecting to login page...');
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
};