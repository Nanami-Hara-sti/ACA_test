(function () {
  function createTabsContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // ベースのタブ領域を作る
    const tabsWrapper = document.createElement('div');
    tabsWrapper.className = 'tabs-wrapper bg-white rounded-lg shadow-sm';

    // タブヘッダ
    const header = document.createElement('div');
    header.className = 'tab-headers flex border-b border-gray-200';
    tabsWrapper.appendChild(header);

    // タブコンテンツ領域
    const content = document.createElement('div');
    content.className = 'tab-contents p-4';
    tabsWrapper.appendChild(content);

    // 初期状態は空
    container.innerHTML = '';
    container.appendChild(tabsWrapper);

    return { header, content };
  }

  function openTab(containerId, title, innerHtml) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // タブ領域がなければ作る
    let wrapper = container.querySelector('.tabs-wrapper');
    let header, content;
    if (!wrapper) {
      const created = createTabsContainer(containerId);
      if (!created) return;
      header = created.header;
      content = created.content;
    } else {
      header = wrapper.querySelector('.tab-headers');
      content = wrapper.querySelector('.tab-contents');
    }

    // タブID（ユニーク）
    const id = 'tab-' + Date.now();

    // ヘッダボタン
    const btn = document.createElement('button');
    btn.className = 'tab-btn px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 focus:outline-none';
    btn.textContent = title;
    btn.dataset.tabId = id;

    // クリックでアクティブ化
    btn.addEventListener('click', () => {
      // 非アクティブ化
      header.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('border-b-2', 'border-blue-500', 'text-blue-600'));
      // コンテンツ切替
      content.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      btn.classList.add('border-b-2', 'border-blue-500', 'text-blue-600');
      const panel = content.querySelector(`#${id}`);
      if (panel) panel.classList.remove('hidden');
    });

    header.appendChild(btn);

    // コンテンツパネル
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = id;
    panel.innerHTML = innerHtml || '';
    content.appendChild(panel);

    // 直後にそのタブを選択
    btn.click();
  }

  // スラグ作成
  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // 浮動ウィンドウ（モーダル風）を開く
  function openFloatingTab(title, innerHtml, opts) {
    opts = opts || {};
    const slug = slugify(title || 'tab');
    const id = 'floating-tab-' + slug;

    // 既に同名の浮動ウィンドウがあればフォーカス（何もしない）
    const existing = document.getElementById(id);
    if (existing) {
      // bring to front
      existing.closest('.floating-overlay').style.zIndex = 60;
      return;
    }

    // オーバーレイ
    const overlay = document.createElement('div');
    overlay.className = 'floating-overlay fixed inset-0 z-50 flex items-center justify-center';

    // 背景暗幕
    const backdrop = document.createElement('div');
    backdrop.className = 'absolute inset-0 bg-black opacity-50';
    overlay.appendChild(backdrop);

    // パネル
    const panel = document.createElement('div');
    panel.id = id;
    // 幅はレスポンシブで半画面程度。小さい画面ではほぼ幅いっぱい、高さは60%。
    // (変更) 高さを h-4/5 (80%) に変更し、flex-col を追加
    panel.className = 'relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/5 h-4/5 flex flex-col overflow-hidden'; // overflow-auto から hidden に変更

    // ヘッダ
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between p-4 border-b flex-shrink-0'; // flex-shrink-0 を追加
    const h = document.createElement('h3');
    h.className = 'text-lg font-semibold';
    h.textContent = title || '';
    header.appendChild(h);

    // コントロール（閉じる）
    const ctrl = document.createElement('div');
    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-500 hover:text-gray-700 focus:outline-none ml-2';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    ctrl.appendChild(closeBtn);
    header.appendChild(ctrl);

    panel.appendChild(header);

    // コンテンツ
    const body = document.createElement('div');
    body.className = 'p-0 flex-grow relative overflow-y-auto'; // (変更) p-4 から p-0 に、 relative と flex-grow を追加
    body.innerHTML = innerHtml || '';
    panel.appendChild(body);

    overlay.appendChild(panel);

    // 閉じる動作
    function close() {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    // キーボード: Esc で閉じる
    function onKey(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);

    // 破棄時にキーハンドラを外す
    const origClose = close;
    close = function () {
      document.removeEventListener('keydown', onKey);
      origClose();
    };

    document.body.appendChild(overlay);

    // フォーカス
    panel.focus && panel.focus();
  }

  // 公開 API
  window.openTab = openTab;
  window.createTabsContainer = createTabsContainer;
  window.openFloatingTab = openFloatingTab;
})();
