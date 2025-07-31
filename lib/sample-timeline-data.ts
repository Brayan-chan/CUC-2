import { TimelineService } from '@/lib/firebase-services';

const sampleTimelineEvents = [
  {
    title: "Fundación de la Universidad Autónoma de Campeche",
    description: "Se establece oficialmente la Universidad Autónoma de Campeche como institución de educación superior pública del estado de Campeche.",
    date: "1965-09-15",
    location: "Campeche, Campeche",
    type: "Otro" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/landscapes/architecture-signs"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "Primer Festival de Danza Folklórica",
    description: "Se realiza el primer festival de danza folklórica de la universidad, estableciendo una tradición cultural que perdura hasta nuestros días.",
    date: "1970-05-20",
    location: "Teatro Universitario UACAM",
    type: "Danza" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/people/bicycle"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "Inauguración del Centro Cultural",
    description: "Se inaugura el nuevo Centro Cultural de la universidad, diseñado para albergar eventos artísticos y culturales de gran envergadura.",
    date: "1985-11-10",
    location: "Centro Cultural UACAM",
    type: "Arte" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/landscapes/beach-boat"
    ],
    videos: [],
    isHighlighted: false,
    createdBy: "system"
  },
  {
    title: "Primer Concierto de la Orquesta Sinfónica Universitaria",
    description: "Debut de la recién formada Orquesta Sinfónica de la Universidad, marcando el inicio de una nueva era musical en la institución.",
    date: "1992-03-15",
    location: "Auditorio Principal UACAM",
    type: "Música" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/food/dessert"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "Festival Internacional de Teatro Universitario",
    description: "Primera edición del Festival Internacional de Teatro, atrayendo compañías teatrales de México y América Latina.",
    date: "2000-08-25",
    location: "Teatro Universitario UACAM",
    type: "Teatro" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/animals/three-dogs"
    ],
    videos: [],
    isHighlighted: false,
    createdBy: "system"
  },
  {
    title: "Concurso Nacional de Literatura Maya",
    description: "Se establece el primer concurso nacional dedicado a preservar y promover la literatura en lengua maya.",
    date: "2010-04-12",
    location: "Biblioteca Central UACAM",
    type: "Literatura" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/cloudinary-icon"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "50 Aniversario de la Universidad",
    description: "Celebración del 50 aniversario con una gran gala cultural que reunió a toda la comunidad universitaria y personalidades del estado.",
    date: "2015-09-15",
    location: "Campus Central UACAM",
    type: "Otro" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/landscapes/girl-urban-view"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "Inauguración del Museo de Arte Contemporáneo",
    description: "Apertura del nuevo museo dedicado al arte contemporáneo regional y nacional, con obras de artistas campechanos.",
    date: "2020-02-28",
    location: "Museo UACAM",
    type: "Arte" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/ecommerce/accessories-bag"
    ],
    videos: [],
    isHighlighted: false,
    createdBy: "system"
  },
  {
    title: "Festival Virtual de Cultura Digital",
    description: "Primer festival completamente virtual durante la pandemia, pionero en el uso de tecnologías digitales para eventos culturales.",
    date: "2021-06-15",
    location: "Plataforma Virtual UACAM",
    type: "Otro" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/people/jazz"
    ],
    videos: [],
    isHighlighted: true,
    createdBy: "system"
  },
  {
    title: "Encuentro de Danzas Prehispánicas",
    description: "Evento dedicado a preservar y difundir las danzas prehispánicas de la región maya, con participación de grupos de toda la península de Yucatán.",
    date: "2023-10-31",
    location: "Plaza Central UACAM",
    type: "Danza" as const,
    images: [
      "https://res.cloudinary.com/dmyejrbs7/image/upload/v1/samples/sheep"
    ],
    videos: [],
    isHighlighted: false,
    createdBy: "system"
  }
];

export async function createSampleTimelineData() {
  console.log('Iniciando creación de datos de muestra del timeline...');
  
  try {
    for (const event of sampleTimelineEvents) {
      const eventId = await TimelineService.create(event);
      console.log(`Evento del timeline creado: ${event.title} (ID: ${eventId})`);
    }
    
    console.log('✅ Datos de muestra del timeline creados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error creando datos de muestra del timeline:', error);
    return false;
  }
}

// También exportar la función para uso desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).createSampleTimelineData = createSampleTimelineData;
}
