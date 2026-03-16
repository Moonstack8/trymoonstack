import { Routes, Route } from 'react-router-dom'
import './App.css'
import SubmissionsList from './pages/SubmissionsList'
import SubmissionDetail from './pages/SubmissionDetail'

export interface Submission {
  id: number
  url: string
  company_name: string
  company_type: string
  colors: string[]
  products: string[]
  submitted_at: string
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SubmissionsList />} />
      <Route path="/submissions/:id" element={<SubmissionDetail />} />
    </Routes>
  )
}

export default App
