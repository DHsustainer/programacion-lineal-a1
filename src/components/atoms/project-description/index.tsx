import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProjectDescription() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Optimización de Mezcla de Inversiones</CardTitle>
				<CardDescription>
					Una aplicación de programación lineal para distribución óptima de
					capital
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='description'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='description'>Descripción</TabsTrigger>
						<TabsTrigger value='theory'>Modelo Matemático</TabsTrigger>
						<TabsTrigger value='instructions'>Instrucciones</TabsTrigger>
					</TabsList>

					<TabsContent
						value='description'
						className='mt-4 text-sm space-y-3'
					>
						<p>
							Esta aplicación utiliza programación lineal para determinar la
							distribución óptima de capital entre dos tipos de inversiones con
							diferentes niveles de riesgo y retorno.
						</p>
						<p>
							El objetivo es maximizar el retorno total esperado mientras se
							cumplen las restricciones de capital disponible, riesgo máximo
							permitido y retorno mínimo esperado.
						</p>
						<p>
							La solución se visualiza gráficamente mostrando la región factible
							y el punto óptimo.
						</p>
					</TabsContent>

					<TabsContent
						value='theory'
						className='mt-4 text-sm space-y-3'
					>
						<p className='font-medium'>Variables de decisión:</p>
						<ul className='list-disc list-inside ml-4 space-y-1'>
							<li>x₁ = Cantidad a invertir en la inversión de bajo riesgo</li>
							<li>x₂ = Cantidad a invertir en la inversión de alto riesgo</li>
						</ul>

						<p className='font-medium mt-2'>Función objetivo:</p>
						<p className='ml-4'>Maximizar Z = r₁·x₁ + r₂·x₂</p>

						<p className='font-medium mt-2'>Restricciones:</p>
						<ul className='list-disc list-inside ml-4 space-y-1'>
							<li>Capital: x₁ + x₂ ≤ Capital Total</li>
							<li>Riesgo: (risk₁·x₁ + risk₂·x₂)/(x₁ + x₂) ≤ Riesgo Máximo</li>
							<li>Retorno: r₁·x₁ + r₂·x₂ ≥ Retorno Mínimo</li>
							<li>No negatividad: x₁, x₂ ≥ 0</li>
						</ul>
					</TabsContent>

					<TabsContent
						value='instructions'
						className='mt-4 text-sm space-y-3'
					>
						<p className='font-medium'>Cómo usar la aplicación:</p>
						<ol className='list-decimal list-inside ml-4 space-y-1'>
							<li>Introduzca el capital total disponible para invertir</li>
							<li>
								Establezca las tasas de retorno esperado para cada inversión
							</li>
							<li>Defina los niveles de riesgo asociados a cada inversión</li>
							<li>
								Especifique el nivel máximo de riesgo que está dispuesto a
								asumir
							</li>
							<li>Indique el retorno mínimo que espera obtener</li>
							<li>
								Haga clic en {`Optimizar Inversión`} para ver los resultados
							</li>
						</ol>
						<p className='mt-2'>
							Puede ajustar los parámetros y volver a optimizar para explorar
							diferentes escenarios.
						</p>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
