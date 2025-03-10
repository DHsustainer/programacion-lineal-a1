/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Area
} from 'recharts'
import { OptimizationData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface GraphTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

// Componente personalizado para el tooltip de gráfico
const GraphTooltip = ({ active, payload }: GraphTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className='bg-white p-2 shadow-md rounded-md border border-gray-200'>
      <p className='text-sm font-medium'>{payload[0].name}</p>
      {payload.map((entry, index) => (
        <p key={index} className='text-xs text-gray-700'>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

interface ProductionGraphProps {
  data: OptimizationData
}

export default function ProductionGraph({ data }: ProductionGraphProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { formData, result } = data

  // Preparar datos para el gráfico de producción
  const productionData = [
    { 
      name: 'Sillas', 
      cantidad: result.sillas, 
      utilidad: result.sillas * formData.utilidadSilla
    },
    { 
      name: 'Mesas', 
      cantidad: result.mesas, 
      utilidad: result.mesas * formData.utilidadMesa
    }
  ]
  
  // Datos para el gráfico de recursos
  const resourceData = Object.entries(result.utilizacionRecursos).map(([key, value]: [string, any]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    usado: value.usado,
    disponible: value.disponible,
    porcentaje: value.porcentaje
  }))
  
  // Datos para el gráfico de sensibilidad
  const sensitivityData = Object.entries(result.valoresDuales).map(([key, value]: [string, any]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    valor: value
  }))

  // Datos para el gráfico de región factible
  // Crear puntos para la visualización de las restricciones
  // Estas son simplificaciones para mostrar las restricciones principales
  
  // Para simplificar, vamos a mostrar las restricciones en un plano 2D (sillas vs mesas)
  const maxSillas = Math.max(
    Math.floor(formData.madera / formData.sillaMadera),
    Math.floor(formData.carpinteria / formData.sillaCarpinteria),
    Math.floor(formData.acabado / formData.sillaAcabado),
    Math.floor(formData.herrajes / formData.sillaHerrajes)
  );
  
  const maxMesas = Math.max(
    Math.floor(formData.madera / formData.mesaMadera),
    Math.floor(formData.carpinteria / formData.mesaCarpinteria),
    Math.floor(formData.acabado / formData.mesaAcabado),
    Math.floor(formData.herrajes / formData.mesaHerrajes)
  );

  // Crear las líneas de restricción para cada recurso
  const maderaLine = [
    { x: 0, y: formData.madera / formData.mesaMadera },
    { x: formData.madera / formData.sillaMadera, y: 0 }
  ];
  
  const carpinteriaLine = [
    { x: 0, y: formData.carpinteria / formData.mesaCarpinteria },
    { x: formData.carpinteria / formData.sillaCarpinteria, y: 0 }
  ];
  
  const acabadoLine = [
    { x: 0, y: formData.acabado / formData.mesaAcabado },
    { x: formData.acabado / formData.sillaAcabado, y: 0 }
  ];
  
  const herrajesLine = [
    { x: 0, y: formData.herrajes / formData.mesaHerrajes },
    { x: formData.herrajes / formData.sillaHerrajes, y: 0 }
  ];

  // Punto óptimo (solución encontrada)
  const optimalPoint = [
    { x: result.sillas, y: result.mesas }
  ];

  // Puntos para sombrear la región factible (aproximada)
  // Esto es una simplificación geométrica
  const feasibleRegionPoints = [
    { x: 0, y: 0 },
    { x: 0, y: Math.min(maderaLine[0].y, carpinteriaLine[0].y, acabadoLine[0].y, herrajesLine[0].y) },
    { x: result.sillas, y: result.mesas },
    { x: Math.min(maderaLine[1].x, carpinteriaLine[1].x, acabadoLine[1].x, herrajesLine[1].x), y: 0 }
  ];

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
        <Tabs defaultValue='production'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='production'>Producción</TabsTrigger>
            <TabsTrigger value='resources'>Recursos</TabsTrigger>
            <TabsTrigger value='region'>Región Factible</TabsTrigger>
          </TabsList>

          <TabsContent
            value='production'
            className='h-64 mt-4'
          >
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <ComposedChart
                data={productionData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis yAxisId="left" orientation="left">
                  <Label
                    value='Cantidad'
                    angle={-90}
                    position='left'
                    offset={-5}
                  />
                </YAxis>
                <YAxis yAxisId="right" orientation="right">
                  <Label
                    value='Utilidad ($)'
                    angle={90}
                    position='right'
                    offset={-5}
                  />
                </YAxis>
                <Tooltip content={<GraphTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey='cantidad' name='Unidades' fill='#8884d8' />
                <Bar yAxisId="right" dataKey='utilidad' name='Utilidad ($)' fill='#82ca9d' />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent
            value='resources'
            className='h-64 mt-4'
          >
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <ComposedChart
                data={resourceData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis>
                  <Label
                    value='Cantidad'
                    angle={-90}
                    position='left'
                    offset={-5}
                  />
                </YAxis>
                <Tooltip content={<GraphTooltip />} />
                <Legend />
                <Bar dataKey='usado' name='Utilizado' fill='#8884d8' />
                <Bar dataKey='disponible' name='Disponible' fill='#82ca9d' />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent
            value='region'
            className='h-64 mt-4'
          >
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <ComposedChart
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  type='number'
                  dataKey='x'
                  domain={[0, maxSillas * 1.1]}
                >
                  <Label
                    value='Sillas'
                    position='bottom'
                    offset={-5}
                  />
                </XAxis>
                <YAxis
                  type='number'
                  dataKey='y'
                  domain={[0, maxMesas * 1.1]}
                >
                  <Label
                    value='Mesas'
                    angle={-90}
                    position='left'
                    offset={-5}
                  />
                </YAxis>
                <Tooltip />
                <Legend />

                {/* Región Factible (aproximada) */}
                <Area
                  type='linear'
                  dataKey='y'
                  data={feasibleRegionPoints}
                  fill='#8884d8'
                  fillOpacity={0.2}
                  stroke='none'
                  isAnimationActive={true}
                  name='Región Factible'
                />

                {/* Restricciones */}
                <Line
                  type='linear'
                  dataKey='y'
                  data={maderaLine}
                  stroke='#2563eb'
                  strokeWidth={2}
                  dot={false}
                  name='Restricción de Madera'
                />
                <Line
                  type='linear'
                  dataKey='y'
                  data={carpinteriaLine}
                  stroke='#059669'
                  strokeWidth={2}
                  dot={false}
                  name='Restricción de Carpintería'
                />
                <Line
                  type='linear'
                  dataKey='y'
                  data={acabadoLine}
                  stroke='#d97706'
                  strokeWidth={2}
                  dot={false}
                  name='Restricción de Acabado'
                />
                <Line
                  type='linear'
                  dataKey='y'
                  data={herrajesLine}
                  stroke='#7c3aed'
                  strokeWidth={2}
                  dot={false}
                  name='Restricción de Herrajes'
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
                    name='Solución Óptima'
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-center'>
          <div className='flex items-center justify-center'>
            <span className='inline-block w-3 h-3 rounded-full bg-blue-600 mr-1'></span>
            <span>Madera</span>
          </div>
          <div className='flex items-center justify-center'>
            <span className='inline-block w-3 h-3 rounded-full bg-green-600 mr-1'></span>
            <span>Carpintería</span>
          </div>
          <div className='flex items-center justify-center'>
            <span className='inline-block w-3 h-3 rounded-full bg-amber-600 mr-1'></span>
            <span>Acabado</span>
          </div>
          <div className='flex items-center justify-center'>
            <span className='inline-block w-3 h-3 rounded-full bg-purple-600 mr-1'></span>
            <span>Herrajes</span>
          </div>
          <div className='flex items-center justify-center'>
            <span className='inline-block w-3 h-3 rounded-full bg-red-600 mr-1'></span>
            <span>Óptimo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}