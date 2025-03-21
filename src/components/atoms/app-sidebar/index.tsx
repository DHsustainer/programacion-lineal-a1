import { ChartCandlestick, Cone, SquareMenu } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'

// Menu items.
const items = [
	{
		title: 'Actividad 1',
		url: '/solar-panel-optimizer',
		icon: SquareMenu
	},
	{
		title: 'Actividad 2',
		url: '/optimizer-invest',
		icon: ChartCandlestick
	},
	{
		title: 'Actividad 3',
		url: '/resource-optimizer',
		icon: ChartCandlestick
	},
	{
		title: 'Simulación',
		url: '/optimizer-tool',
		icon: Cone
	}
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Programación Lineal</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
