// База данных стран (для начала возьмем 5 штук)
const countries = [
    { name: "Россия", capital: "Москва", flag: "https://flagcdn.com/w320/ru.png" },
    { name: "Япония", capital: "Токио", flag: "https://flagcdn.com/w320/jp.png" },
    { name: "Бразилия", capital: "Бразилиа", flag: "https://flagcdn.com/w320/br.png" },
    { name: "Франция", capital: "Париж", flag: "https://flagcdn.com/w320/fr.png" },
    { name: "Египет", capital: "Каир", flag: "https://flagcdn.com/w320/eg.png" }
];

// Переменные состояния
let currentCountryIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Привязка к HTML элементам
const flagImg = document.getElementById('flag-image');
const countryNameEl = document.getElementById('country-name');
const capitalInput = document.getElementById('capital-input');
const submitBtn = document.getElementById('submit-btn');
const resultMsg = document.getElementById('result-message');
const scoreCorrectEl = document.getElementById('score-correct');
const scoreIncorrectEl = document.getElementById('score-incorrect');

// Функция загрузки случайной страны
function loadRandomCountry() {
    currentCountryIndex = Math.floor(Math.random() * countries.length);
    const country = countries[currentCountryIndex];

    flagImg.src = country.flag;
    countryNameEl.textContent = country.name;
    capitalInput.value = ''; // Очищаем поле ввода
    resultMsg.textContent = ''; // Очищаем сообщение
}

// Функция проверки ответа
function checkAnswer() {
    const userAnswer = capitalInput.value.trim().toLowerCase();
    const correctAnswer = countries[currentCountryIndex].capital.toLowerCase();

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        scoreCorrectEl.textContent = correctAnswers;
        resultMsg.textContent = 'Верно! 🎉';
        resultMsg.style.color = 'green';
        setTimeout(loadRandomCountry, 1500); // Загружаем новую страну через 1.5 секунды
    } else {
        incorrectAnswers++;
        scoreIncorrectEl.textContent = incorrectAnswers;
        resultMsg.textContent = `Ошибка! Правильный ответ: ${countries[currentCountryIndex].capital}`;
        resultMsg.style.color = 'red';
    }
}

// Вешаем слушатель на кнопку
submitBtn.addEventListener('click', checkAnswer);

// Запуск игры при загрузке страницы
loadRandomCountry();
