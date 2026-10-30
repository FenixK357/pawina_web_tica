import { put, list } from '@vercel/blob';

const BLOB_PATHNAME = 'data/usuarios.json';

async function leerUsuarios() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    if (blobs.length === 0) return [];

    const res = await fetch(blobs[0].url);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function handler(req, res) {
  // GET: devuelve la lista de usuarios
  if (req.method === 'GET') {
    const usuarios = await leerUsuarios();
    return res.status(200).json(usuarios);
  }

  // POST: sobrescribe toda la lista de usuarios
  if (req.method === 'POST') {
    try {
      const usuarios = req.body;
      if (!Array.isArray(usuarios)) {
        return res.status(400).json({ error: 'Se esperaba un array' });
      }

      await put(BLOB_PATHNAME, JSON.stringify(usuarios), {
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

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}