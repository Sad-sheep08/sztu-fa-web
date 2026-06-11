import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Matches from './components/Matches';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Hero />
        <About />
        <Activities />
        <Teams />
        <Matches />
      </main>
      <Footer />
    </div>
  );
}

export default App;