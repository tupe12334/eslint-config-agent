import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Performance-related testing for ESLint rules
// This file tests various patterns that might affect linting performance

// Large interface with many properties
interface LargeConfig {
  apiEndpoint: string;
  timeout: number;
  retries: number;
  enableCache: boolean;
  cacheSize: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: {
    authentication: boolean;
    authorization: boolean;
    rateLimit: boolean;
    monitoring: boolean;
    analytics: boolean;
  };
  endpoints: {
    users: string;
    products: string;
    orders: string;
    payments: string;
    analytics: string;
    health: string;
    metrics: string;
    logs: string;
  };
  security: {
    cors: {
      origin: string[];
      credentials: boolean;
      methods: string[];
    };
    headers: {
      [key: string]: string;
    };
  };
}

// Component with many props and complex logic
interface ComponentProps {
  config: LargeConfig;
  onUpdate: (config: Partial<LargeConfig>) => void;
  onError: (error: Error) => void;
  onSuccess: (message: string) => void;
  isLoading: boolean;
  data: Array<{
    id: string;
    name: string;
    value: any;
    metadata: Record<string, unknown>;
  }>;
}

function PerformanceTestComponent({
  config,
  onUpdate,
  onError,
  onSuccess,
  isLoading,
  data,
}: ComponentProps) {
  const [localState, setLocalState] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Complex useEffect with multiple dependencies
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const processedData = data.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now(),
      }));

      setLocalState(prevState => ({
        ...prevState,
        processedData,
        lastUpdate: new Date().toISOString(),
      }));
    }
  }, [data, isLoading]);

  // Expensive computation with useMemo
  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = data;

    // Apply filters
    if (filters.length > 0) {
      filtered = data.filter(item =>
        filters.some(filter =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.id.includes(filter) ||
          Object.values(item.metadata).some(value =>
            String(value).toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const getValueByKey = (obj: any, key: string): any => {
        return key in obj ? obj[key] : '';
      };
      const aValue = getValueByKey(a, sortBy);
      const bValue = getValueByKey(b, sortBy);

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, filters, sortBy, sortOrder]);

  // Complex callback with multiple operations
  const handleConfigUpdate = useCallback((section: keyof LargeConfig, updates: any) => {
    try {
      const newConfig = {
        ...config,
        [section]: {
          ...config[section],
          ...updates,
        },
      };

      // Validate config
      if (section === 'timeout' && updates.timeout < 0) {
        throw new Error('Timeout cannot be negative');
      }

      if (section === 'retries' && updates.retries > 10) {
        throw new Error('Too many retries');
      }

      onUpdate(newConfig);
      onSuccess(`Updated ${section} successfully`);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [config, onUpdate, onError, onSuccess]);

  // Another complex callback
  const handleDataOperation = useCallback((operation: string, itemId: string) => {
    const item = data.find(d => d.id === itemId);
    if (!item) {
      onError(new Error(`Item ${itemId} not found`));
      return;
    }

    switch (operation) {
      case 'duplicate':
        const duplicated = {
          ...item,
          id: `${item.id}_copy_${Date.now()}`,
          name: `${item.name} (Copy)`,
        };
        onUpdate({ data: [...data, duplicated] });
        break;

      case 'delete':
        const filtered = data.filter(d => d.id !== itemId);
        onUpdate({ data: filtered });
        break;

      case 'archive':
        const archived = data.map(d =>
          d.id === itemId
            ? { ...d, metadata: { ...d.metadata, archived: true } }
            : d
        );
        onUpdate({ data: archived });
        break;

      default:
        onError(new Error(`Unknown operation: ${operation}`));
    }
  }, [data, onUpdate, onError]);

  // Large JSX structure to test rendering performance impact on linting
  return (
    <div className="performance-test-component">
      <header>
        <h1>Performance Test Component</h1>
        <div className="controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="id">ID</option>
            <option value="value">Value</option>
          </select>
          <select value={sortOrder} onChange={(e) => {
            const value = e.target.value;
            if (value === 'asc' || value === 'desc') {
              setSortOrder(value);
            }
          }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </header>

      <main>
        <section className="filters">
          {/* Multiple filter inputs */}
          {Array.from({ length: 10 }, (_, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Filter ${i + 1}`}
              onChange={(e) => {
                const newFilters = [...filters];
                newFilters[i] = e.target.value;
                setFilters(newFilters.filter(Boolean));
              }}
            />
          ))}
        </section>

        <section className="data-grid">
          {filteredAndSortedData.map(item => (
            <div key={item.id} className="data-item">
              <h3>{item.name}</h3>
              <p>ID: {item.id}</p>
              <div className="metadata">
                {Object.entries(item.metadata).map(([key, value]) => (
                  <span key={key}>
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
              <div className="actions">
                <button onClick={() => handleDataOperation('duplicate', item.id)}>
                  Duplicate
                </button>
                <button onClick={() => handleDataOperation('archive', item.id)}>
                  Archive
                </button>
                <button onClick={() => handleDataOperation('delete', item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="config-editor">
          <h2>Configuration Editor</h2>
          <div className="config-sections">
            <div className="section">
              <h3>API Settings</h3>
              <input
                type="text"
                value={config.apiEndpoint}
                onChange={(e) => handleConfigUpdate('apiEndpoint', e.target.value)}
              />
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => handleConfigUpdate('timeout', parseInt(e.target.value, 10))}
              />
            </div>

            <div className="section">
              <h3>Features</h3>
              {Object.entries(config.features).map(([key, value]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleConfigUpdate('features', { [key]: e.target.checked })}
                  />
                  {key}
                </label>
              ))}
            </div>

            <div className="section">
              <h3>Endpoints</h3>
              {Object.entries(config.endpoints).map(([key, value]) => (
                <div key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigUpdate('endpoints', { [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="status">
          {isLoading && <span>Loading...</span>}
          <span>Items: {filteredAndSortedData.length}</span>
          <span>Last Update: {localState.lastUpdate || 'Never'}</span>
        </div>
      </footer>
    </div>
  );
}

export default PerformanceTestComponent;
export type { LargeConfig, ComponentProps };