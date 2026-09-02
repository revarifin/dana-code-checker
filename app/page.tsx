'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')
  const [checking, setChecking] = useState(false)
  const [linkInfo, setLinkInfo] = useState<any>(null)
  const [loadingLink, setLoadingLink] = useState(false)

  const checkLink = async () => {
    if (!shortUrl.trim()) {
      alert('Short URL tidak boleh kosong')
      return
    }

    setLoadingLink(true)
    setLinkInfo(null)

    try {
      const res = await fetch('/api/check-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortUrl: shortUrl.trim() })
      })

      const data = await res.json()
      setLinkInfo(data)
    } catch (err: any) {
      setLinkInfo({ error: err.message || 'Gagal mengecek link' })
    } finally {
      setLoadingLink(false)
    }
  }

  const checkCode = async () => {
    if (!code.trim()) {
      alert('Kode tidak boleh kosong')
      return
    }

    setChecking(true)

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

    setTimeout(() => setChecking(false), 2000)
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
            Cek nominal dan validasi kode Dana
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short URL (setelah /s/)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                placeholder="kodetunai7se2vdd9"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              />
              <button
                onClick={checkLink}
                disabled={loadingLink}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition font-medium"
              >
                {loadingLink ? '⏳' : '💰'}
              </button>
            </div>
          </div>

          {linkInfo && (
            <div className={`p-4 rounded-lg ${
              linkInfo.error 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              {linkInfo.error ? (
                <div className="text-red-800">
                  <p className="font-semibold">❌ Error</p>
                  <p className="text-sm mt-1">{linkInfo.error}</p>
                </div>
              ) : (
                <div className="text-green-800">
                  <p className="font-semibold mb-2">✓ Info Link</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nominal:</span> Rp {linkInfo.amount}</p>
                    <p><span className="font-medium">Status:</span> {linkInfo.linkActive ? 'Aktif' : 'Tidak aktif'}</p>
                    {linkInfo.amountSource !== 'unknown' && (
                      <p className="text-xs text-green-600">Sumber: {linkInfo.amountSource}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
            disabled={!code.trim() || checking}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {checking ? '⏳ Membuka Popup...' : '🔍 Cek Kode'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">💡 Cara pakai:</span>
            <br />1. Klik 💰 untuk cek nominal link
            <br />2. Masukkan kode di form
            <br />3. Klik &quot;🔍 Cek Kode&quot; untuk buka popup Dana
            <br />4. Copy kode (📋) dan paste di popup
            <br />5. Submit untuk lihat hasil
          </p>
        </div>
      </div>
    </main>
  )
}
