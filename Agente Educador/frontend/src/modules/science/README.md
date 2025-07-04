# 🧪 Módulo de Ciencia

Módulo interactivo diseñado para enseñar conceptos científicos a niños de manera divertida y educativa.

## 🎯 Características

- **Experimentos Científicos**: Colección de experimentos categorizados por temas y niveles de dificultad.
- **Datos Curiosos**: Hechos científicos interesantes con actualización aleatoria.
- **Sistema de Búsqueda**: Búsqueda y filtrado avanzado de contenido.
- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla.
- **Modo Nocturno**: Soporte para tema claro/oscuro.

## 🛠️ Instalación

1. Asegúrate de tener instaladas las dependencias del proyecto:
   ```bash
   npm install
   # o
   yarn
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

3. Accede al módulo en:
   ```
   http://localhost:3001/science
   ```

## 🧩 Componentes Principales

### ScienceModule.tsx
Componente principal que gestiona el estado y la lógica del módulo.

### ScienceCard.tsx
Componente reutilizable para mostrar tarjetas de experimentos y datos científicos.

### Rutas
- `/science` - Vista principal
- `/science/:ageGroup` - Filtrado por grupo de edad (3-5, 6-8, 9-12)
- `/science/experiment/:id` - Detalle de experimento
- `/science/facts` - Lista de datos curiosos
- `/science/quiz` - Cuestionarios interactivos

## 📚 Tipos de Datos

### ScienceExperiment
```typescript
interface ScienceExperiment {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  safetyNotes: string[];
  ageGroup: AgeGroup; // '3-5' | '6-8' | '9-12'
  topic: ScienceTopic;
  duration: number; // en minutos
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  rating?: number;
  students?: number;
}
```

### ScienceFact
```typescript
interface ScienceFact {
  id: string;
  title: string;
  description: string;
  fact: string;
  imageUrl?: string;
  topics: ScienceTopic[];
  ageGroup: AgeGroup;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🎨 Temas y Categorías

Los temas disponibles son:
- Biología
- Química
- Física
- Espacio
- Tierra
- Animales
- Cuerpo Humano
- Tecnología
- Medio Ambiente

## 🤝 Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para más detalles.
