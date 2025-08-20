import { loaderHtml } from '../components';
import { getMessagesPage } from '../store/indexDb';
import { handleError } from '../utils/handleError';
import { parseHTML } from '../utils/parseHtml';
import { initInfiniteScroll } from './infiniteScroll/infiniteScroll';
import { generateMessage, Message } from './message';

const generateMessagesFragment = (mess: Message[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  mess.forEach((message) => {
    const messageElement = generateMessage(message);

    fragment.appendChild(messageElement);
  });

  return fragment;
};

const insertMessages = (mess: Message[]): void => {
  const messageList = document.querySelector('.message-list__inner');
  const fragment = generateMessagesFragment(mess);

  if (!messageList) return;

  messageList.prepend(fragment);
};

const onUpdateMessageList = async (): Promise<void> => {
  const list = document.querySelector('.message-list__inner');

  if (!list) return;

  try {
    const { messages } = await getMessagesPage();

    if (!messages.length) return;

    insertMessages(messages);
  } catch (error) {
    handleError(`Failed to update message list: ${error}`);
  }
};

const buildMessageList = (messages: Message[] = []): HTMLDivElement => {
  const messageList = document.createElement('div');
  const messageListInner = document.createElement('div');
  const fragment = generateMessagesFragment(messages);

  messageListInner.classList.add('message-list__inner');
  messageListInner.appendChild(fragment);

  messageList.classList.add('message-list');
  messageList.appendChild(messageListInner);

  return messageList;
};

export const initMessageList = async (app: HTMLDivElement): Promise<void> => {
  const main = app.querySelector('.main');

  if (!main) return handleError('No main element');

  try {
    const { messages } = await getMessagesPage();

    if (!messages || messages.length === 0) {
      throw new Error('Message list empty');
    }

    const messageList = buildMessageList(messages);

    main.appendChild(messageList);

    // Move scroll to bottom
    messageList.scrollTop = messageList.scrollHeight;

    initInfiniteScroll({
      list: messageList,
      onUpdate: onUpdateMessageList,
      onError: () => handleError('Failed to update message list'),
      loader: parseHTML(loaderHtml),
      sentinelHeight: 1200,
    });
  } catch (error) {
    handleError(`Failed to load message list: ${error}`);
  }
};
