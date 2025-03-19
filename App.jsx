import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [systems, setSystems] = useState([])
  const [roleParameters, setRoleParameters] = useState({})
  const [assignments, setAssignments] = useState([])
  const [coach, setCoach] = useState("")
  const [selectedSystem, setSelectedSystem] = useState("")
  const [role, setRole] = useState("Transformation Coach")

  // Al montar, cargamos los datos desde Supabase
  useEffect(() => {
    async function loadData() {
      // Cargar sistemas desde Supabase (asegurate de haber creado la tabla 'systems')
      const { data: systemsData, error: errorSystems } = await supabase
        .from('systems')
        .select('*')
      if (errorSystems) {
        console.error("Error al cargar sistemas:", errorSystems)
      } else {
        setSystems(systemsData)
        if (systemsData.length > 0) {
          setSelectedSystem(systemsData[0].name)
        }
      }
      
      // Cargar parámetros de roles desde Supabase (asegurate de haber creado la tabla 'role_parameters')
      const { data: roleData, error: errorRoles } = await supabase
        .from('role_parameters')
        .select('*')
      if (errorRoles) {
        console.error("Error al cargar parámetros de roles:", errorRoles)
      } else {
        const mapping = {}
        roleData.forEach(row => {
          if (!mapping[row.role]) mapping[row.role] = {}
          mapping[row.role][row.phase] = row.hours
        })
        setRoleParameters(mapping)
      }
    }
    loadData()
  }, [])

  // Función para agregar una nueva asignación
  const handleAdd = () => {
    const systemObj = systems.find(s => s.name === selectedSystem)
    const phase = systemObj ? systemObj.phase : ""
    const hours = roleParameters[role] && roleParameters[role][phase] ? roleParameters[role][phase] : 0
    setAssignments(prev => [...prev, { coach, role, system: selectedSystem, phase, hours }])
    setCoach("")
  }

  // Función para eliminar asignaciones
  const handleRemove = (index) => {
    setAssignments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Capacity Management MVP</h1>
      
      <h2>Nueva Asignación</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Nombre del Coach/Owner:</label>
        <input 
          type="text"
          value={coach}
          onChange={e => setCoach(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Rol:</label>
        <select 
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
        >
          <option value="Transformation Coach">Transformation Coach</option>
          <option value="Owner de Transformación">Owner de Transformación</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Sistema:</label>
        <select 
          value={selectedSystem}
          onChange={e => setSelectedSystem(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
        >
          {systems.map((s, i) => (
            <option key={i} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleAdd} style={{ marginBottom: '1rem' }}>Agregar</button>

      <h2>Asignaciones Actuales</h2>
      {assignments.length === 0 ? (
        <p>No hay asignaciones.</p>
      ) : (
        assignments.map((a, i) => (
          <div key={i} style={{ border: '1px solid #ccc', margin: '0.5rem 0', padding: '0.5rem' }}>
            <p><strong>Nombre:</strong> {a.coach}</p>
            <p><strong>Rol:</strong> {a.role}</p>
            <p><strong>Sistema:</strong> {a.system}</p>
            <p><strong>Fase:</strong> {a.phase}</p>
            <p><strong>Horas:</strong> {a.hours}</p>
            <button onClick={() => handleRemove(i)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  )
}
