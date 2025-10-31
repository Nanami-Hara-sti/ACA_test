// ページ初期化: メニューを描画し、必要ならデフォルトのテーブルを描画する
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.renderSidebarMenu) {
      window.renderSidebarMenu('sidebar-menu');
    }
    // テーブルは場面によりデータが変わるため自動描画はオプション
    if (window.renderPriceTable && window.defaultPriceTableData) {
      // 初期表示としてデフォルトデータを描画（必要ない場合はコメントアウト可能）
      window.renderPriceTable('price-table', window.defaultPriceTableData);
    }
  });
})();
