// api/search.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { q, id } = req.query;

  if (!q || !id) {
    return res.status(400).json({ error: "키워드(q)와 블로그 ID(id)가 필요합니다." });
  }

  try {
    const encodedKeyword = encodeURIComponent(q);
    const zzimUrl = `https://www.zzimz.co.kr/api/keyword/${encodedKeyword}`;
    const zzimRes = await fetch(zzimUrl);
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
    res.status(500).json({ error: "데이터 조회 오류" });
  }
}
