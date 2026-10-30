import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const archivos = ['fisiologia.json', 'fisiopatologia.json', 'anatomia.json'];
  let temasDisponibles = [];

  try {
    const { blobs } = await list();
    for (const nombre of archivos) {
      const blob = blobs.find(b => b.pathname.endsWith(nombre));
      if (blob) {
        const response = await fetch(blob.url);
        const data = await response.json();
        // Extraemos solo las llaves (nombres de los temas)
        Object.keys(data).forEach(tema => {
          temasDisponibles.push({ id: tema, archivo: nombre });
        });
      }
    }
    return res.status(200).json(temasDisponibles);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}