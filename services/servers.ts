import { ServerWithGeo } from '../types/GeoLocation';

const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : import.meta.env.VITE_API_URL;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const serversService = {
    async getServers(): Promise<ServerWithGeo[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/servers`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            if (response.status === 403) {
                localStorage.removeItem('token');
                throw new Error('Session expired. Please login again');
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch servers');
        }

        return response.json();
    },

    async addServer(name: string, address: string): Promise<ServerWithGeo> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('Adding server:', { name, address });
        const response = await fetch(`${API_URL}/servers`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name, address })
        });

        if (!response.ok) {
            if (response.status === 403) {
                localStorage.removeItem('token');
                throw new Error('Session expired. Please login again');
            }
            const error = await response.json();
            console.error('Server error:', error);
            throw new Error(error.error || 'Failed to add server');
        }

        return response.json();
    },

    async deleteServer(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/servers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            if (response.status === 403) {
                localStorage.removeItem('token');
                throw new Error('Session expired. Please login again');
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete server');
        }
    }
};
