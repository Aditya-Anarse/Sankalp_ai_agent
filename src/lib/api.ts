const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sankalp_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorJson.error || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  auth: {
    login: (credentials: { email: string; password?: string }) =>
      request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    signup: (data: { email: string; password?: string; name?: string; business_name?: string }) =>
      request<any>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<any>('/auth/me'),
  },

  business: {
    get: () => request<any>('/business'),
    update: (data: any) =>
      request<any>('/business', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    getProducts: () => request<any[]>('/business/products'),
    addProduct: (data: any) =>
      request<any>('/business/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getBrand: () => request<any>('/business/brand'),
    updateBrand: (data: any) =>
      request<any>('/business/brand', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getAudience: () => request<any>('/business/audience'),
    updateAudience: (data: any) =>
      request<any>('/business/audience', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getGoals: () => request<any>('/business/goals'),
    updateGoals: (data: any) =>
      request<any>('/business/goals', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getContentPreferences: () => request<any>('/business/content-preferences'),
    updateContentPreferences: (data: any) =>
      request<any>('/business/content-preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  campaigns: {
    list: () => request<any[]>('/campaigns'),
    get: (id: string) => request<any>(`/campaigns/${id}`),
    create: (data: any) =>
      request<any>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    research: (id: string) =>
      request<any>(`/campaigns/${id}/research`, {
        method: 'POST',
      }),
    strategy: (id: string) =>
      request<any>(`/campaigns/${id}/strategy`, {
        method: 'POST',
      }),
    generate: (id: string) =>
      request<any>(`/campaigns/${id}/generate`, {
        method: 'POST',
      }),
    qualityCheck: (id: string) =>
      request<any>(`/campaigns/${id}/quality-check`, {
        method: 'POST',
      }),
    approve: (id: string) =>
      request<any>(`/campaigns/${id}/approve`, {
        method: 'POST',
      }),
    loopState: (id: string) => request<any>(`/campaigns/${id}/loop-state`),
    replan: (id: string) =>
      request<any>(`/campaigns/${id}/replan`, {
        method: 'POST',
      }),
    delete: (id: string) =>
      request<any>(`/campaigns/${id}`, {
        method: 'DELETE',
      }),
  },

  content: {
    list: (params?: { platform?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.platform) q.set('platform', params.platform);
      if (params?.status) q.set('status', params.status);
      const str = q.toString();
      return request<any[]>(`/content${str ? `?${str}` : ''}`);
    },
    get: (id: string) => request<any>(`/content/${id}`),
    update: (id: string, data: any) =>
      request<any>(`/content/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    schedule: (id: string, scheduled_at: string) =>
      request<any>(`/content/${id}/schedule`, {
        method: 'POST',
        body: JSON.stringify({ scheduled_at }),
      }),
    publish: (id: string) =>
      request<any>(`/content/${id}/publish`, {
        method: 'POST',
      }),
    regenerate: (id: string) =>
      request<any>(`/content/${id}/regenerate`, {
        method: 'POST',
      }),
    delete: (id: string) =>
      request<any>(`/content/${id}`, {
        method: 'DELETE',
      }),
  },

  socialAccounts: {
    list: () => request<any[]>('/social-accounts'),
    diagnostics: () => request<any>('/social-accounts/diagnostics'),
    instagramStatus: () => request<any>('/social-accounts/instagram/connection-status'),
    disconnect: (id: string) =>
      request<any>(`/social-accounts/${id}`, {
        method: 'DELETE',
      }),
  },

  agent: {
    activity: () => request<any[]>('/agent/activity'),
    chat: (prompt: string) =>
      request<any>('/agent/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }),
  },

  learning: {
    get: () => request<any[]>('/learning'),
    analyze: () =>
      request<any>('/learning/analyze', {
        method: 'POST',
      }),
  },

  analytics: {
    get: (days: number = 30) => request<any>(`/analytics?days=${days}`),
    content: (id: string) => request<any>(`/analytics/content/${id}`),
    sync: () =>
      request<any>('/analytics/sync', {
        method: 'POST',
      }),
  },

  scheduler: {
    status: () => request<any>('/scheduler/status'),
    trigger: () =>
      request<any>('/scheduler/trigger', {
        method: 'POST',
      }),
  },

  calendar: {
    get: () => request<any>('/calendar'),
  },

  notifications: {
    list: () => request<any[]>('/notifications'),
    markRead: (id: string) =>
      request<any>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
  },
};
