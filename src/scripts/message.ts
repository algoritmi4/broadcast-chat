import { messageHtml } from '../blocks';
import { parseHTML } from '../utils/parseHtml';

export interface Message {
  text: string;
  id: number;
}

export const generateMessage = ({ text, id }: Message): HTMLElement => {
  const message = parseHTML(messageHtml);

  message.textContent = text;
  message.id = String(id);

  return message;
};
