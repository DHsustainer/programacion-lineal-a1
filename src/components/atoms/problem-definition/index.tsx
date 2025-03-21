import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProblemDefinitionProps = {
  parameters: {
    c1: number;
    c2: number;
    a11: number;
    a12: number;
    a21: number;
    a22: number;
    a31: number;
    a32: number;
    b1: number;
    b2: number;
    b3: number;
  };
  updateParameter: (paramName: string, value: string) => void;
};

export default function ProblemDefinition({ parameters, updateParameter }: ProblemDefinitionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problema de Optimización de Producción</CardTitle>
        <CardDescription>
          Una empresa de productos electrónicos fabrica dos tipos de dispositivos: tabletas y laptops.
          Cada producto requiere tiempo de procesamiento en tres departamentos: ensamblaje, control de calidad y empaque.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Función objetivo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Función objetivo (Maximizar utilidad)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c1">Utilidad por tableta ($)</Label>
                <Input
                  id="c1"
                  type="number"
                  value={parameters.c1}
                  onChange={(e) => updateParameter('c1', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c2">Utilidad por laptop ($)</Label>
                <Input
                  id="c2"
                  type="number"
                  value={parameters.c2}
                  onChange={(e) => updateParameter('c2', e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="font-mono">Z = {parameters.c1}x₁ + {parameters.c2}x₂</p>
            </div>
          </div>
          
          {/* Restricciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Restricciones</h3>
            
            {/* Restricción 1: Ensamblaje */}
            <div className="space-y-2">
              <h4 className="font-medium">Ensamblaje</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="a11">Horas/tableta</Label>
                  <Input
                    id="a11"
                    type="number"
                    value={parameters.a11}
                    onChange={(e) => updateParameter('a11', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="a12">Horas/laptop</Label>
                  <Input
                    id="a12"
                    type="number"
                    value={parameters.a12}
                    onChange={(e) => updateParameter('a12', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="b1">Horas disponibles</Label>
                  <Input
                    id="b1"
                    type="number"
                    value={parameters.b1}
                    onChange={(e) => updateParameter('b1', e.target.value)}
                  />
                </div>
              </div>
              <p className="font-mono">{parameters.a11}x₁ + {parameters.a12}x₂ ≤ {parameters.b1}</p>
            </div>
            
            {/* Restricción 2: Control de Calidad */}
            <div className="space-y-2">
              <h4 className="font-medium">Control de Calidad</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="a21">Horas/tableta</Label>
                  <Input
                    id="a21"
                    type="number"
                    value={parameters.a21}
                    onChange={(e) => updateParameter('a21', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="a22">Horas/laptop</Label>
                  <Input
                    id="a22"
                    type="number"
                    value={parameters.a22}
                    onChange={(e) => updateParameter('a22', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="b2">Horas disponibles</Label>
                  <Input
                    id="b2"
                    type="number"
                    value={parameters.b2}
                    onChange={(e) => updateParameter('b2', e.target.value)}
                  />
                </div>
              </div>
              <p className="font-mono">{parameters.a21}x₁ + {parameters.a22}x₂ ≤ {parameters.b2}</p>
            </div>
            
            {/* Restricción 3: Empaque */}
            <div className="space-y-2">
              <h4 className="font-medium">Empaque</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="a31">Horas/tableta</Label>
                  <Input
                    id="a31"
                    type="number"
                    value={parameters.a31}
                    onChange={(e) => updateParameter('a31', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="a32">Horas/laptop</Label>
                  <Input
                    id="a32"
                    type="number"
                    value={parameters.a32}
                    onChange={(e) => updateParameter('a32', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="b3">Horas disponibles</Label>
                  <Input
                    id="b3"
                    type="number"
                    value={parameters.b3}
                    onChange={(e) => updateParameter('b3', e.target.value)}
                  />
                </div>
              </div>
              <p className="font-mono">{parameters.a31}x₁ + {parameters.a32}x₂ ≤ {parameters.b3}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Modifica los valores de los parámetros para ver cómo cambia la solución óptima.
        </p>
      </CardFooter>
    </Card>
  );
}