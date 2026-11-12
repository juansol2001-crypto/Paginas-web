/* Mano a Mano — datos de ejemplo compartidos (presentación + plataforma de prueba)
   Jugadores: confirmados en las formaciones de la fecha 16 del Clausura 2026 (5 al 8 de noviembre de 2026),
   según notas de Minuto Uno, 442 Perfil y Canal26. Puntajes, ligas y usuarios son inventados para la demo. */
(function(){
  const torneo = {
    nombre: 'Clausura 2026',
    fechas: 16,                 // fase regular
    fechaActual: 12,            // fecha de ejemplo para la demo de la liga
    octavos: '2026-11-20',      // octavos de final: 20 al 25 de noviembre
    cuartos: '2026-11-28',      // fin de semana del 28 y 29 de noviembre
    final: '2026-12-12',        // final en La Plata
    fuente: 'https://www.ambito.com/deportes/torneo-clausura-2026-confirmaron-los-dias-y-horarios-los-octavos-final-river-lanus-y-boca-independiente-rivadavia-n6344436'
  };

  // c1/c2: colores del club · bg: dibujo de la camiseta (sin escudos)
  const rayas = (a, b) => `repeating-linear-gradient(90deg,${a} 0 12.5%,${b} 12.5% 25%)`;
  const clubes = {
    'River Plate':             {corto:'River',        c1:'#FFFFFF', c2:'#E2001A', bg:'linear-gradient(135deg,#fff 0 36%,#E2001A 36% 58%,#fff 58%)'},
    'Boca Juniors':            {corto:'Boca',         c1:'#0033A0', c2:'#FFD100', bg:'linear-gradient(180deg,#0033A0 0 38%,#FFD100 38% 62%,#0033A0 62%)'},
    'Racing Club':             {corto:'Racing',       c1:'#6CACE4', c2:'#FFFFFF', bg:rayas('#6CACE4','#fff')},
    'Independiente':           {corto:'Independiente',c1:'#E30613', c2:'#FFFFFF', bg:'#E30613'},
    'San Lorenzo':             {corto:'San Lorenzo',  c1:'#003DA5', c2:'#D2001C', bg:rayas('#003DA5','#D2001C')},
    'Vélez Sarsfield':         {corto:'Vélez',        c1:'#FFFFFF', c2:'#0047AB', bg:'linear-gradient(to bottom right,transparent 40%,#0047AB 40% 56%,transparent 56%) left/50% 100% no-repeat,linear-gradient(to bottom left,transparent 40%,#0047AB 40% 56%,transparent 56%) right/50% 100% no-repeat,#fff'},
    'Estudiantes de La Plata': {corto:'Estudiantes',  c1:'#E30613', c2:'#FFFFFF', bg:rayas('#E30613','#fff')},
    'Talleres de Córdoba':     {corto:'Talleres',     c1:'#002D72', c2:'#FFFFFF', bg:rayas('#002D72','#fff')},
    'Rosario Central':         {corto:'Central',      c1:'#002D72', c2:'#FFD100', bg:rayas('#002D72','#FFD100')},
    'Huracán':                 {corto:'Huracán',      c1:'#FFFFFF', c2:'#E30613', bg:'linear-gradient(90deg,#E30613 0 16%,#fff 16% 84%,#E30613 84%)'}
  };

  // [club, nombre, corto, posición]
  const lista = [
    ['River Plate','Santiago Beltrán','S. Beltrán','ARQ'],['River Plate','Nicolás Otamendi','Otamendi','DEF'],['River Plate','Marcos Acuña','Acuña','DEF'],['River Plate','Tomás Galván','Galván','MED'],['River Plate','Thiago Almada','Almada','MED'],['River Plate','Ángel Correa','Correa','DEL'],['River Plate','Lucas Beltrán','L. Beltrán','DEL'],
    ['Boca Juniors','Álvaro Montero','Montero','ARQ'],['Boca Juniors','Lautaro Blanco','Blanco','DEF'],['Boca Juniors','Facundo Herrera','Herrera','DEF'],['Boca Juniors','Leandro Paredes','Paredes','MED'],['Boca Juniors','Santiago Ascacibar','Ascacibar','MED'],['Boca Juniors','Miguel Merentiel','Merentiel','DEL'],['Boca Juniors','Leonel Flores','Flores','DEL'],
    ['Racing Club','Facundo Cambeses','Cambeses','ARQ'],['Racing Club','Ezequiel Cannavo','Cannavo','DEF'],['Racing Club','Gonzalo Escudero','Escudero','DEF'],['Racing Club','Matías Zaracho','Zaracho','MED'],['Racing Club','Gastón Lodico','Lodico','MED'],['Racing Club','Elías Torres','E. Torres','DEL'],
    ['Independiente','Santiago Mele','Mele','ARQ'],['Independiente','Santiago Arias','Arias','DEF'],['Independiente','Sebastián Valdez','Valdez','DEF'],['Independiente','Iván Marcone','Marcone','MED'],['Independiente','Maximiliano Meza','Meza','MED'],['Independiente','Ezequiel Ávila','Chimy Ávila','DEL'],['Independiente','Matías Abaldo','Abaldo','DEL'],
    ['San Lorenzo','José Devecchi','Devecchi','ARQ'],['San Lorenzo','Danilo Arboleda','Arboleda','DEF'],['San Lorenzo','Emiliano Amor','Amor','DEF'],['San Lorenzo','Juan Rattalino','Rattalino','MED'],['San Lorenzo','Ignacio Perruzzi','Perruzzi','MED'],['San Lorenzo','Alexis Cuello','Cuello','DEL'],['San Lorenzo','Agustín Ladstatter','Ladstatter','DEL'],
    ['Vélez Sarsfield','Tomás Marchiori','Marchiori','ARQ'],['Vélez Sarsfield','Lisandro Magallán','Magallán','DEF'],['Vélez Sarsfield','Elías Gómez','E. Gómez','DEF'],['Vélez Sarsfield','Claudio Baeza','Baeza','MED'],['Vélez Sarsfield','Manuel Lanzini','Lanzini','MED'],['Vélez Sarsfield','Ronaldo Martínez','R. Martínez','DEL'],['Vélez Sarsfield','Matías Pellegrini','Pellegrini','DEL'],
    ['Estudiantes de La Plata','Fernando Muslera','Muslera','ARQ'],['Estudiantes de La Plata','Marcos Rojo','Rojo','DEF'],['Estudiantes de La Plata','Eros Mancuso','Mancuso','DEF'],['Estudiantes de La Plata','Ezequiel Piovi','Piovi','MED'],['Estudiantes de La Plata','Alexis Castro','A. Castro','MED'],['Estudiantes de La Plata','Guido Carrillo','Carrillo','DEL'],['Estudiantes de La Plata','Tiago Palacios','T. Palacios','DEL'],
    ['Talleres de Córdoba','Ezequiel Unsain','Unsain','ARQ'],['Talleres de Córdoba','Matías Catalán','Catalán','DEF'],['Talleres de Córdoba','Román Riquelme','Riquelme','DEF'],['Talleres de Córdoba','Federico Fattori','Fattori','MED'],['Talleres de Córdoba','Matías Galarza','Galarza','MED'],['Talleres de Córdoba','Agustín Álvarez','A. Álvarez','DEL'],['Talleres de Córdoba','Valentín Depietri','Depietri','DEL'],
    ['Rosario Central','Jeremías Ledesma','Ledesma','ARQ'],['Rosario Central','Gastón Ávila','G. Ávila','DEF'],['Rosario Central','Ignacio Ovando','Ovando','DEF'],['Rosario Central','Franco Ibarra','Ibarra','MED'],['Rosario Central','Vicente Pizarro','Pizarro','MED'],['Rosario Central','Enzo Copetti','Copetti','DEL'],['Rosario Central','Ángel Di María','Di María','DEL'],
    ['Huracán','Hernán Galíndez','Galíndez','ARQ'],['Huracán','Lucas Blondel','Blondel','DEF'],['Huracán','Máximo Palazzo','Palazzo','DEF'],['Huracán','Leonardo Gil','Gil','MED'],['Huracán','Facundo Waller','Waller','MED'],['Huracán','Ignacio Pussetto','Pussetto','DEL'],['Huracán','Jordy Caicedo','Caicedo','DEL']
  ];

  // Intercala clubes para que las cintas y los equipos queden mezclados
  const porClub = {};
  lista.forEach(([club, nombre, corto, pos], i) => { (porClub[club] = porClub[club] || []).push({id:'j'+i, club, nombre, corto, pos}); });
  const grupos = Object.values(porClub), jugadores = [];
  for(let r = 0; grupos.some(g => g[r]); r++) grupos.forEach(g => { if(g[r]) jugadores.push(g[r]); });

  // Cómo encaja el juego en el año del fútbol argentino (propuesta de Mano a Mano)
  const temporada = {
    anio: 2026,
    torneos: [
      {id:'apertura', nombre:'Apertura 2026', cuando:'primer semestre', estado:'terminado'},
      {id:'clausura', nombre:'Clausura 2026', cuando:'segundo semestre', estado:'en curso'}
    ],
    // Liga Profesional: 16 fechas de fase regular en dos zonas y después playoffs a partido único
    fechasRegular: 16,
    fechasCruces: 14,      // fechas 1 a 14: un cruce por fecha
    fechasPlayoffs: [15, 16], // semifinal y final de la liga de amigos
    guardados: 2           // jugadores que se guardan del Apertura al Clausura
  };

  // Puntaje propuesto (a definir con el cliente)
  const puntaje = [
    ['Jugar 60 minutos o más', 2, 2, 2, 2],
    ['Gol', 10, 8, 7, 6],
    ['Asistencia', 5, 5, 5, 4],
    ['Valla invicta', 4, 4, 0, 0],
    ['Penal atajado', 6, 0, 0, 0],
    ['Amarilla', -2, -2, -2, -2],
    ['Roja', -5, -5, -5, -5]
  ];

  window.MAM = {
    nombre: 'Mano a Mano', // nombre provisorio
    torneo, temporada, puntaje, clubes, jugadores,
    liga: {nombre:'Los del Sábado', inscripcion:10000, aporte:10000, pctFechas:30},
    amigos: ['Vos','Charrito','Pastilla','Tano','Ruso','Colo','Flaco','Pela'],
    frases: [
      'El Charrito aceptó el desafío de $20.000',
      'Pastilla dejó 25 puntos en el banco',
      'Mi mediocampo mete más goles que el tuyo',
      'El último paga el asado',
      'Se viene el draft del sábado',
      'Te faltan 2 titulares',
      'Vas 63% a ganar el cruce',
      'Robo de la fecha: un 5 que hizo 14 puntos'
    ]
  };
})();
