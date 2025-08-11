import messageListHtml from '../blocks/messageList.html?raw';
import { handleError } from '../utils/handleError';
import { generateMessage, Message } from './message';

const messages: Message[] = [
  { id: 0, text: 'Text0' },
  { id: 1, text: 'Text1' },
];

const initMessages = (messageList: HTMLDivElement): void => {
  messages.forEach((message) => {
    const messageElement = generateMessage(message);

    messageList.appendChild(messageElement);
  });
};

export const initMessageList = (app: HTMLDivElement): void => {
  const main = app.querySelector('.main');

  if (!main) return handleError('No main element');

  main.innerHTML = messageListHtml;

  const messageList = main.querySelector<HTMLDivElement>('.message-list');

  if (!messageList) return handleError('No message list element');

  initMessages(messageList);
};
