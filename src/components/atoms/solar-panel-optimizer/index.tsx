/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SolarPanelOptimizer = () => {
  const [constraints, setConstraints] = useState({
    materialLimit: 1000,
    laborHours: 160,
    maxEmissions: 500
  });

  const [results, setResults] = useState({
    standardPanels: 0,
    premiumPanels: 0,
    profit: 0,
    environmentalImpact: 0,
    materialUsed: 0,
    laborUsed: 0
  });

  const panelTypes = {
    standard: {
      materialUsage: 2,
      laborHours: 1,
      emissions: 1.5,
      profit: 300
    },
    premium: {
      materialUsage: 3,
      laborHours: 2,
      emissions: 2,
      profit: 500
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setConstraints(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const optimize = () => {
    let maxProfit = 0;
    let optimalStandard = 0;
    let optimalPremium = 0;
    let optimalMaterialUsed = 0;
    let optimalLaborUsed = 0;

    for (let standard = 0; standard <= Math.floor(constraints.materialLimit / panelTypes.standard.materialUsage); standard++) {
      for (let premium = 0; premium <= Math.floor(constraints.materialLimit / panelTypes.premium.materialUsage); premium++) {
        const materialUsed = standard * panelTypes.standard.materialUsage + premium * panelTypes.premium.materialUsage;
        const laborUsed = standard * panelTypes.standard.laborHours + premium * panelTypes.premium.laborHours;
        const emissions = standard * panelTypes.standard.emissions + premium * panelTypes.premium.emissions;
        
        if (materialUsed <= constraints.materialLimit &&
            laborUsed <= constraints.laborHours &&
            emissions <= constraints.maxEmissions) {
          
          const profit = standard * panelTypes.standard.profit + premium * panelTypes.premium.profit;
          
          if (profit > maxProfit) {
            maxProfit = profit;
            optimalStandard = standard;
            optimalPremium = premium;
            optimalMaterialUsed = materialUsed;
            optimalLaborUsed = laborUsed;
          }
        }
      }
    }

    setResults({
      standardPanels: optimalStandard,
      premiumPanels: optimalPremium,
      profit: maxProfit,
      environmentalImpact: optimalStandard * panelTypes.standard.emissions + optimalPremium * panelTypes.premium.emissions,
      materialUsed: optimalMaterialUsed,
      laborUsed: optimalLaborUsed
    });
  };

  const chartData = [
    {
      name: 'Estándar',
      cantidad: results.standardPanels,
      beneficio: results.standardPanels * panelTypes.standard.profit
    },
    {
      name: 'Premium',
      cantidad: results.premiumPanels,
      beneficio: results.premiumPanels * panelTypes.premium.profit
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Optimizador de Producción de Paneles Solares</CardTitle>
          <CardDescription>
          Optimize la producción considerando restricciones de materiales, trabajo y emisiones de CO2.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sección de Restricciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Restricciones</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialLimit">Material Disponible</Label>
                <Input
                  id="materialLimit"
                  name="materialLimit"
                  type="number"
                  value={constraints.materialLimit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborHours">Horas de Trabajo</Label>
                <Input
                  id="laborHours"
                  name="laborHours"
                  type="number"
                  value={constraints.laborHours}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxEmissions">Límite de Emisiones (ton CO2)</Label>
                <Input
                  id="maxEmissions"
                  name="maxEmissions"
                  type="number"
                  value={constraints.maxEmissions}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button onClick={optimize} className="w-full">
              Calcular Optimización
            </Button>
          </div>

          {/* Sección de Resultados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Resultados numéricos */}
              <Alert>
                <AlertTitle>Resultados de la Optimización</AlertTitle>
                <AlertDescription>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p>Paneles Estándar: {results.standardPanels}</p>
                      <p>Paneles Premium: {results.premiumPanels}</p>
                    </div>
                    <div>
                      <p>Beneficio Total: ${results.profit}</p>
                      <p>Impacto Ambiental: {results.environmentalImpact.toFixed(2)} ton CO2</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Gráfico */}
              <div className="w-full min-h-[200px]">
                <LineChart width={500} height={200} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="cantidad" stroke="#8884d8" name="Cantidad" />
                  <Line yAxisId="right" type="monotone" dataKey="beneficio" stroke="#82ca9d" name="Beneficio ($)" />
                </LineChart>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Los resultados se basan en las restricciones ingresadas y los parámetros predefinidos para cada tipo de panel.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarPanelOptimizer;