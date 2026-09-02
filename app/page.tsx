'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkCode = async () => {
    if (!code.trim()) {
      setResult({ error: 'Kode tidak boleh kosong' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Client-side direct request (bypass CORS via browser)
      const response = await fetch(`https://m.dana.id/s/${shortUrl}`, {
        method: 'GET',
        mode: 'no-cors', // Bypass CORS
      })

      // Karena no-cors, kita tidak bisa baca response
      // Tapi kita tahu request berhasil dikirim
      setResult({
        valid: null,
        message: `Link https://m.dana.id/s/${shortUrl} dapat diakses. Untuk validasi kode "${code}", silakan buka link di tab baru dan masukkan kode secara manual.`,
        linkUrl: `https://m.dana.id/s/${shortUrl}`,
        linkActive: true
      })
    } catch (err: any) {
      setResult({ 
        error: 'Tidak bisa mengakses server Dana',
        message: err.message 
      })
    } finally {
      setLoading(false)
    }
  }

  const openLink = () => {
    window.open(`https://m.dana.id/s/${shortUrl}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cek Kode Dana
          </h1>
          <p className="text-gray-600 text-sm">
            Helper untuk validasi Kode Tunai Dana
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
              Kode yang mau dicek
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

          <div className="flex gap-2">
            <button
              onClick={openLink}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🔗 Buka Link
            </button>
            <button
              onClick={checkCode}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? '⏳' : '✓ Simpan Info'}
            </button>
          </div>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.error 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            {result.error ? (
              <div className="text-red-800">
                <p className="font-semibold">❌ Error</p>
                <p className="text-sm mt-1">{result.error}</p>
              </div>
            ) : (
              <div className="text-blue-800">
                <p className="font-semibold">ℹ️ Informasi</p>
                <p className="text-sm mt-2">{result.message}</p>
                {result.linkUrl && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs font-medium mb-2">Kode yang akan dicek:</p>
                    <code className="bg-white px-3 py-2 rounded text-lg font-bold block text-center">
                      {code}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">⚠️ Catatan:</span> Server Dana memblokir validasi otomatis. 
            Klik <strong>"Buka Link"</strong> untuk cek kode secara manual di browser.
          </p>
        </div>
      </div>
    </main>
  )
}
