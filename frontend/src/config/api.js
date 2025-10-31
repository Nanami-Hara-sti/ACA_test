// API設定
const config = {
  // 開発環境用
  development: {
    API_BASE_URL: 'http://localhost:8001',
  },
  // 本番環境用
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://rg-test-hara-ca-back.blackrock-912602d1.westus.azurecontainerapps.io',
  }
};

// 現在の環境を判定
const environment = import.meta.env.MODE || 'development';

// 現在の環境に応じた設定をエクスポート
export const API_CONFIG = config[environment] || config.development;

// API呼び出し用のベースURL
export const API_BASE_URL = API_CONFIG.API_BASE_URL;

// よく使われるAPIエンドポイント
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  TEST_DB: '/api/test-db',
  UPLOAD: '/api/upload',
};

// API呼び出し用のヘルパー関数
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};