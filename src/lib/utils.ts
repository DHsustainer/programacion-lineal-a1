import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utilidad para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Formatear valor monetario
export function formatCurrency(
	value: number,
	locale = 'es-CO',
	currency = 'COP'
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value)
}

// Formatear porcentaje
export function formatPercent(value: number, decimals = 2): string {
	return `${value.toFixed(decimals)}%`
}

// Calcular el riesgo de la cartera
export function calculatePortfolioRisk(
	risk1: number,
	risk2: number,
	amount1: number,
	amount2: number
): number {
	const total = amount1 + amount2
	if (total <= 0) return 0

	return (risk1 * amount1 + risk2 * amount2) / total
}

// Ordenar puntos en sentido horario alrededor del centroide
export function sortPointsClockwise(
	points: { x: number; y: number }[]
): { x: number; y: number }[] {
	if (points.length < 3) return [...points]

	// Calcular centroide
	const centroidX = points.reduce((sum, p) => sum + p.x, 0) / points.length
	const centroidY = points.reduce((sum, p) => sum + p.y, 0) / points.length

	return [...points].sort((a, b) => {
		const angleA = Math.atan2(a.y - centroidY, a.x - centroidX)
		const angleB = Math.atan2(b.y - centroidY, b.x - centroidX)
		return angleA - angleB
	})
}
