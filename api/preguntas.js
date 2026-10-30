import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { temasSeleccionados } = req.body; 
  
  if (!temasSeleccionados || temasSeleccionados.length === 0) {
    return res.status(400).json({ error: 'No hay temas seleccionados' });
  }

  try {
    const { blobs } = await list();
    let todasLasPreguntas = [];
    
    const totalTemas = temasSeleccionados.length;
    let preguntasPorTema = [];
    if (totalTemas === 1) preguntasPorTema = [10];
    else if (totalTemas === 2) preguntasPorTema = [5, 5];
    else if (totalTemas === 3) preguntasPorTema = [3, 3, 4];

    for (let i = 0; i < totalTemas; i++) {
      const tema = temasSeleccionados[i];
      const rutaCompleta = `data/${tema.archivo}`; // ✅ CORRECCIÓN
      const blob = blobs.find(b => b.pathname === rutaCompleta);
      
      if (blob) {
        const response = await fetch(blob.url);
        const data = await response.json();
        const preguntasDelTema = data[tema.id];
        
        if (preguntasDelTema) {
          const mezcladas = preguntasDelTema.sort(() => Math.random() - 0.5);
          const seleccionadas = mezcladas.slice(0, preguntasPorTema[i]);
          todasLasPreguntas = [...todasLasPreguntas, ...seleccionadas];
        }
      }
    }

    todasLasPreguntas = todasLasPreguntas.sort(() => Math.random() - 0.5);
    return res.status(200).json(todasLasPreguntas);
    
  } catch (e) {
    console.error("Error en /api/preguntas:", e);
    return res.status(500).json({ error: e.message });
  }
}