/*
• Sumber : https://whatsapp.com/channel/0029VbBW0L5AYlUPmohzsS0Y
*

/*
• Author : Andri Store

• Nama fitur : Facebook downloader
*/

import axios from "axios"

async function getToken() {
  const { data: html } = await axios.get("https://fbdownloader.to/id", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  })

  const match = html.match(/k_exp="(.*?)".*?k_token="(.*?)"/s)
  if (!match) throw new Error("Token tidak ditemukan")

  return { k_exp: match[1], k_token: match[2] }
}

export async function fbDownloader(fbUrl) {
  const { k_exp, k_token } = await getToken()

  const payload = new URLSearchParams({
    k_exp,
    k_token,
    p: "home",
    q: fbUrl,
    lang: "id",
    v: "v2",
    W: ""
  })

  const { data } = await axios.post(
    "https://fbdownloader.to/api/ajaxSearch",
    payload,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://fbdownloader.to",
        Referer: "https://fbdownloader.to/id"
      }
    }
  )

  if (!data?.data) throw new Error("Gagal mengambil data video")

  const html = data.data
  const results = []

  const regex = /<td class="video-quality">(.*?)<\/td>[\s\S]*?(?:href="(.*?)"|data-videourl="(.*?)")/g
  let m

  while ((m = regex.exec(html)) !== null) {
    const quality = m[1]?.trim()
    const url = m[2] || m[3]
    if (quality && url) results.push({ quality, url })
  }

  return results
}
