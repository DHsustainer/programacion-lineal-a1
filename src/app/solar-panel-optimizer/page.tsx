'use client'
import SolarPanelOptimizer from '@/components/atoms/solar-panel-optimizer'

export default function Home() {
	return (
		<div className='w-full'>
			<main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
				<SolarPanelOptimizer />
			</main>
		</div>
	)
}
