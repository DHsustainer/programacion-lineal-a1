'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductionFormData } from '@/types'
import { Loader2 } from 'lucide-react'

// Valores iniciales del caso de estudio
const defaultValues: ProductionFormData = {
  madera: 400,
  carpinteria: 480,
  acabado: 160,
  herrajes: 720,
  
  sillaMadera: 2,
  sillaCarpinteria: 3,
  sillaAcabado: 1,
  sillaHerrajes: 6,
  
  mesaMadera: 5,
  mesaCarpinteria: 4,
  mesaAcabado: 2,
  mesaHerrajes: 8,
  
  utilidadSilla: 75,
  utilidadMesa: 120
}

interface ProductionFormProps {
  onOptimize: (data: ProductionFormData) => void
  loading: boolean
}

export default function ProductionForm({ onOptimize, loading }: ProductionFormProps) {
  const [formData, setFormData] = useState<ProductionFormData>(defaultValues)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOptimize(formData)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros de Producción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="resources">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resources">Recursos</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="profits">Utilidad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="madera">Madera disponible (m²)</Label>
                  <Input
                    id="madera"
                    name="madera"
                    type="number"
                    min="0"
                    step="10"
                    value={formData.madera}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carpinteria">Horas de carpintería</Label>
                  <Input
                    id="carpinteria"
                    name="carpinteria"
                    type="number"
                    min="0"
                    step="10"
                    value={formData.carpinteria}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acabado">Horas de acabado</Label>
                  <Input
                    id="acabado"
                    name="acabado"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.acabado}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="herrajes">Herrajes disponibles</Label>
                  <Input
                    id="herrajes"
                    name="herrajes"
                    type="number"
                    min="0"
                    step="10"
                    value={formData.herrajes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sillas */}
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-semibold text-center border-b pb-2">Sillas</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sillaMadera">Madera por unidad (m²)</Label>
                    <Input
                      id="sillaMadera"
                      name="sillaMadera"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.sillaMadera}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sillaCarpinteria">Horas de carpintería</Label>
                    <Input
                      id="sillaCarpinteria"
                      name="sillaCarpinteria"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.sillaCarpinteria}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sillaAcabado">Horas de acabado</Label>
                    <Input
                      id="sillaAcabado"
                      name="sillaAcabado"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.sillaAcabado}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sillaHerrajes">Herrajes necesarios</Label>
                    <Input
                      id="sillaHerrajes"
                      name="sillaHerrajes"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.sillaHerrajes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Mesas */}
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-semibold text-center border-b pb-2">Mesas</h3>
                  <div className="space-y-2">
                    <Label htmlFor="mesaMadera">Madera por unidad (m²)</Label>
                    <Input
                      id="mesaMadera"
                      name="mesaMadera"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.mesaMadera}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mesaCarpinteria">Horas de carpintería</Label>
                    <Input
                      id="mesaCarpinteria"
                      name="mesaCarpinteria"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.mesaCarpinteria}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mesaAcabado">Horas de acabado</Label>
                    <Input
                      id="mesaAcabado"
                      name="mesaAcabado"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.mesaAcabado}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mesaHerrajes">Herrajes necesarios</Label>
                    <Input
                      id="mesaHerrajes"
                      name="mesaHerrajes"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.mesaHerrajes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profits" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="utilidadSilla">Utilidad por silla ($)</Label>
                  <Input
                    id="utilidadSilla"
                    name="utilidadSilla"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.utilidadSilla}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilidadMesa">Utilidad por mesa ($)</Label>
                  <Input
                    id="utilidadMesa"
                    name="utilidadMesa"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.utilidadMesa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizando...
                </>
              ) : (
                'Optimizar Producción'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}