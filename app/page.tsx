'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')

  const openLink = () => {
    const url = `https://m.dana.id/s/${shortUrl}`
    window.open(url, '_blank')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    alert('Kode berhasil di-copy!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dana Kode Tunai Helper
          </h1>
          <p className="text-gray-600 text-sm">
            Simpan kode dan buka link Dana dengan mudah
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
            />
          </div>

          {code && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">Kode yang akan digunakan:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded text-lg font-bold text-center text-gray-800">
                  {code}
                </code>
                <button
                  onClick={copyCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          <button
            onClick={openLink}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            🔗 Buka Link Dana
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">💡 Cara pakai:</span>
            <br />1. Masukkan kode di atas
            <br />2. Klik &quot;Buka Link Dana&quot;
            <br />3. Paste kode di halaman Dana yang terbuka
          </p>
        </div>
      </div>
    </main>
  )
}
