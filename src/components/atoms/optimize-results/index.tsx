/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ReactNode } from "react"

export default function OptimizeResults({ data }: any) {
  const { result, formData } = data
  
  // Utilidad detallada
  const utilidadSillas = result.sillas * formData.utilidadSilla
  const utilidadMesas = result.mesas * formData.utilidadMesa
  
  // Recursos ordenados por valor dual (para recomendaciones)
  const recursosPorValor = Object.entries(result.valoresDuales)
    .filter(([_, value]) => (value as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Solución Óptima</span>
            <Badge variant="outline" className="text-lg">
              ${result.utilidadTotal.toLocaleString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-500">Sillas</span>
              <span className="text-3xl font-bold">{result.sillas}</span>
              <span className="text-xs text-green-600">${utilidadSillas.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-500">Mesas</span>
              <span className="text-3xl font-bold">{result.mesas}</span>
              <span className="text-xs text-green-600">${utilidadMesas.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Uso de Recursos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Utilizado</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead className="text-right">% Uso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(result.utilizacionRecursos).map(([key, value]: [string, any]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize">{key}</TableCell>
                    <TableCell>{value.usado.toFixed(1)}</TableCell>
                    <TableCell>{value.disponible}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 relative">
                          {/* Usamos un div con estilo personalizado si es un recurso al 100% de uso */}
                          {value.porcentaje >= 99 ? (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${value.porcentaje}%` }}></div>
                            </div>
                          ) : (
                            <Progress value={value.porcentaje} className="w-full" />
                          )}
                        </div>
                        <span className={value.porcentaje >= 99 ? "text-red-500" : ""}>
                          {value.porcentaje}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Sensibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              El valor dual indica cuánto aumentaría la utilidad total por cada unidad adicional del recurso.
            </p>
            
            {recursosPorValor.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {recursosPorValor.map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{key}</div>
                      <div className="text-xs text-gray-500">Valor por unidad adicional</div>
                    </div>
                    <Badge variant="secondary" className="text-xl">
                      ${String(value)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border border-dashed rounded-md text-center text-gray-500">
                No hay recursos limitantes en esta configuración
              </div>
            )}
            
            {recursosPorValor.length > 0 && (
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mt-4">
                <strong className="text-amber-800">Recomendación:</strong>{" "}
                <span className="text-amber-700">
                  Priorizar el aumento de <span className="capitalize font-medium">{recursosPorValor[0][0]}</span>,
                  ya que cada unidad adicional incrementaría la utilidad en ${String(recursosPorValor[0][1])}.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}