import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/database';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        logo_text: '',
        display_name: '',
        badge_text: '',
        hero_title: '',
        short_description: '',
        detailed_bio: '',
        address: '',
        footer_text: '',
        github: '',
        linkedin: '',
        twitter: '',
        email: '',
        website: '',
        phone: '',
    });

    const { data: profile, isLoading } = useQuery({
        queryKey: ['admin-profile', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data, error } = await supabase.from('profile').select('*').eq('id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as Profile | null;
        },
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (profile) {
            const socialLinks = profile.social_links || {};
            setFormData({
                logo_text: profile.logo_text || '',
                display_name: profile.display_name || '',
                badge_text: profile.badge_text || '',
                hero_title: profile.hero_title || '',
                short_description: profile.short_description || '',
                detailed_bio: profile.detailed_bio || '',
                address: profile.address || '',
                footer_text: profile.footer_text || '',
                github: socialLinks.github || '',
                linkedin: socialLinks.linkedin || '',
                twitter: socialLinks.twitter || '',
                email: socialLinks.email || '',
                website: socialLinks.website || '',
                phone: socialLinks.phone || '',
            });
        }
    }, [profile]);

    const saveMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const profileData = {
                id: user?.id,
                logo_text: data.logo_text || null,
                display_name: data.display_name || null,
                badge_text: data.badge_text || null,
                hero_title: data.hero_title || null,
                short_description: data.short_description || null,
                detailed_bio: data.detailed_bio || null,
                address: data.address || null,
                footer_text: data.footer_text || null,
                social_links: {
                    github: data.github || undefined,
                    linkedin: data.linkedin || undefined,
                    twitter: data.twitter || undefined,
                    email: data.email || undefined,
                    website: data.website || undefined,
                    phone: data.phone || undefined,
                },
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profile').upsert(profileData);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            toast.success('Settings saved successfully');
        },
        onError: (error) => toast.error(`Failed to save: ${error.message}`),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="text-terminal-muted font-terminal">Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-terminal text-terminal">Settings</h1>
                    <p className="text-terminal-muted font-terminal text-sm mt-1">Profile and site configuration</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-terminal text-terminal">Basic Information</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Logo Text</label>
                                <input type="text" value={formData.logo_text} onChange={(e) => setFormData({ ...formData, logo_text: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="DevFolio" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Display Name</label>
                                <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="Ilham Ramadhan" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Badge Text</label>
                                <input type="text" value={formData.badge_text} onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="Fullstack Developer" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Hero Title</label>
                                <input type="text" value={formData.hero_title} onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="Building Digital Experiences" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-terminal-muted text-sm mb-1 font-terminal">Short Description</label>
                            <textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal resize-none" rows={2} />
                        </div>
                        <div>
                            <label className="block text-terminal-muted text-sm mb-1 font-terminal">About / Bio</label>
                            <textarea value={formData.detailed_bio} onChange={(e) => setFormData({ ...formData, detailed_bio: e.target.value })}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal resize-none" rows={4} />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-terminal text-terminal">Social Links & Contact</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">GitHub</label>
                                <input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="https://github.com/username" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">LinkedIn</label>
                                <input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="https://linkedin.com/in/username" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Twitter</label>
                                <input type="url" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="https://twitter.com/username" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Website</label>
                                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="https://yoursite.com" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-terminal-muted text-sm mb-1 font-terminal">Phone</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="+62 xxx xxxx xxxx" />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-terminal text-terminal">Other Settings</h2>
                        <div>
                            <label className="block text-terminal-muted text-sm mb-1 font-terminal">Address</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" />
                        </div>
                        <div>
                            <label className="block text-terminal-muted text-sm mb-1 font-terminal">Footer Text</label>
                            <input type="text" value={formData.footer_text} onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded text-terminal font-terminal" placeholder="© 2024 Your Name" />
                        </div>
                    </div>

                    <button type="submit" disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded font-terminal hover:opacity-90 disabled:opacity-50">
                        <Save className="w-4 h-4" />
                        {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
