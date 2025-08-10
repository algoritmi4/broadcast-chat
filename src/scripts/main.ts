import '../style/index.scss';
import { setupCounter } from './counter';
import appHtml from '../blocks/app.html?raw';
import headerHtml from '../blocks/header.html?raw';

const app = document.querySelector<HTMLDivElement>('#app');

app!.innerHTML = appHtml;

const header = app?.querySelector('.header');

header!.innerHTML = headerHtml;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
