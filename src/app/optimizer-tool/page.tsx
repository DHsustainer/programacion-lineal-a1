/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProblemDefinition from '@/components/atoms/problem-definition';
import OptimalSolution from '@/components/atoms/optimal-solution';
import { calculateOptimalSolution, calculateResourceAnalysis, calculateSensitivityRanges, calculateShadowPrices, generateGraphData, simulateChanges, updateDualProblem } from '@/utils/optimizationUtils';
import SensitivityAnalysis from '@/components/atoms/sensitivity-analysis';
import DualModel from '@/components/atoms/dual-model';
import Simulation from '@/components/atoms/simulation';

export default function OptimizationApp() {
  // Estados para los parámetros del problema
  const [parameters, setParameters] = useState({
    // Coeficientes de la función objetivo
    c1: 120, // Utilidad por tableta
    c2: 180, // Utilidad por laptop

    // Coeficientes de las restricciones
    // Restricción 1: Ensamblaje
    a11: 3, // Horas de ensamblaje por tableta
    a12: 5, // Horas de ensamblaje por laptop
    b1: 150, // Horas disponibles de ensamblaje

    // Restricción 2: Control de calidad
    a21: 1, // Horas de control de calidad por tableta
    a22: 2, // Horas de control de calidad por laptop
    b2: 60, // Horas disponibles de control de calidad

    // Restricción 3: Empaque
    a31: 2, // Horas de empaque por tableta
    a32: 1, // Horas de empaque por laptop
    b3: 80, // Horas disponibles de empaque
  });

  // Estado para la solución óptima
  const [optimalSolution, setOptimalSolution] = useState({
    x1: 0,
    x2: 0,
    utility: 0
  });

  // Estado para las restricciones activas
  const [activeConstraints, setActiveConstraints] = useState({
    assembly: false,
    qualityControl: false,
    packaging: false
  });

  // Estado para los datos de los gráficos
  const [feasibleRegionData, setFeasibleRegionData] = useState<any>([]);
  const [constraintLinesData, setConstraintLinesData] = useState<any>([]);
  const [optimalPoint, setOptimalPoint] = useState<any>([]);
  
  // Estado para los precios sombra estimados
  const [shadowPrices, setShadowPrices] = useState({
    assembly: 0,
    qualityControl: 0,
    packaging: 0
  });

  // Estado para los rangos de sensibilidad
  const [sensitivityRanges, setSensitivityRanges] = useState({
    c1: { min: 0, max: 0 },
    c2: { min: 0, max: 0 }
  });

  // Estado para el análisis de recursos
  const [resourceAnalysis, setResourceAnalysis] = useState({
    usage: { assembly: 0, qualityControl: 0, packaging: 0 },
    percentage: { assembly: 0, qualityControl: 0, packaging: 0 },
    remaining: { assembly: 0, qualityControl: 0, packaging: 0 }
  });

  // Estado para visualizar el problema dual
  const [dualProblem, setDualProblem] = useState<any>({
    coefficients: [0, 0, 0],
    constraints: [
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  });

  // Estado para los cambios en la simulación
  const [changes, setChanges] = useState({
    deltaC1: 0,
    deltaC2: 0,
    deltaB1: 0,
    deltaB2: 0,
    deltaB3: 0
  });

  // Estado para el resultado de la simulación
  const [simulationResult, setSimulationResult] = useState({
    newUtility: 0,
    difference: 0
  });

  // Efecto para recalcular todo cuando cambian los parámetros
  useEffect(() => {
    const solution = calculateOptimalSolution(parameters);
    setOptimalSolution(solution.optimalSolution);
    setActiveConstraints(solution.activeConstraints);
    setOptimalPoint(solution.optimalPoint);
    
    const graphData = generateGraphData(parameters, solution.optimalSolution);
    setFeasibleRegionData(graphData.feasibleRegionData);
    setConstraintLinesData(graphData.constraintLinesData);
    
    setShadowPrices(calculateShadowPrices(parameters, solution.activeConstraints));
    setSensitivityRanges(calculateSensitivityRanges(parameters));
    setResourceAnalysis(calculateResourceAnalysis(parameters, solution.optimalSolution));
    setDualProblem(updateDualProblem(parameters));
    
    const simResult = simulateChanges(parameters, solution.optimalSolution, changes);
    setSimulationResult(simResult);
  }, [parameters, changes]);

  // Función para actualizar un parámetro específico
  const updateParameter = (param: any, value: string) => {
    setParameters(prev => ({ ...prev, [param]: parseFloat(value) }));
  };

  // Función para actualizar un cambio en la simulación
  const updateChange = (param: any, value: string) => {
    setChanges(prev => ({ ...prev, [param]: parseFloat(value) }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Simulación de Análisis de Sensibilidad en Programación Lineal</h1>
      
      <Tabs defaultValue="problem">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="problem">Definición del Problema</TabsTrigger>
          <TabsTrigger value="solution">Solución Óptima</TabsTrigger>
          <TabsTrigger value="sensitivity">Análisis de Sensibilidad</TabsTrigger>
          <TabsTrigger value="dual">Modelo Dual</TabsTrigger>
          <TabsTrigger value="simulation">Simulación de Cambios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="problem">
          <ProblemDefinition 
            parameters={parameters} 
            updateParameter={updateParameter} 
          />
        </TabsContent>
        
        <TabsContent value="solution">
          <OptimalSolution
            optimalSolution={optimalSolution}
            activeConstraints={activeConstraints}
            feasibleRegionData={feasibleRegionData}
            constraintLinesData={constraintLinesData}
            optimalPoint={optimalPoint}
          />
        </TabsContent>
        
        <TabsContent value="sensitivity">
          <SensitivityAnalysis
            shadowPrices={shadowPrices}
            sensitivityRanges={sensitivityRanges}
            resourceAnalysis={resourceAnalysis}
            parameters={parameters}
          />
        </TabsContent>
        
        <TabsContent value="dual">
          <DualModel
            dualProblem={dualProblem}
            shadowPrices={shadowPrices}
          />
        </TabsContent>
        
        <TabsContent value="simulation">
          <Simulation
            parameters={parameters}
            optimalSolution={optimalSolution}
            changes={changes}
            updateChange={updateChange}
            simulationResult={simulationResult}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}