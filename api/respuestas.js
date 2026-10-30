import { put, list } from '@vercel/blob';

const BLOB_PATHNAME = 'data/respuestas.json';

async function leerRespuestas() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch (e) { return []; }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      let respuestas = await leerRespuestas();
      const nuevasRespuestas = req.body; // Array de respuestas
      
      respuestas = [...respuestas, ...nuevasRespuestas];
      
      await put(BLOB_PATHNAME, JSON.stringify(respuestas), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(405).end();
}