import IconSend from '../assets/icons/send-button.svg?raw';

const inputHtml = `
  <label class="input" for="chat-input">
    <input placeholder="Message..." type="text" class="input__field" id="chat-input" />
  </label>
  <div class="chat-buttons">
    <div class="chat-buttons__send-btn">${IconSend}</div>
  </div>
`;

export default inputHtml;
