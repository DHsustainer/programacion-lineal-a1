// Datos del formulario de inversión
export interface InvestmentFormData {
  utilidadSilla: number;
	totalCapital: number
	returnRate1: number // En porcentaje
	returnRate2: number // En porcentaje
	riskLevel1: number // En porcentaje
	riskLevel2: number // En porcentaje
	maxRiskLevel: number // En porcentaje
	minReturnAmount: number
}

// Definición de puntos para el gráfico
export interface Point {
  x: number;
  y: number;
}

// Solución óptima para el problema de inversión
export interface OptimalSolution {
  x1: number;
  x2: number;
  totalReturn: number;
}

// Resultado de la optimización de inversión
export interface InvestmentOptimizationResult {
  intersectionPoints: Point[];
  optimalSolution: OptimalSolution;
  constraints: {
    capital: { x1: number; y1: number; x2: number; y2: number };
    minReturn: { slope: number; intercept: number };
    risk: { slope: number; intercept: number };
  };
}

// Definición de tipos para el formulario de datos de producción
export interface ProductionFormData {
  // Recursos disponibles
  madera: number;
  carpinteria: number;
  acabado: number;
  herrajes: number;
  
  // Requerimientos para sillas
  sillaMadera: number;
  sillaCarpinteria: number;
  sillaAcabado: number;
  sillaHerrajes: number;
  
  // Requerimientos para mesas
  mesaMadera: number;
  mesaCarpinteria: number;
  mesaAcabado: number;
  mesaHerrajes: number;
  
  // Utilidad por producto
  utilidadSilla: number;
  utilidadMesa: number;
}

// Resultado de la optimización de producción
export interface OptimizationResult {
  sillas: number;
  mesas: number;
  utilidadTotal: number;
  utilizacionRecursos: ResourceUsage;
  valoresDuales: DualValues;
  cuellosBotella: string[];
}

// Datos de uso de recursos
export interface ResourceUsage {
  madera: { usado: number; disponible: number; porcentaje: number };
  carpinteria: { usado: number; disponible: number; porcentaje: number };
  acabado: { usado: number; disponible: number; porcentaje: number };
  herrajes: { usado: number; disponible: number; porcentaje: number };
}

// Valores duales (sensibilidad)
export interface DualValues {
  madera: number;
  carpinteria: number;
  acabado: number;
  herrajes: number;
}

// Datos completos de optimización
export interface OptimizationData {
  formData: ProductionFormData;
  result: OptimizationResult;
}

// Para compatibilidad con código previo de inversión
export interface InvestmentFormData {
  totalCapital: number;
  returnRate1: number;
  returnRate2: number;
  riskLevel1: number;
  riskLevel2: number;
  maxRiskLevel: number;
  minReturnAmount: number;
}