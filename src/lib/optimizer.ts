/* eslint-disable @typescript-eslint/no-explicit-any */
import { Point, OptimalSolution, OptimizationResult } from '@/types'

/**
 * Modelo matemático para la optimización de mezcla de inversiones
 *
 * Variables de decisión:
 * x1 = Cantidad a invertir en inversión de tipo 1 (bajo riesgo)
 * x2 = Cantidad a invertir en inversión de tipo 2 (alto riesgo)
 *
 * Función objetivo: Maximizar Z = r1*x1 + r2*x2 (Retorno total esperado)
 *
 * Restricciones:
 * 1. x1 + x2 <= totalCapital (No podemos invertir más del capital disponible)
 * 2. risk1*x1 + risk2*x2 <= maxRisk*(x1 + x2) (El riesgo promedio ponderado no debe exceder el máximo)
 * 3. r1*x1 + r2*x2 >= minReturn (El retorno total debe ser al menos el mínimo esperado)
 * 4. x1 >= 0, x2 >= 0 (No negatividad)
 */

// Calcular los puntos de intersección de las restricciones
export function calculateIntersectionPoints(
	totalCapital: number,
	r1: number,
	r2: number,
	risk1: number,
	risk2: number,
	maxRisk: number,
	minReturn: number
): Point[] {
	const points: Point[] = []

	// Punto de origen
	points.push({ x: 0, y: 0 })

	// Intersecciones con los ejes
	points.push({ x: totalCapital, y: 0 })
	points.push({ x: 0, y: totalCapital })

	// Restricción de retorno mínimo: r1*x1 + r2*x2 = minReturn
	if (r2 > 0) {
		const yMinReturn = minReturn / r2
		if (yMinReturn >= 0 && yMinReturn <= totalCapital) {
			points.push({ x: 0, y: yMinReturn })
		}
	}

	if (r1 > 0) {
		const xMinReturn = minReturn / r1
		if (xMinReturn >= 0 && xMinReturn <= totalCapital) {
			points.push({ x: xMinReturn, y: 0 })
		}
	}

	// Restricción de riesgo: (risk1 - maxRisk)*x1 + (risk2 - maxRisk)*x2 = 0
	if (risk1 !== risk2) {
		if ((risk1 - maxRisk) * (risk2 - maxRisk) < 0) {
			const slope = (maxRisk - risk1) / (risk2 - maxRisk)

			// Intersección con la restricción de capital
			const xRisk = totalCapital / (1 + slope)
			const yRisk = totalCapital - xRisk

			if (xRisk >= 0 && yRisk >= 0) {
				points.push({ x: xRisk, y: yRisk })
			}

			// La línea de riesgo pasa por el origen
			points.push({ x: 0, y: 0 })
		}
	}

	// Intersección entre la restricción de capital y retorno mínimo
	if (r1 !== r2) {
		const xCapReturn = (totalCapital * r2 - minReturn) / (r2 - r1)
		const yCapReturn = totalCapital - xCapReturn

		if (
			xCapReturn >= 0 &&
			yCapReturn >= 0 &&
			xCapReturn <= totalCapital &&
			yCapReturn <= totalCapital
		) {
			points.push({ x: xCapReturn, y: yCapReturn })
		}
	}

	// Filtrar duplicados y puntos fuera de los límites
	const uniquePoints: Point[] = []
	points.forEach(point => {
		// Redondear valores para evitar problemas de precisión
		point.x = Math.round(point.x * 100) / 100
		point.y = Math.round(point.y * 100) / 100

		// Verificar si el punto ya existe
		const exists = uniquePoints.some(
			p => Math.abs(p.x - point.x) < 0.01 && Math.abs(p.y - point.y) < 0.01
		)

		// Verificar si el punto cumple con todas las restricciones
		const isValid =
			point.x >= 0 &&
			point.y >= 0 &&
			point.x + point.y <= totalCapital &&
			r1 * point.x + r2 * point.y >= minReturn &&
			(point.x + point.y === 0 ||
				(risk1 * point.x + risk2 * point.y) / (point.x + point.y) <= maxRisk)

		if (!exists && isValid) {
			uniquePoints.push(point)
		}
	})

	return uniquePoints
}

// Encontrar la solución óptima
export function findOptimalSolution(
	points: Point[],
	r1: number,
	r2: number
): OptimalSolution | null {
	if (points.length === 0) return null

	let maxReturn = -Infinity
	let optimalPoint: any | null = null

	points.forEach(point => {
		const returnValue = r1 * point.x + r2 * point.y
		if (returnValue > maxReturn) {
			maxReturn = returnValue
			optimalPoint = point
		}
	})

	if (!optimalPoint) return null

	return {
		x1: optimalPoint.x,
		x2: optimalPoint.y,
		totalReturn: maxReturn
	}
}

// Resolver el problema de optimización
export function solveInvestmentProblem(
	totalCapital: number,
	r1: number,
	r2: number,
	risk1: number,
	risk2: number,
	maxRisk: number,
	minReturn: number
): OptimizationResult {
	// Calcular puntos de intersección de restricciones
	const intersectionPoints = calculateIntersectionPoints(
		totalCapital,
		r1,
		r2,
		risk1,
		risk2,
		maxRisk,
		minReturn
	)

	// Encontrar la solución óptima
	const optimalSolution = findOptimalSolution(intersectionPoints, r1, r2)

	if (!optimalSolution) {
		throw new Error(
			'No se pudo encontrar una solución óptima con los parámetros proporcionados.'
		)
	}

	return {
		intersectionPoints,
		optimalSolution,
		constraints: {
			capital: { x1: 0, y1: totalCapital, x2: totalCapital, y2: 0 },
			minReturn: { slope: -r1 / r2, intercept: minReturn / r2 },
			risk: { slope: (maxRisk - risk1) / (risk2 - maxRisk), intercept: 0 }
		}
	}
}
