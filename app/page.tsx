'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<any>(null)

  const checkCode = async () => {
    if (!code.trim()) {
      alert('Kode tidak boleh kosong')
      return
    }

    setChecking(true)
    setResult(null)

    // Buka popup
    const popup = window.open(
      `https://m.dana.id/s/${shortUrl}`,
      'dana_checker',
      'width=400,height=700,left=100,top=100'
    )

    if (!popup) {
      alert('Popup diblokir! Allow popup di browser untuk melanjutkan.')
      setChecking(false)
      return
    }

    // Simulasi monitoring (karena cross-origin, kita tidak bisa baca isi popup)
    setResult({
      status: 'opened',
      message: `Popup terbuka! Masukkan kode "${code}" di halaman Dana.`,
      code: code
    })

    // Auto-stop monitoring setelah 30 detik
    setTimeout(() => {
      if (checking) {
        setChecking(false)
        setResult((prev: any) => ({
          ...prev,
          status: 'timeout',
          message: 'Apakah kode valid? Cek di popup yang terbuka.'
        }))
      }
    }, 30000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    alert('✓ Kode berhasil di-copy!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dana Kode Tunai Checker
          </h1>
          <p className="text-gray-600 text-sm">
            Validasi kode Dana dengan popup helper
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

          {code && !checking && (
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
            disabled={!code.trim() || checking}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {checking ? '⏳ Popup Terbuka...' : '🔍 Cek Kode'}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${
              result.status === 'opened' 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="text-blue-800">
                <p className="font-semibold mb-2">
                  {result.status === 'opened' ? '✓ Popup Terbuka' : 'ℹ️ Status'}
                </p>
                <p className="text-sm mb-3">{result.message}</p>
                {result.code && (
                  <div className="bg-white p-3 rounded border border-blue-300">
                    <p className="text-xs text-gray-600 mb-1">Kode untuk di-paste:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-lg font-bold text-center text-gray-800">
                        {result.code}
                      </code>
                      <button
                        onClick={copyCode}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">💡 Cara pakai:</span>
            <br />1. Masukkan kode di atas
            <br />2. Klik &quot;🔍 Cek Kode&quot;
            <br />3. Popup Dana akan terbuka otomatis
            <br />4. Klik 📋 untuk copy, lalu paste di popup
            <br />5. Submit di popup untuk lihat hasil (valid/tidak)
          </p>
        </div>
      </div>
    </main>
  )
}
