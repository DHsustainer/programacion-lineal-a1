/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ResourceUsageGraph({ data }: any) {
  const { result, formData } = data
  
  // Datos para el gráfico de producción
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización de Resultados</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="production">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="production">Producción</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensibilidad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production" className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Unidades', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Utilidad ($)', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value: any, name: any) => {
                  if (name === "utilidad") return [`$${value}`, "Utilidad"];
                  return [value, "Cantidad"];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="cantidad" name="Unidades" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="utilidad" name="Utilidad ($)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="resources" className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usado" name="Utilizado" fill="#8884d8" />
                <Bar dataKey="disponible" name="Disponible" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="sensitivity" className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sensitivityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Valor Dual ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: any) => [`$${value}`, "Valor Dual"]} />
                <Legend />
                <Bar dataKey="valor" name="Valor por unidad adicional" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}