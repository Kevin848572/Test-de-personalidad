const questions = [
  { id: 1,  text: "Prefiero pasar tiempo con grupos grandes de personas.", col: 1, dim: 'E/I' },
  { id: 2,  text: "Me fijo m\u00e1s en los detalles concretos y hechos reales.", col: 2, dim: 'S/N' },
  { id: 3,  text: "Me gusta describir las cosas de manera precisa y detallada.", col: 3, dim: 'S/N' },
  { id: 4,  text: "Tomo decisiones bas\u00e1ndome en la l\u00f3gica y la raz\u00f3n.", col: 4, dim: 'T/F' },
  { id: 5,  text: "Me considero una persona justa y objetiva.", col: 5, dim: 'T/F' },
  { id: 6,  text: "Me gusta tener un plan y seguirlo estrictamente.", col: 6, dim: 'J/P' },
  { id: 7,  text: "Me estresa la incertidumbre y la falta de planes.", col: 7, dim: 'J/P' },
  { id: 8,  text: "Me siento con energ\u00eda despu\u00e9s de asistir a una fiesta o reuni\u00f3n social.", col: 1, dim: 'E/I' },
  { id: 9,  text: "Conf\u00edo m\u00e1s en la informaci\u00f3n que proviene de mis experiencias directas.", col: 2, dim: 'S/N' },
  { id: 10, text: "Cuando leo, prefiero historias basadas en hechos reales.", col: 3, dim: 'S/N' },
  { id: 11, text: "Es m\u00e1s importante ser honesto que ser diplom\u00e1tico.", col: 4, dim: 'T/F' },
  { id: 12, text: "Analizo los pros y contras antes de decidir.", col: 5, dim: 'T/F' },
  { id: 13, text: "Prefiero que mi vida est\u00e9 estructurada y organizada.", col: 6, dim: 'J/P' },
  { id: 14, text: "Cierro cap\u00edtulos y tomo decisiones definitivas.", col: 7, dim: 'J/P' },
  { id: 15, text: "Disfruto conocer gente nueva y entablar conversaciones casuales.", col: 1, dim: 'E/I' },
  { id: 16, text: "Prefiero instrucciones paso a paso y claras.", col: 2, dim: 'S/N' },
  { id: 17, text: "Para tomar decisiones, me baso en informaci\u00f3n verificable.", col: 3, dim: 'S/N' },
  { id: 18, text: "Cuando resuelvo problemas, uso un enfoque anal\u00edtico.", col: 4, dim: 'T/F' },
  { id: 19, text: "Valoro m\u00e1s la competencia y la eficiencia.", col: 5, dim: 'T/F' },
  { id: 20, text: "Me gusta tener las cosas decididas con anticipaci\u00f3n.", col: 6, dim: 'J/P' },
  { id: 21, text: "Me siento inc\u00f3modo cuando las cosas cambian de \u00faltimo minuto.", col: 7, dim: 'J/P' },
  { id: 22, text: "Suelo pensar en voz alta mientras organizo mis ideas.", col: 1, dim: 'E/I' },
  { id: 23, text: "Me gusta trabajar con hechos, datos y evidencia concreta.", col: 2, dim: 'S/N' },
  { id: 24, text: "Disfruto m\u00e1s las experiencias sensoriales (comida, m\u00fasica, arte visual).", col: 3, dim: 'S/N' },
  { id: 25, text: "Prefiero que me digan la verdad aunque sea dura.", col: 4, dim: 'T/F' },
  { id: 26, text: "Prefiero ambientes donde predomine la l\u00f3gica.", col: 5, dim: 'T/F' },
  { id: 27, text: "Hago listas y horarios para organizar mis actividades.", col: 6, dim: 'J/P' },
  { id: 28, text: "Establezco metas claras y trabajo para alcanzarlas.", col: 7, dim: 'J/P' },
  { id: 29, text: "Prefiero trabajos que impliquen interactuar con muchas personas.", col: 1, dim: 'E/I' },
  { id: 30, text: "Presto atenci\u00f3n a lo que sucede aqu\u00ed y ahora.", col: 2, dim: 'S/N' },
  { id: 31, text: "Soy m\u00e1s consciente de mi entorno f\u00edsico inmediato.", col: 3, dim: 'S/N' },
  { id: 32, text: "Juzgo las situaciones bas\u00e1ndome en principios objetivos.", col: 4, dim: 'T/F' },
  { id: 33, text: "Las decisiones deben basarse en hechos objetivos.", col: 5, dim: 'T/F' },
  { id: 34, text: "Me siento m\u00e1s productivo cuando sigo una rutina.", col: 6, dim: 'J/P' },
  { id: 35, text: "Me gusta tener claridad sobre lo que har\u00e9 cada d\u00eda.", col: 7, dim: 'J/P' },
  { id: 36, text: "En reuniones, soy de los que m\u00e1s hablan y participan.", col: 1, dim: 'E/I' },
  { id: 37, text: "Prefiero aprender a trav\u00e9s de la pr\u00e1ctica y la experiencia directa.", col: 2, dim: 'S/N' },
  { id: 38, text: "Prefiero los pasatiempos que producen resultados tangibles.", col: 3, dim: 'S/N' },
  { id: 39, text: "Tiendo a ser objetivo e imparcial en mis decisiones.", col: 4, dim: 'T/F' },
  { id: 40, text: "Suelo decir lo que pienso directamente.", col: 5, dim: 'T/F' },
  { id: 41, text: "Prefiero trabajos con plazos y metas claras.", col: 6, dim: 'J/P' },
  { id: 42, text: "Prefiero eventos con horarios definidos y estructura.", col: 7, dim: 'J/P' },
  { id: 43, text: "Me resulta f\u00e1cil iniciar conversaciones con desconocidos.", col: 1, dim: 'E/I' },
  { id: 44, text: "Me considero una persona pr\u00e1ctica y realista.", col: 2, dim: 'S/N' },
  { id: 45, text: "Me considero una persona realista.", col: 3, dim: 'S/N' },
  { id: 46, text: "Me molestan las injusticias y las incoherencias l\u00f3gicas.", col: 4, dim: 'T/F' },
  { id: 47, text: "Cuando alguien tiene un problema, ofrezco soluciones pr\u00e1cticas.", col: 5, dim: 'T/F' },
  { id: 48, text: "Tengo un lugar para cada cosa y cada cosa en su lugar.", col: 6, dim: 'J/P' },
  { id: 49, text: "El orden y la organizaci\u00f3n son esenciales para m\u00ed.", col: 7, dim: 'J/P' },
  { id: 50, text: "Prefiero actividades grupales que individuales.", col: 1, dim: 'E/I' },
  { id: 51, text: "Disfruto m\u00e1s cuando me enfoco en una tarea a la vez.", col: 2, dim: 'S/N' },
  { id: 52, text: "Me gusta que las cosas sean medibles y cuantificables.", col: 3, dim: 'S/N' },
  { id: 53, text: "Las cr\u00edticas constructivas me ayudan a mejorar.", col: 4, dim: 'T/F' },
  { id: 54, text: "Me siento m\u00e1s c\u00f3modo con el debate intelectual.", col: 5, dim: 'T/F' },
  { id: 55, text: "Planifico mis vacaciones con itinerarios detallados.", col: 6, dim: 'J/P' },
  { id: 56, text: "Cuando empiezo un libro o proyecto, lo termino antes de empezar otro.", col: 7, dim: 'J/P' },
  { id: 57, text: "Disfruto ser el centro de atenci\u00f3n en eventos sociales.", col: 1, dim: 'E/I' },
  { id: 58, text: "Valoro m\u00e1s la utilidad pr\u00e1ctica de las cosas.", col: 2, dim: 'S/N' },
  { id: 59, text: "Aprendo mejor cuando veo ejemplos pr\u00e1cticos.", col: 3, dim: 'S/N' },
  { id: 60, text: "Defiendo mis decisiones con argumentos l\u00f3gicos.", col: 4, dim: 'T/F' },
  { id: 61, text: "Prefiero l\u00edderes que sean firmes y decisivos.", col: 5, dim: 'T/F' },
  { id: 62, text: "Me gusta terminar un proyecto antes de comenzar otro.", col: 6, dim: 'J/P' },
  { id: 63, text: "Me siento mejor cuando mi entorno est\u00e1 ordenado.", col: 7, dim: 'J/P' },
  { id: 64, text: "Tengo muchos amigos y conocidos con quienes me mantengo en contacto.", col: 1, dim: 'E/I' },
  { id: 65, text: "Prefiero rutinas y m\u00e9todos probados.", col: 2, dim: 'S/N' },
  { id: 66, text: "Prefiero conversaciones sobre temas cotidianos y concretos.", col: 3, dim: 'S/N' },
  { id: 67, text: "Resuelvo conflictos estableciendo reglas claras.", col: 4, dim: 'T/F' },
  { id: 68, text: "La verdad objetiva es m\u00e1s importante que la armon\u00eda del grupo.", col: 5, dim: 'T/F' },
  { id: 69, text: "La puntualidad y el cumplimiento de plazos son fundamentales.", col: 6, dim: 'J/P' },
  { id: 70, text: "Las reglas y normas existen para cumplirse.", col: 7, dim: 'J/P' }
];

const colMap = { 1: { A: 'E', B: 'I' }, 2: { A: 'S', B: 'N' }, 3: { A: 'S', B: 'N' }, 4: { A: 'T', B: 'F' }, 5: { A: 'T', B: 'F' }, 6: { A: 'J', B: 'P' }, 7: { A: 'J', B: 'P' } };

const dimClass = { 'E/I': 'dim-ei', 'S/N': 'dim-sn', 'T/F': 'dim-tf', 'J/P': 'dim-jp' };

const infoPersonalidades = {
  'INTJ': {
    titulo: 'INTJ \u2014 El Arquitecto',
    descripcion: 'Pensador estrat\u00e9gico con una visi\u00f3n clara del futuro. Los INTJ son planificadores meticulosos que disfrutan dise\u00f1ando sistemas eficientes y mejorando procesos. Prefieren trabajar de forma independiente y valoran la competencia intelectual por encima de todo.',
    fortalezas: ['Vis\u00f3n estrat\u00e9gica para anticipar problemas y oportunidades a largo plazo', 'Alta capacidad de an\u00e1lisis y pensamiento cr\u00edtico para resolver problemas complejos', 'Compromiso firme con la calidad y la mejora continua de los procesos'],
    debilidades: ['Tienden a ser directos y bruscos al comunicar, lo que puede generar fricciones', 'Dificultad para aceptar sugerencias o reconocer errores propios', 'Pueden parecer fr\u00edos o distantes en entornos que requieren calidez emocional']
  },
  'INTP': {
    titulo: 'INTP \u2014 El L\u00f3gico',
    descripcion: 'Mente anal\u00edtica que busca comprender los principios fundamentales de todo. Los INTP disfrutan explorando teor\u00edas abstractas y cuestionando suposiciones establecidas. Son innovadores silenciosos que prefieren la profundidad intelectual sobre las interacciones sociales.',
    fortalezas: ['Pensamiento innovador para encontrar soluciones originales a problemas t\u00e9cnicos', 'Objetividad y rigor l\u00f3gico al evaluar datos sin sesgos emocionales', 'Curiosidad intelectual que los mantiene actualizados en su campo de especializaci\u00f3n'],
    debilidades: ['Dificultad para llevar las ideas a la acci\u00f3n con plazos concretos', 'Tienden a aislarse y descuidar la comunicaci\u00f3n con el equipo', 'Pueden perderse en detalles te\u00f3ricos sin priorizar lo pr\u00e1ctico']
  },
  'ENTJ': {
    titulo: 'ENTJ \u2014 El Comandante',
    descripcion: 'L\u00edder nato con una determinaci\u00f3n inquebrantable para alcanzar metas. Los ENTJ organizan personas y recursos de manera eficiente, y no temen tomar decisiones dif\u00edciles. Su energ\u00eda y visi\u00f3n los convierten en impulsores naturales del cambio organizacional.',
    fortalezas: ['Liderazgo firme para dirigir equipos hacia objetivos ambiciosos y medibles', 'Eficiencia ejecutiva para delegar tareas y optimizar el uso del tiempo', 'Capacidad para tomar decisiones r\u00e1pidas bajo presi\u00f3n con informaci\u00f3n limitada'],
    debilidades: ['Impaciencia con quienes no siguen su ritmo o est\u00e1ndares de trabajo', 'Pueden ser autoritarios y no escuchar opiniones divergentes', 'Descuido del bienestar emocional del equipo al priorizar los resultados']
  },
  'ENTP': {
    titulo: 'ENTP \u2014 El Innovador',
    descripcion: 'Generador incansable de ideas y nuevas posibilidades. Los ENTP disfrutan el debate intelectual y desafiar el status quo. Su mente \u00e1gil encuentra conexiones donde otros no las ven, lo que los hace valiosos en tormentas de ideas y procesos de cambio.',
    fortalezas: ['Creatividad disruptiva para proponer soluciones no convencionales a viejos problemas', 'Agilidad mental para adaptarse r\u00e1pidamente a contextos cambiantes', 'Habilidad para conectar conceptos de \u00e1reas dispares y generar innovaci\u00f3n'],
    debilidades: ['Dificultad para dar seguimiento y finalizar los proyectos que inician', 'Tienden a ser argumentativos y a buscar conflicto intelectual innecesario', 'Pueden aburrirse f\u00e1cilmente y perder el foco en tareas rutinarias']
  },
  'INFJ': {
    titulo: 'INFJ \u2014 El Abogado',
    descripcion: 'Idealista con una profunda comprensi\u00f3n de las motivaciones humanas. Los INFJ buscan significado y prop\u00f3sito en su trabajo, y son capaces de inspirar a otros hacia una visi\u00f3n compartida. Su empat\u00eda y visi\u00f3n sist\u00e9mica los convierten en mediadores naturales.',
    fortalezas: ['Empat\u00eda profunda para comprender necesidades no expresadas del equipo', 'Visi\u00f3n inspiradora que alinea a las personas con un prop\u00f3sito com\u00fan', 'Capacidad para mediar conflictos y restaurar la armon\u00eda grupal'],
    debilidades: ['Tienden a idealizar situaciones y personas, generando expectativas poco realistas', 'Dificultad para manejar cr\u00edticas directas o entornos altamente competitivos', 'Pueden agotarse emocionalmente al absorber los problemas de los dem\u00e1s']
  },
  'INFP': {
    titulo: 'INFP \u2014 El Mediador',
    descripcion: 'Creativo guiado por valores personales profundos y un fuerte sentido de autenticidad. Los INFP destacan en entornos que valoran la originalidad y la colaboraci\u00f3n humana. Defienden causas justas y buscan que su trabajo tenga un impacto positivo en la sociedad.',
    fortalezas: ['Creatividad aut\u00e9ntica para generar ideas alineadas con valores humanos', 'Empat\u00eda genuina que crea un ambiente de confianza y apoyo mutuo', 'Compromiso \u00e9tico con causas que promueven el bienestar colectivo'],
    debilidades: ['Dificultad para manejar conflictos directos o tomar decisiones impopulares', 'Pueden postergar tareas importantes por buscar la perfecci\u00f3n', 'Tienden a internalizar las cr\u00edticas y tomarlas como un ataque personal']
  },
  'ENFJ': {
    titulo: 'ENFJ \u2014 El Protagonista',
    descripcion: 'L\u00edder carism\u00e1tico que inspira y desarrolla el potencial de los dem\u00e1s. Los ENFJ son comunicadores excepcionales que construyen equipos cohesionados. Su habilidad para motivar y su visi\u00f3n humanista los convierten en agentes de cambio positivo.',
    fortalezas: ['Liderazgo inspirador que motiva a los equipos a dar lo mejor de s\u00ed mismos', 'Comunicaci\u00f3n persuasiva para alinear voluntades en torno a objetivos compartidos', 'Habilidad para detectar y potenciar el talento individual de cada colaborador'],
    debilidades: ['Pueden descuidar sus propias necesidades al enfocarse excesivamente en los dem\u00e1s', 'Dificultad para aceptar cr\u00edticas o se\u00f1alamientos sobre su desempe\u00f1o', 'Tienden a evitar conflictos necesarios por miedo a da\u00f1ar la armon\u00eda del grupo']
  },
  'ENFP': {
    titulo: 'ENFP \u2014 El Activista',
    descripcion: 'Esp\u00edritu libre y entusiasta que contagia energ\u00eda positiva a su alrededor. Los ENFP exploran constantemente nuevas ideas y posibilidades, y destacan en entornos din\u00e1micos que requieren creatividad. Su carisma natural construye puentes entre personas diversas.',
    fortalezas: ['Entusiasmo contagioso que eleva la moral del equipo en momentos desafiantes', 'Creatividad vers\u00e1til para abordar problemas desde m\u00faltiples perspectivas', 'Habilidad para conectar con personas diversas y construir relaciones s\u00f3lidas'],
    debilidades: ['Dificultad para mantener el foco en una sola tarea o proyecto a largo plazo', 'Pueden ser percibidos como desorganizados o poco estructurados', 'Tienden a comprometerse en exceso y luego no cumplir todas las expectativas']
  },
  'ISTJ': {
    titulo: 'ISTJ \u2014 El Inspector',
    descripcion: 'Persona responsable y meticulosa que valora el orden y la tradici\u00f3n. Los ISTJ son pilares de confiabilidad en cualquier organizaci\u00f3n, cumpliendo sus compromisos con rigor y atenci\u00f3n al detalle. Prefieren procedimientos claros y objetivos medibles.',
    fortalezas: ['Confiabilidad absoluta para cumplir plazos y entregables con calidad consistente', 'Atenci\u00f3n al detalle para detectar errores que otros pasan por alto', 'Compromiso con las normas y procedimientos que garantizan el orden organizacional'],
    debilidades: ['Resistencia al cambio y dificultad para adaptarse a metodolog\u00edas no probadas', 'Pueden ser percibidos como r\u00edgidos o excesivamente formales en el trato', 'Dificultad para ver el panorama general al enfocarse en detalles operativos']
  },
  'ISFJ': {
    titulo: 'ISFJ \u2014 El Defensor',
    descripcion: 'Protector dedicado que antepone el bienestar del equipo a todo. Los ISFJ son el soporte silencioso de las organizaciones, asegurando que todos tengan lo necesario para trabajar. Su memoria para los detalles y su lealtad los convierten en colaboradores invaluables.',
    fortalezas: ['Lealtad y compromiso excepcional con el equipo y los objetivos organizacionales', 'Memoria detallada para recordar informaci\u00f3n clave sobre proyectos y personas', 'Servicio desinteresado que apoya a compa\u00f1eros sin buscar reconocimiento'],
    debilidades: ['Dificultad para decir que no, acumulando m\u00e1s trabajo del que pueden manejar', 'Pueden resistirse a cambios que alteren la estabilidad del entorno laboral', 'Tienden a subestimar sus propias contribuciones y evitar posiciones de liderazgo']
  },
  'ESTJ': {
    titulo: 'ESTJ \u2014 El Supervisor',
    descripcion: 'Organizador nato que establece estructura y orden donde sea necesario. Los ESTJ son gerentes eficientes que aseguran que las operaciones funcionen sin contratiempos. Valoran la competencia, la puntualidad y el cumplimiento de los objetivos establecidos.',
    fortalezas: ['Capacidad ejecutiva para organizar equipos y recursos hacia metas concretas', 'Toma de decisiones r\u00e1pida basada en hechos y experiencia pr\u00e1ctica', 'Compromiso con la eficiencia operativa y la mejora de procesos medibles'],
    debilidades: ['Pueden ser autoritarios y no considerar opiniones que desaf\u00eden su autoridad', 'Dificultad para adaptarse a entornos ambiguos o sin jerarqu\u00edas claras', 'Tienden a priorizar resultados sobre relaciones, generando un clima fr\u00edo']
  },
  'ESFJ': {
    titulo: 'ESFJ \u2014 El C\u00f3nsul',
    descripcion: 'Persona c\u00e1lida y cooperativa que construye comunidades s\u00f3lidas a su alrededor. Los ESFJ destacan por su habilidad para crear ambientes armoniosos y su compromiso con servir a los dem\u00e1s. Son el pegamento social que mantiene unidos a los equipos de trabajo.',
    fortalezas: ['Habilidad para construir un clima laboral positivo y relaciones de confianza', 'Organizaci\u00f3n meticulosa de eventos, agendas y actividades colaborativas', 'Empat\u00eda pr\u00e1ctica para anticipar necesidades del equipo y ofrecer apoyo oportuno'],
    debilidades: ['Dificultad para aceptar cr\u00edticas o situaciones que rompan la armon\u00eda del grupo', 'Pueden descuidar sus propias prioridades por atender las necesidades de otros', 'Tienden a ser excesivamente tradicionales y resistirse a enfoques novedosos']
  },
  'ISTP': {
    titulo: 'ISTP \u2014 El Virtuoso',
    descripcion: 'Solucionador pr\u00e1ctico con habilidades t\u00e9cnicas excepcionales. Los ISTP entienden c\u00f3mo funcionan los sistemas f\u00edsicos y abstractos, y destacan en situaciones que requieren respuestas r\u00e1pidas y eficaces. Prefieren la acci\u00f3n directa sobre la teorizaci\u00f3n prolongada.',
    fortalezas: ['Habilidad t\u00e9cnica para diagnosticar y resolver problemas pr\u00e1cticos r\u00e1pidamente', 'Flexibilidad para adaptarse a entornos cambiantes y crisis imprevistas', 'Mente anal\u00edtica que comprende sistemas complejos con rapidez'],
    debilidades: ['Pueden ser reservados y no compartir informaci\u00f3n importante con el equipo', 'Dificultad para comprometerse con planes a largo plazo o rutinas estrictas', 'Tienden a minimizar la importancia de las normas y los procedimientos formales']
  },
  'ISFP': {
    titulo: 'ISFP \u2014 El Aventurero',
    descripcion: 'Artista silencioso que aporta sensibilidad est\u00e9tica y autenticidad al entorno laboral. Los ISFP valoran la libertad creativa y disfrutan trabajando en proyectos que reflejen sus valores personales. Su presencia tranquila y su mirada \u00fanica enriquecen cualquier equipo.',
    fortalezas: ['Sensibilidad est\u00e9tica para mejorar la presentaci\u00f3n y el dise\u00f1o de proyectos', 'Autenticidad y coherencia entre sus valores personales y su trabajo', 'Capacidad para trabajar de forma independiente con alta calidad en tareas creativas'],
    debilidades: ['Dificultad para expresar sus ideas en entornos altamente competitivos o verbales', 'Pueden evitar conflictos y no defender sus posiciones cuando es necesario', 'Tienden a postergar tareas administrativas o burocr\u00e1ticas que les resultan tediosas']
  },
  'ESTP': {
    titulo: 'ESTP \u2014 El Emprendedor',
    descripcion: 'Persona en\u00e9rgica y orientada a la acci\u00f3n que prospera en entornos din\u00e1micos. Los ESTP son negociadores h\u00e1biles que detectan oportunidades donde otros ven obst\u00e1culos. Su carisma y rapidez los convierten en l\u00edderes naturales en situaciones de crisis o cambio.',
    fortalezas: ['Capacidad para tomar decisiones r\u00e1pidas en entornos de alta presi\u00f3n', 'Habilidad de negociaci\u00f3n para cerrar acuerdos y mover proyectos hacia adelante', 'Carisma y energ\u00eda que motivan a la acci\u00f3n en momentos de incertidumbre'],
    debilidades: ['Pueden ser impulsivos y no considerar las consecuencias a largo plazo', 'Dificultad para seguir procedimientos establecidos o tareas repetitivas', 'Tienden a aburrirse r\u00e1pidamente y buscar nuevos est\u00edmulos constantemente']
  },
  'ESFP': {
    titulo: 'ESFP \u2014 El Animador',
    descripcion: 'Esp\u00edritu vibrante que ilumina cualquier espacio de trabajo con su entusiasmo. Los ESFP son el coraz\u00f3n social de las organizaciones, conectando personas y celebrando los logros colectivos. Su energ\u00eda positiva y su pragmatismo los hacen excelentes en roles que requieren interacci\u00f3n constante.',
    fortalezas: ['Carisma natural para generar un ambiente laboral positivo y colaborativo', 'Pragmatismo para resolver problemas del d\u00eda a d\u00eda con soluciones pr\u00e1cticas', 'Habilidad para conectar con personas de todos los niveles y construir redes s\u00f3lidas'],
    debilidades: ['Dificultad para concentrarse en tareas solitarias o que requieren an\u00e1lisis profundo', 'Pueden priorizar la diversi\u00f3n sobre la responsabilidad en momentos cr\u00edticos', 'Tienden a evitar planificaciones detalladas y prefieren la improvisaci\u00f3n']
  }
};

function getDate() {
  return new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderDate() {
  document.getElementById('dateDisplay').textContent = getDate();
}

// ---------- answers store ----------
const answers = {};

function getCount() {
  return Object.keys(answers).length;
}

function updateUI() {
  const n = getCount();
  document.getElementById('progressText').textContent = n + ' / 70';
  document.getElementById('progressFill').style.width = (n / 70 * 100) + '%';
  document.getElementById('footerSummary').textContent = n + ' de 70 preguntas respondidas';
}

// ---------- build questions with button UI ----------
function buildQuestions() {
  const c = document.getElementById('questionsContainer');
  c.innerHTML = '';

  questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = 'q-card-' + q.id;

    const top = document.createElement('div');
    top.className = 'card-top';

    const num = document.createElement('span');
    num.className = 'question-number';
    num.textContent = 'Pregunta ' + q.id;

    const tag = document.createElement('span');
    tag.className = 'dimension-tag ' + (dimClass[q.dim] || '');
    tag.textContent = q.dim;

    top.appendChild(num);
    top.appendChild(tag);

    const text = document.createElement('div');
    text.className = 'question-text';
    text.textContent = q.text;

    const opts = document.createElement('div');
    opts.className = 'question-options';

    // hidden native select for data storage
    const sel = document.createElement('select');
    sel.id = 'q-' + q.id;
    sel.style.display = 'none';
    const dflt = document.createElement('option'); dflt.value = ''; dflt.selected = true;
    const oA = document.createElement('option'); oA.value = 'A';
    const oB = document.createElement('option'); oB.value = 'B';
    sel.appendChild(dflt); sel.appendChild(oA); sel.appendChild(oB);

    // button A
    const btnA = document.createElement('button');
    btnA.type = 'button';
    btnA.className = 'option-btn';
    btnA.innerHTML = '<span class="opt-key">A</span> ' + q.dim.split('/')[0];
    btnA.dataset.value = 'A';

    // button B
    const btnB = document.createElement('button');
    btnB.type = 'button';
    btnB.className = 'option-btn';
    btnB.innerHTML = '<span class="opt-key">B</span> ' + q.dim.split('/')[1];
    btnB.dataset.value = 'B';

    function select(val) {
      if (answers[q.id] === val) {
        delete answers[q.id];
        sel.value = '';
        btnA.classList.remove('selected-a');
        btnB.classList.remove('selected-b');
        card.classList.remove('answered');
      } else {
        answers[q.id] = val;
        sel.value = val;
        btnA.classList.toggle('selected-a', val === 'A');
        btnB.classList.toggle('selected-b', val === 'B');
        card.classList.add('answered');
      }
      updateUI();
    }

    btnA.addEventListener('click', function () { select('A'); });
    btnB.addEventListener('click', function () { select('B'); });

    opts.appendChild(btnA);
    opts.appendChild(sel);
    opts.appendChild(btnB);

    card.appendChild(top);
    card.appendChild(text);
    card.appendChild(opts);

    // staggered animation delay
    card.style.animationDelay = (i * 0.025) + 's';

    c.appendChild(card);
  });
}

// ---------- start ----------
function startTest() {
  const inp = document.getElementById('nameInput');
  const name = inp.value.trim();
  if (!name) {
    inp.classList.add('input-error');
    inp.focus();
    setTimeout(function () { inp.classList.remove('input-error'); }, 2000);
    return;
  }

  document.getElementById('evaluatedName').textContent = name;

  // transition: fade out login
  const login = document.getElementById('loginSection');
  const quiz = document.getElementById('quizSection');
  login.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  login.style.opacity = '0';
  login.style.transform = 'scale(0.97)';

  setTimeout(function () {
    login.classList.add('hidden');
    login.style.opacity = '';
    login.style.transform = '';
    quiz.classList.remove('hidden');
    setTimeout(function () {
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, 350);
}

// ---------- process ----------
function processAnswers() {
  const missing = [];
  questions.forEach(function (q) {
    if (!answers[q.id]) missing.push(q.id);
  });

  if (missing.length) {
    const first = missing[0];
    const card = document.getElementById('q-card-' + first);
    if (card) {
      card.classList.add('invalid');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { card.classList.remove('invalid'); }, 1500);
    }
    showAlert(
      missing.length === 1
        ? 'La Pregunta ' + first + ' no ha sido respondida.'
        : 'Faltan por responder las preguntas: ' + missing.join(', ') + '.'
    );
    return;
  }

  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  questions.forEach(function (q) {
    const a = answers[q.id];
    const m = colMap[q.col];
    if (m && m[a]) scores[m[a]]++;
  });

  const e = scores.E >= scores.I ? 'E' : 'I';
  const s = scores.S >= scores.N ? 'S' : 'N';
  const t = scores.T >= scores.F ? 'T' : 'F';
  const j = scores.J >= scores.P ? 'J' : 'P';
  const code = e + s + t + j;

  showResults(code, scores);
}

// ---------- alert ----------
function showAlert(msg) {
  const el = document.querySelector('.custom-alert-overlay');
  if (el) el.remove();
  const o = document.createElement('div');
  o.className = 'custom-alert-overlay';
  const b = document.createElement('div');
  b.className = 'custom-alert';
  b.innerHTML =
    '<div class="custom-alert-icon">&#33;</div>' +
    '<h3>Respuestas Incompletas</h3>' +
    '<p>' + msg + '</p>' +
    '<button class="alert-btn">Continuar</button>';
  o.appendChild(b);
  document.body.appendChild(o);
  b.querySelector('.alert-btn').addEventListener('click', function () { o.remove(); });
  o.addEventListener('click', function (e) { if (e.target === o) o.remove(); });
}

// ---------- render perfil detail ----------
function mostrarResultadoFinal(codigoGenerado) {
  const data = infoPersonalidades[codigoGenerado];

  const perfilEl = document.getElementById('txt-perfil');
  const descEl = document.getElementById('txt-descripcion');
  const fortEl = document.getElementById('lista-fortalezas');
  const debEl = document.getElementById('lista-debilidades');

  if (!data) {
    perfilEl.textContent = codigoGenerado + ' \u2014 Perfil no disponible';
    descEl.textContent = 'No se encontr\u00f3 informaci\u00f3n detallada para este tipo de personalidad.';
    fortEl.innerHTML = '<li class="perfil-item">Informaci\u00f3n no disponible</li>';
    debEl.innerHTML = '<li class="perfil-item">Informaci\u00f3n no disponible</li>';
    return;
  }

  perfilEl.textContent = data.titulo;
  descEl.textContent = data.descripcion;
  fortEl.innerHTML = data.fortalezas.map(function (f) { return '<li class="perfil-item fortaleza">' + f + '</li>'; }).join('');
  debEl.innerHTML = data.debilidades.map(function (d) { return '<li class="perfil-item debilidad">' + d + '</li>'; }).join('');
}

// ---------- results ----------
function showResults(code, scores) {
  document.getElementById('resultName').textContent = document.getElementById('evaluatedName').textContent;
  document.getElementById('resultDate').textContent = getDate();
  document.getElementById('personalityCode').textContent = code;

  mostrarResultadoFinal(code);

  const grid = document.getElementById('scoresGrid');
  grid.innerHTML = '';

  const pairs = [
    { l: 'E', r: 'I', label: 'Extroversi\u00f3n / Introversi\u00f3n' },
    { l: 'S', r: 'N', label: 'Sensorial / Intuitivo' },
    { l: 'T', r: 'F', label: 'Racional / Emocional' },
    { l: 'J', r: 'P', label: 'Estructurado / Perceptivo' }
  ];

  pairs.forEach(function (p) {
    const lS = scores[p.l];
    const rS = scores[p.r];
    const tot = lS + rS || 1;
    const pct = (lS / tot) * 100;
    const win = lS >= rS ? p.l : p.r;

    const item = document.createElement('div');
    item.className = 'score-item';

    const hdr = document.createElement('div');
    hdr.className = 'score-header';
    hdr.innerHTML =
      '<div class="dimension">' + p.l + ' <span>vs</span> ' + p.r +
        (win === p.l ? ' <span class="winner-tag">' + p.l + '</span>' : '') +
      '</div>' +
      '<div class="score-value">' + lS + ' &ndash; ' + rS + '</div>';

    const bar = document.createElement('div');
    bar.className = 'score-bar';

    const fill = document.createElement('div');
    fill.className = 'score-bar-fill ' + (win === p.l ? 'dominant' : 'recessive');
    fill.style.width = Math.max(pct, 4) + '%';
    bar.appendChild(fill);

    const lbl = document.createElement('div');
    lbl.className = 'score-labels';
    lbl.textContent = p.l + ' (' + lS + ') \u2014 ' + p.r + ' (' + rS + ')';

    item.appendChild(hdr);
    item.appendChild(bar);
    item.appendChild(lbl);
    grid.appendChild(item);
  });

  document.getElementById('resultOverlay').classList.remove('hidden');
  document.getElementById('resultSection').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function hideResults() {
  document.getElementById('resultOverlay').classList.add('hidden');
  document.getElementById('resultSection').classList.add('hidden');
  document.body.style.overflow = '';
}

function restartTest() {
  hideResults();
  document.getElementById('quizSection').classList.add('hidden');
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('nameInput').value = '';
  Object.keys(answers).forEach(function (k) { delete answers[k]; });
  updateUI();
  document.querySelectorAll('#questionsContainer .option-btn').forEach(function (b) {
    b.classList.remove('selected-a', 'selected-b');
  });
  document.querySelectorAll('#questionsContainer .question-card').forEach(function (c) {
    c.classList.remove('answered');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', function () {
  renderDate();
  buildQuestions();
  updateUI();

  document.getElementById('startBtn').addEventListener('click', startTest);
  document.getElementById('nameInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') startTest();
  });
  document.getElementById('processBtn').addEventListener('click', processAnswers);
  document.getElementById('closeResultBtn').addEventListener('click', hideResults);

  document.getElementById('printBtn').addEventListener('click', function () {
    const rs = document.getElementById('resultSection');
    const styles = document.querySelector('link[rel="stylesheet"]') ? '' : document.querySelector('style').innerHTML;
    const w = window.open('', '', 'width=800,height=600');
    w.document.write(
      '<html><head><title>Reporte MBTI</title><style>' +
      'body{font-family:Inter,sans-serif;padding:20px;color:#1e293b}' +
      '.btn-close,.result-actions,.overlay{display:none!important}' +
      '#resultSection{position:static!important;padding:0!important}' +
      '.result-card{max-height:none!important;box-shadow:none!important;border-radius:0!important}' +
      '.result-header{border-radius:0!important}' +
      '</style></head><body>' +
      rs.innerHTML +
      '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 300);
  });

  document.getElementById('restartBtn').addEventListener('click', restartTest);
  document.getElementById('resultOverlay').addEventListener('click', hideResults);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !document.getElementById('resultSection').classList.contains('hidden')) {
      hideResults();
    }
  });
});
