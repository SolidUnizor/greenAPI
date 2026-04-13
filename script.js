/**
 * GREEN-API Test Task - Client-Side Logic
 * Note: Tokens are handled client-side per test requirements.
 * In production, always proxy API calls through a secure backend.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM References
  const idInstanceInput = document.getElementById('idInstance');
  const apiTokenInput = document.getElementById('apiTokenInstance');

  const btnGetSettings = document.getElementById('btn-getSettings');
  const btnGetState = document.getElementById('btn-getStateInstance');
  const btnSendMessage = document.getElementById('btn-sendMessage');
  const btnSendFile = document.getElementById('btn-sendFileByUrl');

  const resGetSettings = document.getElementById('res-getSettings');
  const resGetState = document.getElementById('res-getStateInstance');
  const resSendMessage = document.getElementById('res-sendMessage');
  const resSendFile = document.getElementById('res-sendFileByUrl');

  const sendChatId = document.getElementById('send-chatId');
  const sendMessageText = document.getElementById('send-message');

  const fileChatId = document.getElementById('file-chatId');
  const fileUrl = document.getElementById('file-url');
  const fileName = document.getElementById('file-name');
  const fileCaption = document.getElementById('file-caption');

  // 2. Helper Functions
  const validateCredentials = () => {
    if (!idInstanceInput.value.trim() || !apiTokenInput.value.trim()) {
      alert('⚠️ Please enter both idInstance and apiTokenInstance.');
      return false;
    }
    return true;
  };

  const buildUrl = (method) => {
    return `https://api.green-api.com/waInstance${idInstanceInput.value.trim()}/${method}/${apiTokenInput.value.trim()}`;
  };

  const formatJSON = (data) => JSON.stringify(data, null, 2);

  const displayError = (element, error) => {
    element.value = `❌ Error:\n${error.message || 'Unknown error occurred'}\n\n💡 Check browser console (F12) for details.`;
    console.error('API Error:', error);
  };

  const setLoading = (btn, isLoading) => {
    if (isLoading) {
      btn.dataset.originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '⏳ Loading...';
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Call';
    }
  };

  // 3. Event Handlers

  // getSettings (GET)
  btnGetSettings.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    setLoading(btnGetSettings, true);
    resGetSettings.value = '⏳ Fetching settings...';

    try {
      const response = await fetch(buildUrl('getSettings'), { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      resGetSettings.value = formatJSON(data);
    } catch (err) {
      displayError(resGetSettings, err);
    } finally {
      setLoading(btnGetSettings, false);
    }
  });

  // getStateInstance (GET)
  btnGetState.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    setLoading(btnGetState, true);
    resGetState.value = '⏳ Fetching state...';

    try {
      const response = await fetch(buildUrl('getStateInstance'), { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      resGetState.value = formatJSON(data);
    } catch (err) {
      displayError(resGetState, err);
    } finally {
      setLoading(btnGetState, false);
    }
  });

  // sendMessage (POST)
  btnSendMessage.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    if (!sendChatId.value.trim() || !sendMessageText.value.trim()) {
      alert('⚠️ Please enter both Chat ID and Message text.');
      return;
    }

    setLoading(btnSendMessage, true);
    resSendMessage.value = '⏳ Sending message...';

    const payload = {
      chatId: sendChatId.value.trim(),
      message: sendMessageText.value.trim()
    };

    try {
      const response = await fetch(buildUrl('sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`);
      }
      const data = await response.json();
      resSendMessage.value = formatJSON(data);
    } catch (err) {
      displayError(resSendMessage, err);
    } finally {
      setLoading(btnSendMessage, false);
    }
  });

  // sendFileByUrl (POST)
  btnSendFile.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    if (!fileChatId.value.trim() || !fileUrl.value.trim() || !fileName.value.trim()) {
      alert('⚠️ Please enter Chat ID, File URL, and Filename.');
      return;
    }

    setLoading(btnSendFile, true);
    resSendFile.value = '⏳ Sending file...';

    const payload = {
      chatId: fileChatId.value.trim(),
      urlFile: fileUrl.value.trim(),
      fileName: fileName.value.trim(),
      caption: fileCaption.value.trim() || ''
    };

    try {
      const response = await fetch(buildUrl('sendFileByUrl'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`);
      }
      const data = await response.json();
      resSendFile.value = formatJSON(data);
    } catch (err) {
      displayError(resSendFile, err);
    } finally {
      setLoading(btnSendFile, false);
    }
  });
});