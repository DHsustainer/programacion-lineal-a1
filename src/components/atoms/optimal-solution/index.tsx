import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface OptimalSolutionProps {
  optimalSolution: {
    x1: number;
    x2: number;
    utility: number;
  };
  activeConstraints: {
    assembly: boolean;
    qualityControl: boolean;
    packaging: boolean;
  };
  feasibleRegionData: Array<{ x: number; y: number }>;
  constraintLinesData: Array<Array<{ x: number; y: number; restriccion?: string }>>;
  optimalPoint: Array<{ x: number; y: number }>;
}

export default function OptimalSolution({ 
  optimalSolution, 
  activeConstraints, 
  feasibleRegionData, 
  constraintLinesData, 
  optimalPoint 
}: OptimalSolutionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Solución Óptima</CardTitle>
          <CardDescription>
            La solución que maximiza la utilidad total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-sm text-gray-500">Tabletas (x₁)</p>
                <p className="text-2xl font-bold">{optimalSolution.x1.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-sm text-gray-500">Laptops (x₂)</p>
                <p className="text-2xl font-bold">{optimalSolution.x2.toFixed(2)}</p>
              </div>
            </div>
            <div className="p-4 bg-green-100 rounded-md text-center">
              <p className="text-sm text-green-800">Utilidad Máxima</p>
              <p className="text-3xl font-bold text-green-800">${optimalSolution.utility.toFixed(2)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Restricciones activas</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-2 rounded-md text-center ${activeConstraints.assembly ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <p className="text-sm">Ensamblaje</p>
                  <p className="font-medium">{activeConstraints.assembly ? 'Activa' : 'Inactiva'}</p>
                </div>
                <div className={`p-2 rounded-md text-center ${activeConstraints.qualityControl ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <p className="text-sm">Control Calidad</p>
                  <p className="font-medium">{activeConstraints.qualityControl ? 'Activa' : 'Inactiva'}</p>
                </div>
                <div className={`p-2 rounded-md text-center ${activeConstraints.packaging ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <p className="text-sm">Empaque</p>
                  <p className="font-medium">{activeConstraints.packaging ? 'Activa' : 'Inactiva'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Región Factible</CardTitle>
          <CardDescription>
            Visualización gráfica del problema y su solución
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Tabletas (x₁)" />
              <YAxis type="number" dataKey="y" name="Laptops (x₂)" />
              <ZAxis range={[5, 5]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              
              {/* Puntos de la región factible */}
              <Scatter name="Región Factible" data={feasibleRegionData} fill="#8884d8" opacity={0.1} />
              
              {/* Líneas de restricción */}
              {constraintLinesData.map((datos, index) => (
                <Scatter 
                  key={index} 
                  name={datos[0]?.restriccion || `Restricción ${index + 1}`} 
                  data={datos.filter(punto => punto.y >= 0)} 
                  line={{ stroke: ['#ff7300', '#82ca9d', '#8884d8'][index % 3] }} 
                  lineType="fitting"
                  shape="circle"
                  fill={['#ff7300', '#82ca9d', '#8884d8'][index % 3]} 
                  opacity={0.7} 
                />
              ))}
              
              {/* Punto óptimo */}
              <Scatter 
                name="Punto Óptimo" 
                data={optimalPoint} 
                fill="#ff0000" 
                shape="star"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}