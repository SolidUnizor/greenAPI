document.addEventListener('DOMContentLoaded', () => {
  const idInstanceInput = document.getElementById('idInstance');
  const apiTokenInput = document.getElementById('apiTokenInstance');
  
  const btnGetSettings = document.getElementById('btn-getSettings');
  const btnGetState = document.getElementById('btn-getStateInstance');
  const btnSendMessage = document.getElementById('btn-sendMessage');
  const btnSendFile = document.getElementById('btn-sendFileByUrl');
  
  const sendChatId = document.getElementById('send-chatId');
  const sendMessageText = document.getElementById('send-message');
  const fileChatId = document.getElementById('file-chatId');
  const fileUrl = document.getElementById('file-url');
  
  const responseOutput = document.getElementById('response-output');


  const validateCredentials = () => {
    if (!idInstanceInput.value.trim() || !apiTokenInput.value.trim()) {
      alert('⚠️ Please enter both idInstance and ApiTokenInstance');
      return false;
    }
    return true;
  };

  const buildUrl = (method) => {
    return `https://api.green-api.com/waInstance${idInstanceInput.value.trim()}/${method}/${apiTokenInput.value.trim()}`;
  };

  const formatJSON = (data) => JSON.stringify(data, null, 2);

  const displayResponse = (method, data) => {
    const output = `=== ${method} ===\n${formatJSON(data)}\n\n`;
    responseOutput.value += output;
  };

  const displayError = (method, error) => {
    const output = `❌ ${method} Error:\n${error.message || 'Unknown error'}\n\n`;
    responseOutput.value += output;
    console.error(`${method} error:`, error);
  };

  const setLoading = (btn, isLoading) => {
    if (isLoading) {
      btn.dataset.originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '⏳ Loading...';
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || btn.textContent.replace('⏳ Loading...', '');
    }
  };

  const fetchWithTimeout = async (url, options, timeout = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const formatChatId = (input) => {
    let chatId = input.trim();
    
    if (chatId.endsWith('@c.us') || chatId.endsWith('@g.us')) {
      return chatId;
    }
    
    chatId = chatId.replace(/@.*$/, '');
    
    chatId = chatId.replace(/[^\d+]/g, '');
    
    chatId = chatId.replace(/^\+/, '');
    
    if (input.includes('-') || input.includes('_')) {
      return chatId + '@g.us';
    }
    
    return chatId + '@c.us';
  };

  const autoFormatChatId = (inputElement) => {
    if (inputElement.value.trim()) {
      inputElement.value = formatChatId(inputElement.value);
    }
  };

  sendChatId.addEventListener('blur', () => autoFormatChatId(sendChatId));
  fileChatId.addEventListener('blur', () => autoFormatChatId(fileChatId));


  btnGetSettings.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    
    setLoading(btnGetSettings, true);
    
    try {
      const url = buildUrl('getSettings');
      const response = await fetchWithTimeout(url, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      displayResponse('getSettings', data);
    } catch (error) {
      displayError('getSettings', error);
    } finally {
      setLoading(btnGetSettings, false);
    }
  });

  btnGetState.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    
    setLoading(btnGetState, true);
    
    try {
      const url = buildUrl('getStateInstance');
      const response = await fetchWithTimeout(url, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      displayResponse('getStateInstance', data);
    } catch (error) {
      displayError('getStateInstance', error);
    } finally {
      setLoading(btnGetState, false);
    }
  });

  btnSendMessage.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    
    const chatId = formatChatId(sendChatId.value);
    const message = sendMessageText.value.trim();
    
    if (!chatId || !message) {
      alert('⚠️ Please enter both Chat ID and Message');
      return;
    }
    
    setLoading(btnSendMessage, true);
    
    try {
      const url = buildUrl('sendMessage');
      const payload = { chatId, message };
      
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      displayResponse('sendMessage', data);
    } catch (error) {
      displayError('sendMessage', error);
    } finally {
      setLoading(btnSendMessage, false);
    }
  });

  btnSendFile.addEventListener('click', async () => {
    if (!validateCredentials()) return;
    
    const chatId = formatChatId(fileChatId.value);
    const urlFile = fileUrl.value.trim();
    
    if (!chatId || !urlFile) {
      alert('⚠️ Please enter Chat ID and File URL');
      return;
    }
    
    setLoading(btnSendFile, true);
    
    try {
      const url = buildUrl('sendFileByUrl');
      const payload = {
        chatId,
        urlFile,
        fileName: 'file.' + urlFile.split('.').pop() || 'png',
        caption: ''
      };
      
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      displayResponse('sendFileByUrl', data);
    } catch (error) {
      displayError('sendFileByUrl', error);
    } finally {
      setLoading(btnSendFile, false);
    }
  });
});
