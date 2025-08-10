import './style.css';
import { setupCounter } from './counter';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <input type="text" />
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
