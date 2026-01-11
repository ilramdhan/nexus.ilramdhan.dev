import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types/database';
import { Plus, Pencil, Trash2, ExternalLink, Github, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        short_description: '',
        content: '',
        tech_stack: '',
        tags: '',
        demo_url: '',
        repo_url: '',
        is_featured: false,
    });

    const { data: projects, isLoading } = useQuery({
        queryKey: ['admin-projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Project[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('projects').insert({
                user_id: user?.id,
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                short_description: data.short_description,
                content: data.content,
                tech_stack: data.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
                tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
                demo_url: data.demo_url || null,
                repo_url: data.repo_url || null,
                is_featured: data.is_featured,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            toast.success('Project created successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to create project: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const { error } = await supabase
                .from('projects')
                .update({
                    title: data.title,
                    slug: data.slug,
                    short_description: data.short_description,
                    content: data.content,
                    tech_stack: data.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
                    tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
                    demo_url: data.demo_url || null,
                    repo_url: data.repo_url || null,
                    is_featured: data.is_featured,
                })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            toast.success('Project updated successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to update project: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            toast.success('Project deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete project: ${error.message}`);
        },
    });

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            slug: '',
            short_description: '',
            content: '',
            tech_stack: '',
            tags: '',
            demo_url: '',
            repo_url: '',
            is_featured: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            slug: project.slug || '',
            short_description: project.short_description || '',
            content: project.content || '',
            tech_stack: project.tech_stack?.join(', ') || '',
            tags: project.tags?.join(', ') || '',
            demo_url: project.demo_url || '',
            repo_url: project.repo_url || '',
            is_featured: project.is_featured,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (project: Project) => {
        if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
            deleteMutation.mutate(project.id);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Projects</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">
                            Manage your portfolio projects
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : projects?.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-terminal-muted font-terminal">No projects yet</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-4 text-terminal-accent font-terminal hover:underline"
                        >
                            Create your first project
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {projects?.map((project) => (
                            <div
                                key={project.id}
                                className="bg-card border border-border rounded-lg p-6 hover:border-accent/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-terminal text-terminal truncate">
                                                {project.title}
                                            </h3>
                                            {project.is_featured && (
                                                <span className="px-2 py-0.5 bg-accent/20 text-terminal-accent text-xs font-terminal rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-terminal-muted text-sm mt-1 line-clamp-2">
                                            {project.short_description}
                                        </p>
                                        {project.tech_stack && project.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {project.tech_stack.slice(0, 5).map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-0.5 bg-secondary text-terminal-muted text-xs rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.tech_stack.length > 5 && (
                                                    <span className="text-terminal-muted text-xs">
                                                        +{project.tech_stack.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                                title="View Demo"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        {project.repo_url && (
                                            <a
                                                href={project.repo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                                title="View Repository"
                                            >
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => openEditModal(project)}
                                            className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project)}
                                            className="p-2 text-terminal-muted hover:text-terminal-error transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-terminal text-terminal">
                                {editingProject ? 'Edit Project' : 'New Project'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 text-terminal-muted hover:text-terminal transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="auto-generated-from-title"
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Short Description
                                </label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                    rows={5}
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Tech Stack (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tech_stack}
                                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="React, Node.js, PostgreSQL"
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Web, Mobile, Enterprise"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                        Demo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.demo_url}
                                        onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                        Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.repo_url}
                                        onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="rounded border-border"
                                />
                                <label htmlFor="is_featured" className="text-terminal text-sm font-terminal">
                                    Featured Project
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm hover:bg-accent/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
