// script.js

document.getElementById('csvFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    const text = evt.target.result;
    const data = parseMultiBlockCSV(text);
    console.log('Datos agrupados:', data);
    renderResults(data);
  };
  reader.readAsText(file);
});

function cleanString(str) {
  if (!str) return '';
  return str.replace(/^"|"$/g, '').trim();
}

function normalizeKey(str) {
  return str.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/gi, '');
}

function findKey(headers, keys) {
  const normalizedHeaders = headers.map(normalizeKey);
  for (const key of keys) {
    const normKey = normalizeKey(key);
    const idx = normalizedHeaders.findIndex(h => h.includes(normKey) || normKey.includes(h));
    if (idx !== -1) return headers[idx];
  }
  return undefined;
}

function parseMultiBlockCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  const profesionales = {};
  let i = 0;
  while (i < lines.length) {
    // Buscar bloque de profesional
    if (lines[i].toLowerCase().startsWith('profesional:')) {
      const profesional = cleanString(lines[i].replace('PROFESIONAL:', '').replace('profesional:', ''));
      i++;
      if (i >= lines.length) break;
      // Headers
      const headers = lines[i].split(',').map(h => h.trim());
      // Detectar claves
      const pacienteKey = findKey(headers, ['paciente', 'nombre paciente', 'nombre', 'usuario', 'user']);
      const fechaKey = findKey(headers, ['fecha', 'date', 'día', 'dia', 'fechaSesion']);
      const comentariosKey = findKey(headers, ['comentarios', 'comentario', 'notas', 'nota', 'comentarios y notas', 'comentarios/notas', 'observaciones', 'comentarioSesion', 'notasSesion']);
      i++;
      // Leer datos hasta el próximo profesional o EOF
      while (i < lines.length && !lines[i].toLowerCase().startsWith('profesional:')) {
        // Parsear respetando comillas
        const row = [];
        let current = '';
        let inQuotes = false;
        for (let c = 0; c < lines[i].length; c++) {
          const char = lines[i][c];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        row.push(current);
        // Saltar si la fila no tiene datos suficientes
        if (row.length < headers.length) { i++; continue; }
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx] || ''; });
        const paciente = cleanString(pacienteKey ? obj[pacienteKey] : '');
        const fecha = cleanString(fechaKey ? obj[fechaKey] : '');
        // Buscar ambos campos de comentarios y notas
        const comentario = cleanString(obj['comentarioSesion'] || obj['comentarios'] || obj['comentario'] || '');
        const notas = cleanString(obj['notasSesion'] || obj['notas'] || obj['nota'] || '');
        if (!fecha && !comentario && !notas) { i++; continue; }
        if (!profesionales[profesional]) profesionales[profesional] = {};
        if (!profesionales[profesional][fecha]) profesionales[profesional][fecha] = [];
        // Evitar duplicados exactos
        if (!profesionales[profesional][fecha].some(s => s.paciente === paciente && s.comentario === comentario && s.notas === notas)) {
          profesionales[profesional][fecha].push({ paciente, comentario, notas });
        }
        i++;
      }
    } else {
      i++;
    }
  }
  return profesionales;
}

function renderResults(profesionales) {
  const container = document.getElementById('results');
  if (!profesionales || Object.keys(profesionales).length === 0) {
    container.innerHTML = '<p>No se encontraron datos válidos en el archivo.</p>';
    return;
  }
  let html = '';
  Object.entries(profesionales).forEach(([profesional, fechas], idx) => {
    const profId = `prof-${idx}`;
    html += `<div class="profesional">
      <button class="prof-toggle" onclick="toggleSection('${profId}')"><h2>${profesional}</h2></button>
      <div id="${profId}" class="prof-content" style="display:none;">`;
    Object.entries(fechas).forEach(([fecha, sesiones], jdx) => {
      const fechaId = `${profId}-fecha-${jdx}`;
      html += `<div class="fecha">
        <button class="fecha-toggle" onclick="toggleSection('${fechaId}')"><strong>Fecha:</strong> ${fecha}</button>
        <div id="${fechaId}" class="fecha-content" style="display:none;">`;
      sesiones.forEach(sesion => {
        html += `<div class="sesion">`;
        if (sesion.paciente) {
          html += `<div><strong>Paciente:</strong> ${sesion.paciente}</div>`;
        }
        // Mostrar la fecha
        if (fecha) {
          html += `<div><strong>Fecha:</strong> ${fecha}</div>`;
        }
        // Mostrar ambos campos si existen
        if (sesion.comentario) {
          html += `<div><strong>Comentarios:</strong> ${sesion.comentario}</div>`;
        }
        if (sesion.notas) {
          html += `<div><strong>Notas:</strong> ${sesion.notas}</div>`;
        }
        if (!sesion.comentario && !sesion.notas) {
          html += `<div><strong>Comentarios/Notas:</strong> -</div>`;
        }
        html += `</div>`;
      });
      html += `</div></div>`;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html;
}

// Toggle helpers para colapsar/desplegar
window.toggleSection = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
  }
} 