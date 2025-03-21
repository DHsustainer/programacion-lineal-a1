/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DualProblemType {
  coefficients: number[];
  restrictions: number[][];
}

interface ShadowPricesType {
  assembly: number;
  qualityControl: number;
  packaging: number;
}

export default function DualModel({ dualProblem, shadowPrices }: { dualProblem: DualProblemType; shadowPrices: ShadowPricesType }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Modelo Dual</CardTitle>
          <CardDescription>
            Formulación del problema dual asociado al problema primal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Función objetivo (Minimizar)</h3>
              <p className="font-mono">
                W = {dualProblem.coefficients[0]}y₁ + {dualProblem.coefficients[1]}y₂ + {dualProblem.coefficients[2]}y₃
              </p>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Sujeto a las restricciones</h3>
              <p className="font-mono mb-2">
                {dualProblem.restrictions[0][0]}y₁ + {dualProblem.restrictions[0][1]}y₂ + {dualProblem.restrictions[0][2]}y₃ ≥ {dualProblem.restrictions[0][3]}
              </p>
              <p className="font-mono mb-2">
                {dualProblem.restrictions[1][0]}y₁ + {dualProblem.restrictions[1][1]}y₂ + {dualProblem.restrictions[1][2]}y₃ ≥ {dualProblem.restrictions[1][3]}
              </p>
              <p className="font-mono">
                y₁, y₂, y₃ ≥ 0
              </p>
            </div>
            
            <Alert>
              <AlertTitle>Interpretación del Problema Dual</AlertTitle>
              <AlertDescription>
                El problema dual busca minimizar el "costo" total de los recursos, donde cada variable dual (y₁, y₂, y₃) representa el valor o precio sombra asignado a cada unidad de recurso.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Relación entre el Modelo Primal y el Dual</CardTitle>
          <CardDescription>
            Cómo se relacionan los modelos primal y dual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo Primal</TableHead>
                  <TableHead>Modelo Dual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Maximizar función objetivo</TableCell>
                  <TableCell>Minimizar función objetivo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Restricciones ≤</TableCell>
                  <TableCell>Restricciones ≥</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Coeficientes de restricciones</TableCell>
                  <TableCell>Coeficientes de función objetivo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Coeficientes de función objetivo</TableCell>
                  <TableCell>Términos independientes de restricciones</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Términos independientes de restricciones</TableCell>
                  <TableCell>Coeficientes de función objetivo</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <Alert>
              <AlertTitle>Precios Sombra</AlertTitle>
              <AlertDescription>
                Los precios sombra indican cuánto aumentaría la función objetivo del problema primal si se incrementara en una unidad el lado derecho de la restricción correspondiente.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-sm text-gray-500">Precio Sombra - Ensamblaje</p>
                <p className="text-xl font-bold">${shadowPrices.assembly.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-sm text-gray-500">Precio Sombra - Control de Calidad</p>
                <p className="text-xl font-bold">${shadowPrices.qualityControl.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-sm text-gray-500">Precio Sombra - Empaque</p>
                <p className="text-xl font-bold">${shadowPrices.packaging.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-green-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Teorema Fundamental de la Dualidad</h3>
              <p>
                Si tanto el problema primal como el dual tienen soluciones factibles, entonces ambos tienen soluciones óptimas y estas soluciones tienen el mismo valor en la función objetivo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}