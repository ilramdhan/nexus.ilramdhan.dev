import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Terminal, Mail, KeyRound } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<AuthMode>('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { user, isAdmin, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

    useEffect(() => {
        if (user && isAdmin) {
            navigate(from, { replace: true });
        }
    }, [user, isAdmin, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (mode === 'reset') {
                // Send password reset email
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/admin/reset-password`,
                });
                if (error) {
                    setError(error.message);
                } else {
                    setSuccessMessage('Password reset email sent! Check your inbox and click the link to set a new password.');
                }
            } else if (mode === 'signup') {
                const { error } = await signUpWithEmail(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccessMessage('Account created! Check your email for confirmation link, then login.');
                    setMode('login');
                }
            } else {
                const { error } = await signInWithEmail(email, password);
                if (error) {
                    setError(error.message);
                }
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="min-h-screen bg-terminal flex items-center justify-center p-4 scan-lines">
            <div className="terminal-window max-w-md w-full">
                <div className="terminal-header">
                    <div className="flex items-center">
                        <div className="terminal-button close"></div>
                        <div className="terminal-button minimize"></div>
                        <div className="terminal-button maximize"></div>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-terminal-muted text-sm font-medium">
                            {mode === 'reset' ? 'Reset Password' : mode === 'signup' ? 'Sign Up' : 'Admin Login'}
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-terminal-accent hover:text-terminal transition-colors">
                            <Terminal className="w-8 h-8" />
                            <span className="text-xl font-terminal">Portfolio CMS</span>
                        </Link>
                        <p className="text-terminal-muted text-sm mt-2">
                            {mode === 'reset'
                                ? 'Enter your email to reset password'
                                : mode === 'signup'
                                    ? 'Create admin account'
                                    : 'Sign in to manage your portfolio'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-terminal-error/10 border border-terminal-error rounded text-terminal-error text-sm font-terminal">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-3 bg-green-500/10 border border-green-500 rounded text-green-500 text-sm font-terminal">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="email" className="block text-terminal-muted text-sm mb-1 font-terminal">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {mode !== 'reset' && (
                            <div>
                                <label htmlFor="password" className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-accent text-accent-foreground rounded font-terminal hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {mode === 'reset' ? <KeyRound className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                            {loading
                                ? 'Please wait...'
                                : mode === 'reset'
                                    ? 'Send Reset Link'
                                    : mode === 'signup'
                                        ? 'Create Account'
                                        : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center space-y-3">
                        {mode === 'login' && (
                            <>
                                <button
                                    onClick={() => switchMode('reset')}
                                    className="text-terminal-muted hover:text-terminal-accent font-terminal text-sm block w-full"
                                >
                                    Forgot password? (Or set password for OAuth account)
                                </button>
                                <button
                                    onClick={() => switchMode('signup')}
                                    className="text-terminal-accent hover:underline font-terminal text-sm"
                                >
                                    Don't have an account? Sign up
                                </button>
                            </>
                        )}

                        {mode === 'signup' && (
                            <button
                                onClick={() => switchMode('login')}
                                className="text-terminal-accent hover:underline font-terminal text-sm"
                            >
                                Already have an account? Sign in
                            </button>
                        )}

                        {mode === 'reset' && (
                            <button
                                onClick={() => switchMode('login')}
                                className="text-terminal-accent hover:underline font-terminal text-sm"
                            >
                                Back to login
                            </button>
                        )}

                        <div className="pt-4 border-t border-border">
                            <p className="text-terminal-muted text-xs">
                                Only emails listed in VITE_ALLOWED_ADMIN_EMAILS can access the admin panel.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-terminal-muted hover:text-terminal-accent font-terminal text-sm transition-colors">
                            ← Back to Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
