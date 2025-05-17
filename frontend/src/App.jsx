import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Process from './pages/Process';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<Process />} />
            <Route path="/analytics/:processId" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;