import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OptimizationData } from '@/types'
import {
	formatCurrency,
	formatPercent,
	calculatePortfolioRisk
} from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChartPie, Scale, TrendingUp } from 'lucide-react'

interface OptimizationResultsProps {
	data: OptimizationData
}

export default function OptimizationResults({
	data
}: OptimizationResultsProps) {
	if (!data || !data.result || !data.result.optimalSolution) {
		return (
			<Card>
				<CardContent className='pt-6'>
					<p className='text-center text-muted-foreground'>
						No hay resultados disponibles.
					</p>
				</CardContent>
			</Card>
		)
	}

	const { formData, result } = data
	const { optimalSolution } = result

	// Calcular la distribución de la inversión
	const totalInvested = optimalSolution.x1 + optimalSolution.x2
	const percentInvestment1 = (optimalSolution.x1 / totalInvested) * 100
	const percentInvestment2 = (optimalSolution.x2 / totalInvested) * 100

	// Calcular el riesgo de la cartera
	const portfolioRisk = calculatePortfolioRisk(
		formData.riskLevel1 / 100,
		formData.riskLevel2 / 100,
		optimalSolution.x1,
		optimalSolution.x2
	)

	// Calcular el retorno como porcentaje del capital
	const returnPercentage =
		(optimalSolution.totalReturn / formData.totalCapital) * 100

	// Verificar si se está utilizando todo el capital disponible
	const isUsingAllCapital =
		Math.abs(totalInvested - formData.totalCapital) < 0.01

	// Determinar la restricción activa
	const determineActiveConstraint = () => {
		if (!isUsingAllCapital) {
			// Si no se usa todo el capital, entonces otra restricción es la activa
			const portfolioRiskPercentage = portfolioRisk * 100
			const maxRiskPercentage = formData.maxRiskLevel

			// Verificar si el riesgo está en el límite
			if (Math.abs(portfolioRiskPercentage - maxRiskPercentage) < 0.1) {
				return 'riesgo'
			} else {
				return 'retorno'
			}
		} else {
			return 'capital'
		}
	}

	const activeConstraint = determineActiveConstraint()

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resultados de la Optimización</CardTitle>
			</CardHeader>
			<CardContent className='space-y-6'>
				{/* Distribución Óptima */}
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex items-center gap-2 mb-3'>
						<ChartPie className='h-5 w-5 text-blue-600' />
						<h3 className='font-medium text-blue-800'>Distribución Óptima</h3>
					</div>

					<div className='space-y-3'>
						<div>
							<div className='flex justify-between mb-1'>
								<span className='text-sm font-medium'>
									Inversión 1 (Bajo Riesgo)
								</span>
								<span className='text-sm font-medium'>
									{formatCurrency(optimalSolution.x1)}
								</span>
							</div>
							<Progress
								value={percentInvestment1}
								className='h-2'
							/>
							<div className='flex justify-between mt-1'>
								<span className='text-xs text-muted-foreground'>
									Retorno: {formatPercent(formData.returnRate1)}
								</span>
								<span className='text-xs text-muted-foreground'>
									{formatPercent(percentInvestment1)} del total
								</span>
							</div>
						</div>

						<div>
							<div className='flex justify-between mb-1'>
								<span className='text-sm font-medium'>
									Inversión 2 (Alto Riesgo)
								</span>
								<span className='text-sm font-medium'>
									{formatCurrency(optimalSolution.x2)}
								</span>
							</div>
							<Progress
								value={percentInvestment2}
								className='h-2'
							/>
							<div className='flex justify-between mt-1'>
								<span className='text-xs text-muted-foreground'>
									Retorno: {formatPercent(formData.returnRate2)}
								</span>
								<span className='text-xs text-muted-foreground'>
									{formatPercent(percentInvestment2)} del total
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Métricas de la cartera */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* Retorno Total */}
					<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
						<div className='flex justify-between items-center mb-2'>
							<div className='flex items-center gap-2'>
								<TrendingUp className='h-5 w-5 text-green-600' />
								<h3 className='font-medium text-green-800'>Retorno Total</h3>
							</div>
							<span className='text-lg font-semibold text-green-700'>
								{formatCurrency(optimalSolution.totalReturn)}
							</span>
						</div>
						<Progress
							value={returnPercentage}
							className='h-2 bg-green-200'
						/>
						<div className='flex justify-between mt-1'>
							<span className='text-xs text-muted-foreground'>
								Del capital invertido
							</span>
							<span className='text-xs font-medium text-green-700'>
								{formatPercent(returnPercentage)}
							</span>
						</div>
					</div>

					{/* Riesgo de la Cartera */}
					<div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
						<div className='flex justify-between items-center mb-2'>
							<div className='flex items-center gap-2'>
								<Scale className='h-5 w-5 text-amber-600' />
								<h3 className='font-medium text-amber-800'>
									Riesgo de la Cartera
								</h3>
							</div>
							<span className='text-lg font-semibold text-amber-700'>
								{formatPercent(portfolioRisk * 100)}
							</span>
						</div>
						<Progress
							value={((portfolioRisk * 100) / formData.maxRiskLevel) * 100}
							className='h-2 bg-amber-200'
						/>
						<div className='flex justify-between mt-1'>
							<span className='text-xs text-muted-foreground'>
								Nivel de riesgo
							</span>
							<span className='text-xs font-medium text-amber-700'>
								Máximo: {formatPercent(formData.maxRiskLevel)}
							</span>
						</div>
					</div>
				</div>

				{/* Información sobre restricciones activas */}
				<Alert
					variant='default'
					className='bg-slate-50'
				>
					<AlertDescription>
						{activeConstraint === 'capital' && (
							<span>
								La restricción de <strong>capital total</strong> es la
								restricción activa que limita la inversión.
							</span>
						)}
						{activeConstraint === 'riesgo' && (
							<span>
								La restricción de <strong>riesgo máximo</strong> es la
								restricción activa que limita la inversión.
							</span>
						)}
						{activeConstraint === 'retorno' && (
							<span>
								La restricción de <strong>retorno mínimo</strong> es la
								restricción activa que limita la inversión.
							</span>
						)}
					</AlertDescription>
				</Alert>

				<div className='text-sm text-muted-foreground'>
					<p>
						<strong>Nota:</strong> Esta solución representa la distribución
						óptima de acuerdo con los parámetros especificados. Ajuste los
						parámetros para explorar diferentes escenarios de inversión.
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
