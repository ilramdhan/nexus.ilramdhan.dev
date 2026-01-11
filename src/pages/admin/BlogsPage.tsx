import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Blog } from '@/types/database';
import { Plus, Pencil, Trash2, Eye, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        is_featured: false,
        published_at: '',
    });

    const { data: blogs, isLoading } = useQuery({
        queryKey: ['admin-blogs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Blog[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('blogs').insert({
                user_id: user?.id,
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                excerpt: data.excerpt,
                content: data.content,
                tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
                is_featured: data.is_featured,
                published_at: data.published_at || null,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
            toast.success('Blog post created successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to create blog post: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const { error } = await supabase
                .from('blogs')
                .update({
                    title: data.title,
                    slug: data.slug,
                    excerpt: data.excerpt,
                    content: data.content,
                    tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
                    is_featured: data.is_featured,
                    published_at: data.published_at || null,
                })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
            toast.success('Blog post updated successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to update blog post: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
            toast.success('Blog post deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete blog post: ${error.message}`);
        },
    });

    const openCreateModal = () => {
        setEditingBlog(null);
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            tags: '',
            is_featured: false,
            published_at: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (blog: Blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            tags: blog.tags?.join(', ') || '',
            is_featured: blog.is_featured,
            published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBlog) {
            updateMutation.mutate({ id: editingBlog.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (blog: Blog) => {
        if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
            deleteMutation.mutate(blog.id);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Draft';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Blog Posts</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">
                            Manage your blog articles
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : blogs?.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-terminal-muted font-terminal">No blog posts yet</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-4 text-terminal-accent font-terminal hover:underline"
                        >
                            Create your first post
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {blogs?.map((blog) => (
                            <div
                                key={blog.id}
                                className="bg-card border border-border rounded-lg p-6 hover:border-accent/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-terminal text-terminal truncate">
                                                {blog.title}
                                            </h3>
                                            {blog.is_featured && (
                                                <span className="px-2 py-0.5 bg-accent/20 text-terminal-accent text-xs font-terminal rounded">
                                                    Featured
                                                </span>
                                            )}
                                            {!blog.published_at && (
                                                <span className="px-2 py-0.5 bg-terminal-warning/20 text-terminal-warning text-xs font-terminal rounded">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-terminal-muted text-sm mt-1 line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-terminal-muted">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(blog.published_at)}
                                            </span>
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex gap-1">
                                                    {blog.tags.slice(0, 3).map((tag) => (
                                                        <span key={tag} className="px-2 py-0.5 bg-secondary rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {blog.published_at && (
                                            <button
                                                className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                                title="Preview"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openEditModal(blog)}
                                            className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog)}
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
                                {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
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
                                    Excerpt
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
                                    rows={8}
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
                                    placeholder="React, TypeScript, Tutorial"
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">
                                    Publish Date (leave empty for draft)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.published_at}
                                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal focus:outline-none focus:ring-2 focus:ring-accent"
                                />
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
                                    Featured Post
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
