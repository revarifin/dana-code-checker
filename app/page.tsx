'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')
  const [showIframe, setShowIframe] = useState(false)
  const [status, setStatus] = useState('')

  const checkCode = () => {
    if (!code.trim()) {
      alert('Kode tidak boleh kosong')
      return
    }
    setStatus('Membuka halaman Dana...')
    setShowIframe(true)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    alert('Kode berhasil di-copy! Paste di halaman Dana yang muncul di bawah.')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dana Kode Tunai Checker
            </h1>
            <p className="text-gray-600 text-sm">
              Cek validitas kode langsung di browser
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL (setelah /s/)
              </label>
              <input
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                placeholder="kodetunai7se2vdd9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="998558"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
                onKeyDown={(e) => e.key === 'Enter' && checkCode()}
              />
            </div>

            {code && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">Kode yang akan dicek:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded text-lg font-bold text-center text-gray-800">
                    {code}
                  </code>
                  <button
                    onClick={copyCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    title="Copy kode"
                  >
                    📋
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={checkCode}
              disabled={!code.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ✓ Cek Kode di Halaman Dana
            </button>

            {status && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">{status}</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">💡 Cara pakai:</span>
              <br />1. Masukkan kode di atas
              <br />2. Klik &quot;Cek Kode di Halaman Dana&quot;
              <br />3. Halaman Dana akan muncul di bawah
              <br />4. Paste kode (klik 📋 untuk copy) di form yang muncul
              <br />5. Lihat hasilnya langsung (valid/tidak valid)
            </p>
          </div>
        </div>

        {showIframe && (
          <div className="bg-white rounded-2xl shadow-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-800">Halaman Dana:</h2>
              <button
                onClick={() => setShowIframe(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
              >
                ✕ Tutup
              </button>
            </div>
            <iframe
              src={`https://m.dana.id/s/${shortUrl}`}
              className="w-full h-[600px] border border-gray-300 rounded-lg"
              title="Dana Kode Tunai"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        )}
      </div>
    </main>
  )
}
