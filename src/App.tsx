import { Route, Routes } from 'react-router-dom'
import Simulator from './pages/Simulator'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Simulator />} />
    </Routes>
  )
}
