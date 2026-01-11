import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
    FolderKanban,
    FileText,
    Briefcase,
    MessageSquare,
    Award,
    Code2,
    Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    href: string;
    loading?: boolean;
}

function StatCard({ title, value, icon: Icon, href, loading }: StatCardProps) {
    return (
        <Link
            to={href}
            className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-terminal-muted text-sm font-terminal">{title}</p>
                    <p className="text-3xl font-terminal text-terminal mt-2">
                        {loading ? '...' : value}
                    </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-terminal-accent" />
                </div>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const { data: projectCount, isLoading: loadingProjects } = useQuery({
        queryKey: ['admin-projects-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true });
            return count || 0;
        },
    });

    const { data: blogCount, isLoading: loadingBlogs } = useQuery({
        queryKey: ['admin-blogs-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('blogs')
                .select('*', { count: 'exact', head: true });
            return count || 0;
        },
    });

    const { data: resumeCount, isLoading: loadingResume } = useQuery({
        queryKey: ['admin-resume-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('resume')
                .select('*', { count: 'exact', head: true });
            return count || 0;
        },
    });

    const { data: messageCount, isLoading: loadingMessages } = useQuery({
        queryKey: ['admin-messages-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false);
            return count || 0;
        },
    });

    const { data: certCount, isLoading: loadingCerts } = useQuery({
        queryKey: ['admin-certs-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('certificates')
                .select('*', { count: 'exact', head: true });
            return count || 0;
        },
    });

    const { data: techCount, isLoading: loadingTech } = useQuery({
        queryKey: ['admin-tech-count'],
        queryFn: async () => {
            const { count } = await supabase
                .from('tech_stack')
                .select('*', { count: 'exact', head: true });
            return count || 0;
        },
    });

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Dashboard</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">
                            Welcome back! Here's an overview of your portfolio.
                        </p>
                    </div>
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded hover:bg-accent/10 transition-colors font-terminal text-sm text-terminal"
                    >
                        <Eye className="w-4 h-4" />
                        View Portfolio
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Projects"
                        value={projectCount ?? 0}
                        icon={FolderKanban}
                        href="/admin/projects"
                        loading={loadingProjects}
                    />
                    <StatCard
                        title="Blog Posts"
                        value={blogCount ?? 0}
                        icon={FileText}
                        href="/admin/blogs"
                        loading={loadingBlogs}
                    />
                    <StatCard
                        title="Resume Entries"
                        value={resumeCount ?? 0}
                        icon={Briefcase}
                        href="/admin/resume"
                        loading={loadingResume}
                    />
                    <StatCard
                        title="Unread Messages"
                        value={messageCount ?? 0}
                        icon={MessageSquare}
                        href="/admin/messages"
                        loading={loadingMessages}
                    />
                    <StatCard
                        title="Certificates"
                        value={certCount ?? 0}
                        icon={Award}
                        href="/admin/certificates"
                        loading={loadingCerts}
                    />
                    <StatCard
                        title="Tech Stack"
                        value={techCount ?? 0}
                        icon={Code2}
                        href="/admin/tech-stack"
                        loading={loadingTech}
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-terminal text-terminal mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/admin/projects?action=new"
                            className="px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm hover:opacity-90 transition-opacity"
                        >
                            + New Project
                        </Link>
                        <Link
                            to="/admin/blogs?action=new"
                            className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm hover:bg-accent/10 transition-colors"
                        >
                            + New Blog Post
                        </Link>
                        <Link
                            to="/admin/settings"
                            className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm hover:bg-accent/10 transition-colors"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
