import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                    <div className="max-w-lg w-full bg-gray-800 rounded-lg p-6 border border-red-500">
                        <h1 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h1>
                        <p className="text-gray-300 mb-4">
                            The application encountered an error. This might be due to:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 mb-4 text-sm">
                            <li>Missing environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)</li>
                            <li>Network connectivity issues</li>
                            <li>Browser compatibility problems</li>
                        </ul>
                        {this.state.error && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-gray-400 hover:text-white">
                                    Error details
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto text-red-300">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
