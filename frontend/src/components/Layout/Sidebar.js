(function () {
  // DOM 要素を取得
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const menuOpenButton = document.getElementById('menu-open-button');
  const sidebarLogo = document.getElementById('sidebar-logo');
  const sidebarTexts = document.querySelectorAll('.sidebar-text');

  if (!sidebar || !mainContent || !menuOpenButton) return; // 必要要素がない場合は何もしない

  // 状態
  let isSidebarOpen = false; // 展開(true)/折りたたみ(false)
  let isSidebarVisible = false; // 表示(true)/非表示(false)

  function showSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    sidebar.classList.remove('w-16');
    sidebar.classList.add('w-64');
    mainContent.classList.remove('pl-0');
    mainContent.classList.add('pl-64');
  // Labels always visible now; no opacity toggling
    isSidebarOpen = true;
    isSidebarVisible = true;
  }

  function hideSidebar() {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('w-64');
    sidebar.classList.add('w-16');
    mainContent.classList.remove('pl-64');
    mainContent.classList.add('pl-0');
  // Keep labels visible even when hidden (menu is same across all screens)
    isSidebarOpen = false;
    isSidebarVisible = false;
  }

  // トグル
  menuOpenButton.addEventListener('click', () => {
    if (isSidebarVisible) {
      hideSidebar();
    } else {
      showSidebar();
    }
  });

  // メイン領域クリックで閉じる
  mainContent.addEventListener('click', () => {
    if (isSidebarVisible) hideSidebar();
  });

  // 初期化: サイドバーは閉じた状態（短い幅）にしておく
  hideSidebar();
})();
