const express = require('express');
const app = express();
app.use(express.json());

// Comidas que se guardan en memoria con sus valores
let comidas = [
    {
      idComida: 1,
      nombreComida: 'Comida1',
      Proteina: 5,
      Carbohidratos: 10,
      Grasas: 2,
      cantidadPorcion: 100,
      UnidadMedida: 'gr',
      calProteina:      5 * 4,
      calCarbohidratos: 10 * 4,
      calGrasas:        2  * 9,
      calTotales:       5*4 + 10*4 + 2*9
    },
    {
      idComida: 2,
      nombreComida: 'Comida2',
      Proteina: 10,
      Carbohidratos: 20,
      Grasas: 7,
      cantidadPorcion: 150,
      UnidadMedida: 'gr',
      calProteina:      10 * 4,
      calCarbohidratos: 20 * 4,
      calGrasas:        7  * 9,
      calTotales:       10*4 + 20*4 + 7*9
    },
    {
        idComida: 3,
        nombreComida: 'Comida3',
        Proteina: 15,
        Carbohidratos: 30,
        Grasas: 10,
        cantidadPorcion: 200,
        UnidadMedida: 'gr',
        calProteina:      15 * 4,
        calCarbohidratos: 30 * 4,
        calGrasas:        10  * 9,
        calTotales:       15*4 + 30*4 + 10*9
    },
    {
        idComida: 4,
        nombreComida: 'Comida4',
        Proteina: 20,
        Carbohidratos: 40,
        Grasas: 15,
        cantidadPorcion: 100,
        UnidadMedida: 'gr',
        calProteina:      20 * 4,
        calCarbohidratos: 40 * 4,
        calGrasas:        15  * 9,
        calTotales:       20*4 + 40*4 + 15*9
    },
    {
        idComida: 5,
        nombreComida: 'Comida5',
        Proteina: 2,
        Carbohidratos: 40,
        Grasas: 15,
        cantidadPorcion: 100,
        UnidadMedida: 'gr',
        calProteina:      2 * 4,
        calCarbohidratos: 40 * 4,
        calGrasas:        15  * 9,
        calTotales:       2*4 + 40*4 + 15*9
    }
  ];


// Recetas que se guardan en memoria
let recetas = [
];

// GET / --> Raiz
app.get('/', function(request, response) {

    response.send("Bienvenido a la calculadora de macros!");

});

// GET /api/v1/comidas --> Trae todas las comidas que haya
app.get('/api/v1/comidas', function(req, res) {

    res.json(comidas);
});

// GET /api/v1/comidas/:id --> Trae los datos de una comida identificandola por ID
app.get('/api/v1/comidas/:id', (req, res) => {
    const id = Number(req.params.id);   
    const miComida = comidas.find(c => c.idComida === id);
    if (!miComida) return res.status(404).json({ error: 'ID de comida no encontrada' });
    res.json(miComida);
  });


// POST /api/v1/comidas --> crea una nueva comida e incluye cálculo de calorías
app.post('/api/v1/comidas', (req, res) => {
    // campos que vienen del body
    const {
      nombreComida,
      Proteina,
      Carbohidratos,
      Grasas,
      cantidadPorcion,
      UnidadMedida
    } = req.body;
  
    // Calculamos las calorías según los macros
    const calProteina       = Proteina      * 4;  // 4 kcal por g de proteína
    const calCarbohidratos  = Carbohidratos * 4;  // 4 kcal por g de carbohidrato
    const calGrasas         = Grasas        * 9;  // 9 kcal por g de grasa
    const calTotales        = calProteina + calCarbohidratos + calGrasas; // total de calorías
  
    // Construimos el objeto comida con ID incremental y todos sus valores
    const nuevaComida = {
      idComida:        comidas.length + 1,
      nombreComida,
      Proteina,
      Carbohidratos,
      Grasas,
      cantidadPorcion,
      UnidadMedida,
      calProteina,
      calCarbohidratos,
      calGrasas,
      calTotales
    };
  
    // Agregamos la comida  al array y respondemos 
    comidas.push(nuevaComida);
    res.status(201).json(nuevaComida);
  });

  
// DELETE /api/v1/comidas/:id --> Borra una comida pasandole el ID
app.delete('/api/v1/comidas/:id', (req, res) => {
    const id = Number(req.params.id);
    const lenAntes = comidas.length;
    comidas = comidas.filter(c => c.idComida !== id);
    if (comidas.length === lenAntes) return res.status(404).json({ error: 'ID de comida no encontrada' });
    res.status(204).end();
  });


//---------------------------------------------------------------
// ------------------------- RECETAS ----------------------------
//---------------------------------------------------------------


// GET /api/v1/recetas --> devuelve todas las recetas que haya creadas
app.get('/api/v1/recetas', (req, res) => {
    res.json(recetas);
  });

// GET /api/v1/recetas/:id --> devuelve los valores de una receta pasandole el id
app.get('/api/v1/recetas/:id', (req, res) => {
    const id = Number(req.params.id);
    const receta = recetas.find(r => r.idReceta === id);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(receta);
});



// POST /api/v1/recetas --> crea una nueva receta a partir de mínimo 2 ID de comidas y le asigna un idReceta incremental
app.post('/api/v1/recetas', (req, res) => {
    const { idComidas } = req.body; 
    // Validamos que sea un array con mínimo 2 ID de comidas
    if (!Array.isArray(idComidas) || idComidas.length < 2) {
      return res.status(400).json({ error: 'Envía un array con 2 o más id de comidas' });
    }
  
    // Buscar las comidas correspondientes a esos IDs
    const comidasSeleccionadas = comidas.filter(c => idComidas.includes(c.idComida));
  
    // validamos que los idComida que se enviaron existan
    if (comidasSeleccionadas.length !== idComidas.length) {
      return res.status(400).json({ error: 'Algún idComida no existe' });
    }
  
    // Calcular totales de macros
    const totalProteina = comidasSeleccionadas.reduce((sum, c) => sum + c.Proteina, 0);
    const totalCarbohidratos = comidasSeleccionadas.reduce((sum, c) => sum + c.Carbohidratos, 0);
    const totalGrasas = comidasSeleccionadas.reduce((sum, c) => sum + c.Grasas, 0);
  
    // Construir objeto de receta con idReceta incremental
    const nuevaReceta = {
      idReceta: recetas.length + 1,
      comidas: comidasSeleccionadas,
      totalProteina,
      totalCarbohidratos,
      totalGrasas
    };
  
    recetas.push(nuevaReceta);
    res.status(201).json(nuevaReceta);
  });

// DELETE /api/v1/recetas/:id --> elimina una receta por id
app.delete('/api/v1/recetas/:id', (req, res) => {
    const id = Number(req.params.id);
    const lenAntes = recetas.length;
  
    // Filtramos la lista borrando la receta cuyo idReceta coincida
    recetas = recetas.filter(r => r.idReceta !== id);
  
    // Si no cambió el largo del array recetas, no se encontró el id de la receta
    if (recetas.length === lenAntes) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
  
    // Si se borra exitosamente, devuelve un 204
    res.status(204).end();
  });
  

//---------------------------------------------------------------
// ---------------------- Recomendacion -------------------------
//---------------------------------------------------------------


// GET /api/v1/recomendacion/comidas/:id -->  Recomienda una comida para una etapa (volumen, definición o mantenimiento). Devuelve la comida, la etapa recomendada, el porcentaje de proteína y la cantidad de calorías totales que tiene la comida
app.get('/api/v1/recomendacion/comidas/:id', (req, res) => {
    const id = Number(req.params.id);
    const comida = comidas.find(c => c.idComida === id);
    if (!comida) {
      return res.status(404).json({ error: 'Comida no encontrada' });
    }
  
    // Calculamos % de proteína y lo redondeamos
    const pct = Number(((comida.calProteina / comida.calTotales) * 100).toFixed(2));
  
    // Determinamos la etapa para la que se recomienda la comida
    let etapa;
    if (pct >= 25) {
      etapa = 'definición';
    } else if (pct >= 15) {
      etapa = 'mantenimiento';
    } else {
      etapa = 'volumen';
    }
  
    // Respondemos con nombreComida, etapa, porcentaje y calTotales
    res.json({
      nombreComida: comida.nombreComida,  // Nombre de la comida
      etapa,                              // Etapa recomendada
      pctProteina: pct,                    // Porcentaje de proteína
      calTotales: comida.calTotales       // cantidad total de calorías
    });
  });
  
  
// GET /api/v1/recomendacion/recetas/:id --> devuelve id de la receta, etapa recomendada, % de proteína y calorías totales de una receta
app.get('/api/v1/recomendacion/recetas/:id', (req, res) => {
    const id = Number(req.params.id);
    const receta = recetas.find(r => r.idReceta === id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
  
    // Sumamos calorías totales y calorías de proteína de todas las comidas de la receta
    const totalCalProteina = receta.comidas.reduce((sum, c) => sum + c.calProteina, 0);
    const totalCalTotales  = receta.comidas.reduce((sum, c) => sum + c.calTotales, 0);
  
    // Calculamos % de proteína y lo redondeamos a dos decimales
    const pct = Number(((totalCalProteina / totalCalTotales) * 100).toFixed(2));
  
    // Determinamos la etapa para la que se recomienda la receta 
    let etapa;
    if (pct >= 25) {
      etapa = 'definición';
    } else if (pct >= 15) {
      etapa = 'mantenimiento';
    } else {
      etapa = 'volumen';
    }
  
    // Respondemos con idReceta, etapa, % de proteína y calorías totales
    res.json({
      idReceta:      receta.idReceta, // id de la receta
      etapa,               // Etapa recomendada
      pctProteina:   pct,  // Porcentaje de proteína
      totalCalorias: totalCalTotales  // cantidad total de calorías
    });
  });
  


// ------------------------- Config del puerto para poner a escuchar la app ----------------------------

app.listen(3333, function() {

    console.log('servidor ejecutando...');

});
