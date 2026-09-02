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
      const res = await fetch('/api/check-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), shortUrl })
      })

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setResult({ error: err.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cek Kode Dana
          </h1>
          <p className="text-gray-600 text-sm">
            Validasi kode Kode Tunai Dana dengan mudah
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              onKeyDown={(e) => e.key === 'Enter' && checkCode()}
            />
          </div>

          <button
            onClick={checkCode}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Mengecek...' : 'Cek Kode'}
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.error 
              ? 'bg-red-50 border border-red-200' 
              : result.valid 
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
          }`}>
            {result.error ? (
              <div className="text-red-800">
                <p className="font-semibold">❌ Error</p>
                <p className="text-sm mt-1">{result.error}</p>
              </div>
            ) : result.valid ? (
              <div className="text-green-800">
                <p className="font-semibold">✅ Kode Valid!</p>
                <p className="text-sm mt-1">{result.message || 'Kode dapat digunakan'}</p>
              </div>
            ) : (
              <div className="text-yellow-800">
                <p className="font-semibold">⚠️ Kode Tidak Valid</p>
                <p className="text-sm mt-1">{result.message || 'Kode sudah dipakai atau kadaluarsa'}</p>
              </div>
            )}
            
            {result.details && (
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
