import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectDesc() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimización de Producción de Muebles</CardTitle>
        <CardDescription>Aplicación de Programación Lineal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Esta aplicación utiliza programación lineal para determinar la cantidad óptima de sillas y mesas que 
          debe producir la empresa MaderArte para maximizar la utilidad, considerando las restricciones de recursos disponibles.
        </p>
        
        <h3 className="font-medium text-lg">Restricciones del Problema:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Disponibilidad limitada de madera (m²)</li>
          <li>Horas de carpintería disponibles</li>
          <li>Horas de acabado disponibles</li>
          <li>Disponibilidad de herrajes</li>
        </ul>
        
        <h3 className="font-medium text-lg">El Modelo:</h3>
        <p className="pl-5 font-mono text-sm bg-gray-50 p-2 rounded">
          Maximizar Z = UtilidadSilla × Sillas + UtilidadMesa × Mesas
        </p>
        <p className="mt-2">Sujeto a las restricciones de recursos:</p>
        <ul className="list-disc pl-5 space-y-1 font-mono text-sm">
          <li>SillaMadera × Sillas + MesaMadera × Mesas ≤ Madera</li>
          <li>SillaCarpinteria × Sillas + MesaCarpinteria × Mesas ≤ Carpintería</li>
          <li>SillaAcabado × Sillas + MesaAcabado × Mesas ≤ Acabado</li>
          <li>SillaHerrajes × Sillas + MesaHerrajes × Mesas ≤ Herrajes</li>
          <li>Sillas, Mesas ≥ 0</li>
        </ul>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-blue-700 text-sm">
            <strong>Análisis de Sensibilidad:</strong> La aplicación también proporciona valores duales (precios sombra) que indican cuánto 
            aumentaría la utilidad por cada unidad adicional de un recurso limitante.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}