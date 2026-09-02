import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { shortUrl } = await request.json()

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'shortUrl harus diisi' },
        { status: 400 }
      )
    }

    const url = `https://m.dana.id/s/${shortUrl}`
    
    // Fetch dengan follow redirect
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
      },
    })

    const finalUrl = response.url
    const html = await response.text()

    // Ekstrak nominal dari berbagai sumber
    let amount = null
    let amountSource = 'unknown'

    // 1. Cek dari URL parameter
    const urlParams = new URL(finalUrl).searchParams
    const amountParam = urlParams.get('amount') || urlParams.get('nominal')
    if (amountParam) {
      amount = amountParam
      amountSource = 'url_param'
    }

    // 2. Cek dari meta tag
    if (!amount) {
      const metaMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*Rp\s*[\d.,]+[^"]*)"/i)
      if (metaMatch) {
        const rpMatch = metaMatch[1].match(/Rp\s*([\d.,]+)/i)
        if (rpMatch) {
          amount = rpMatch[1]
          amountSource = 'meta_tag'
        }
      }
    }

    // 3. Cek dari JSON script tag
    if (!amount) {
      const jsonMatch = html.match(/<script[^>]*type="application\/json"[^>]*>([^<]+)<\/script>/i)
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1])
          if (data.amount) {
            amount = data.amount
            amountSource = 'json_script'
          }
        } catch (e) {
          // ignore
        }
      }
    }

    // 4. Cek dari window.__INITIAL_STATE__ atau similar
    if (!amount) {
      const stateMatch = html.match(/amount['":\s]+["']?([\d.,]+)/i)
      if (stateMatch) {
        amount = stateMatch[1]
        amountSource = 'inline_state'
      }
    }

    return NextResponse.json({
      success: true,
      shortUrl,
      finalUrl,
      amount: amount || 'Tidak ditemukan',
      amountSource,
      linkActive: response.status === 200,
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Gagal mengecek link',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
