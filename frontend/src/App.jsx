import { Routes, Route } from 'react-router-dom'
import Landing        from './pages/Landing.jsx'
import Charts         from './pages/Graficas.jsx'
import TSP            from './pages/TSP.jsx'
import SAT       from './pages/SAT.jsx'
import ColoracionGrafo  from './pages/ColoracionGrafos.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/Algoritmos-NP"               element={<Landing />} />
      <Route path="/estadisticas"         element={<Charts />} />
      <Route path="/tsp"            element={<TSP />} />
      <Route path="/sat"       element={<SAT />} />
      <Route path="/coloracion-de-grafos" element={<ColoracionGrafo />} />
    </Routes>
  )
}