import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SensitivityAnalysisProps {
  shadowPrices: {
    assembly: number;
    qualityControl: number;
    packaging: number;
  };
  sensitivityRanges: {
    c1: { min: number; max: number };
    c2: { min: number; max: number };
  };
  resourceAnalysis: {
    usage: {
      assembly: number;
      qualityControl: number;
      packaging: number;
    };
    percentage: {
      assembly: number;
      qualityControl: number;
      packaging: number;
    };
  };
  parameters: {
    b1: number;
    b2: number;
    b3: number;
  };
}

export default function SensitivityAnalysis({ shadowPrices, sensitivityRanges, resourceAnalysis, parameters }: SensitivityAnalysisProps) {
  // Datos para el gráfico de precios sombra
  const shadowPricesData = [
    { name: 'Ensamblaje', valor: shadowPrices.assembly },
    { name: 'Control de Calidad', valor: shadowPrices.qualityControl },
    { name: 'Empaque', valor: shadowPrices.packaging }
  ];

  // Datos para el gráfico de uso de recursos
  const resourceUsageData = [
    { 
      name: 'Ensamblaje', 
      usado: resourceAnalysis.usage.assembly, 
      disponible: parameters.b1 - resourceAnalysis.usage.assembly,
      porcentaje: resourceAnalysis.percentage.assembly.toFixed(1)
    },
    { 
      name: 'Control Calidad', 
      usado: resourceAnalysis.usage.qualityControl, 
      disponible: parameters.b2 - resourceAnalysis.usage.qualityControl,
      porcentaje: resourceAnalysis.percentage.qualityControl.toFixed(1)
    },
    { 
      name: 'Empaque', 
      usado: resourceAnalysis.usage.packaging, 
      disponible: parameters.b3 - resourceAnalysis.usage.packaging,
      porcentaje: resourceAnalysis.percentage.packaging.toFixed(1)
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Precios Sombra</CardTitle>
            <CardDescription>
              Valor económico de una unidad adicional de cada recurso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shadowPricesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" name="Precio Sombra ($)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <Alert>
                <AlertTitle>Interpretación</AlertTitle>
                <AlertDescription>
                  El precio sombra indica cuánto aumentaría la utilidad si se incrementa una unidad del recurso correspondiente.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rangos de Sensibilidad</CardTitle>
            <CardDescription>
              Rangos donde la solución óptima se mantiene estable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Coeficientes de la función objetivo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-500">Utilidad por tableta (c₁)</p>
                    <p className="font-medium">De ${sensitivityRanges.c1.min.toFixed(2)} a ${sensitivityRanges.c1.max.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-500">Utilidad por laptop (c₂)</p>
                    <p className="font-medium">De ${sensitivityRanges.c2.min.toFixed(2)} a ${sensitivityRanges.c2.max.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertTitle>Interpretación</AlertTitle>
                <AlertDescription>
                  Dentro de estos rangos, la solución óptima (número de tabletas y laptops) no cambia, aunque la utilidad total sí varía.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Recursos</CardTitle>
          <CardDescription>
            Uso actual y disponibilidad de cada recurso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceUsageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                stackOffset="expand"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    return [typeof value === 'number' ? value.toFixed(2) : value, name];
                  }}
                  labelFormatter={(value) => {
                    const resource = resourceUsageData.find(r => r.name === value);
                    return `${value} (${resource?.porcentaje}%)`;
                  }}
                />
                <Legend />
                <Bar dataKey="usado" name="Usado" stackId="a" fill="#8884d8" />
                <Bar dataKey="disponible" name="Disponible" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {resourceUsageData.map((resource, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-500">{resource.name}</p>
                <p className="font-medium">Uso: {resource.usado.toFixed(2)} horas ({resource.porcentaje}%)</p>
                <p className="text-sm">Disponible: {resource.disponible.toFixed(2)} horas</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}