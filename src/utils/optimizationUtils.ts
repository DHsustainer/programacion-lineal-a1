/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Función para verificar si un punto es factible
export const isFeasible = (params: { a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }, x1: number, x2: number) => {
  const { a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  return (
    a11 * x1 + a12 * x2 <= b1 &&
    a21 * x1 + a22 * x2 <= b2 &&
    a31 * x1 + a32 * x2 <= b3 &&
    x1 >= 0 && x2 >= 0
  );
};

// Función para encontrar los puntos de intersección de las restricciones
export const findIntersections = (params: { a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }) => {
  const { a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  const intersections = [];
  
  // Punto (0,0)
  intersections.push([0, 0]);
  
  // Intersección con los ejes
  // Eje x1 (x2 = 0)
  intersections.push([b1/a11, 0]); // Restricción 1 con eje x1
  intersections.push([b2/a21, 0]); // Restricción 2 con eje x1
  intersections.push([b3/a31, 0]); // Restricción 3 con eje x1
  
  // Eje x2 (x1 = 0)
  intersections.push([0, b1/a12]); // Restricción 1 con eje x2
  intersections.push([0, b2/a22]); // Restricción 2 con eje x2
  intersections.push([0, b3/a32]); // Restricción 3 con eje x2
  
  // Intersecciones entre restricciones
  // Restricción 1 y 2
  const det12 = a11 * a22 - a12 * a21;
  if (det12 !== 0) {
    const x1 = (b1 * a22 - b2 * a12) / det12;
    const x2 = (a11 * b2 - a21 * b1) / det12;
    intersections.push([x1, x2]);
  }
  
  // Restricción 1 y 3
  const det13 = a11 * a32 - a12 * a31;
  if (det13 !== 0) {
    const x1 = (b1 * a32 - b3 * a12) / det13;
    const x2 = (a11 * b3 - a31 * b1) / det13;
    intersections.push([x1, x2]);
  }
  
  // Restricción 2 y 3
  const det23 = a21 * a32 - a22 * a31;
  if (det23 !== 0) {
    const x1 = (b2 * a32 - b3 * a22) / det23;
    const x2 = (a21 * b3 - a31 * b2) / det23;
    intersections.push([x1, x2]);
  }
  
  return intersections;
};

// Función para calcular la solución óptima
export const calculateOptimalSolution = (params: { c1: any; c2: any; a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }) => {
  const { c1, c2, a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  
  // Encontrar los puntos de intersección de las restricciones
  const intersections = findIntersections(params);
  
  // Filtrar los puntos factibles
  const feasiblePoints = intersections.filter(point => isFeasible(params, point[0], point[1]));
  
  // Calcular la utilidad para cada punto factible
  const utilities = feasiblePoints.map(point => ({
    x1: point[0],
    x2: point[1],
    utility: c1 * point[0] + c2 * point[1]
  }));
  
  // Ordenar por utilidad (de mayor a menor)
  utilities.sort((a, b) => b.utility - a.utility);
  
  // La solución óptima es la que tiene mayor utilidad
  const optimalSolution = utilities.length > 0 ? utilities[0] : { x1: 0, x2: 0, utility: 0 };
  
  // Verificar qué restricciones son activas en la solución óptima
  const activeConstraints = {
    assembly: Math.abs(a11 * optimalSolution.x1 + a12 * optimalSolution.x2 - b1) < 0.001,
    qualityControl: Math.abs(a21 * optimalSolution.x1 + a22 * optimalSolution.x2 - b2) < 0.001,
    packaging: Math.abs(a31 * optimalSolution.x1 + a32 * optimalSolution.x2 - b3) < 0.001
  };
  
  // Preparar el punto óptimo para la visualización
  const optimalPoint = [{ x: optimalSolution.x1, y: optimalSolution.x2 }];
  
  return { optimalSolution, activeConstraints, optimalPoint };
};

// Función para generar los datos para los gráficos
export const generateGraphData = (params: { c1?: number; c2?: number; a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }, optimalSolution: { x1: number; x2: number; utility: number; }) => {
  const { a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  
  // Definir el rango de x para las gráficas
  const maxX1 = Math.max(b1/a11, b2/a21, b3/a31) * 1.2;
  const points = [];
  
  // Generar puntos para verificar la región factible
  for (let x1 = 0; x1 <= maxX1; x1 += maxX1/50) {
    for (let x2 = 0; x2 <= maxX1; x2 += maxX1/50) {
      if (isFeasible(params, x1, x2)) {
        points.push({ x: x1, y: x2 });
      }
    }
  }
  
  // Generar líneas para las restricciones
  const constraintLines = [
    // Restricción de ensamblaje
    Array.from({ length: 51 }, (_, i) => {
      const x1 = (i / 50) * maxX1;
      return { restriccion: 'Ensamblaje', x: x1, y: (b1 - a11 * x1) / a12 };
    }),
    // Restricción de control de calidad
    Array.from({ length: 51 }, (_, i) => {
      const x1 = (i / 50) * maxX1;
      return { restriccion: 'Control de Calidad', x: x1, y: (b2 - a21 * x1) / a22 };
    }),
    // Restricción de empaque
    Array.from({ length: 51 }, (_, i) => {
      const x1 = (i / 50) * maxX1;
      return { restriccion: 'Empaque', x: x1, y: (b3 - a31 * x1) / a32 };
    })
  ];
  
  return {
    feasibleRegionData: points,
    constraintLinesData: constraintLines
  };
};

// Función para calcular los precios sombra
export const calculateShadowPrices = (params: { c1: any; c2: any; a11?: number; a12?: number; b1?: number; a21?: number; a22?: number; b2?: number; a31?: number; a32?: number; b3?: number; }, activeConstraints: { assembly: any; qualityControl: any; packaging: any; }) => {
  const { c1, c2 } = params;
  
  // En un caso real, los precios sombra se obtendrían del problema dual
  // Aquí usamos una estimación basada en las restricciones activas
  const assemblyPrice = activeConstraints.assembly ? c1 * 0.2 : 0;
  const qualityControlPrice = activeConstraints.qualityControl ? c2 * 0.1 : 0;
  const packagingPrice = activeConstraints.packaging ? c1 * 0.25 : 0;
  
  return {
    assembly: assemblyPrice,
    qualityControl: qualityControlPrice,
    packaging: packagingPrice
  };
};

// Función para calcular los rangos de sensibilidad
export const calculateSensitivityRanges = (params: { c1: any; c2: any; a11?: number; a12?: number; b1?: number; a21?: number; a22?: number; b2?: number; a31?: number; a32?: number; b3?: number; }) => {
  const { c1, c2 } = params;
  
  // En un caso real, estos rangos se calcularían de la tabla simplex final
  // Aquí usamos una aproximación simple
  return {
    c1: { min: c1 * 0.75, max: c1 * 1.25 },
    c2: { min: c2 * 0.8, max: c2 * 1.2 }
  };
};

// Función para calcular el análisis de recursos
export const calculateResourceAnalysis = (params: { c1?: number; c2?: number; a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }, optimalSolution: { x1: any; x2: any; utility?: number; }) => {
  const { a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  const { x1, x2 } = optimalSolution;
  
  // Calculamos el uso actual de recursos
  const assemblyUsage = a11 * x1 + a12 * x2;
  const qualityControlUsage = a21 * x1 + a22 * x2;
  const packagingUsage = a31 * x1 + a32 * x2;
  
  // Calculamos el porcentaje de uso de cada recurso
  const assemblyPercentage = (assemblyUsage / b1) * 100;
  const qualityControlPercentage = (qualityControlUsage / b2) * 100;
  const packagingPercentage = (packagingUsage / b3) * 100;
  
  // Recursos sobrantes
  const assemblyRemaining = b1 - assemblyUsage;
  const qualityControlRemaining = b2 - qualityControlUsage;
  const packagingRemaining = b3 - packagingUsage;
  
  return {
    usage: {
      assembly: assemblyUsage,
      qualityControl: qualityControlUsage,
      packaging: packagingUsage
    },
    percentage: {
      assembly: assemblyPercentage,
      qualityControl: qualityControlPercentage,
      packaging: packagingPercentage
    },
    remaining: {
      assembly: assemblyRemaining,
      qualityControl: qualityControlRemaining,
      packaging: packagingRemaining
    }
  };
};

// Función para actualizar la formulación del problema dual
export const updateDualProblem = (params: { c1: any; c2: any; a11: any; a12: any; b1: any; a21: any; a22: any; b2: any; a31: any; a32: any; b3: any; }) => {
  const { c1, c2, a11, a12, b1, a21, a22, b2, a31, a32, b3 } = params;
  
  return {
    coefficients: [b1, b2, b3],
    restrictions: [
      [a11, a21, a31, c1],
      [a12, a22, a32, c2]
    ]
  };
};

// Función para simular cambios en los parámetros
export const simulateChanges = (params: { c1: any; c2: any; a11?: number; a12?: number; b1?: number; a21?: number; a22?: number; b2?: number; a31?: number; a32?: number; b3?: number; }, optimalSolution: { x1: any; x2: any; utility: any; }, changes: { deltaC1: any; deltaC2: any; deltaB1?: number; deltaB2?: number; deltaB3?: number; }) => {
  const { c1, c2 } = params;
  const { x1, x2, utility } = optimalSolution;
  const { deltaC1, deltaC2 } = changes;
  
  // Calcular la nueva utilidad con los cambios en los coeficientes
  const newUtility = (c1 + deltaC1) * x1 + (c2 + deltaC2) * x2;
  
  return {
    newUtility,
    difference: newUtility - utility
  };
};