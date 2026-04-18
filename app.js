// Переменные состояния
let countries = [];
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

// Функция загрузки данных из публичного API
async function fetchCountries() {
    try {
        resultMsg.textContent = 'Загрузка стран...';
        // Запрашиваем все страны на русском языке
        const response = await fetch('countries.json');
        const data = await response.json();

        // Фильтруем данные: оставляем только те страны, у которых есть столица
        countries = data
            .filter(country => country.capital && country.capital.length > 0)
            .map(country => ({
                name: country.translations.rus ? country.translations.rus.common : "Неизвестная страна", // Берем название на русском
                capital: country.capital[0], // Столица (в API это массив, берем первую)
                flag: country.flags.png // Ссылка на картинку флага
            }));

        resultMsg.textContent = ''; // Убираем надпись "Загрузка..."
        loadRandomCountry(); // Запускаем игру
    } catch (error) {
        console.error("Ошибка при загрузке стран:", error);
        resultMsg.textContent = 'Ошибка загрузки базы стран!';
        resultMsg.style.color = 'red';
    }
}

// Функция загрузки случайной страны
function loadRandomCountry() {
    if (countries.length === 0) return;

    currentCountryIndex = Math.floor(Math.random() * countries.length);
    const country = countries[currentCountryIndex];

    flagImg.src = country.flag;
    countryNameEl.textContent = country.name;
    capitalInput.value = ''; // Очищаем поле ввода
    resultMsg.textContent = ''; // Очищаем сообщение

    // Фокус на поле ввода (для удобства пользователя)
    capitalInput.focus();
}

// Функция проверки ответа
function checkAnswer() {
    if (countries.length === 0) return;

    // Убираем пробелы, переводим в нижний регистр и заменяем "ё" на "е" для гибкости
    const userAnswer = capitalInput.value.trim().toLowerCase().replace(/ё/g, 'е');
    const correctAnswer = countries[currentCountryIndex].capital.toLowerCase().replace(/ё/g, 'е');

    // Поскольку в API столицы на английском (Moscow, Tokyo), нам нужно разрешить ввод на английском. 
    // Если хочешь столицы на русском - потребуется другой источник данных или сложный маппинг.
    // Для нашего примера оставим сравнение с оригинальным ответом API (на английском).

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        scoreCorrectEl.textContent = correctAnswers;
        resultMsg.textContent = 'Верно! 🎉';
        resultMsg.style.color = 'green';
        setTimeout(loadRandomCountry, 1500); 
    } else {
        incorrectAnswers++;
        scoreIncorrectEl.textContent = incorrectAnswers;
        resultMsg.textContent = `Ошибка! Правильный ответ: ${countries[currentCountryIndex].capital}`;
        resultMsg.style.color = 'red';
    }
}

// Слушатель на кнопку
submitBtn.addEventListener('click', checkAnswer);

// Слушатель на клавишу Enter в поле ввода (удобство!)
capitalInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Запуск приложения: начинаем с загрузки данных
fetchCountries();
