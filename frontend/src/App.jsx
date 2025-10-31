import { useState } from 'react';
import PriceTable from './components/Table/PriceTable.jsx';

// 製品データ
const initialTableData = [
  { category: 'RHEL', sku: 'RH00001', name: 'Red Hat Enterprise Linux Server, Standard (Physical or Virtual Nodes)', price_std: '¥102,700', price_offer: '¥92,000', sockets: '2', cores: 'N/A', support: 'Standard', uom: 'Per 2 Sockets' },
  { category: 'RHEL', sku: 'RH00002', name: 'Red Hat Enterprise Linux Server, Premium (Physical or Virtual Nodes)', price_std: '¥165,000', price_offer: '¥148,000', sockets: '2', cores: 'N/A', support: 'Premium', uom: 'Per 2 Sockets' },
  { category: 'OpenShift', sku: 'MW00123', name: 'Red Hat OpenShift Platform Plus, Standard (Cores)', price_std: '¥2,580,000', price_offer: '¥2,322,000', sockets: 'N/A', cores: '100', support: 'Standard', uom: 'Per 100 Cores' },
  { category: 'Ansible', sku: 'SV00456', name: 'Red Hat Ansible Automation Platform', price_std: '¥1,935,000', price_offer: '¥1,741,500', sockets: 'N/A', cores: 'N/A', support: 'Premium', uom: 'Per 100 Nodes' },
  { category: 'RHEL for SAP', sku: 'RH03043', name: 'Red Hat Enterprise Linux for SAP Applications, Premium (Physical or Virtual Nodes)', price_std: '¥322,000', price_offer: '¥289,800', sockets: '2', cores: 'N/A', support: 'Premium', uom: 'Per 2 Sockets' }
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tableData, setTableData] = useState(initialTableData);
  const [activeTab, setActiveTab] = useState('price-table');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    // モバイルでは自動的にサイドバーを閉じる
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const menuItems = [
    {
      id: 'home',
      name: 'ホーム',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'price-table',
      name: '価格表一覧',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'analytics',
      name: '分析',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex h-screen" style={{color: '#374151'}}>
      
      {/* ハンバーガーメニューボタン (サイドバーが閉じているときに表示) */}
      <button 
        id="menu-open-button" 
        className={`fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-900 shadow-md text-white ${
          isSidebarOpen ? '' : ''
        }`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isSidebarOpen ? 0 : 1,
          pointerEvents: isSidebarOpen ? 'none' : 'auto',
          transition: 'all 0.3s'
        }}
        onClick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ===== サイドバー ===== */}
      <nav 
        id="sidebar"
        className={isSidebarOpen ? 'open' : 'closed'}
      >
        <div style={{display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem'}}>
          {/* ロゴエリア */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            opacity: isSidebarOpen ? 1 : 0,
            transition: 'opacity 0.2s'
          }}>
            {/* Red Hat ロゴ */}
            <svg style={{height: '2rem', width: '2rem', color: '#dc2626'}} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.282 10.164c.162.27.18.603.047.893-1.074 2.22-3.21 3.737-5.74 3.737-1.34 0-2.58-.45-3.58-1.21l-.018-.013c-.354-.27-.81-.223-1.11.113L8.02 16.54c-1.85 1.98-4.38 3.12-7.02 3.12-.4 0-.75-.32-.75-.75 0-.15.05-.3.13-.42C1.6 16.27 3.3 14.7 4.5 12.86c.02-.03.03-.06.05-.09.11-.17.18-.36.18-.57 0-.21-.07-.4-.18-.57-.02-.03-.03-.06-.05-.09C3.3 9.3 1.6 7.73.38 5.51c-.08-.12-.13-.27-.13-.42 0-.41.35-.75.75-.75 2.64 0 5.17 1.14 7.02 3.12l2.86 2.85c.3.34.76.38 1.1.11l.017-.014c1-.76 2.24-1.21 3.58-1.21 2.53 0 4.67 1.517 5.74 3.736.133.29.115.623-.047.894Z"></path>
            </svg>
            <span style={{
              marginLeft: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: 'white',
              whiteSpace: 'nowrap'
            }}>
              ライセンス管理
            </span>
          </div>
          
          {/* 閉じるボタン */}
          <button 
            id="menu-toggle-button" 
            onClick={toggleSidebar} 
            style={{
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'white',
              backgroundColor: 'transparent'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* メニュー項目 */}
        <div style={{flexGrow: 1}}>
          <ul style={{listStyle: 'none', margin: 0, padding: '1rem 0.5rem 0 0.5rem'}}>
            {menuItems.map((item) => (
              <li key={item.id} style={{marginBottom: '0.5rem'}}>
                <button 
                  onClick={() => handleMenuClick(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    height: '3rem',
                    alignItems: 'center',
                    borderRadius: '0.5rem',
                    padding: '0 1rem',
                    backgroundColor: activeTab === item.id ? '#374151' : 'transparent',
                    color: activeTab === item.id ? 'white' : '#d1d5db',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.backgroundColor = '#374151';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#d1d5db';
                    }
                  }}
                >
                  {item.icon}
                  <span style={{
                    marginLeft: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    opacity: isSidebarOpen ? 1 : 0,
                    transition: 'opacity 0.2s'
                  }}>
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* フッター (設定) */}
        <ul style={{
          marginTop: 'auto',
          listStyle: 'none',
          margin: '0',
          padding: '0.5rem',
          borderTop: '1px solid #374151'
        }}>
          <li>
            <a href="#" style={{
              display: 'flex',
              height: '3rem',
              alignItems: 'center',
              borderRadius: '0.5rem',
              padding: '0 1rem',
              color: '#d1d5db',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#374151';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.5 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span style={{
                marginLeft: '1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                opacity: isSidebarOpen ? 1 : 0,
                transition: 'opacity 0.2s'
              }}>
                設定
              </span>
            </a>
          </li>
        </ul>
      </nav>
      {/* ===== /サイドバー ===== */}

      {/* ===== メインコンテンツ ===== */}
      <main 
        id="main-content"
        className={isSidebarOpen ? 'shifted' : ''}
      >
        
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '1rem'}}>
          {/* コンテンツをタブ別に表示 */}
          {activeTab === 'home' && (
            <div>
              <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem'}}>ダッシュボード</h2>
              <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem'}}>
                <h3 className="text-lg font-medium mb-4">Red Hat License Manager へようこそ</h3>
                <p className="text-gray-600 mb-4">このダッシュボードでは、Red Hat製品のライセンス情報を管理できます。</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">製品数</h4>
                    <p className="text-2xl font-bold text-blue-600">{tableData.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">カテゴリ</h4>
                    <p className="text-2xl font-bold text-green-600">{[...new Set(tableData.map(item => item.category))].length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">合計価格</h4>
                    <p className="text-2xl font-bold text-purple-600">¥{tableData.reduce((sum, item) => {
                      const price = parseInt(item.price_std.replace(/[¥,]/g, ''));
                      return sum + price;
                    }, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'price-table' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Red Hat サブスクリプション価格表</h2>
              {/* 価格表コンポーネント */}
              <PriceTable tableData={tableData} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">分析</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">価格分析</h3>
                <div className="space-y-4">
                  {[...new Set(tableData.map(item => item.category))].map(category => {
                    const categoryItems = tableData.filter(item => item.category === category);
                    const avgPrice = categoryItems.reduce((sum, item) => {
                      return sum + parseInt(item.price_std.replace(/[¥,]/g, ''));
                    }, 0) / categoryItems.length;
                    
                    return (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold">{category}</h4>
                        <p className="text-sm text-gray-600">製品数: {categoryItems.length}</p>
                        <p className="text-sm text-gray-600">平均価格: ¥{Math.round(avgPrice).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* タブコンテナ（将来的な拡張用） */}
          <div id="tab-area" className="mt-6"></div>
        </div>
      </main>
      {/* ===== /メインコンテンツ ===== */}

    </div>
  );
}

export default App;