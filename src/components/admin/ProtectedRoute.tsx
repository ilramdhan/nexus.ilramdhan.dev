import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-terminal flex items-center justify-center">
                <div className="text-terminal-accent font-terminal">
                    <span className="animate-pulse">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // User is authenticated but not an admin
        return (
            <div className="min-h-screen bg-terminal flex items-center justify-center p-4">
                <div className="terminal-window max-w-md w-full p-8 text-center">
                    <h1 className="text-terminal-error text-xl font-terminal mb-4">Access Denied</h1>
                    <p className="text-terminal-muted mb-6">
                        Your account ({user.email}) is not authorized to access the admin panel.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 bg-secondary text-terminal-accent border border-border rounded hover:bg-accent/10 transition-all font-terminal"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
