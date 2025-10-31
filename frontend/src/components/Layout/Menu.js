(function () {
  const items = [
    { id: 'home', label: 'ホーム', href: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1zm10 0a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1z" /></svg>` },
    { id: 'upload', label: 'データ送信', href: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>` },
    { id: 'history', label: '選定履歴', href: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
  ];

  function buildMenu(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const ul = document.createElement('ul');
    ul.className = 'flex-grow space-y-2 pt-4';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'relative';
      const icon = item.icon.replace(/stroke="currentColor"/g, 'stroke="currentColor"').replace(/class="h-6 w-6"/g, 'class="h-6 w-6 text-white"');
      li.innerHTML = `
        <a href="${item.href}" class="flex h-12 items-center rounded-lg px-4 text-white hover:bg-gray-800 hover:text-white">
          ${icon}
          <span class="sidebar-text ml-4 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap">${item.label}</span>
        </a>
      `;
      ul.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(ul);

    ul.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (ev) => {
        const li = a.closest('li');
        if (!li) return;
        const idx = Array.from(ul.children).indexOf(li);
        const menuItem = items[idx];
        if (!menuItem) return;

        ev.preventDefault();

        if (menuItem.id === 'upload') {
          
          // 1. HTMLコンテンツ (ファイルリスト領域を常に表示し高さを確保)
          const content = `
            <div class="flex flex-col h-full p-4">
              
              <!-- 1. ドラッグ&ドロップ ゾーン (flex-growで高さを最大化) -->
              <div id="drop-zone" class="relative flex flex-col items-center justify-center grow border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 transition-colors duration-200">
                
                <svg id="drop-zone-icon" class="w-16 h-16 text-gray-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.33-2.13 3.75 3.75 0 013.88 5.22A4.5 4.5 0 0118 19.5H6.75z" />
                </svg>
                
                <p id="drop-zone-text" class="mt-4 text-sm font-medium text-gray-600 transition-colors duration-200">
                  ファイルをここにドラッグ＆ドロップ
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  または
                </p>
                
                <button id="file-browse-button" type="button" class="mt-3 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                  ファイルを選択
                </button>
                
                <input type="file" id="file-input" class="hidden" multiple />
              </div>
              
              <!-- 2. 選択されたファイルリスト (高さを固定し、hiddenを削除) -->
              <div id="file-list-container" class="mt-4 h-24 overflow-y-auto">
                <!-- &nbsp; で高さを確保し、ファイル選択時にテキストを差し替える -->
                <p id="file-list-title" class="text-sm font-medium text-gray-700">&nbsp;</p>
                <ul id="file-list" class="mt-2 list-disc list-inside text-sm text-gray-600">
                  <!-- ファイル名はJSでここに追加されます -->
                </ul>
              </div>

              <!-- 3. 送信ボタン (パネル右下) -->
              <div class="absolute right-4 bottom-4">
                <button id="upload-button" class="px-4 py-2 bg-gray-900 text-white rounded-md shadow-sm opacity-50 cursor-not-allowed" disabled>
                  送信
                </button>
              </div>
            </div>
          `;

          // 2. 浮動ウィンドウを開く
          if (window.openFloatingTab) {
            window.openFloatingTab(menuItem.label, content);
          } else {
            alert('タブ機能が利用できません');
            return;
          }

          // 3. イベントリスナーをアタッチ
          setTimeout(() => {
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const browseButton = document.getElementById('file-browse-button');
            const fileListTitle = document.getElementById('file-list-title'); // タイトル要素を取得
            const fileList = document.getElementById('file-list');
            const uploadButton = document.getElementById('upload-button');
            const dropZoneIcon = document.getElementById('drop-zone-icon');
            const dropZoneText = document.getElementById('drop-zone-text');

            if (!dropZone) return; 

            let selectedFiles = []; 

            // ファイルリストと送信ボタンの状態を更新する関数
            const updateFileList = () => {
              fileList.innerHTML = ''; // リストをクリア
              if (selectedFiles.length > 0) {
                fileListTitle.textContent = '選択されたファイル:'; // テキストを表示
                selectedFiles.forEach(file => {
                  const li = document.createElement('li');
                  li.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                  fileList.appendChild(li);
                });
                uploadButton.classList.remove('opacity-50', 'cursor-not-allowed');
                uploadButton.disabled = false;
              } else {
                fileListTitle.innerHTML = '&nbsp;'; // テキストを非表示（高さを維持）
                uploadButton.classList.add('opacity-50', 'cursor-not-allowed');
                uploadButton.disabled = true;
              }
            };
            
            // ドラッグ&ドロップ イベント
            dropZone.addEventListener('dragover', (e) => {
              e.preventDefault(); 
              dropZone.classList.add('border-blue-500', 'bg-blue-50');
              dropZoneIcon.classList.add('text-blue-500');
              dropZoneText.classList.add('text-blue-600');
            });

            dropZone.addEventListener('dragleave', (e) => {
              e.preventDefault();
              dropZone.classList.remove('border-blue-500', 'bg-blue-50');
              dropZoneIcon.classList.remove('text-blue-500');
              dropZoneText.classList.remove('text-blue-600');
            });

            dropZone.addEventListener('drop', (e) => {
              e.preventDefault();
              dropZone.classList.remove('border-blue-500', 'bg-blue-50');
              dropZoneIcon.classList.remove('text-blue-500');
              dropZoneText.classList.remove('text-blue-600');
              
              if (e.dataTransfer.files) {
                selectedFiles = Array.from(e.dataTransfer.files);
                fileInput.files = e.dataTransfer.files; 
                updateFileList();
              }
            });

            // 「ファイルを選択」ボタンのクリック
            browseButton.addEventListener('click', () => {
              fileInput.click();
            });

            // ファイル入力（<input>）の変更
            fileInput.addEventListener('change', () => {
              if (fileInput.files) {
                selectedFiles = Array.from(fileInput.files);
                updateFileList();
              }
            });

            // 送信ボタンのクリック（ダミー）
            uploadButton.addEventListener('click', () => {
              if (selectedFiles.length > 0) {
                alert(`${selectedFiles.length}個のファイルを送信します:\n${selectedFiles.map(f => f.name).join('\n')}`);
                // ここに実際のアップロード処理を実装
              }
            });

          }, 0); 

        } else {
          // 他（ホーム、選定履歴）のメニュー項目のデフォルト動作
        }
      });
    });
  }

  // DOMContentLoaded 時に自動描画
  document.addEventListener('DOMContentLoaded', () => {
    buildMenu('sidebar-menu');
  });

  // 公開 API
  window.renderSidebarMenu = buildMenu;
})();
