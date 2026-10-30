import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const archivos = [
    { nombre: 'fisiologia.json', curso: 'Fisiología' },
    { nombre: 'fisiopatologia.json', curso: 'Fisiopatología' },
    { nombre: 'anatomia.json', curso: 'Anatomía' }
  ];
  
  let temasDisponibles = [];

  try {
    const { blobs } = await list();
    
    for (const item of archivos) {
      // ✅ CORRECCIÓN: Buscamos la ruta exacta dentro de la carpeta data
      const rutaCompleta = `data/${item.nombre}`;
      const blob = blobs.find(b => b.pathname === rutaCompleta);
      
      if (blob) {
        const response = await fetch(blob.url);
        const data = await response.json();
        
        // Extraemos los temas (ej. "Cardiovascular", "Digestiva")
        Object.keys(data).forEach(tema => {
          temasDisponibles.push({ 
            id: tema, 
            curso: item.curso, 
            archivo: item.nombre 
          });
        });
      } else {
        console.log(`No se encontró el archivo: ${rutaCompleta}`);
      }
    }
    
    return res.status(200).json(temasDisponibles);
  } catch (e) {
    console.error("Error en /api/temas:", e);
    return res.status(500).json({ error: e.message });
  }
}