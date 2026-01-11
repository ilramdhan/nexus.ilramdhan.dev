import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TechStack } from '@/types/database';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud', 'Tools', 'Other'];

export default function TechStackPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: 'Frontend', icon_url: '' });

    const { data: techStack, isLoading } = useQuery({
        queryKey: ['admin-tech-stack'],
        queryFn: async () => {
            const { data, error } = await supabase.from('tech_stack').select('*').order('category');
            if (error) throw error;
            return data as TechStack[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('tech_stack').insert({
                user_id: user?.id,
                name: data.name,
                category: data.category,
                icon_url: data.icon_url || null,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tech-stack'] });
            toast.success('Tech added successfully');
            setIsModalOpen(false);
            setFormData({ name: '', category: 'Frontend', icon_url: '' });
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('tech_stack').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tech-stack'] });
            toast.success('Tech removed');
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const grouped = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = techStack?.filter(t => t.category === cat) || [];
        return acc;
    }, {} as Record<string, TechStack[]>);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Tech Stack</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">Manage your technologies</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm">
                        <Plus className="w-4 h-4" /> Add Tech
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : (
                    <div className="grid gap-6">
                        {CATEGORIES.map((category) => (
                            <div key={category} className="bg-card border border-border rounded-lg p-4">
                                <h3 className="text-terminal font-terminal mb-3">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {grouped[category].length === 0 ? (
                                        <p className="text-terminal-muted text-sm">No items</p>
                                    ) : (
                                        grouped[category].map((tech) => (
                                            <span key={tech.id} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded text-terminal text-sm">
                                                {tech.name}
                                                <button onClick={() => deleteMutation.mutate(tech.id)} className="text-terminal-muted hover:text-terminal-error">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-terminal text-terminal">Add Technology</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-terminal-muted hover:text-terminal">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="p-4 space-y-4">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm">Cancel</button>
                                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm disabled:opacity-50">
                                    {createMutation.isPending ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
