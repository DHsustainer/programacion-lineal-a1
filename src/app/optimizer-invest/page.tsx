/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { OptimizationData } from '@/types'
import { solveInvestmentProblem } from '@/lib/optimizer'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ProjectDescription from '@/components/atoms/project-description'
import InvestmentForm from '@/components/atoms/investment-form'
import OptimizationResults from '@/components/atoms/optimization-results'
import OptimizationGraph from '@/components/atoms/optimization-graph'

export default function Home() {
	const [optimizationData, setOptimizationData] =
		useState<OptimizationData | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const handleOptimize = (formData: any) => {
		setLoading(true)
		setError(null)

		try {
			// Convertir porcentajes a decimales para cálculos
			const result = solveInvestmentProblem(
				formData.totalCapital,
				formData.returnRate1 / 100, // Convertir a decimal
				formData.returnRate2 / 100, // Convertir a decimal
				formData.riskLevel1 / 100, // Convertir a decimal
				formData.riskLevel2 / 100, // Convertir a decimal
				formData.maxRiskLevel / 100, // Convertir a decimal
				formData.minReturnAmount
			)

			setOptimizationData({
				formData,
				result
			})
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Ocurrió un error al optimizar la inversión'
			)
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='container mx-auto px-4 py-8'>
				<div className='flex flex-col items-center mb-8 gap-4'>
					<h1 className='text-3xl font-bold'>
						Optimizador de Cartera de Inversiones
					</h1>
					<p>
						Aplicación de Programación Lineal para Optimización de Mezcla de
						Inversiones
					</p>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{/* Columna izquierda: Descripción y Formulario */}
					<div className='space-y-6'>
						<ProjectDescription />
						<InvestmentForm
							onOptimize={handleOptimize}
							loading={loading}
						/>
					</div>

					{/* Columna derecha: Resultados y Gráfico */}
					<div className='space-y-6'>
						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{optimizationData ? (
							<>
								<OptimizationResults data={optimizationData} />
								<OptimizationGraph data={optimizationData} />
							</>
						) : (
							<div className='bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-96'>
								<p className='text-gray-500 text-lg text-center'>
									Ingresa los parámetros de inversión y haz clic en{' '}
									{`Optimizar
									Inversión`}{' '}
									para ver la distribución óptima de tu capital.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
