import { useState } from 'react';

// 製品名の最大表示文字数
const MAX_NAME_LEN = 68;

const PriceTable = ({ tableData }) => {
  // 製品名のコピー処理
  const handleCopy = (textToCopy, event) => {
    event.stopPropagation();
    if (!navigator.clipboard) {
      alert("クリップボード機能が利用できません。");
      return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert(`「${textToCopy}」をコピーしました`);
    }, (err) => {
      alert(`コピーに失敗しました: ${err}`);
    });
  };

  // データが空の場合はメッセージを表示
  if (!tableData || tableData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">表示するデータがありません。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            
            {/* テーブルヘッダー */}
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-[10%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  製品カテゴリ
                </th>
                <th scope="col" className="w-[12%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  SKU
                </th>
                <th scope="col" className="w-[25%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  製品名
                </th>
                <th scope="col" className="w-[10%] py-3 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  標準価格
                </th>
                <th scope="col" className="w-[10%] py-3 px-6 text-right text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  提供価格
                </th>
                <th scope="col" className="w-[6%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  ソケット
                </th>
                <th scope="col" className="w-[6%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  コア
                </th>
                <th scope="col" className="w-[9%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  サポート
                </th>
                <th scope="col" className="w-[12%] py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate">
                  Unit of Measure
                </th>
              </tr>
            </thead>
            
            {/* テーブルボディ */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {tableData.map((row, index) => {
                const fullName = row.name || '';
                const displayName = fullName.length > MAX_NAME_LEN 
                  ? fullName.slice(0, MAX_NAME_LEN) + '…' 
                  : fullName;

                return (
                  <tr key={row.sku || index} className="hover:bg-gray-100 group">
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 truncate" title={row.category}>
                      {row.category}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 truncate" title={row.sku}>
                      {row.sku}
                    </td>
                    
                    {/* 製品名 (コピー機能付き) */}
                    <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-800">
                      <div className="flex items-center justify-between group">
                        <span className="truncate" title={fullName}>
                          {displayName}
                        </span>
                        <button
                          className="copy-to-clipboard-btn ml-2 p-0.5 rounded text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-all"
                          onClick={(e) => handleCopy(fullName, e)}
                          title="Copy"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-900 text-right truncate" title={row.price_std}>
                      {row.price_std}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-900 text-right truncate" title={row.price_offer}>
                      {row.price_offer}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 truncate" title={row.sockets}>
                      {row.sockets}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 truncate" title={row.cores}>
                      {row.cores}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 truncate" title={row.support}>
                      {row.support}
                    </td>
                    
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 truncate" title={row.uom}>
                      {row.uom}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceTable;