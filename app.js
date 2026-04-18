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

// Ссылка на стабильный репозиторий с флагами (не заблокирован)
const flagBaseUrl = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/";

async function fetchCountries() {
    try {
        resultMsg.textContent = 'Загрузка стран...';
        // Грузим локальный файл со списком стран
        const response = await fetch('countries.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Формируем новый, чистый массив
        countries = data
            .filter(country => country.capital && country.capital.length > 0 && country.cca2)
            .map(country => {
                const rusName = country.translations && country.translations.rus ? country.translations.rus.common : null;
                const engName = country.name ? country.name.common : "Неизвестная страна";
                // Генерируем ссылку на флаг из двухбуквенного кода страны
                const flagUrl = `${flagBaseUrl}${country.cca2.toLowerCase()}.svg`;

                return {
                    name: rusName || engName,
                    capital: country.capital[0],
                    flag: flagUrl
                };
            });

        if (countries.length === 0) {
            throw new Error("Массив стран пуст после фильтрации.");
        }

        resultMsg.textContent = ''; 

        // Экспортируем данные для справочника (если он открыт)
        if (window.location.pathname.includes('reference.html')) {
            renderReference();
        } else {
            loadRandomCountry();
        }

    } catch (error) {
        console.error("Детали ошибки:", error);
        resultMsg.textContent = 'Ошибка загрузки базы стран!';
        resultMsg.style.color = 'red';
    }
}

function loadRandomCountry() {
    if (countries.length === 0 || !flagImg) return;
    currentCountryIndex = Math.floor(Math.random() * countries.length);
    const country = countries[currentCountryIndex];

    flagImg.src = country.flag;
    countryNameEl.textContent = country.name;
    capitalInput.value = ''; 
    resultMsg.textContent = ''; 
    capitalInput.focus();
}

function checkAnswer() {
    if (countries.length === 0) return;
    const userAnswer = capitalInput.value.trim().toLowerCase().replace(/ё/g, 'е');
    const correctAnswer = countries[currentCountryIndex].capital.toLowerCase().replace(/ё/g, 'е');

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

// Функция отрисовки справочника (вызывается только на странице справочника)
function renderReference() {
    const refContainer = document.getElementById('reference-list');
    if (!refContainer) return;

    // Сортируем страны по алфавиту для красоты
    countries.sort((a, b) => a.name.localeCompare(b.name));

    let html = '';
    countries.forEach(country => {
        html += `
            <div style="display: flex; align-items: center; justify-content: start; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${country.flag}" alt="${country.name}" style="width: 40px; margin-right: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                <span style="font-size: 18px; font-weight: bold; width: 250px; text-align: left;">${country.name}</span>
                <span style="font-size: 16px; color: #555;">${country.capital}</span>
            </div>
        `;
    });
    refContainer.innerHTML = html;
}

// Подключаем слушатели только если элементы существуют (в игре)
if (submitBtn) {
    submitBtn.addEventListener('click', checkAnswer);
    capitalInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkAnswer();
    });
}

// Стартуем
fetchCountries();
