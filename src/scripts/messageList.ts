import { getMessages } from '../store/indexDb';
import { handleError } from '../utils/handleError';
import { generateMessage, Message } from './message';

const buildMessageList = (messages: Message[]): HTMLDivElement => {
  const messageList = document.createElement('div');
  const fragment = document.createDocumentFragment();

  messageList.classList.add('message-list');

  messages.forEach((message) => {
    const messageElement = generateMessage(message);

    fragment.appendChild(messageElement);
  });

  messageList.appendChild(fragment);

  return messageList;
};

export const initMessageList = async (app: HTMLDivElement): Promise<void> => {
  const main = app.querySelector('.main');

  if (!main) return handleError('No main element');

  try {
    const messages = await getMessages();

    if (!messages || messages.length === 0) {
      throw new Error('Message list empty');
    }

    const messageList = buildMessageList(messages);

    main.appendChild(messageList);
  } catch (error) {
    handleError(`Failed to load message list: ${error}`);
  }
};
