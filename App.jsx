
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const initialSystems = [
  { name: "Aseguramiento", phase: "Transformación" },
  { name: "Acceso", phase: "Consolidación" },
  { name: "Campañas-Martech", phase: "Potenciación" }
];

const cargaHoraria = {
  "Transformation Coach": {
    "Transformación": 16,
    "Consolidación": 24,
    "Potenciación": 12
  },
  "Owner de Transformación": {
    "Transformación": 8,
    "Consolidación": 4,
    "Potenciación": 2,
    "Mentoría por Coach": 2
  }
};

export default function CapacityApp() {
  const [assignments, setAssignments] = useState([]);
  const [coach, setCoach] = useState("");
  const [system, setSystem] = useState(initialSystems[0].name);
  const [role, setRole] = useState("Transformation Coach");

  const handleAdd = () => {
    const phase = initialSystems.find(s => s.name === system)?.phase;
    const hours = cargaHoraria[role][phase] || 0;
    setAssignments(prev => [...prev, { coach, role, system, phase, hours }]);
    setCoach("");
  };

  const handleRemove = (index) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 grid gap-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Nueva Asignación</h2>
        <Input
          placeholder="Nombre del Coach / Owner"
          value={coach}
          onChange={e => setCoach(e.target.value)}
        />
        <Select value={role} onValueChange={setRole}>
          <SelectItem value="Transformation Coach">Transformation Coach</SelectItem>
          <SelectItem value="Owner de Transformación">Owner de Transformación</SelectItem>
        </Select>
        <Select value={system} onValueChange={setSystem}>
          {initialSystems.map((s, i) => (
            <SelectItem key={i} value={s.name}>{s.name}</SelectItem>
          ))}
        </Select>
        <Button onClick={handleAdd} className="mt-2">Agregar</Button>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Asignaciones Actuales</h2>
        {assignments.length === 0 && <p>No hay asignaciones.</p>}
        {assignments.map((a, i) => (
          <CardContent key={i} className="border p-2 mb-2 rounded">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Nombre:</strong> {a.coach}</div>
              <div><strong>Rol:</strong> {a.role}</div>
              <div><strong>Sistema:</strong> {a.system}</div>
              <div><strong>Fase:</strong> {a.phase}</div>
              <div><strong>Horas:</strong> {a.hours}</div>
            </div>
            <Button onClick={() => handleRemove(i)} className="mt-2" variant="outline">Eliminar</Button>
          </CardContent>
        ))}
      </Card>
    </div>
  );
}
