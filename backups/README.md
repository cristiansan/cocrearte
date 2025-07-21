# Listado de Sesiones de Psicólogos

Esta es una página web responsive que permite cargar un archivo CSV con datos de sesiones de psicólogos y muestra un listado agrupado por profesional, fecha y comentarios/notas.

## ¿Cómo funciona?

1. Haz clic en el selector para elegir un archivo `.csv` desde tu computadora.
2. El archivo debe tener columnas como: nombre del profesional, fecha, comentarios/notas, etc.
3. La página mostrará un listado fácil de leer con la información agrupada por profesional.

## Ejemplo de CSV

```
Psicologo,Fecha,Comentarios
Juan Perez,2024-05-01,"Sesión inicial, paciente tranquilo"
Ana Lopez,2024-05-02,"Se trabajó sobre ansiedad"
Juan Perez,2024-05-08,"Seguimiento, avances positivos"
```

## Cómo hostear en GitHub Pages

1. Sube los archivos `index.html` y `script.js` a tu repositorio de GitHub.
2. Ve a la configuración del repositorio (Settings > Pages).
3. En "Source", selecciona la rama principal (main o master) y la carpeta raíz (`/`).
4. Guarda los cambios. Tu página estará disponible en `https://<tu-usuario>.github.io/<nombre-repo>/`.

---

Página creada para visualizar fácilmente sesiones de psicólogos a partir de un archivo CSV. 