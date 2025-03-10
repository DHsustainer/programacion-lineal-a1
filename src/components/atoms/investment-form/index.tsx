/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

// Esquema de validación usando Zod
const formSchema = z.object({
	totalCapital: z.number().min(1000, 'El capital debe ser al menos 1.000'),
	returnRate1: z
		.number()
		.min(0, 'El retorno no puede ser negativo')
		.max(20, 'El retorno no debe exceder 20%'),
	returnRate2: z
		.number()
		.min(0, 'El retorno no puede ser negativo')
		.max(30, 'El retorno no debe exceder 30%'),
	riskLevel1: z
		.number()
		.min(0, 'El riesgo no puede ser negativo')
		.max(10, 'El riesgo no debe exceder 10%'),
	riskLevel2: z
		.number()
		.min(0, 'El riesgo no puede ser negativo')
		.max(20, 'El riesgo no debe exceder 20%'),
	maxRiskLevel: z
		.number()
		.min(0, 'El riesgo no puede ser negativo')
		.max(20, 'El riesgo no debe exceder 20%'),
	minReturnAmount: z.number().min(0, 'El retorno no puede ser negativo')
})

interface InvestmentFormProps {
	onOptimize: (data: any) => void
	loading: boolean
}

export default function InvestmentForm({
	onOptimize,
	loading
}: InvestmentFormProps) {
	// Valores por defecto
	const defaultValues: any = {
		totalCapital: 100000,
		returnRate1: 5,
		returnRate2: 10,
		riskLevel1: 2,
		riskLevel2: 8,
		maxRiskLevel: 5,
		minReturnAmount: 800
	}

	// Inicializar el formulario con React Hook Form
	const form = useForm<any>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	const handleSubmit = (data: any) => {
		onOptimize(data)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Parámetros de Inversión</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-6'
					>
						{/* Capital Total */}
						<FormField
							control={form.control}
							name='totalCapital'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center'>
										Capital Total Disponible
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className='h-4 w-4 ml-2 text-muted-foreground' />
												</TooltipTrigger>
												<TooltipContent className='max-w-xs'>
													El monto total que tiene disponible para invertir.
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</FormLabel>
									<FormControl>
										<div className='flex items-center space-x-2'>
											<Input
												type='number'
												min={1000}
												step={1000}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
											<span className='text-sm font-medium'>$</span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Retorno Inversión 1 */}
							<FormField
								control={form.control}
								name='returnRate1'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Retorno Inversión Bajo Riesgo (%)</FormLabel>
										<FormControl>
											<div className='flex flex-col space-y-2'>
												<div className='flex justify-between'>
													<span className='text-xs'>0%</span>
													<span className='text-xs font-medium'>
														{field.value}%
													</span>
													<span className='text-xs'>20%</span>
												</div>
												<Slider
													min={0}
													max={20}
													step={0.5}
													value={[field.value]}
													onValueChange={value => field.onChange(value[0])}
												/>
											</div>
										</FormControl>
										<FormDescription>
											Retorno esperado para inversión conservadora.
										</FormDescription>
									</FormItem>
								)}
							/>

							{/* Retorno Inversión 2 */}
							<FormField
								control={form.control}
								name='returnRate2'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Retorno Inversión Alto Riesgo (%)</FormLabel>
										<FormControl>
											<div className='flex flex-col space-y-2'>
												<div className='flex justify-between'>
													<span className='text-xs'>0%</span>
													<span className='text-xs font-medium'>
														{field.value}%
													</span>
													<span className='text-xs'>30%</span>
												</div>
												<Slider
													min={0}
													max={30}
													step={0.5}
													value={[field.value]}
													onValueChange={value => field.onChange(value[0])}
												/>
											</div>
										</FormControl>
										<FormDescription>
											Retorno esperado para inversión agresiva.
										</FormDescription>
									</FormItem>
								)}
							/>

							{/* Riesgo Inversión 1 */}
							<FormField
								control={form.control}
								name='riskLevel1'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Riesgo Inversión Bajo Riesgo (%)</FormLabel>
										<FormControl>
											<div className='flex flex-col space-y-2'>
												<div className='flex justify-between'>
													<span className='text-xs'>0%</span>
													<span className='text-xs font-medium'>
														{field.value}%
													</span>
													<span className='text-xs'>10%</span>
												</div>
												<Slider
													min={0}
													max={10}
													step={0.5}
													value={[field.value]}
													onValueChange={value => field.onChange(value[0])}
												/>
											</div>
										</FormControl>
										<FormDescription>
											Nivel de riesgo para inversión conservadora.
										</FormDescription>
									</FormItem>
								)}
							/>

							{/* Riesgo Inversión 2 */}
							<FormField
								control={form.control}
								name='riskLevel2'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Riesgo Inversión Alto Riesgo (%)</FormLabel>
										<FormControl>
											<div className='flex flex-col space-y-2'>
												<div className='flex justify-between'>
													<span className='text-xs'>0%</span>
													<span className='text-xs font-medium'>
														{field.value}%
													</span>
													<span className='text-xs'>20%</span>
												</div>
												<Slider
													min={0}
													max={20}
													step={0.5}
													value={[field.value]}
													onValueChange={value => field.onChange(value[0])}
												/>
											</div>
										</FormControl>
										<FormDescription>
											Nivel de riesgo para inversión agresiva.
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>

						{/* Nivel de Riesgo Máximo */}
						<FormField
							control={form.control}
							name='maxRiskLevel'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center'>
										Nivel Máximo de Riesgo Aceptable (%)
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className='h-4 w-4 ml-2 text-muted-foreground' />
												</TooltipTrigger>
												<TooltipContent className='max-w-xs'>
													El riesgo promedio ponderado máximo que está dispuesto
													a aceptar en su cartera.
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</FormLabel>
									<FormControl>
										<div className='flex flex-col space-y-2'>
											<div className='flex justify-between'>
												<span className='text-xs'>0%</span>
												<span className='text-xs font-medium'>
													{field.value}%
												</span>
												<span className='text-xs'>20%</span>
											</div>
											<Slider
												min={0}
												max={20}
												step={0.5}
												value={[field.value]}
												onValueChange={value => field.onChange(value[0])}
											/>
										</div>
									</FormControl>
									<FormDescription>
										Limite el riesgo total de su cartera.
									</FormDescription>
								</FormItem>
							)}
						/>

						{/* Retorno Mínimo Esperado */}
						<FormField
							control={form.control}
							name='minReturnAmount'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center'>
										Retorno Mínimo Esperado
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className='h-4 w-4 ml-2 text-muted-foreground' />
												</TooltipTrigger>
												<TooltipContent className='max-w-xs'>
													El retorno mínimo en valor monetario que desea obtener
													de su inversión.
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</FormLabel>
									<FormControl>
										<div className='flex items-center space-x-2'>
											<Input
												type='number'
												min={0}
												step={100}
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
											<span className='text-sm font-medium'>$</span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={loading}
						>
							{loading ? 'Optimizando...' : 'Optimizar Inversión'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
