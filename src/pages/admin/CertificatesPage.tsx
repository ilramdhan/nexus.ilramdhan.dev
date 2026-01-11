import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Certificate } from '@/types/database';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificatesPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        issued_by: '',
        issued_date: '',
        expiry_date: '',
        credential_url: '',
    });

    const { data: certificates, isLoading } = useQuery({
        queryKey: ['admin-certificates'],
        queryFn: async () => {
            const { data, error } = await supabase.from('certificates').select('*').order('issued_date', { ascending: false });
            if (error) throw error;
            return data as Certificate[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('certificates').insert({
                user_id: user?.id,
                title: data.title,
                description: data.description || null,
                issued_by: data.issued_by || null,
                issued_date: data.issued_date || null,
                expiry_date: data.expiry_date || null,
                credential_url: data.credential_url || null,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
            toast.success('Certificate added');
            closeModal();
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const { error } = await supabase.from('certificates').update({
                title: data.title,
                description: data.description || null,
                issued_by: data.issued_by || null,
                issued_date: data.issued_date || null,
                expiry_date: data.expiry_date || null,
                credential_url: data.credential_url || null,
            }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
            toast.success('Certificate updated');
            closeModal();
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('certificates').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
            toast.success('Certificate deleted');
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const openCreateModal = () => {
        setEditingCert(null);
        setFormData({ title: '', description: '', issued_by: '', issued_date: '', expiry_date: '', credential_url: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (cert: Certificate) => {
        setEditingCert(cert);
        setFormData({
            title: cert.title,
            description: cert.description || '',
            issued_by: cert.issued_by || '',
            issued_date: cert.issued_date || '',
            expiry_date: cert.expiry_date || '',
            credential_url: cert.credential_url || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingCert(null); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCert) updateMutation.mutate({ id: editingCert.id, data: formData });
        else createMutation.mutate(formData);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Certificates</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">Your certifications</p>
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm">
                        <Plus className="w-4 h-4" /> Add Certificate
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : certificates?.length === 0 ? (
                    <p className="text-terminal-muted font-terminal">No certificates yet</p>
                ) : (
                    <div className="grid gap-4">
                        {certificates?.map((cert) => (
                            <div key={cert.id} className="bg-card border border-border rounded-lg p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-terminal font-terminal">{cert.title}</h3>
                                        <p className="text-terminal-accent text-sm">{cert.issued_by}</p>
                                        <p className="text-terminal-muted text-xs mt-1">
                                            {cert.issued_date && `Issued: ${cert.issued_date}`}
                                            {cert.expiry_date && ` | Expires: ${cert.expiry_date}`}
                                        </p>
                                        {cert.description && <p className="text-terminal-muted text-sm mt-2">{cert.description}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        {cert.credential_url && (
                                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="p-2 text-terminal-muted hover:text-terminal-accent">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button onClick={() => openEditModal(cert)} className="p-2 text-terminal-muted hover:text-terminal-accent"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => confirm('Delete?') && deleteMutation.mutate(cert.id)} className="p-2 text-terminal-muted hover:text-terminal-error"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-terminal text-terminal">{editingCert ? 'Edit' : 'Add'} Certificate</h2>
                            <button onClick={closeModal} className="p-2 text-terminal-muted hover:text-terminal"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Title *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" required />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Issued By</label>
                                <input type="text" value={formData.issued_by} onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-terminal-muted text-sm mb-1 font-terminal">Issued Date</label>
                                    <input type="date" value={formData.issued_date} onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" />
                                </div>
                                <div>
                                    <label className="block text-terminal-muted text-sm mb-1 font-terminal">Expiry Date</label>
                                    <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Credential URL</label>
                                <input type="url" value={formData.credential_url} onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal resize-none" rows={2} />
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
