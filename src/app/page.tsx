'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center w-full h-full mx-auto p-8'>
			<Card>
				<CardHeader>
					<CardTitle>Proyectos de Programación Lineal</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					<p>
						Aquí encontrarás todos los proyectos propuestos para la asignatura
						Programación Lineal.
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
