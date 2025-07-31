export const API_BASE_URL = 'http://localhost:3001';

// Types for API responses
export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    role: string;
    lastLogin?: string;
  };
}

export interface SessionResponse {
  success: boolean;
  session: {
    id: string;
    session_id: string;
    hostess_id: string;
    hospital_id: string;
    ward_id: string;
    meal_type: string;
    meal_count: number;
    meals_served: number;
    status: string;
    shift_start: string;
    kitchen_exit?: string;
    ward_arrival?: string;
    diet_sheet_captured?: string;
    nurse_alerted?: string;
    nurse_response?: string;
    service_start?: string;
    service_complete?: string;
  };
}

export interface QRScanResponse {
  success: boolean;
  message: string;
  location: {
    type: string;
    name: string;
  };
  timestamp: string;
}

// API service class
export class ServiceSyncAPI {
  private static token: string | null = null;

  // Set authentication token
  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('servicesync_token', token);
  }

  // Get authentication token
  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('servicesync_token');
    }
    return this.token;
  }

  // Clear authentication token
  static clearToken() {
    this.token = null;
    localStorage.removeItem('servicesync_token');
  }

  // Generic API request method
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  static async login(employeeId: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, password }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  static async getCurrentUser() {
    return await this.request('/api/auth/me');
  }

  static async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // Session management endpoints
  static async createSession(sessionData: {
    hospitalId: string;
    wardId: string;
    mealType: string;
    mealCount: number;
    hostessId?: string;
  }): Promise<SessionResponse> {
    return await this.request<SessionResponse>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  static async getSession(sessionId: string): Promise<SessionResponse> {
    return await this.request<SessionResponse>(`/api/sessions/${sessionId}`);
  }

  static async updateSession(sessionId: string, updateData: any) {
    return await this.request(`/api/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // QR code scanning
  static async scanQRCode(qrCode: string, sessionId: string): Promise<QRScanResponse> {
    return await this.request<QRScanResponse>('/api/qr/scan', {
      method: 'POST',
      body: JSON.stringify({ qrCode, sessionId }),
    });
  }

  // Nurse notifications
  static async sendNurseAlert(sessionId: string) {
    return await this.request('/api/nurse/alert', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  // File upload
  static async uploadDietSheet(sessionId: string, photoData?: any) {
    return await this.request('/api/upload/diet-sheet', {
      method: 'POST',
      body: JSON.stringify({ sessionId, photoData }),
    });
  }

  // Dashboard and reports
  static async getDashboard() {
    return await this.request('/api/reports/dashboard');
  }

  // Health check
  static async healthCheck() {
    return await this.request('/health');
  }
}