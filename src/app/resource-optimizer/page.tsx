'use client'

import { useState } from 'react'
import { ProductionFormData, OptimizationData } from '@/types'
import { solveProduction } from '@/lib/optimizer'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ProjectDesc from '@/components/atoms/project-desc'
import OptimizeResults from '@/components/atoms/optimize-results'
import ProductionForm from '@/components/atoms/production-form'
import ProductionGraph from '@/components/atoms/optimization-graph';

export default function ResourceOptimizer() {
  const [optimizationData, setOptimizationData] = 
    useState<OptimizationData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = (formData: ProductionFormData) => {
    setLoading(true)
    setError(null)

    try {
      const result = solveProduction(
        formData.madera,
        formData.carpinteria,
        formData.acabado,
        formData.herrajes,
        formData.sillaMadera,
        formData.sillaCarpinteria,
        formData.sillaAcabado,
        formData.sillaHerrajes,
        formData.mesaMadera,
        formData.mesaCarpinteria,
        formData.mesaAcabado,
        formData.mesaHerrajes,
        formData.utilidadSilla,
        formData.utilidadMesa
      )

      setOptimizationData({
        formData,
        result
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al optimizar la producción'
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
            MaderArte Optimizer
          </h1>
          <p>
            Aplicación de Programación Lineal para Optimización de Producción de Muebles
          </p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Columna izquierda: Descripción y Formulario */}
          <div className='space-y-6'>
            <ProjectDesc />
            <ProductionForm
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
                <OptimizeResults data={optimizationData} />
                <ProductionGraph data={optimizationData} />
              </>
            ) : (
              <div className='bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-96'>
                <p className='text-gray-500 text-lg text-center'>
                  Ingresa los parámetros de producción y haz clic en{' '}
                  {`Optimizar
                  Producción`}{' '}
                  para ver la distribución óptima de recursos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}