import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Github, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, isAdmin, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

    useEffect(() => {
        if (user && isAdmin) {
            navigate(from, { replace: true });
        }
    }, [user, isAdmin, navigate, from]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = isSignUp
                ? await signUpWithEmail(email, password)
                : await signInWithEmail(email, password);

            if (error) {
                setError(error.message);
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
        }
    };

    const handleGitHubLogin = async () => {
        setError('');
        const { error } = await signInWithGitHub();
        if (error) {
            setError(error.message);
        }
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
                            Admin Login
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
                            {isSignUp ? 'Create admin account' : 'Sign in to manage your portfolio'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-terminal-error/10 border border-terminal-error rounded text-terminal-error text-sm font-terminal">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-accent text-accent-foreground rounded font-terminal hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In with Email')}
                        </button>
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-terminal text-terminal-muted font-terminal">or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-2 bg-secondary border border-border rounded font-terminal text-terminal hover:bg-accent/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>

                        <button
                            onClick={handleGitHubLogin}
                            className="w-full py-2 bg-secondary border border-border rounded font-terminal text-terminal hover:bg-accent/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-terminal-accent hover:underline font-terminal text-sm"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
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
