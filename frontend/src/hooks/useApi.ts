import { useState, useCallback } from 'react';

interface UseApiState {
    loading: boolean;
    error: string | null;
    data: any;
}

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
    const [state, setState] = useState<UseApiState>({
        loading: false,
        error: null,
        data: null
    });

    const execute = useCallback(async (fn: () => Promise<any>) => {
        setState({ loading: true, error: null, data: null });
        try {
            const result = await fn();
            setState({ loading: false, error: null, data: result });
            options.onSuccess?.(result);
            return result;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
            setState({ loading: false, error: errorMessage, data: null });
            options.onError?.(error);
            throw error;
        }
    }, [options]);

    return { ...state, execute };
};
