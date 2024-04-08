// app.js
// サーバーサイドAPI呼び出し用の関数
async function makeRequest(url, method, data = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const accessToken = localStorage.getItem('accessToken'); // トークンをlocalStorageから取得
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`; // トークンをヘッダーに含める
  }
  let response;
  if (method.toUpperCase() === 'GET') {
    response = await fetch(url, {
      method,
      headers
    });
  } else {
    response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });
  }

  if (!response.ok) {
    throw new Error(response);
  }

  return await response.json();
}

// ユーザー登録
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  try {
    await makeRequest('/register', 'POST', { email, password });
    console.log('Registration successful');
  } catch (error) {
    alert(`Registration failed: ${error.error}`);
  }
});

// ユーザーログイン
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const { accessToken } = await makeRequest('/login', 'POST', { email, password });
    localStorage.setItem('accessToken', accessToken); // トークンをlocalStorageに保存

    console.log('Login successful');
    location.reload();
  } catch (error) {
    alert(`Login failed: ${error.error}`);
  }
});

// 単語の新規登録
const wordForm = document.getElementById('wordForm');
wordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const word = document.getElementById('word').value;
  const translate = document.getElementById('translate').value;
  try {
    await makeRequest('/api/words', 'POST', { word, translate }); // ユーザーIDは仮置き
    console.log('Word registered successfully');
    location.reload();
  } catch (error) {
    alert(`Word registration failed: ${error.error}`);
  }
});

// 単語の一覧表示
async function loadWords() {
  const accessToken = localStorage.getItem('accessToken'); // トークンをlocalStorageから取得
  if (!accessToken) {
    return;
  }

  try {
    const words = await makeRequest('/api/words', 'GET');
    // 単語リストを画面に表示する処理
    const wordList = document.getElementById('wordList');
    const wordSelect = document.getElementById('wordSelect');
    wordList.innerHTML = '';
    if(wordSelect.hasChildNodes()){
      while(wordSelect.childNodes.length > 0) {
        wordSelect.removeChild(wordSelect.firstChild);
      }
    }
    words.forEach((word, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td>${word.word}</td>
          <td>${word.translate}</td>
          <td>${word.sentence}</td>
          <td>
            <button class="btn btn-success btn-sm mr-2 addSentence" data-id="${word.id}">Sentence</button>
            <button class="btn btn-primary btn-sm mr-2 editWord" data-id="${word.id}">Edit</button>
            <button class="btn btn-danger btn-sm deleteWord" data-id="${word.id}">Delete</button>
          </td>
        `;
      wordList.appendChild(row);
      const opt = document.createElement('option');
      opt.value = word.id;
      opt.text = word.word;
      wordSelect.add(opt);
    });
  } catch (error) {
    console.error('Error:', error);
  }


}

// 単語の編集
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('editWord')) {
    const wordId = event.target.dataset.id;
    const newWord = prompt('Enter new word');
    const newTranslate = prompt('Enter new translate');
    try {
      await makeRequest(`/api/words/${wordId}`, 'PUT', { word: newWord, translate: newTranslate });
      console.log('Word updated successfully');
      location.reload();
    } catch (error) {
      alert(`Failed to update word: ${error.error}`);
    }
  }
});

// 単語の削除
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('deleteWord')) {
    const wordId = event.target.dataset.id;
    try {
      await makeRequest(`/api/words/${wordId}`, 'DELETE');
      console.log('Word deleted successfully');
      location.reload();
    } catch (error) {
      alert(`Failed to delete word: ${error.error}`);
    }
  }
});
// 例文の選択
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('addSentence')) {
    const wordId = event.target.dataset.id;
    const wordSelect = document.getElementById('wordSelect');
    for(var i = 0; i < wordSelect.options.length; i++){
      if(wordSelect.options[i].value == wordId){
        wordSelect.options[i].setAttribute("selected", "selected");
      } else {
        wordSelect.options[i].removeAttribute("selected");
      }
    }
    document.getElementById('sentence').focus();
  }
});
// 例文の登録
const sentenceForm = document.getElementById('sentenceForm');
sentenceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const wordId = document.getElementById('wordSelect').value;
  const sentence = document.getElementById('sentence').value;
  const translation = document.getElementById('translation').value;
  try {
    await makeRequest('/api/sentences', 'POST', { wordId, sentence, translation });
    console.log('Sentence registered successfully');
    location.reload();
  } catch (error) {
    alert(`Sentence registration failed: ${error.error}`);
  }
});

// 例文の一覧表示
async function loadSentences() {
  const accessToken = localStorage.getItem('accessToken'); // トークンをlocalStorageから取得
  if (!accessToken) {
    return;
  }
  try {
    const sentences = await makeRequest('/api/sentences', 'GET');
    const sentenceList = document.getElementById('sentenceList');
    sentenceList.innerHTML = '';
    sentences.forEach((sentence, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td>${sentence.sentence}</td>
          <td>${sentence.translation}</td>
          <td>
            <button class="btn btn-primary btn-sm mr-2 editSentence" data-id="${sentence.id}">Edit</button>
            <button class="btn btn-danger btn-sm deleteSentence" data-id="${sentence.id}">Delete</button>
          </td>
        `;
      sentenceList.appendChild(row);
    });
  } catch (error) {
    alert(`Failed to load sentences: ${error.error}`);
  }
}

// 単語の編集
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('editSentence')) {
    const sentenceId = event.target.dataset.id;
    const newSentence = prompt('Enter new Sentence');
    const newTranslate = prompt('Enter new Translate');
    try {
      await makeRequest(`/api/sentences/${sentenceId}`, 'PUT', { sentence: newSentence, translation: newTranslate });
      console.log('Sentence updated successfully');
      location.reload();
    } catch (error) {
      alert(`Failed to update word: ${error.error}`);
    }
  }
});

// 単語の削除
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('deleteSentence')) {
    const sentenceId = event.target.dataset.id;
    try {
      await makeRequest(`/api/sentences/${sentenceId}`, 'DELETE');
      console.log('Sentence deleted successfully');
      location.reload();
    } catch (error) {
      alert(`Failed to delete word: ${error.error}`);
    }
  }
});

// 初期化
async function initialize() {
  await loadWords();
  await loadSentences();
}

initialize();