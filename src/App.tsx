import { useState } from 'react';
import { Customizer } from './pages/Customizer';
import { Portfolio } from './pages/Portfolio';

function App() {
  const [page, setPage] = useState<'portfolio' | 'customizer'>('portfolio');

  if (page === 'customizer') {
    return <Customizer onBack={() => setPage('portfolio')} />;
  }

  return <Portfolio onNavigateToCustomizer={() => setPage('customizer')} />;
}

export default App;
