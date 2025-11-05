import { useState, useEffect, useRef } from 'react';
import PriceTable from './components/Table/PriceTable.jsx';
import { API_BASE_URL, API_ENDPOINTS, apiCall } from './config/api.js';

// 製品データ
const initialTableData = [
  { category: 'RHEL', sku: 'RH00001', name: 'Red Hat Enterprise Linux Server, Standard (Physical or Virtual Nodes)', price_std: '¥102,700', price_offer: '¥92,000', sockets: '2', cores: 'N/A', support: 'Standard', uom: 'Per 2 Sockets' },
  { category: 'RHEL', sku: 'RH00002', name: 'Red Hat Enterprise Linux Server, Premium (Physical or Virtual Nodes)', price_std: '¥165,000', price_offer: '¥148,000', sockets: '2', cores: 'N/A', support: 'Premium', uom: 'Per 2 Sockets' },
  { category: 'OpenShift', sku: 'MW00123', name: 'Red Hat OpenShift Platform Plus, Standard (Cores)', price_std: '¥2,580,000', price_offer: '¥2,322,000', sockets: 'N/A', cores: '100', support: 'Standard', uom: 'Per 100 Cores' },
  { category: 'Ansible', sku: 'SV00456', name: 'Red Hat Ansible Automation Platform', price_std: '¥1,935,000', price_offer: '¥1,741,500', sockets: 'N/A', cores: 'N/A', support: 'Premium', uom: 'Per 100 Nodes' },
  { category: 'RHEL for SAP', sku: 'RH03043', name: 'Red Hat Enterprise Linux for SAP Applications, Premium (Physical or Virtual Nodes)', price_std: '¥322,000', price_offer: '¥289,800', sockets: '2', cores: 'N/A', support: 'Premium', uom: 'Per 2 Sockets' }
];


// --- ▼ UploadModal コンポーネント (ファイル送信用) ▼ ---
const UploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ドラッグ操作のイベントハンドラ
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ファイルがドロップまたは選択されたときの処理
  const processFiles = (files) => {
    if (files && files.length > 0) {
      // 複数ファイルではなく、1つのファイルのみを受け入れる（またはFileListをそのままセット）
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  // ファイル選択ダイアログからの変更
  const handleFileChange = (e) => {
    processFiles(e.target.files);
    // 同じファイルを選択できるように値をリセット
    e.target.value = null; 
  };

  // 「ファイルを選択」ボタンのクリック
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 選択したファイルリストからファイルを削除
  const removeFile = (fileName) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  // 「送信」ボタンの処理
  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) return;

    // 親コンポーネント(App)にファイルを渡す
    onFileUpload(selectedFiles);

    // 状態をリセット
    setSelectedFiles([]);
    onClose();
  };
  
  // モーダルを閉じる処理（状態のリセットも行う）
  const handleClose = () => {
    setSelectedFiles([]);
    setIsDragging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // オーバーレイ (背景)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose} // 背景クリックで閉じる
    >
      {/* モーダル本体 */}
      <div 
        className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/5 h-4/5 max-w-4xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()} // モーダル内部のクリックは閉じない
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold">ファイル送信</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label="モーダルを閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツエリア (ドラッグ＆ドロップ) */}
        <div className="flex flex-col flex-grow p-6 overflow-y-auto">
          
          <div 
            id="drop-zone"
            className={`flex flex-col items-center justify-center flex-grow p-8 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg className="w-20 h-20 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg text-gray-700">ファイルをここにドラッグ＆ドロップ</p>
            <p className="text-gray-500 my-2">または</p>
            <button
              id="file-browse-button"
              onClick={handleFileSelectClick}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              ファイルを選択
            </button>
          </div>

          {/* 選択されたファイルリスト */}
          <div 
            id="file-list-container"
            className="flex-shrink-0 pt-4"
            style={{ minHeight: '6rem' }} 
          >
            <h4 
              className={`font-semibold text-gray-700 ${selectedFiles.length > 0 ? 'opacity-100' : 'opacity-0'}`}
            >
              選択されたファイル:
            </h4>
            <div id="file-list" className="mt-2 space-y-2">
              {selectedFiles.map(file => (
                <div key={file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <span className="text-sm text-gray-800 truncate" title={file.name}>{file.name}</span>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="ml-2 text-gray-500 hover:text-gray-600 focus:outline-none"
                    title="ファイルを削除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* フッター (送信ボタン) */}
        <div className="flex justify-end p-4 border-t flex-shrink-0">
          <button
            onClick={handleClose}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
          <button
            id="upload-button"
            onClick={handleUploadSubmit}
            disabled={selectedFiles.length === 0} 
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            送信
          </button>
        </div>

        {/* 隠しファイル入力 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
          multiple={true}
        />
      </div>
    </div>
  );
};


// --- ▼▼▼ TextUploadModal コンポーネント ▼▼▼ ---
const TextUploadModal = ({ isOpen, onClose, onTextUpload }) => {
  const [inputText, setInputText] = useState("");

  // 「送信」ボタンの処理
  const handleUploadSubmit = () => {
    if (inputText.trim() === "") return;
    onTextUpload(inputText);
    setInputText("");
    onClose();
  };
  
  // モーダルを閉じる処理
  const handleClose = () => {
    setInputText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    // オーバーレイ (背景)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose} // 背景クリックで閉じる
    >
      {/* モーダル本体 */}
      <div 
        className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/5 h-4/5 max-w-4xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()} // モーダル内部のクリックは閉じない
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold">テキスト送信</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label="モーダルを閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツエリア (テキストエリア) */}
        <div className="flex flex-col flex-grow p-6 overflow-y-auto">
          
          <div 
            id="text-input-zone"
            // (点線枠のデザインを適用)
            className="flex flex-col flex-grow p-2 border-2 border-dashed rounded-lg border-gray-300 focus-within:border-gray-500 transition-colors"
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ここにテキストを貼り付け、または入力してください..."
              className="w-full h-full p-4 border-none outline-none resize-none bg-transparent flex-grow"
            />
          </div>

          {/* (ファイルリストは不要) */}
          <div 
            id="text-info-container"
            className="flex-shrink-0 pt-4"
            style={{ minHeight: '6rem' }} 
          >
             <h4 className="font-semibold text-gray-700">
              入力文字数: {inputText.length}
            </h4>
          </div>
        </div>
        
        {/* フッター (送信ボタン) */}
        <div className="flex justify-end p-4 border-t flex-shrink-0">
          <button
            onClick={handleClose}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
          <button
            id="upload-button"
            onClick={handleUploadSubmit}
            // テキストが空の場合は無効化
            disabled={inputText.trim() === ""} 
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};


// --- ▼▼▼ メインの App コンポーネント ▼▼▼ ---
function App() {
  // --- 状態管理 ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tableData, setTableData] = useState(initialTableData);
  const [activeTab, setActiveTab] = useState('price-table');
  const [apiStatus, setApiStatus] = useState('未接続');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [textUploadModalOpen, setTextUploadModalOpen] = useState(false);
  
  const [floatingTabs, setFloatingTabs] = useState([]);

  // --- 関数 ---
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (tabId) => {
    if (tabId === 'upload') {
      setUploadModalOpen(true);
    } else if (tabId === 'text-upload') {
      setTextUploadModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const closeTextUploadModal = () => {
    setTextUploadModalOpen(false);
  };

  const openFloatingTab = (title, content) => {
    const id = Date.now();
    const newTab = { id, title, content };
    setFloatingTabs(prev => [...prev, newTab]);
  };

  const closeFloatingTab = (id) => {
    setFloatingTabs(prev => prev.filter(tab => tab.id !== id));
  };

  const generateSampleTable = (filename) => {
    const sampleData = [
      { id: 1, name: 'Red Hat Enterprise Linux Server', price: 102700, category: 'RHEL' },
      { id: 2, name: 'Red Hat OpenShift Platform Plus', price: 258000, category: 'OpenShift' },
    ];
    return `
      <div class="p-4">
        <h4 class="text-lg font-semibold mb-4">処理結果: ${filename}</h4>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th class="border border-gray-300 px-4 py-2 text-left">製品名</th>
                <th class="border border-gray-300 px-4 py-2 text-left">価格</th>
                <th class="border border-gray-300 px-4 py-2 text-left">カテゴリ</th>
              </tr>
            </thead>
            <tbody>
              ${sampleData.map(item => `
                <tr class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">${item.id}</td>
                  <td class="border border-gray-300 px-4 py-2">${item.name}</td>
                  <td class="border border-gray-300 px-4 py-2">¥${item.price.toLocaleString()}</td>
                  <td class="border border-gray-300 px-4 py-2">${item.category}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  const testApiConnection = async () => {
    try {
      setApiStatus('接続中...');
      const response = await apiCall(API_ENDPOINTS.TEST_DB); 
      setApiStatus('接続成功');
      console.log('API Response:', response);
    } catch (error) {
      setApiStatus('接続失敗');
      console.error('API connection failed:', error);
    }
  };

  useEffect(() => {
    // ページロード時にDB接続テストを実行
    // if (import.meta.env.MODE === 'development') {
    //   testApiConnection();
    // }
  }, []);

  // ESCキー
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (floatingTabs.length > 0) {
          const lastTab = floatingTabs[floatingTabs.length - 1];
          closeFloatingTab(lastTab.id);
        } else if (uploadModalOpen) {
          closeUploadModal();
        } else if (textUploadModalOpen) {
          closeTextUploadModal();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [floatingTabs, uploadModalOpen, textUploadModalOpen]);

  // メニュー項目
  const menuItems = [
    { id: 'home',
      name: 'ホーム',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },    
    { id: 'upload',
      name: 'ファイル送信',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    { 
      id: 'text-upload', 
      name: 'テキスト送信', 
      icon: ( 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg> 
      ) 
    },
    { id: 'price-table',
      name: 'ライセンス一覧',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    ];


  // --- JSX (レンダリング) ---
  return (
    <div className="flex min-h-screen text-gray-800">
      
      <nav 
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex h-full flex-col overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'w-64' : 'w-16'}
        `}
      >
        <div className={`flex h-16 items-center w-full border-b border-gray-800 transition-all ${
          isSidebarOpen ? 'justify-end px-4' : 'justify-center px-0'
        }`}>
        
            {/* 開閉両用のトグルボタン */}
            <button 
              id="menu-toggle-button" 
              onClick={toggleSidebar} 
              className="rounded-lg p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              aria-label="メニューを切り替える"
            >
              {isSidebarOpen ? (
                // 閉じる (左矢印) アイコン
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                // ハンバーガーアイコン
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
        </div>
        
        <div className="flex-grow">
          <ul className="list-none m-0 py-4 px-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex h-12 items-center rounded-lg px-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500
                    ${activeTab === item.id && item.id !== 'upload'
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  aria-label={item.name}
                >
                  {item.icon}
                  <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-auto list-none m-0 p-2 border-t border-gray-700">
          <li>
            <a href="#" className="flex h-12 items-center rounded-lg px-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}>
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
        className={`min-h-screen w-full flex-grow bg-gray-100 pl-16 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:pl-64' : 'md:pl-16'
        }`}
      >
        
        {/* メインコンテンツの中身 */}
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          
          {/* タブコンテナ */}
          {activeTab === 'home' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">ダッシュボード</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Red Hat License Manager へようこそ</h3>
                <p className="text-gray-600 mb-4">このダッシュボードでは、Red Hat製品のライセンス情報を管理できます。</p>
                
                {/* グリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">API接続状態</h4>
                    <p className={`text-xl font-bold ${
                      apiStatus === '接続成功' ? 'text-green-600' :
                      apiStatus === '接続失敗' ? 'text-gray-600' :
                      'text-yellow-600'
                    }`}>{apiStatus}</p>
                    <button 
                      onClick={testApiConnection}
                      className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded hover:bg-yellow-600"
                    >
                      再接続
                    </button>
                  </div>
                </div>
                
                {/* API情報 */}
                <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
                  <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
                  <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'price-table' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ライセンス一覧</h2>
              <PriceTable tableData={tableData} />
            </div>
          )}

          <div id="tab-area" className="mt-6"></div>
        </div>
      </main>
      {/* ===== /メインコンテンツ ===== */}

      {/* ファイル送信 */}
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={closeUploadModal} 
        onFileUpload={(files) => {
          console.log('Uploading files from App:', files);
          const file = files[0];
          const tableContent = generateSampleTable(file.name);
          openFloatingTab(`処理結果: ${file.name}`, tableContent);
        }}
      />
      
      {/* テキスト送信 */}
      <TextUploadModal
        isOpen={textUploadModalOpen}
        onClose={closeTextUploadModal}
        onTextUpload={(text) => {
          console.log('Uploading text from App:', text);
          // デモ: 処理結果を浮動タブで開く
          openFloatingTab(`処理結果: テキスト送信`, `<div class="p-4"><pre class="whitespace-pre-wrap text-sm text-gray-700">${text}</pre></div>`);
        }}
      />

      {/* 浮動タブ */}
      {floatingTabs.map((tab) => (
        <div key={tab.id} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 h-4/5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-semibold">{tab.title}</h3>
              <button
                onClick={() => closeFloatingTab(tab.id)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                aria-label="タブを閉じる"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div 
              className="flex-grow overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: tab.content }}
            />
          </div>
        </div>
      ))}

    </div>
  );
}

export default App;