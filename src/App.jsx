import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GrammarIndex from './pages/GrammarIndex'
import GrammarExercise from './pages/GrammarExercise'
import VocabularyIndex from './pages/VocabularyIndex'
import VocabularySet from './pages/VocabularySet'
import ReadingIndex from './pages/ReadingIndex'
import ReadingPassage from './pages/ReadingPassage'
import WritingIndex from './pages/WritingIndex'
import WritingTask from './pages/WritingTask'
import ListeningIndex from './pages/ListeningIndex'
import ListeningExercise from './pages/ListeningExercise'
import Dashboard from './pages/Dashboard'
import CLBTable from './pages/CLBTable'
import ReviewMode from './pages/ReviewMode'

function App() {
  return (
    <BrowserRouter basename="/frenchapp">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grammar" element={<GrammarIndex />} />
          <Route path="grammar/:topicId" element={<GrammarExercise />} />
          <Route path="vocabulary" element={<VocabularyIndex />} />
          <Route path="vocabulary/:setId" element={<VocabularySet />} />
          <Route path="reading" element={<ReadingIndex />} />
          <Route path="reading/:passageId" element={<ReadingPassage />} />
          <Route path="writing" element={<WritingIndex />} />
          <Route path="writing/:taskId" element={<WritingTask />} />
          <Route path="listening" element={<ListeningIndex />} />
          <Route path="listening/:exerciseId" element={<ListeningExercise />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clb-table" element={<CLBTable />} />
          <Route path="review" element={<ReviewMode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
