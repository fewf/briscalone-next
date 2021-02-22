import '../styles/globals.css';
import { GameProvider } from '../contexts/GameContext.js';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <div className="container mx-auto my-6">
        <Component {...pageProps} />
      </div>
    </GameProvider>
  );
}

export default MyApp;
