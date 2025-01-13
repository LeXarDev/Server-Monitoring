import { useState } from 'react';
import { ServerCard } from './ServerCard';
import { AddServerForm } from './AddServerForm';
import type { ServerWithGeo } from '../types/GeoLocation';

interface Server extends ServerWithGeo {}

export function PingChecker() {
  const [servers, setServers] = useState<Server[]>([
    { id: '1', name: 'Google DNS', address: '8.8.8.8' },
    { id: '2', name: 'Cloudflare DNS', address: '1.1.1.1' }
  ]);

  const handleAddServer = (name: string, address: string) => {
    setServers(prev => [...prev, { id: Date.now().toString(), name, address }]);
  };

  const handleRemoveServer = (id: string) => {
    setServers(prev => prev.filter(server => server.id !== id));
  };

  return (
    <div className="space-y-8">
      <AddServerForm onAdd={handleAddServer} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map(server => (
          <ServerCard
            key={server.id}
            server={server}
            onDelete={() => handleRemoveServer(server.id)}
          />
        ))}
      </div>
    </div>
  );
}