// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Landing        from './pages/Landing.jsx'
import Charts         from './pages/Graficas.jsx'
import TSP            from './pages/TSP.jsx'
import TSP_Showcase   from './pages/TSP_Showcase.jsx'
import Knapsack       from './pages/Knapsack.jsx'
import ColoracionGrafo  from './pages/ColoracionGrafos.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                     element={<Landing />} />
      <Route path="/estadisticas"         element={<Charts />} />
      <Route path="/tsp"                  element={<TSP />} />
      <Route path="/tsp_showcase"           element={<TSP_Showcase />} />
      <Route path="/knapsack"                  element={<Knapsack />} />
      <Route path="/coloracion-de-grafos" element={<ColoracionGrafo />} />
    </Routes>
  )
}