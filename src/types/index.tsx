// Datos del formulario de inversión
export interface InvestmentFormData {
	totalCapital: number
	returnRate1: number // En porcentaje
	returnRate2: number // En porcentaje
	riskLevel1: number // En porcentaje
	riskLevel2: number // En porcentaje
	maxRiskLevel: number // En porcentaje
	minReturnAmount: number
}

// Punto en el plano cartesiano
export interface Point {
	x: number
	y: number
}

// Solución óptima del problema
export interface OptimalSolution {
	x1: number
	x2: number
	totalReturn: number
}

// Restricciones gráficas
export interface Constraints {
	capital: {
		x1: number
		y1: number
		x2: number
		y2: number
	}
	minReturn: {
		slope: number
		intercept: number
	}
	risk: {
		slope: number
		intercept: number
	}
}

// Resultado de la optimización
export interface OptimizationResult {
	intersectionPoints: Point[]
	optimalSolution: OptimalSolution
	constraints: Constraints
}

// Datos completos para la visualización
export interface OptimizationData {
	formData: InvestmentFormData
	result: OptimizationResult
}

// Punto para el gráfico de la región factible
export interface ChartPoint {
	x: number
	y: number
	label?: string
	optimal?: boolean
	regionPoint?: boolean
}
