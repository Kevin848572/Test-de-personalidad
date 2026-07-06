const questions = [
  { id: 1,  text: "Prefiero pasar tiempo con grupos grandes de personas.", col: 1, dim: 'E/I' },
  { id: 2,  text: "Me fijo m\u00E1s en los detalles concretos y hechos reales.", col: 2, dim: 'S/N' },
  { id: 3,  text: "Me gusta describir las cosas de manera precisa y detallada.", col: 3, dim: 'S/N' },
  { id: 4,  text: "Tomo decisiones bas\u00E1ndome en la l\u00F3gica y la raz\u00F3n.", col: 4, dim: 'T/F' },
  { id: 5,  text: "Me considero una persona justa y objetiva.", col: 5, dim: 'T/F' },
  { id: 6,  text: "Me gusta tener un plan y seguirlo estrictamente.", col: 6, dim: 'J/P' },
  { id: 7,  text: "Me estresa la incertidumbre y la falta de planes.", col: 7, dim: 'J/P' },
  { id: 8,  text: "Me siento con energ\u00EDa despu\u00E9s de asistir a una fiesta o reuni\u00F3n social.", col: 1, dim: 'E/I' },
  { id: 9,  text: "Conf\u00EDo m\u00E1s en la informaci\u00F3n que proviene de mis experiencias directas.", col: 2, dim: 'S/N' },
  { id: 10, text: "Cuando leo, prefiero historias basadas en hechos reales.", col: 3, dim: 'S/N' },
  { id: 11, text: "Es m\u00E1s importante ser honesto que ser diplom\u00E1tico.", col: 4, dim: 'T/F' },
  { id: 12, text: "Analizo los pros y contras antes de decidir.", col: 5, dim: 'T/F' },
  { id: 13, text: "Prefiero que mi vida est\u00E9 estructurada y organizada.", col: 6, dim: 'J/P' },
  { id: 14, text: "Cierro cap\u00EDtulos y tomo decisiones definitivas.", col: 7, dim: 'J/P' },
  { id: 15, text: "Disfruto conocer gente nueva y entablar conversaciones casuales.", col: 1, dim: 'E/I' },
  { id: 16, text: "Prefiero instrucciones paso a paso y claras.", col: 2, dim: 'S/N' },
  { id: 17, text: "Para tomar decisiones, me baso en informaci\u00F3n verificable.", col: 3, dim: 'S/N' },
  { id: 18, text: "Cuando resuelvo problemas, uso un enfoque anal\u00EDtico.", col: 4, dim: 'T/F' },
  { id: 19, text: "Valoro m\u00E1s la competencia y la eficiencia.", col: 5, dim: 'T/F' },
  { id: 20, text: "Me gusta tener las cosas decididas con anticipaci\u00F3n.", col: 6, dim: 'J/P' },
  { id: 21, text: "Me siento inc\u00F3modo cuando las cosas cambian de \u00FAltimo minuto.", col: 7, dim: 'J/P' },
  { id: 22, text: "Suelo pensar en voz alta mientras organizo mis ideas.", col: 1, dim: 'E/I' },
  { id: 23, text: "Me gusta trabajar con hechos, datos y evidencia concreta.", col: 2, dim: 'S/N' },
  { id: 24, text: "Disfruto m\u00E1s las experiencias sensoriales (comida, m\u00FAsica, arte visual).", col: 3, dim: 'S/N' },
  { id: 25, text: "Prefiero que me digan la verdad aunque sea dura.", col: 4, dim: 'T/F' },
  { id: 26, text: "Prefiero ambientes donde predomine la l\u00F3gica.", col: 5, dim: 'T/F' },
  { id: 27, text: "Hago listas y horarios para organizar mis actividades.", col: 6, dim: 'J/P' },
  { id: 28, text: "Establezco metas claras y trabajo para alcanzarlas.", col: 7, dim: 'J/P' },
  { id: 29, text: "Prefiero trabajos que impliquen interactuar con muchas personas.", col: 1, dim: 'E/I' },
  { id: 30, text: "Presto atenci\u00F3n a lo que sucede aqu\u00ED y ahora.", col: 2, dim: 'S/N' },
  { id: 31, text: "Soy m\u00E1s consciente de mi entorno f\u00EDsico inmediato.", col: 3, dim: 'S/N' },
  { id: 32, text: "Juzgo las situaciones bas\u00E1ndome en principios objetivos.", col: 4, dim: 'T/F' },
  { id: 33, text: "Las decisiones deben basarse en hechos objetivos.", col: 5, dim: 'T/F' },
  { id: 34, text: "Me siento m\u00E1s productivo cuando sigo una rutina.", col: 6, dim: 'J/P' },
  { id: 35, text: "Me gusta tener claridad sobre lo que har\u00E9 cada d\u00EDa.", col: 7, dim: 'J/P' },
  { id: 36, text: "En reuniones, soy de los que m\u00E1s hablan y participan.", col: 1, dim: 'E/I' },
  { id: 37, text: "Prefiero aprender a trav\u00E9s de la pr\u00E1ctica y la experiencia directa.", col: 2, dim: 'S/N' },
  { id: 38, text: "Prefiero los pasatiempos que producen resultados tangibles.", col: 3, dim: 'S/N' },
  { id: 39, text: "Tiendo a ser objetivo e imparcial en mis decisiones.", col: 4, dim: 'T/F' },
  { id: 40, text: "Suelo decir lo que pienso directamente.", col: 5, dim: 'T/F' },
  { id: 41, text: "Prefiero trabajos con plazos y metas claras.", col: 6, dim: 'J/P' },
  { id: 42, text: "Prefiero eventos con horarios definidos y estructura.", col: 7, dim: 'J/P' },
  { id: 43, text: "Me resulta f\u00E1cil iniciar conversaciones con desconocidos.", col: 1, dim: 'E/I' },
  { id: 44, text: "Me considero una persona pr\u00E1ctica y realista.", col: 2, dim: 'S/N' },
  { id: 45, text: "Me considero una persona realista.", col: 3, dim: 'S/N' },
  { id: 46, text: "Me molestan las injusticias y las incoherencias l\u00F3gicas.", col: 4, dim: 'T/F' },
  { id: 47, text: "Cuando alguien tiene un problema, ofrezco soluciones pr\u00E1cticas.", col: 5, dim: 'T/F' },
  { id: 48, text: "Tengo un lugar para cada cosa y cada cosa en su lugar.", col: 6, dim: 'J/P' },
  { id: 49, text: "El orden y la organizaci\u00F3n son esenciales para m\u00ED.", col: 7, dim: 'J/P' },
  { id: 50, text: "Prefiero actividades grupales que individuales.", col: 1, dim: 'E/I' },
  { id: 51, text: "Disfruto m\u00E1s cuando me enfoco en una tarea a la vez.", col: 2, dim: 'S/N' },
  { id: 52, text: "Me gusta que las cosas sean medibles y cuantificables.", col: 3, dim: 'S/N' },
  { id: 53, text: "Las cr\u00EDticas constructivas me ayudan a mejorar.", col: 4, dim: 'T/F' },
  { id: 54, text: "Me siento m\u00E1s c\u00F3modo con el debate intelectual.", col: 5, dim: 'T/F' },
  { id: 55, text: "Planifico mis vacaciones con itinerarios detallados.", col: 6, dim: 'J/P' },
  { id: 56, text: "Cuando empiezo un libro o proyecto, lo termino antes de empezar otro.", col: 7, dim: 'J/P' },
  { id: 57, text: "Disfruto ser el centro de atenci\u00F3n en eventos sociales.", col: 1, dim: 'E/I' },
  { id: 58, text: "Valoro m\u00E1s la utilidad pr\u00E1ctica de las cosas.", col: 2, dim: 'S/N' },
  { id: 59, text: "Aprendo mejor cuando veo ejemplos pr\u00E1cticos.", col: 3, dim: 'S/N' },
  { id: 60, text: "Defiendo mis decisiones con argumentos l\u00F3gicos.", col: 4, dim: 'T/F' },
  { id: 61, text: "Prefiero l\u00EDderes que sean firmes y decisivos.", col: 5, dim: 'T/F' },
  { id: 62, text: "Me gusta terminar un proyecto antes de comenzar otro.", col: 6, dim: 'J/P' },
  { id: 63, text: "Me siento mejor cuando mi entorno est\u00E1 ordenado.", col: 7, dim: 'J/P' },
  { id: 64, text: "Tengo muchos amigos y conocidos con quienes me mantengo en contacto.", col: 1, dim: 'E/I' },
  { id: 65, text: "Prefiero rutinas y m\u00E9todos probados.", col: 2, dim: 'S/N' },
  { id: 66, text: "Prefiero conversaciones sobre temas cotidianos y concretos.", col: 3, dim: 'S/N' },
  { id: 67, text: "Resuelvo conflictos estableciendo reglas claras.", col: 4, dim: 'T/F' },
  { id: 68, text: "La verdad objetiva es m\u00E1s importante que la armon\u00EDa del grupo.", col: 5, dim: 'T/F' },
  { id: 69, text: "La puntualidad y el cumplimiento de plazos son fundamentales.", col: 6, dim: 'J/P' },
  { id: 70, text: "Las reglas y normas existen para cumplirse.", col: 7, dim: 'J/P' }
];

const colMap = { 1: { A: 'E', B: 'I' }, 2: { A: 'S', B: 'N' }, 3: { A: 'S', B: 'N' }, 4: { A: 'T', B: 'F' }, 5: { A: 'T', B: 'F' }, 6: { A: 'J', B: 'P' }, 7: { A: 'J', B: 'P' } };

const dimClass = { 'E/I': 'E/I', 'S/N': 'S/N', 'T/F': 'T/F', 'J/P': 'J/P' };

const infoPersonalidades = {
  'INTJ': {
    titulo: 'INTJ — El Arquitecto',
    descripcion: 'Pensador estrat\u00E9gico con una visi\u00F3n clara del futuro. Los INTJ son planificadores meticulosos que disfrutan dise\u00F1ando sistemas eficientes y mejorando procesos. Prefieren trabajar de forma independiente y valoran la competencia intelectual por encima de todo.',
    fortalezas: ['Visi\u00F3n estrat\u00E9gica para anticipar problemas y oportunidades a largo plazo', 'Alta capacidad de an\u00E1lisis y pensamiento cr\u00EDtico para resolver problemas complejos', 'Compromiso firme con la calidad y la mejora continua de los procesos'],
    debilidades: ['Tienden a ser directos y bruscos al comunicar, lo que puede generar fricciones', 'Dificultad para aceptar sugerencias o reconocer errores propios', 'Pueden parecer fr\u00EDos o distantes en entornos que requieren calidez emocional']
  },
  'INTP': {
    titulo: 'INTP — El L\u00F3gico',
    descripcion: 'Mente anal\u00EDtica que busca comprender los principios fundamentales de todo. Los INTP disfrutan explorando teor\u00EDas abstractas y cuestionando suposiciones establecidas. Son innovadores silenciosos que prefieren la profundidad intelectual sobre las interacciones sociales.',
    fortalezas: ['Pensamiento innovador para encontrar soluciones originales a problemas t\u00E9cnicos', 'Objetividad y rigor l\u00F3gico al evaluar datos sin sesgos emocionales', 'Curiosidad intelectual que los mantiene actualizados en su campo de especializaci\u00F3n'],
    debilidades: ['Dificultad para llevar las ideas a la acci\u00F3n con plazos concretos', 'Tienden a aislarse y descuidar la comunicaci\u00F3n con el equipo', 'Pueden perderse en detalles te\u00F3ricos sin priorizar lo pr\u00E1ctico']
  },
  'ENTJ': {
    titulo: 'ENTJ — El Comandante',
    descripcion: 'L\u00EDder nato con una determinaci\u00F3n inquebrantable para alcanzar metas. Los ENTJ organizan personas y recursos de manera eficiente, y no temen tomar decisiones dif\u00EDciles. Su energ\u00EDa y visi\u00F3n los convierten en impulsores naturales del cambio organizacional.',
    fortalezas: ['Liderazgo firme para dirigir equipos hacia objetivos ambiciosos y medibles', 'Eficiencia ejecutiva para delegar tareas y optimizar el uso del tiempo', 'Capacidad para tomar decisiones r\u00E1pidas bajo presi\u00F3n con informaci\u00F3n limitada'],
    debilidades: ['Impaciencia con quienes no siguen su ritmo o est\u00E1ndares de trabajo', 'Pueden ser autoritarios y no escuchar opiniones divergentes', 'Descuido del bienestar emocional del equipo al priorizar los resultados']
  },
  'ENTP': {
    titulo: 'ENTP — El Innovador',
    descripcion: 'Generador incansable de ideas y nuevas posibilidades. Los ENTP disfrutan el debate intelectual y desafiar el status quo. Su mente \u00E1gil encuentra conexiones donde otros no las ven, lo que los hace valiosos en tormentas de ideas y procesos de cambio.',
    fortalezas: ['Creatividad disruptiva para proponer soluciones no convencionales a viejos problemas', 'Agilidad mental para adaptarse r\u00E1pidamente a contextos cambiantes', 'Habilidad para conectar conceptos de \u00E1reas dispares y generar innovaci\u00F3n'],
    debilidades: ['Dificultad para dar seguimiento y finalizar los proyectos que inician', 'Tienden a ser argumentativos y a buscar conflicto intelectual innecesario', 'Pueden aburrirse f\u00E1cilmente y perder el foco en tareas rutinarias']
  },
  'INFJ': {
    titulo: 'INFJ — El Abogado',
    descripcion: 'Idealista con una profunda comprensi\u00F3n de las motivaciones humanas. Los INFJ buscan significado y prop\u00F3sito en su trabajo, y son capaces de inspirar a otros hacia una visi\u00F3n compartida. Su empat\u00EDa y visi\u00F3n sist\u00E9mica los convierten en mediadores naturales.',
    fortalezas: ['Empat\u00EDa profunda para comprender necesidades no expresadas del equipo', 'Visi\u00F3n inspiradora que alinea a las personas con un prop\u00F3sito com\u00FAn', 'Capacidad para mediar conflictos y restaurar la armon\u00EDa grupal'],
    debilidades: ['Tienden a idealizar situaciones y personas, generando expectativas poco realistas', 'Dificultad para manejar cr\u00EDticas directas o entornos altamente competitivos', 'Pueden agotarse emocionalmente al absorber los problemas de los dem\u00E1s']
  },
  'INFP': {
    titulo: 'INFP — El Mediador',
    descripcion: 'Creativo guiado por valores personales profundos y un fuerte sentido de autenticidad. Los INFP destacan en entornos que valoran la originalidad y la colaboraci\u00F3n humana. Defienden causas justas y buscan que su trabajo tenga un impacto positivo en la sociedad.',
    fortalezas: ['Creatividad aut\u00E9ntica para generar ideas alineadas con valores humanos', 'Empat\u00EDa genuina que crea un ambiente de confianza y apoyo mutuo', 'Compromiso \u00E9tico con causas que promueven el bienestar colectivo'],
    debilidades: ['Dificultad para manejar conflictos directos o tomar decisiones impopulares', 'Pueden postergar tareas importantes por buscar la perfecci\u00F3n', 'Tienden a internalizar las cr\u00EDticas y tomarlas como un ataque personal']
  },
  'ENFJ': {
    titulo: 'ENFJ — El Protagonista',
    descripcion: 'L\u00EDder carism\u00E1tico que inspira y desarrolla el potencial de los dem\u00E1s. Los ENFJ son comunicadores excepcionales que construyen equipos cohesionados. Su habilidad para motivar y su visi\u00F3n humanista los convierten en agentes de cambio positivo.',
    fortalezas: ['Liderazgo inspirador que motiva a los equipos a dar lo mejor de s\u00ED mismos', 'Comunicaci\u00F3n persuasiva para alinear voluntades en torno a objetivos compartidos', 'Habilidad para detectar y potenciar el talento individual de cada colaborador'],
    debilidades: ['Pueden descuidar sus propias necesidades al enfocarse excesivamente en los dem\u00E1s', 'Dificultad para aceptar cr\u00EDticas o se\u00F1alamientos sobre su desempe\u00F1o', 'Tienden a evitar conflictos necesarios por miedo a da\u00F1ar la armon\u00EDa del grupo']
  },
  'ENFP': {
    titulo: 'ENFP — El Activista',
    descripcion: 'Esp\u00EDritu libre y entusiasta que contagia energ\u00EDa positiva a su alrededor. Los ENFP exploran constantemente nuevas ideas y posibilidades, y destacan en entornos din\u00E1micos que requieren creatividad. Su carisma natural construye puentes entre personas diversas.',
    fortalezas: ['Entusiasmo contagioso que eleva la moral del equipo en momentos desafiantes', 'Creatividad vers\u00E1til para abordar problemas desde m\u00FAltiples perspectivas', 'Habilidad para conectar con personas diversas y construir relaciones s\u00F3lidas'],
    debilidades: ['Dificultad para mantener el foco en una sola tarea o proyecto a largo plazo', 'Pueden ser percibidos como desorganizados o poco estructurados', 'Tienden a comprometerse en exceso y luego no cumplir todas las expectativas']
  },
  'ISTJ': {
    titulo: 'ISTJ — El Inspector',
    descripcion: 'Persona responsable y meticulosa que valora el orden y la tradici\u00F3n. Los ISTJ son pilares de confiabilidad en cualquier organizaci\u00F3n, cumpliendo sus compromisos con rigor y atenci\u00F3n al detalle. Prefieren procedimientos claros y objetivos medibles.',
    fortalezas: ['Confiabilidad absoluta para cumplir plazos y entregables con calidad consistente', 'Atenci\u00F3n al detalle para detectar errores que otros pasan por alto', 'Compromiso con las normas y procedimientos que garantizan el orden organizacional'],
    debilidades: ['Resistencia al cambio y dificultad para adaptarse a metodolog\u00EDas no probadas', 'Pueden ser percibidos como r\u00EDgidos o excesivamente formales en el trato', 'Dificultad para ver el panorama general al enfocarse en detalles operativos']
  },
  'ISFJ': {
    titulo: 'ISFJ — El Defensor',
    descripcion: 'Protector dedicado que antepone el bienestar del equipo a todo. Los ISFJ son el soporte silencioso de las organizaciones, asegurando que todos tengan lo necesario para trabajar. Su memoria para los detalles y su lealtad los convierten en colaboradores invaluables.',
    fortalezas: ['Lealtad y compromiso excepcional con el equipo y los objetivos organizacionales', 'Memoria detallada para recordar informaci\u00F3n clave sobre proyectos y personas', 'Servicio desinteresado que apoya a compa\u00F1eros sin buscar reconocimiento'],
    debilidades: ['Dificultad para decir que no, acumulando m\u00E1s trabajo del que pueden manejar', 'Pueden resistirse a cambios que alteren la estabilidad del entorno laboral', 'Tienden a subestimar sus propias contribuciones y evitar posiciones de liderazgo']
  },
  'ESTJ': {
    titulo: 'ESTJ — El Supervisor',
    descripcion: 'Organizador nato que establece estructura y orden donde sea necesario. Los ESTJ son gerentes eficientes que aseguran que las operaciones funcionen sin contratiempos. Valoran la competencia, la puntualidad y el cumplimiento de los objetivos establecidos.',
    fortalezas: ['Capacidad ejecutiva para organizar equipos y recursos hacia metas concretas', 'Toma de decisiones r\u00E1pida basada en hechos y experiencia pr\u00E1ctica', 'Compromiso con la eficiencia operativa y la mejora de procesos medibles'],
    debilidades: ['Pueden ser autoritarios y no considerar opiniones que desaf\u00EDen su autoridad', 'Dificultad para adaptarse a entornos ambiguos o sin jerarqu\u00EDas claras', 'Tienden a priorizar resultados sobre relaciones, generando un clima fr\u00EDo']
  },
  'ESFJ': {
    titulo: 'ESFJ — El C\u00F3nsul',
    descripcion: 'Persona c\u00E1lida y cooperativa que construye comunidades s\u00F3lidas a su alrededor. Los ESFJ destacan por su habilidad para crear ambientes armoniosos y su compromiso con servir a los dem\u00E1s. Son el pegamento social que mantiene unidos a los equipos de trabajo.',
    fortalezas: ['Habilidad para construir un clima laboral positivo y relaciones de confianza', 'Organizaci\u00F3n meticulosa de eventos, agendas y actividades colaborativas', 'Empat\u00EDa pr\u00E1ctica para anticipar necesidades del equipo y ofrecer apoyo oportuno'],
    debilidades: ['Dificultad para aceptar cr\u00EDticas o situaciones que rompan la armon\u00EDa del grupo', 'Pueden descuidar sus propias prioridades por atender las necesidades de otros', 'Tienden a ser excesivamente tradicionales y resistirse a enfoques novedosos']
  },
  'ISTP': {
    titulo: 'ISTP — El Virtuoso',
    descripcion: 'Solucionador pr\u00E1ctico con habilidades t\u00E9cnicas excepcionales. Los ISTP entienden c\u00F3mo funcionan los sistemas f\u00EDsicos y abstractos, y destacan en situaciones que requieren respuestas r\u00E1pidas y eficaces. Prefieren la acci\u00F3n directa sobre la teorizaci\u00F3n prolongada.',
    fortalezas: ['Habilidad t\u00E9cnica para diagnosticar y resolver problemas pr\u00E1cticos r\u00E1pidamente', 'Flexibilidad para adaptarse a entornos cambiantes y crisis imprevistas', 'Mente anal\u00EDtica que comprende sistemas complejos con rapidez'],
    debilidades: ['Pueden ser reservados y no compartir informaci\u00F3n importante con el equipo', 'Dificultad para comprometerse con planes a largo plazo o rutinas estrictas', 'Tienden a minimizar la importancia de las normas y los procedimientos formales']
  },
  'ISFP': {
    titulo: 'ISFP — El Aventurero',
    descripcion: 'Artista silencioso que aporta sensibilidad est\u00E9tica y autenticidad al entorno laboral. Los ISFP valoran la libertad creativa y disfrutan trabajando en proyectos que reflejen sus valores personales. Su presencia tranquila y su mirada \u00FAnica enriquecen cualquier equipo.',
    fortalezas: ['Sensibilidad est\u00E9tica para mejorar la presentaci\u00F3n y el dise\u00F1o de proyectos', 'Autenticidad y coherencia entre sus valores personales y su trabajo', 'Capacidad para trabajar de forma independiente con alta calidad en tareas creativas'],
    debilidades: ['Dificultad para expresar sus ideas en entornos altamente competitivos o verbales', 'Pueden evitar conflictos y no defender sus posiciones cuando es necesario', 'Tienden a postergar tareas administrativas o burocr\u00E1ticas que les resultan tediosas']
  },
  'ESTP': {
    titulo: 'ESTP — El Emprendedor',
    descripcion: 'Persona en\u00E9rgica y orientada a la acci\u00F3n que prospera en entornos din\u00E1micos. Los ESTP son negociadores h\u00E1biles que detectan oportunidades donde otros ven obst\u00E1culos. Su carisma y rapidez los convierten en l\u00EDderes naturales en situaciones de crisis o cambio.',
    fortalezas: ['Capacidad para tomar decisiones r\u00E1pidas en entornos de alta presi\u00F3n', 'Habilidad de negociaci\u00F3n para cerrar acuerdos y mover proyectos hacia adelante', 'Carisma y energ\u00EDa que motivan a la acci\u00F3n en momentos de incertidumbre'],
    debilidades: ['Pueden ser impulsivos y no considerar las consecuencias a largo plazo', 'Dificultad para seguir procedimientos establecidos o tareas repetitivas', 'Tienden a aburrirse r\u00E1pidamente y buscar nuevos est\u00EDmulos constantemente']
  },
  'ESFP': {
    titulo: 'ESFP — El Animador',
    descripcion: 'Esp\u00EDritu vibrante que ilumina cualquier espacio de trabajo con su entusiasmo. Los ESFP son el coraz\u00F3n social de las organizaciones, conectando personas y celebrando los logros colectivos. Su energ\u00EDa positiva y su pragmatismo los hacen excelentes en roles que requieren interacci\u00F3n constante.',
    fortalezas: ['Carisma natural para generar un ambiente laboral positivo y colaborativo', 'Pragmatismo para resolver problemas del d\u00EDa a d\u00EDa con soluciones pr\u00E1cticas', 'Habilidad para conectar con personas de todos los niveles y construir redes s\u00F3lidas'],
    debilidades: ['Dificultad para concentrarse en tareas solitarias o que requieren an\u00E1lisis profundo', 'Pueden priorizar la diversi\u00F3n sobre la responsabilidad en momentos cr\u00EDticos', 'Tienden a evitar planificaciones detalladas y prefieren la improvisaci\u00F3n']
  }
};

/* ===== STATE ===== */
var currentIndex = 0;
var answers = {};

/* ===== DOM REFS ===== */
var questionNumberEl = document.getElementById('questionNumber');
var dimensionTagEl = document.getElementById('dimensionTag');
var questionTextEl = document.getElementById('questionText');
var optionsList = document.getElementById('optionsList');
var optionBtns = optionsList.querySelectorAll('.option-btn');
var progressFill = document.getElementById('progressFill');
var progressText = document.getElementById('progressText');
var progressPct = document.getElementById('progressPct');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var submitBtn = document.getElementById('submitBtn');

/* ===== RENDER ===== */
function renderQuestion() {
  var q = questions[currentIndex];
  var dimParts = q.dim.split('/');
  questionNumberEl.textContent = 'Pregunta ' + q.id + ' / ' + questions.length;
  dimensionTagEl.textContent = q.dim;
  questionTextEl.textContent = q.text;
  document.getElementById('optALabel').textContent = 'Opci\u00F3n ' + dimParts[0];
  document.getElementById('optBLabel').textContent = 'Opci\u00F3n ' + dimParts[1];

  optionBtns.forEach(function (btn) {
    btn.classList.remove('selected');
  });

  if (answers[q.id]) {
    optionBtns.forEach(function (btn) {
      if (btn.dataset.value === answers[q.id]) {
        btn.classList.add('selected');
      }
    });
  }

  var answeredCount = Object.keys(answers).length;
  var pct = Math.round((answeredCount / questions.length) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = (currentIndex + 1) + ' / ' + questions.length;
  progressPct.textContent = pct + '%';

  prevBtn.disabled = currentIndex === 0;

  if (currentIndex === questions.length - 1) {
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  } else {
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  }
}

/* ===== OPTION CLICK ===== */
optionBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var q = questions[currentIndex];
    answers[q.id] = btn.dataset.value;
    optionBtns.forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
  });
});

/* ===== NAVIGATION ===== */
prevBtn.addEventListener('click', function () {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', function () {
  var q = questions[currentIndex];
  if (!answers[q.id]) return;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

submitBtn.addEventListener('click', function () {
  processResults();
});

/* ===== LOGIN ===== */
document.getElementById('startBtn').addEventListener('click', startTest);
document.getElementById('nameInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') startTest();
});
function startTest() {
  var name = document.getElementById('nameInput').value.trim();
  if (!name) {
    var inp = document.getElementById('nameInput');
    inp.classList.add('input-error');
    inp.focus();
    setTimeout(function () { inp.classList.remove('input-error'); }, 2000);
    return;
  }
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('quizSection').classList.remove('hidden');
  renderQuestion();
}

/* ===== PROCESS ===== */
function processResults() {
  var missing = questions.filter(function (q) { return !answers[q.id]; });
  if (missing.length) {
    var first = missing[0];
    currentIndex = questions.indexOf(first);
    renderQuestion();
    return;
  }

  var scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach(function (q) {
    var val = answers[q.id];
    var map = colMap[q.col];
    if (map && map[val]) scores[map[val]]++;
  });

  var e = scores.E >= scores.I ? 'E' : 'I';
  var s = scores.S >= scores.N ? 'S' : 'N';
  var t = scores.T >= scores.F ? 'T' : 'F';
  var j = scores.J >= scores.P ? 'J' : 'P';
  var code = e + s + t + j;

  showResults(code, scores);
}

/* ===== RESULTS ===== */
function mostrarResultadoFinal(codigo) {
  var data = infoPersonalidades[codigo];
  var perfilEl = document.getElementById('txt-perfil');
  var descEl = document.getElementById('txt-descripcion');
  var fortEl = document.getElementById('lista-fortalezas');
  var debEl = document.getElementById('lista-debilidades');

  if (!data) {
    perfilEl.textContent = codigo + ' \u2014 Perfil no disponible';
    descEl.textContent = 'No se encontr\u00F3 informaci\u00F3n detallada para este tipo de personalidad.';
    fortEl.innerHTML = '<li class="perfil-item">Informaci\u00F3n no disponible</li>';
    debEl.innerHTML = '<li class="perfil-item">Informaci\u00F3n no disponible</li>';
    return;
  }

  perfilEl.textContent = data.titulo;
  descEl.textContent = data.descripcion;
  fortEl.innerHTML = data.fortalezas.map(function (f) { return '<li class="perfil-item">' + f + '</li>'; }).join('');
  debEl.innerHTML = data.debilidades.map(function (d) { return '<li class="perfil-item">' + d + '</li>'; }).join('');
}

function showResults(code, scores) {
  document.getElementById('personalityCode').textContent = code;
  document.getElementById('resultName').textContent = document.getElementById('nameInput').value.trim();
  mostrarResultadoFinal(code);

  var grid = document.getElementById('scoresGrid');
  grid.innerHTML = '';

  var pairs = [
    { l: 'E', r: 'I', label: 'Extroversi\u00F3n / Introversi\u00F3n' },
    { l: 'S', r: 'N', label: 'Sensorial / Intuitivo' },
    { l: 'T', r: 'F', label: 'Racional / Emocional' },
    { l: 'J', r: 'P', label: 'Estructurado / Perceptivo' }
  ];

  pairs.forEach(function (p) {
    var lS = scores[p.l];
    var rS = scores[p.r];
    var tot = lS + rS || 1;
    var pct = (lS / tot) * 100;
    var win = lS >= rS ? p.l : p.r;

    var item = document.createElement('div');
    item.className = 'score-item';

    var hdr = document.createElement('div');
    hdr.className = 'score-header';
    hdr.innerHTML =
      '<div class="dimension">' + p.l + ' <span>vs</span> ' + p.r +
        (win === p.l ? ' <span class="winner-tag">' + p.l + '</span>' : '') +
      '</div>' +
      '<div class="score-value">' + lS + ' \u2013 ' + rS + '</div>';

    var bar = document.createElement('div');
    bar.className = 'score-bar';

    var fill = document.createElement('div');
    fill.className = 'score-bar-fill';
    fill.style.width = Math.max(pct, 4) + '%';
    bar.appendChild(fill);

    var lbl = document.createElement('div');
    lbl.className = 'score-labels';
    lbl.textContent = p.l + ' (' + lS + ') \u2014 ' + p.r + ' (' + rS + ')';

    item.appendChild(hdr);
    item.appendChild(bar);
    item.appendChild(lbl);
    grid.appendChild(item);
  });

  document.getElementById('quizSection').classList.add('hidden');
  document.getElementById('resultSection').classList.remove('hidden');
}

/* ===== RESULTS ACTIONS ===== */
document.getElementById('closeResultBtn').addEventListener('click', function () {
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('quizSection').classList.remove('hidden');
});

document.getElementById('printBtn').addEventListener('click', function () {
  var rs = document.getElementById('resultSection');
  var w = window.open('', '', 'width=800,height=600');
  w.document.write(
    '<html><head><title>Reporte MBTI</title><style>' +
    'body{font-family:Inter,sans-serif;padding:20px;background:#0a0a0a;color:#f0f0f0}' +
    '.btn-close,.result-actions{display:none!important}' +
    '.result-card{background:rgba(20,20,20,0.95);border-radius:16px;padding:24px}' +
    '.badge-code{color:#D4AF37;font-size:48px;font-weight:800;letter-spacing:8px;text-align:center;display:block}' +
    '.badge-label{color:#888;font-size:11px;text-align:center;letter-spacing:2px;text-transform:uppercase}' +
    '.score-item{padding:14px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.06);border-radius:10px}' +
    '.score-header{display:flex;justify-content:space-between;margin-bottom:6px}' +
    '.score-bar{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;margin-bottom:4px}' +
    '.score-bar-fill{height:100%;background:#D4AF37;border-radius:2px}' +
    '.score-labels{display:flex;justify-content:space-between;font-size:9px;color:#555}' +
    '.winner-tag{background:#D4AF37;color:#121212;padding:1px 6px;border-radius:3px;font-size:9px;margin-left:4px}' +
    '.perfil-titulo{color:#f0f0f0;font-size:16px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px}' +
    '.perfil-descripcion{color:#888;font-size:13px;line-height:1.7}' +
    '.perfil-columnas{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.perfil-col{padding:14px;border:1px solid rgba(255,255,255,0.06);border-radius:10px}' +
    '.perfil-sub{color:#D4AF37;font-size:11px;text-transform:uppercase;letter-spacing:0.8px}' +
    '.perfil-item{color:#888;font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)}' +
    '</style></head><body>' +
    rs.innerHTML +
    '</body></html>'
  );
  w.document.close();
  w.focus();
  setTimeout(function () { w.print(); }, 300);
});

document.getElementById('restartBtn').addEventListener('click', function () {
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('nameInput').value = '';

  currentIndex = 0;
  answers = {};
  renderQuestion();
});

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !document.getElementById('resultSection').classList.contains('hidden')) {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('quizSection').classList.remove('hidden');
  }
  if (!document.getElementById('resultSection').classList.contains('hidden')) return;
  if (document.getElementById('loginSection').classList.contains('hidden')) {
    if (e.key === 'a' || e.key === 'A' || e.key === 'b' || e.key === 'B') {
      var key = e.key.toUpperCase();
      var btns = optionsList.querySelectorAll('.option-btn');
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].dataset.value === key) btns[i].click();
      }
    }
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      if (!nextBtn.classList.contains('hidden')) nextBtn.click();
      else if (!submitBtn.classList.contains('hidden')) submitBtn.click();
    }
    if (e.key === 'ArrowLeft') prevBtn.click();
  }
});

/* ===== INIT ===== */
renderQuestion();
