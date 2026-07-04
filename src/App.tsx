import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Second from './pages/Second'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/second" element={<Second />} />
    </Routes>
  )
}
