// api/search.js
export default async function handler(req, res) {
  const { q, id } = req.query;
  if (!q || !id) {
    return res.status(400).json({ error: "키워드(q)와 블로그 ID(id)가 필요합니다." });
  }

  try {
    const encodedKeyword = encodeURIComponent(q);
    // 한국 IP 우회용 프록시 서버 (Korean node)
    const proxyUrl = `https://proxy.cors.sh/https://www.zzimz.com/api/keyword/${encodedKeyword}`;

    const zzimRes = await fetch(proxyUrl, {
      headers: {
        "x-cors-api-key": "temp_0e9cc8cd8a9a9c5ad72b7c8c2c62b692", // 무료 테스트 키
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!zzimRes.ok) {
      throw new Error(`프록시 응답 오류: ${zzimRes.status}`);
    }

    const zzimData = await zzimRes.json();

    const result = {
      searchVolume: zzimData?.search_volume || "0",
      docCount: zzimData?.post_count || "0",
      rank: zzimData?.rank || "-",
      diff: zzimData?.diff || "-",
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "데이터 조회 실패", detail: error.message });
  }
}
