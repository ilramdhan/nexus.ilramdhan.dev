import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Service } from '@/types/database';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', icon_name: '' });

    const { data: services, isLoading } = useQuery({
        queryKey: ['admin-services'],
        queryFn: async () => {
            const { data, error } = await supabase.from('services').select('*').order('id');
            if (error) throw error;
            return data as Service[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('services').insert({
                user_id: user?.id,
                title: data.title,
                description: data.description || null,
                icon_name: data.icon_name || null,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            toast.success('Service created');
            closeModal();
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const { error } = await supabase.from('services').update({
                title: data.title,
                description: data.description || null,
                icon_name: data.icon_name || null,
            }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            toast.success('Service updated');
            closeModal();
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            toast.success('Service deleted');
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const openCreateModal = () => {
        setEditingService(null);
        setFormData({ title: '', description: '', icon_name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description || '',
            icon_name: service.icon_name || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            updateMutation.mutate({ id: editingService.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Services</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">Services you offer</p>
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm">
                        <Plus className="w-4 h-4" /> Add Service
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : services?.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-terminal-muted font-terminal">No services yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {services?.map((service) => (
                            <div key={service.id} className="bg-card border border-border rounded-lg p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-terminal font-terminal">{service.title}</h3>
                                        <p className="text-terminal-muted text-sm mt-2">{service.description}</p>
                                        {service.icon_name && <p className="text-terminal-accent text-xs mt-1">Icon: {service.icon_name}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(service)} className="p-2 text-terminal-muted hover:text-terminal-accent">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirm('Delete?') && deleteMutation.mutate(service.id)} className="p-2 text-terminal-muted hover:text-terminal-error">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
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
                            <h2 className="text-lg font-terminal text-terminal">{editingService ? 'Edit' : 'Add'} Service</h2>
                            <button onClick={closeModal} className="p-2 text-terminal-muted hover:text-terminal"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Title *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" required />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal resize-none" rows={3} />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Icon Name (Lucide)</label>
                                <input type="text" value={formData.icon_name} onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="e.g., globe, server" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm">Cancel</button>
                                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm disabled:opacity-50">
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
