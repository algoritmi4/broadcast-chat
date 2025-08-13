import '../style/index.scss';
import { appHtml } from '../blocks';
import { headerHtml } from '../blocks';
import { initMessageList } from './messageList';
import { handleError } from '../utils/handleError';
import { initDataBase } from '../store/indexDb';

const initApp = async (): Promise<void> => {
  await initDataBase();

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return handleError('No app element');

  app.innerHTML = appHtml;

  const header = app?.querySelector('.header');

  header!.innerHTML = headerHtml;

  await initMessageList(app);
};

initApp().catch((e) => {
  handleError(e);
});
