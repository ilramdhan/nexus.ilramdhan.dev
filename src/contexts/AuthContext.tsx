import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithGitHub: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get allowed admin emails from environment variable
const getAllowedEmails = (): string[] => {
    const emailsEnv = import.meta.env.VITE_ALLOWED_ADMIN_EMAILS || '';
    return emailsEnv.split(',').map((email: string) => email.trim().toLowerCase()).filter(Boolean);
};

const isEmailAllowed = (email: string | undefined): boolean => {
    if (!email) return false;
    const allowedEmails = getAllowedEmails();
    // If no allowed emails configured, allow all authenticated users
    if (allowedEmails.length === 0) return true;
    return allowedEmails.includes(email.toLowerCase());
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAdmin(isEmailAllowed(session?.user?.email));
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAdmin(isEmailAllowed(session?.user?.email));
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        // Check if email is allowed before attempting login
        if (!isEmailAllowed(email)) {
            return { error: new Error('This email is not authorized to access the admin panel.') };
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? new Error(error.message) : null };
    };

    const signUpWithEmail = async (email: string, password: string) => {
        // Check if email is allowed before attempting signup
        if (!isEmailAllowed(email)) {
            return { error: new Error('This email is not authorized to create an admin account.') };
        }

        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error ? new Error(error.message) : null };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/admin/callback`,
            },
        });
        return { error: error ? new Error(error.message) : null };
    };

    const signInWithGitHub = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/admin/callback`,
            },
        });
        return { error: error ? new Error(error.message) : null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                isAdmin,
                signInWithEmail,
                signUpWithEmail,
                signInWithGoogle,
                signInWithGitHub,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
