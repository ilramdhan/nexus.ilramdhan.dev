import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
    const { user, loading, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user && isAdmin) {
                navigate('/admin', { replace: true });
            } else if (user && !isAdmin) {
                navigate('/admin/login', { replace: true });
            } else {
                navigate('/admin/login', { replace: true });
            }
        }
    }, [user, loading, isAdmin, navigate]);

    return (
        <div className="min-h-screen bg-terminal flex items-center justify-center">
            <div className="text-center">
                <div className="text-terminal-accent font-terminal mb-4">
                    <span className="animate-pulse">Authenticating...</span>
                </div>
                <div className="text-terminal-muted text-sm font-terminal">
                    Please wait while we verify your credentials
                </div>
            </div>
        </div>
    );
}
