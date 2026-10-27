const questionBank = [
  { topic: "numbers", emoji: "🔢", question: "What number comes after 3?", answers: ["2", "4", "5", "1"], correct: "4" },
  { topic: "numbers", emoji: "🍎", question: "You have 2 apples and get 1 more. How many apples?", answers: ["1", "2", "3", "4"], correct: "3" },
  { topic: "numbers", emoji: "⭐", question: "How many stars are here? ⭐ ⭐ ⭐ ⭐", answers: ["2", "3", "4", "5"], correct: "4" },
  { topic: "animals", emoji: "🐶", question: "Which animal says “woof”?", answers: ["Cat", "Dog", "Cow", "Duck"], correct: "Dog" },
  { topic: "animals", emoji: "🐄", question: "Which animal gives us milk?", answers: ["Lion", "Tiger", "Cow", "Fox"], correct: "Cow" },
  { topic: "animals", emoji: "🐟", question: "Where does a fish live?", answers: ["In water", "In a tree", "In a nest", "In a shoe"], correct: "In water" },
  { topic: "colors", emoji: "🍌", question: "What color is a ripe banana usually?", answers: ["Blue", "Purple", "Yellow", "Black"], correct: "Yellow" },
  { topic: "colors", emoji: "🍓", question: "What color is a strawberry usually?", answers: ["Green", "Red", "Blue", "White"], correct: "Red" },
  { topic: "colors", emoji: "🌿", question: "What color are most healthy leaves?", answers: ["Pink", "Orange", "Green", "Purple"], correct: "Green" },
  { topic: "letters", emoji: "🍎", question: "Apple starts with which letter?", answers: ["B", "A", "C", "D"], correct: "A" },
  { topic: "letters", emoji: "🐱", question: "Which letter does “Cat” start with?", answers: ["K", "S", "C", "T"], correct: "C" },
  { topic: "letters", emoji: "🐻", question: "Which letter comes after A?", answers: ["C", "D", "B", "E"], correct: "B" }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const topicSelect = document.getElementById("topic");
const progressText = document.getElementById("progress");
const scoreText = document.getElementById("score");
const progressFill = document.getElementById("progress-fill");
const questionEmoji = document.getElementById("question-emoji");
const questionText = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

let questions = [];
let questionIndex = 0;
let score = 0;
let answered = false;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  const topic = topicSelect.value;
  const pool = topic === "all" ? questionBank : questionBank.filter(q => q.topic === topic);
  questions = shuffle(pool).slice(0, Math.min(5, pool.length));
  questionIndex = 0;
  score = 0;
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = questions[questionIndex];
  progressText.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  scoreText.textContent = `⭐ ${score}`;
  progressFill.style.width = `${(questionIndex / questions.length) * 100}%`;
  questionEmoji.textContent = q.emoji;
  questionText.textContent = q.question;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.classList.add("hidden");
  answersEl.replaceChildren();

  shuffle(q.answers).forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(button, answer, q.correct));
    answersEl.appendChild(button);
  });
}

function chooseAnswer(button, answer, correct) {
  if (answered) return;
  answered = true;
  const buttons = [...answersEl.querySelectorAll("button")];
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add("correct");
  });

  if (answer === correct) {
    score++;
    feedbackEl.textContent = "Great job! You earned a star! ⭐";
    feedbackEl.classList.add("good");
  } else {
    button.classList.add("wrong");
    feedbackEl.textContent = `Good try! The answer is ${correct}.`;
    feedbackEl.classList.add("try");
  }
  scoreText.textContent = `⭐ ${score}`;
  progressFill.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  nextBtn.textContent = questionIndex === questions.length - 1 ? "See My Score 🏆" : "Next Question ➜";
  nextBtn.classList.remove("hidden");
}

function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  const percent = Math.round((score / questions.length) * 100);
  document.getElementById("final-score").textContent = `${score} / ${questions.length} stars ⭐`;
  const emoji = document.getElementById("result-emoji");
  const message = document.getElementById("result-message");
  if (percent === 100) {
    emoji.textContent = "🏆";
    message.textContent = "Amazing! You got every question right!";
  } else if (percent >= 60) {
    emoji.textContent = "🌟";
    message.textContent = "Wonderful work! Keep learning and playing.";
  } else {
    emoji.textContent = "🌈";
    message.textContent = "Good effort! Try again and earn more stars.";
  }
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("play-again-btn").addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
nextBtn.addEventListener("click", () => {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    showQuestion();
  } else {
    showResults();
  }
});
