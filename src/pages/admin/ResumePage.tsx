import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Resume } from '@/types/database';
import { Plus, Pencil, Trash2, X, Briefcase, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumePage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResume, setEditingResume] = useState<Resume | null>(null);
    const [formData, setFormData] = useState({
        type: 'experience' as 'experience' | 'education',
        title: '',
        institution: '',
        period: '',
        description: '',
        gpa: '',
        tags: '',
    });

    const { data: resumes, isLoading } = useQuery({
        queryKey: ['admin-resumes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('resume')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            return data as Resume[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from('resume').insert({
                user_id: user?.id,
                type: data.type,
                title: data.title,
                institution: data.institution || null,
                period: data.period || null,
                description: data.description || null,
                gpa: data.gpa || null,
                tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
            toast.success('Resume entry created successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to create resume entry: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
            const { error } = await supabase
                .from('resume')
                .update({
                    type: data.type,
                    title: data.title,
                    institution: data.institution || null,
                    period: data.period || null,
                    description: data.description || null,
                    gpa: data.gpa || null,
                    tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
                })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
            toast.success('Resume entry updated successfully');
            closeModal();
        },
        onError: (error) => {
            toast.error(`Failed to update resume entry: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('resume').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
            toast.success('Resume entry deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete resume entry: ${error.message}`);
        },
    });

    const openCreateModal = () => {
        setEditingResume(null);
        setFormData({
            type: 'experience',
            title: '',
            institution: '',
            period: '',
            description: '',
            gpa: '',
            tags: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (resume: Resume) => {
        setEditingResume(resume);
        setFormData({
            type: resume.type as 'experience' | 'education',
            title: resume.title,
            institution: resume.institution || '',
            period: resume.period || '',
            description: resume.description || '',
            gpa: resume.gpa || '',
            tags: resume.tags?.join(', ') || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingResume(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingResume) {
            updateMutation.mutate({ id: editingResume.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (resume: Resume) => {
        if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
            deleteMutation.mutate(resume.id);
        }
    };

    const experiences = resumes?.filter(r => r.type === 'experience') || [];
    const education = resumes?.filter(r => r.type === 'education') || [];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-terminal text-terminal">Resume</h1>
                        <p className="text-terminal-muted font-terminal text-sm mt-1">
                            Manage your work experience and education
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded font-terminal text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entry
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : (
                    <div className="space-y-8">
                        {/* Experience Section */}
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-terminal text-terminal mb-4">
                                <Briefcase className="w-5 h-5" />
                                Work Experience
                            </h2>
                            {experiences.length === 0 ? (
                                <p className="text-terminal-muted font-terminal text-sm">No work experience added yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {experiences.map((item) => (
                                        <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-terminal font-terminal">{item.title}</h3>
                                                    <p className="text-terminal-accent text-sm">{item.institution}</p>
                                                    <p className="text-terminal-muted text-xs mt-1">{item.period}</p>
                                                    <p className="text-terminal-muted text-sm mt-2">{item.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(item)} className="p-2 text-terminal-muted hover:text-terminal-accent">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item)} className="p-2 text-terminal-muted hover:text-terminal-error">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Education Section */}
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-terminal text-terminal mb-4">
                                <GraduationCap className="w-5 h-5" />
                                Education
                            </h2>
                            {education.length === 0 ? (
                                <p className="text-terminal-muted font-terminal text-sm">No education added yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {education.map((item) => (
                                        <div key={item.id} className="bg-card border border-border rounded-lg p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-terminal font-terminal">{item.title}</h3>
                                                    <p className="text-terminal-accent text-sm">{item.institution}</p>
                                                    <p className="text-terminal-muted text-xs mt-1">{item.period}</p>
                                                    {item.gpa && <p className="text-terminal-muted text-xs">GPA: {item.gpa}</p>}
                                                    <p className="text-terminal-muted text-sm mt-2">{item.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(item)} className="p-2 text-terminal-muted hover:text-terminal-accent">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item)} className="p-2 text-terminal-muted hover:text-terminal-error">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-terminal text-terminal">
                                {editingResume ? 'Edit Entry' : 'New Entry'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-terminal-muted hover:text-terminal">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'experience' | 'education' })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                >
                                    <option value="experience">Work Experience</option>
                                    <option value="education">Education</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Title/Position *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Company/Institution</label>
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Period</label>
                                <input
                                    type="text"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                    placeholder="Jan 2020 - Present"
                                />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal resize-none"
                                    rows={3}
                                />
                            </div>
                            {formData.type === 'education' && (
                                <div>
                                    <label className="block text-terminal-muted text-sm mb-1 font-terminal">GPA</label>
                                    <input
                                        type="text"
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal"
                                        placeholder="3.8/4.0"
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-secondary border border-border text-terminal rounded font-terminal text-sm">
                                    Cancel
                                </button>
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
