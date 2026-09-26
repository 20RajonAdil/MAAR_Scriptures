import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Bible from './pages/Bible';
import Torah from './pages/Torah';
import Search from './pages/Search';
import Compare from './pages/Compare';
import Topics from './pages/Topics';
import Saved from './pages/Saved';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import About from './pages/About';
import Onboarding from './pages/Onboarding';

export default function App() {
  const onboarded = localStorage.getItem('maar-onboarded');

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/*"
        element={
          !onboarded ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quran" element={<Quran />} />
                <Route path="/bible" element={<Bible />} />
                <Route path="/torah" element={<Torah />} />
                <Route path="/search" element={<Search />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )
        }
      />
    </Routes>
  );
}
