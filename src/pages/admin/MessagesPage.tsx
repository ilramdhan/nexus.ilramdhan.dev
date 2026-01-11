import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Message } from '@/types/database';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
    const queryClient = useQueryClient();

    const { data: messages, isLoading } = useQuery({
        queryKey: ['admin-messages'],
        queryFn: async () => {
            const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data as Message[];
        },
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
            toast.success('Message deleted');
        },
        onError: (error) => toast.error(`Failed: ${error.message}`),
    });

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-terminal text-terminal">Messages</h1>
                    <p className="text-terminal-muted font-terminal text-sm mt-1">Contact form submissions</p>
                </div>

                {isLoading ? (
                    <div className="text-terminal-muted font-terminal">Loading...</div>
                ) : messages?.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-terminal-muted font-terminal">No messages yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages?.map((message) => (
                            <div
                                key={message.id}
                                className={`bg-card border rounded-lg p-6 ${message.is_read ? 'border-border' : 'border-accent/50'}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {message.is_read ? (
                                                <MailOpen className="w-4 h-4 text-terminal-muted" />
                                            ) : (
                                                <Mail className="w-4 h-4 text-terminal-accent" />
                                            )}
                                            <span className="font-terminal text-terminal">{message.name}</span>
                                            {!message.is_read && (
                                                <span className="px-2 py-0.5 bg-accent/20 text-terminal-accent text-xs rounded">New</span>
                                            )}
                                        </div>
                                        <p className="text-terminal-muted text-sm mt-1">{message.email}</p>
                                        <p className="text-terminal text-sm mt-3 whitespace-pre-wrap">{message.message}</p>
                                        <p className="text-terminal-muted text-xs mt-2">{formatDate(message.created_at)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!message.is_read && (
                                            <button
                                                onClick={() => markAsReadMutation.mutate(message.id)}
                                                className="p-2 text-terminal-muted hover:text-terminal-accent transition-colors"
                                                title="Mark as read"
                                            >
                                                <MailOpen className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => confirm('Delete this message?') && deleteMutation.mutate(message.id)}
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
        </AdminLayout>
    );
}
