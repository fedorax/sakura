

// クイズの状態を管理する変数
let currentQuestionIndex = 0;
let score = 0;
let quizData = {};

// DOM 要素を取得
const questionContainer = document.getElementById("question-container");
const answerInput = document.getElementById("answer-input");
const hintContainer = document.getElementById("hint-container");
const resultContainer = document.getElementById("result-container");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const hintButton = document.getElementById("hint-btn");

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

// 質問を表示する関数
function showQuestion() {
	const accessToken = localStorage.getItem('accessToken'); // トークンをlocalStorageから取得
	if (!accessToken) {
		return;
	}
	console.log('here');
	(async function() {
		quizData = await makeRequest('./api/sentences/train/en','GET');
		const question = quizData;
		questionContainer.textContent = question.question;
	})();
	answerInput.value = "";
	hintContainer.classList.add("d-none");
}

// 回答を送信した時の処理
function submitAnswer() {
	const question = quizData;
	const userAnswer = answerInput.value.trim().toLowerCase();
	const correctAnswer = question.answer.toLowerCase();

	if (userAnswer === correctAnswer) {
		score++;
		resultContainer.textContent = "正解!";
		resultContainer.classList.remove("d-none");
	} else {
		resultContainer.textContent = `不正解。正解は "${correctAnswer}" です。`;
		resultContainer.classList.remove("d-none");
	}

	answerInput.disabled = true;
	submitButton.classList.add("d-none");
	nextButton.classList.remove("d-none");

	showResult();

}

// 次の質問に進む処理
function nextQuestion() {
	currentQuestionIndex++;
	resultContainer.classList.add("d-none");
	answerInput.disabled = false;
	submitButton.classList.remove("d-none");
	nextButton.classList.add("d-none");

	showQuestion();
}

// 結果を表示する関数
function showResult() {
	resultContainer.textContent = `あなたの得点は ${score} / ${currentQuestionIndex} です。`;
	resultContainer.classList.remove("d-none");
}

// ヒントを表示する関数
function showHint() {
	const question = quizData;
	hintContainer.textContent = question.hint;
	hintContainer.classList.remove("d-none");
}

// クイズを開始する
showQuestion();

// ボタンのイベントリスナー
submitButton.addEventListener("click", submitAnswer);
nextButton.addEventListener("click", nextQuestion);
hintButton.addEventListener("click", showHint);