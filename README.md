# Growi — Directorio Agrícola de Baja California

## Cómo actualizar productores

Los datos de productores están en `src/Growi.jsx` al inicio del archivo en el array `PRODUCERS`.

Para agregar un nuevo productor, copia este template y llena los campos:

```js
{
  id: "BC-XXXX",          // ID único del productor
  region: "San Quintín",  // Región: Ensenada, Maneadero, Colonet, Vicente Guerrero, Camalú, San Quintín, El Rosario, Pescadero
  crops: ["Fresa"],       // Lista de cultivos
  capacity: "100 Tons/Mes", // Capacidad de producción
  acreage: 50,            // Hectáreas
  certifications: ["SENASICA"], // Certificaciones
  salesType: "EXPORT",    // EXPORT o DOMESTIC
  verified: true,         // true si lo visitaste en persona
  season: "Mar - Nov",    // Temporada de producción
},
```

Guarda el archivo en GitHub y Vercel automáticamente republica el sitio.

## Desarrollo local

```bash
npm install
npm run dev
```
