import '../style/index.scss';
import { appHtml } from '../components';
import { headerHtml } from '../components';
import { initMessageList } from './messageList';
import { handleError } from '../utils/handleError';
import { initDataBase } from '../store/indexDb';
import { inputHtml } from '../components';

const initApp = async (): Promise<void> => {
  await initDataBase();

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return handleError('No app element');

  app.innerHTML = appHtml;

  const header = app?.querySelector('.header');
  const inputBox = app?.querySelector('.chat-input');

  header!.innerHTML = headerHtml;
  inputBox!.innerHTML = inputHtml;

  await initMessageList(app);
};

initApp().catch((e) => {
  handleError(e);
});
