import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GrammarIndex from './pages/GrammarIndex'
import GrammarExercise from './pages/GrammarExercise'
import VocabularyIndex from './pages/VocabularyIndex'
import VocabularySet from './pages/VocabularySet'
import SavedExpressions from './pages/SavedExpressions'
import ReadingIndex from './pages/ReadingIndex'
import ReadingPassage from './pages/ReadingPassage'
import WritingIndex from './pages/WritingIndex'
import WritingTask from './pages/WritingTask'
import ListeningIndex from './pages/ListeningIndex'
import ListeningExercise from './pages/ListeningExercise'
import Dashboard from './pages/Dashboard'
import NCLCTable from './pages/NCLCTable'
import ReviewMode from './pages/ReviewMode'
import Settings from './pages/Settings'
import ConjugationCheatsheet from './pages/ConjugationCheatsheet'

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
          <Route path="saved-expressions" element={<SavedExpressions />} />
          <Route path="reading" element={<ReadingIndex />} />
          <Route path="reading/:passageId" element={<ReadingPassage />} />
          <Route path="writing" element={<WritingIndex />} />
          <Route path="writing/:taskId" element={<WritingTask />} />
          <Route path="listening" element={<ListeningIndex />} />
          <Route path="listening/:exerciseId" element={<ListeningExercise />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="nclc-table" element={<NCLCTable />} />
          <Route path="review" element={<ReviewMode />} />
          <Route path="conjugation" element={<ConjugationCheatsheet />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
