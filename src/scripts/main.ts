import '../style/index.scss';
import appHtml from '../blocks/app.html?raw';
import headerHtml from '../blocks/header.html?raw';

const app = document.querySelector<HTMLDivElement>('#app');

app!.innerHTML = appHtml;

const header = app?.querySelector('.header');

header!.innerHTML = headerHtml;
