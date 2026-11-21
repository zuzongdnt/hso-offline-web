import { createRoot } from 'react-dom/client';
import { SublevelStudioLandingPage } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import './site.css';

export function Scene() {
  return (
    <div className="shader-frame">
      <SublevelStudioLandingPage />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Scene />);
