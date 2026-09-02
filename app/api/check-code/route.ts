import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, shortUrl } = await request.json()

    if (!code || !shortUrl) {
      return NextResponse.json(
        { error: 'Kode dan shortUrl harus diisi' },
        { status: 400 }
      )
    }

    // Headers untuk simulate browser request
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'id-ID,id;q=0.9',
      'Content-Type': 'application/json',
      'Origin': 'https://m.dana.id',
      'Referer': `https://m.dana.id/s/${shortUrl}`,
    }

    // Step 1: Load halaman untuk dapat cookies (dengan timeout)
    const pageRes = await fetch(`https://m.dana.id/s/${shortUrl}`, {
      headers: {
        'User-Agent': headers['User-Agent'],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(8000), // 8 detik timeout
    })

    const cookies = pageRes.headers.get('set-cookie') || ''

    // Step 2: Submit kode ke API (dengan timeout)
    const claimRes = await fetch('https://m.dana.id/api/cashcode/claim', {
      method: 'POST',
      headers: {
        ...headers,
        'Cookie': cookies,
      },
      body: JSON.stringify({
        code: code,
        shortUrl: shortUrl,
      }),
      signal: AbortSignal.timeout(10000), // 10 detik timeout
    })

    const data = await claimRes.json()

    // Response processing
    if (claimRes.status === 200) {
      if (data.success === true) {
        return NextResponse.json({
          valid: true,
          message: 'Kode valid dan dapat digunakan',
          details: data,
        })
      } else {
        return NextResponse.json({
          valid: false,
          message: data.message || data.resultMessage || 'Kode tidak valid',
          details: data,
        })
      }
    } else {
      return NextResponse.json({
        valid: false,
        message: `HTTP ${claimRes.status}: ${data.message || 'Gagal memverifikasi kode'}`,
        details: data,
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Gagal terhubung ke server Dana',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
