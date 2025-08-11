import '../style/index.scss';
import appHtml from '../blocks/app.html?raw';
import headerHtml from '../blocks/header.html?raw';
import { initMessageList } from './messageList';
import { handleError } from '../utils/handleError';

const initApp: () => void = () => {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return handleError('No app element');

  app.innerHTML = appHtml;

  const header = app?.querySelector('.header');

  header!.innerHTML = headerHtml;

  initMessageList(app);
};

initApp();
