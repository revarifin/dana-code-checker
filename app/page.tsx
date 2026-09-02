'use client'

import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [shortUrl, setShortUrl] = useState('kodetunai7se2vdd9')
  const [amount, setAmount] = useState('')
  const [checking, setChecking] = useState(false)

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

  const saveInfo = () => {
    if (!amount.trim()) {
      alert('Nominal tidak boleh kosong')
      return
    }
    
    const info = {
      shortUrl,
      code,
      amount,
      timestamp: new Date().toLocaleString('id-ID')
    }
    
    // Simpan ke localStorage
    const saved = localStorage.getItem('dana_checks') || '[]'
    const history = JSON.parse(saved)
    history.unshift(info)
    localStorage.setItem('dana_checks', JSON.stringify(history.slice(0, 10)))
    
    alert('✓ Info berhasil disimpan!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dana Kode Tunai Helper
          </h1>
          <p className="text-gray-600 text-sm">
            Cek dan simpan info kode Dana
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nominal (isi setelah lihat di popup)
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">
                Rp
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="50000"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              />
            </div>
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

          <div className="flex gap-2">
            <button
              onClick={checkCode}
              disabled={!code.trim() || checking}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {checking ? '⏳ Membuka...' : '🔍 Buka Dana'}
            </button>
            <button
              onClick={saveInfo}
              disabled={!amount.trim() || !code.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              💾 Simpan Info
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">💡 Cara pakai:</span>
            <br />1. Isi kode di form
            <br />2. Klik &quot;🔍 Buka Dana&quot; → popup terbuka
            <br />3. Lihat nominal di popup, copy (📋) kodenya
            <br />4. Paste kode di popup, submit untuk cek
            <br />5. Isi nominal di form, klik &quot;💾 Simpan Info&quot;
          </p>
        </div>
      </div>
    </main>
  )
}
