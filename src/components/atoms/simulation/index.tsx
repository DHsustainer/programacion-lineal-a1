/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Simulation.jsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Simulation({ 
  parameters, 
  optimalSolution, 
  changes, 
  updateChange, 
  simulationResult 
}: any) {
  // Estado para registrar el historial de cambios en la simulación
  const [simulationHistory, setSimulationHistory] = useState([
    {
      id: 0,
      deltaC1: 0,
      deltaC2: 0,
      deltaB1: 0,
      deltaB2: 0,
      deltaB3: 0,
      utility: optimalSolution.utility,
      difference: 0
    }
  ]);

  // Función para guardar el estado actual de la simulación en el historial
  const saveSimulation = () => {
    const newSimulation = {
      id: simulationHistory.length,
      ...changes,
      utility: simulationResult.newUtility,
      difference: simulationResult.difference
    };
    
    setSimulationHistory(prev => [...prev, newSimulation]);
  };

  // Calcular el porcentaje de cambio en la utilidad
  const percentageChange = optimalSolution.utility > 0 
    ? (simulationResult.difference / optimalSolution.utility) * 100 
    : 0;

  // Generar los datos para el gráfico de sensibilidad
  // Simula pequeños cambios en c1 y c2 para visualizar su impacto
  const generateSensitivityData = () => {
    const c1Range = parameters.c1 * 0.5; // 50% del valor actual
    const c2Range = parameters.c2 * 0.5; // 50% del valor actual
    const data = [];
    
    // Generar puntos para variaciones de c1
    for (let deltaC1 = -c1Range; deltaC1 <= c1Range; deltaC1 += c1Range / 10) {
      const newC1 = parameters.c1 + deltaC1;
      const newUtility = newC1 * optimalSolution.x1 + parameters.c2 * optimalSolution.x2;
      
      data.push({
        variation: `c1=${newC1.toFixed(0)}`,
        utility: newUtility,
        type: 'c1'
      });
    }
    
    // Generar puntos para variaciones de c2
    for (let deltaC2 = -c2Range; deltaC2 <= c2Range; deltaC2 += c2Range / 10) {
      const newC2 = parameters.c2 + deltaC2;
      const newUtility = parameters.c1 * optimalSolution.x1 + newC2 * optimalSolution.x2;
      
      data.push({
        variation: `c2=${newC2.toFixed(0)}`,
        utility: newUtility,
        type: 'c2'
      });
    }
    
    return data;
  };

  const sensitivityData = generateSensitivityData();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Simulación de Cambios en los Parámetros</CardTitle>
          <CardDescription>
            Analiza cómo los cambios en los parámetros afectan a la solución óptima
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cambios en la función objetivo</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deltaC1">Δ Utilidad por tableta (c₁): ${changes.deltaC1}</Label>
                  <span className="text-sm text-gray-500">
                    ${parameters.c1} → ${parameters.c1 + changes.deltaC1}
                  </span>
                </div>
                <Slider
                  id="deltaC1"
                  min={-parameters.c1 * 0.5}
                  max={parameters.c1 * 0.5}
                  step={1}
                  value={[changes.deltaC1]}
                  onValueChange={(value) => updateChange('deltaC1', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deltaC2">Δ Utilidad por laptop (c₂): ${changes.deltaC2}</Label>
                  <span className="text-sm text-gray-500">
                    ${parameters.c2} → ${parameters.c2 + changes.deltaC2}
                  </span>
                </div>
                <Slider
                  id="deltaC2"
                  min={-parameters.c2 * 0.5}
                  max={parameters.c2 * 0.5}
                  step={1}
                  value={[changes.deltaC2]}
                  onValueChange={(value) => updateChange('deltaC2', value[0])}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cambios en los recursos disponibles</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deltaB1">Δ Horas de ensamblaje: {changes.deltaB1}</Label>
                  <span className="text-sm text-gray-500">
                    {parameters.b1} → {parameters.b1 + changes.deltaB1}
                  </span>
                </div>
                <Slider
                  id="deltaB1"
                  min={-parameters.b1 * 0.3}
                  max={parameters.b1 * 0.3}
                  step={1}
                  value={[changes.deltaB1]}
                  onValueChange={(value) => updateChange('deltaB1', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deltaB2">Δ Horas de control de calidad: {changes.deltaB2}</Label>
                  <span className="text-sm text-gray-500">
                    {parameters.b2} → {parameters.b2 + changes.deltaB2}
                  </span>
                </div>
                <Slider
                  id="deltaB2"
                  min={-parameters.b2 * 0.3}
                  max={parameters.b2 * 0.3}
                  step={1}
                  value={[changes.deltaB2]}
                  onValueChange={(value) => updateChange('deltaB2', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deltaB3">Δ Horas de empaque: {changes.deltaB3}</Label>
                  <span className="text-sm text-gray-500">
                    {parameters.b3} → {parameters.b3 + changes.deltaB3}
                  </span>
                </div>
                <Slider
                  id="deltaB3"
                  min={-parameters.b3 * 0.3}
                  max={parameters.b3 * 0.3}
                  step={1}
                  value={[changes.deltaB3]}
                  onValueChange={(value) => updateChange('deltaB3', value[0])}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-500">Utilidad original</p>
                <p className="text-xl font-bold">${optimalSolution.utility.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-md ${simulationResult.difference >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="text-sm text-gray-700">Nueva utilidad estimada</p>
                <p className="text-xl font-bold">${simulationResult.newUtility.toFixed(2)}</p>
                <p className={`text-sm ${simulationResult.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {simulationResult.difference >= 0 ? '+' : ''}{simulationResult.difference.toFixed(2)} 
                  ({percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%)
                </p>
              </div>
            </div>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={saveSimulation}
            >
              Guardar simulación
            </button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Sensibilidad</CardTitle>
            <CardDescription>
              Visualización del impacto de cambios en los coeficientes c₁ y c₂
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sensitivityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="variation" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="utility" 
                  stroke="#8884d8" 
                  name="Utilidad" 
                  connectNulls 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Historial de Simulaciones</CardTitle>
            <CardDescription>
              Registro de los diferentes escenarios simulados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {simulationHistory.map((sim) => (
                <div 
                  key={sim.id} 
                  className={`p-3 rounded-md border ${sim.difference >= 0 ? 'border-green-200' : 'border-red-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Simulación #{sim.id}</p>
                    <p className={`text-sm ${sim.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sim.difference >= 0 ? '+' : ''}{sim.difference.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
                    <p>Δc₁: {sim.deltaC1}</p>
                    <p>Δc₂: {sim.deltaC2}</p>
                    <p>Util.: ${sim.utility.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interpretación del Análisis de Sensibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Conclusiones</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Los cambios en los coeficientes de la función objetivo (c₁ y c₂) afectan directamente a la utilidad total, pero no alteran la solución óptima mientras se mantengan dentro de ciertos rangos.
                </li>
                <li>
                  Aumentar la disponibilidad de recursos restrictivos (aquellos con restricciones activas) mejora la utilidad total, mientras que aumentar recursos no restrictivos no genera beneficio.
                </li>
                <li>
                  El valor marginal de cada recurso (precio sombra) indica cuánto vale invertir en una unidad adicional de ese recurso.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}