import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Terminal, Check } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/admin/login');
                }, 2000);
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-terminal flex items-center justify-center p-4">
                <div className="terminal-window max-w-md w-full p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-xl font-terminal text-terminal mb-2">Password Updated!</h1>
                    <p className="text-terminal-muted text-sm">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

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
                            Set New Password
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
                            Enter your new password
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-terminal-error/10 border border-terminal-error rounded text-terminal-error text-sm font-terminal">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-terminal-muted text-sm mb-1 font-terminal">
                                New Password
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-terminal-muted text-sm mb-1 font-terminal">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-accent text-accent-foreground rounded font-terminal hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/admin/login" className="text-terminal-muted hover:text-terminal-accent font-terminal text-sm transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
