import React, { useEffect, useMemo, useState } from 'react'
import {
	Area,
	CartesianGrid,
	ComposedChart,
	Label,
	Line,
	ReferenceDot,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { sortPointsClockwise } from '@/lib/utils'
import { OptimizationData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface GraphTooltipProps {
	active?: boolean
	payload?: Array<{ value: number }>
	label?: string
}

// Componente personalizado para el tooltip de gráfico
const GraphTooltip = ({ active, payload }: GraphTooltipProps) => {
	if (!active || !payload || payload.length < 2) return null

	return (
		<div className='bg-white p-2 shadow-md rounded-md border border-gray-200'>
			<p className='text-sm font-medium'>Punto de la región factible</p>
			<p className='text-xs text-gray-700'>
				Inversión 1: ${payload[0].value.toLocaleString()}
			</p>
			<p className='text-xs text-gray-700'>
				Inversión 2: ${payload[1].value.toLocaleString()}
			</p>
		</div>
	)
}

interface OptimizationGraphProps {
	data: OptimizationData
}

export default function OptimizationGraph({ data }: OptimizationGraphProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Preparar datos para el gráfico
	const { formData, result } = data
	const { intersectionPoints, optimalSolution } = result

	// Calcular los límites del gráfico
	const maxX = useMemo(
		() => Math.ceil(formData.totalCapital * 1.1),
		[formData.totalCapital]
	)
	const maxY = useMemo(
		() => Math.ceil(formData.totalCapital * 1.1),
		[formData.totalCapital]
	)

	// Crear puntos para la región factible
	const feasibleRegionPoints = useMemo(() => {
		if (intersectionPoints.length < 3) {
			return []
		}

		// Ordenar los puntos en sentido horario para formar el polígono
		const sortedPoints = sortPointsClockwise(intersectionPoints)

		// Crear datos para el polígono cerrado
		const polygonPoints = [...sortedPoints, sortedPoints[0]]

		return polygonPoints.map(point => ({
			x: point.x,
			y: point.y
		}))
	}, [intersectionPoints])

	// Puntos de restricciones para visualización
	const capitalLine = useMemo(
		() => [
			{ x: 0, y: formData.totalCapital },
			{ x: formData.totalCapital, y: 0 }
		],
		[formData.totalCapital]
	)

	const minReturnLine = useMemo(() => {
		const r1 = formData.returnRate1 / 100
		const r2 = formData.returnRate2 / 100
		const minReturn = formData.minReturnAmount

		// Si alguna tasa es cero, no podemos calcular la intersección
		if (r1 === 0 || r2 === 0) return []

		const x2 = minReturn / r2
		const x1 = minReturn / r1

		// Añadir algunos puntos adicionales para visualizar mejor la línea
		return [
			{ x: 0, y: x2 },
			{ x: x1, y: 0 }
		]
	}, [formData.returnRate1, formData.returnRate2, formData.minReturnAmount])

	const riskLine = useMemo(() => {
		const risk1 = formData.riskLevel1 / 100
		const risk2 = formData.riskLevel2 / 100
		const maxRisk = formData.maxRiskLevel / 100

		// Si los riesgos son iguales o no hay diferencia en relación al riesgo máximo
		if (risk1 === risk2 || (risk1 - maxRisk) * (risk2 - maxRisk) >= 0) {
			return []
		}

		const slope = (maxRisk - risk1) / (risk2 - maxRisk)

		// La línea de riesgo pasa por el origen
		return [
			{ x: 0, y: 0 },
			{ x: maxX / (1 + slope), y: (maxX / (1 + slope)) * slope }
		]
	}, [formData.riskLevel1, formData.riskLevel2, formData.maxRiskLevel, maxX])

	// Puntos óptimos para visualización
	const optimalPoint = useMemo(
		() => [
			{
				x: optimalSolution.x1,
				y: optimalSolution.x2,
				label: 'Óptimo'
			}
		],
		[optimalSolution]
	)

	if (!mounted) {
		return (
			<Card className='w-full h-96'>
				<CardHeader>
					<CardTitle>Visualización</CardTitle>
				</CardHeader>
				<CardContent className='h-64'>
					<Skeleton className='w-full h-full' />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Visualización</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='graph'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='graph'>Región Factible</TabsTrigger>
						<TabsTrigger value='constraints'>Restricciones</TabsTrigger>
					</TabsList>

					<TabsContent
						value='graph'
						className='h-64 mt-4'
					>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<ComposedChart
								margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									type='number'
									dataKey='x'
									domain={[0, maxX]}
									tickFormatter={value => `$${value / 1000}k`}
								>
									<Label
										value='Inversión 1 (Bajo Riesgo)'
										position='bottom'
										offset={-5}
									/>
								</XAxis>
								<YAxis
									type='number'
									dataKey='y'
									domain={[0, maxY]}
									tickFormatter={value => `$${value / 1000}k`}
								>
									<Label
										value='Inversión 2 (Alto Riesgo)'
										angle={-90}
										position='left'
										offset={-5}
									/>
								</YAxis>
								<Tooltip content={<GraphTooltip />} />

								{/* Región Factible */}
								<Area
									type='linear'
									dataKey='y'
									data={feasibleRegionPoints}
									fill='#8884d8'
									fillOpacity={0.2}
									stroke='none'
									isAnimationActive={true}
								/>

								{/* Punto Óptimo */}
								{optimalPoint.map((point, index) => (
									<ReferenceDot
										key={index}
										x={point.x}
										y={point.y}
										r={6}
										fill='#ff0000'
										stroke='none'
									/>
								))}
							</ComposedChart>
						</ResponsiveContainer>
					</TabsContent>

					<TabsContent
						value='constraints'
						className='h-64 mt-4'
					>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<ComposedChart
								margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									type='number'
									dataKey='x'
									domain={[0, maxX]}
									tickFormatter={value => `$${value / 1000}k`}
								>
									<Label
										value='Inversión 1 (Bajo Riesgo)'
										position='bottom'
										offset={-5}
									/>
								</XAxis>
								<YAxis
									type='number'
									dataKey='y'
									domain={[0, maxY]}
									tickFormatter={value => `$${value / 1000}k`}
								>
									<Label
										value='Inversión 2 (Alto Riesgo)'
										angle={-90}
										position='left'
										offset={-5}
									/>
								</YAxis>
								<Tooltip content={<GraphTooltip />} />

								{/* Restricción de Capital */}
								<Line
									type='linear'
									dataKey='y'
									data={capitalLine}
									stroke='#2563eb'
									strokeWidth={2}
									dot={false}
									name='Restricción de Capital'
								/>

								{/* Restricción de Retorno Mínimo */}
								{minReturnLine.length > 0 && (
									<Line
										type='linear'
										dataKey='y'
										data={minReturnLine}
										stroke='#059669'
										strokeWidth={2}
										dot={false}
										name='Restricción de Retorno Mínimo'
									/>
								)}

								{/* Restricción de Riesgo Máximo */}
								{riskLine.length > 0 && (
									<Line
										type='linear'
										dataKey='y'
										data={riskLine}
										stroke='#d97706'
										strokeWidth={2}
										dot={false}
										name='Restricción de Riesgo Máximo'
									/>
								)}

								{/* Punto Óptimo */}
								{optimalPoint.map((point, index) => (
									<ReferenceDot
										key={index}
										x={point.x}
										y={point.y}
										r={6}
										fill='#ff0000'
										stroke='none'
									/>
								))}
							</ComposedChart>
						</ResponsiveContainer>
					</TabsContent>
				</Tabs>

				<div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center'>
					<div className='flex items-center justify-center'>
						<span className='inline-block w-3 h-3 rounded-full bg-blue-600 mr-1'></span>
						<span>Capital</span>
					</div>
					<div className='flex items-center justify-center'>
						<span className='inline-block w-3 h-3 rounded-full bg-green-600 mr-1'></span>
						<span>Retorno Mínimo</span>
					</div>
					<div className='flex items-center justify-center'>
						<span className='inline-block w-3 h-3 rounded-full bg-amber-600 mr-1'></span>
						<span>Riesgo Máximo</span>
					</div>
					<div className='flex items-center justify-center'>
						<span className='inline-block w-3 h-3 rounded-full bg-red-600 mr-1'></span>
						<span>Solución Óptima</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
