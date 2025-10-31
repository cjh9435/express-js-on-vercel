// api/search.js

export default async function handler(req, res) {
  const { q, id } = req.query;
  if (!q || !id) {
    return res.status(400).json({ error: "키워드(q)와 블로그 ID(id)가 필요합니다." });
  }

  try {
    const encodedKeyword = encodeURIComponent(q.trim());
    // ✅ 새 주소 (zzim2)
    const targetUrl = `https://zzim2.com/nViewRank/?keyword=${encodedKeyword}`;

    // CORS 프록시로 접근 (한국 IP 가능)
    const proxyUrl = `https://proxy.cors.sh/${targetUrl}`;

    const response = await fetch(proxyUrl, {
      headers: {
        "x-cors-api-key": "temp_0e9cc8cd8a9a9c5ad72b7c8c2c62b692",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json, text/html, */*",
        "Referer": "https://zzim2.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`프록시 응답 오류: ${response.status}`);
    }

    const text = await response.text();

    // 🔍 HTML 응답일 경우 내부 값 추출
    const volumeMatch = text.match(/검색량[:：]\s*([0-9,]+)/);
    const docMatch = text.match(/문서수[:：]\s*([0-9,]+)/);
    const rankMatch = text.match(/순위[:：]\s*([0-9,]+)/);

    const result = {
      searchVolume: volumeMatch ? volumeMatch[1].replace(/,/g, "") : "0",
      docCount: docMatch ? docMatch[1].replace(/,/g, "") : "0",
      rank: rankMatch ? rankMatch[1] : "-",
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "데이터 조회 실패", detail: error.message });
  }
}
