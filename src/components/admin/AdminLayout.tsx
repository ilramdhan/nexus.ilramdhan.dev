import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Briefcase,
    Wrench,
    Award,
    Code2,
    MessageSquare,
    Settings,
    LogOut,
    Terminal,
    ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { path: '/admin/resume', icon: Briefcase, label: 'Resume' },
    { path: '/admin/services', icon: Wrench, label: 'Services' },
    { path: '/admin/certificates', icon: Award, label: 'Certificates' },
    { path: '/admin/tech-stack', icon: Code2, label: 'Tech Stack' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-terminal flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-border">
                    <Link to="/" className="flex items-center gap-2 text-terminal-accent hover:opacity-80 transition-opacity">
                        <Terminal className="w-6 h-6" />
                        <span className="font-terminal text-lg">Portfolio CMS</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path, item.exact);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded font-terminal text-sm transition-all ${active
                                        ? 'bg-accent/20 text-terminal-accent'
                                        : 'text-terminal-muted hover:bg-secondary hover:text-terminal'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info & Logout */}
                <div className="p-4 border-t border-border">
                    <div className="text-terminal-muted text-xs font-terminal mb-2 truncate">
                        {user?.email}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-terminal-error hover:bg-terminal-error/10 rounded font-terminal text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
