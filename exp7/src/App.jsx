import React, { Suspense, lazy, useState } from 'react';

const Home = lazy(() => import('./page/home/Home'));
const About = lazy(() => import('./page/about/About'));
const Contact = lazy(() => import('./page/contact/Contact'));
const Project = lazy(() => import('./page/project/Project'));
const More = lazy(() => import('./page/more/More'));

function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch(page) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'project': return <Project />;
      case 'more': return <More />;
      default: return <Home />;
    }
  };

  return (
    <div>
      <button onClick={() => setPage('home')}>Home</button>
      <button onClick={() => setPage('about')}>About</button>
      <button onClick={() => setPage('contact')}>Contact</button>
      <button onClick={() => setPage('project')}>Project</button>
      <button onClick={() => setPage('more')}>More</button>
      <Suspense fallback={<div>Loading...</div>}>
        {renderPage()}
      </Suspense>
    </div>
  );
}

export default App;