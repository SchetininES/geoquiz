// Переменные
let countries = [];
let currentCountryIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

const flagImg = document.getElementById('flag-image');
const countryNameEl = document.getElementById('country-name');
const capitalInput = document.getElementById('capital-input');
const submitBtn = document.getElementById('submit-btn');
const resultMsg = document.getElementById('result-message');
const scoreCorrectEl = document.getElementById('score-correct');
const scoreIncorrectEl = document.getElementById('score-incorrect');

// Ссылка на флаги (стабильная)
const flagBaseUrl = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/";

async function fetchCountries() {
    try {
        if (resultMsg) resultMsg.textContent = 'Загрузка данных...';

        // Загружаем нашу НОВУЮ, полностью русскую базу
        const response = await fetch('ru_countries.json');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Преобразуем данные из нового JSON
        // Формат там: { "RU": { "name": "Россия", "capital": "Москва", ... } }
        countries = Object.keys(data).map(code => {
            const country = data[code];
            return {
                name: country.name,
                capital: country.capital,
                // Код страны (code) берем в нижнем регистре для флага
                flag: `${flagBaseUrl}${code.toLowerCase()}.svg`
            };
        }).filter(c => c.capital && c.name); // Оставляем только те, где есть и столица, и название

        if (resultMsg) resultMsg.textContent = ''; 

        // ОПРЕДЕЛЯЕМ, ГДЕ МЫ НАХОДИМСЯ
        const isReferencePage = document.getElementById('reference-list') !== null;

        if (isReferencePage) {
            renderReference();
        } else {
            loadRandomCountry();
        }

    } catch (error) {
        console.error("Ошибка:", error);
        if (resultMsg) {
            resultMsg.textContent = 'Ошибка загрузки базы стран!';
            resultMsg.style.color = 'red';
        }
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

    // Подсказка на русском
    capitalInput.placeholder = "Введите столицу (на русском)...";
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

// Рендер справочника (теперь точно сработает!)
function renderReference() {
    const refContainer = document.getElementById('reference-list');
    if (!refContainer) return;

    // Сортируем по алфавиту
    countries.sort((a, b) => a.name.localeCompare(b.name));

    let html = '';
    countries.forEach(country => {
        html += `
            <div class="ref-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                <div style="display: flex; align-items: center; width: 60%;">
                    <img src="${country.flag}" alt="${country.name}" style="width: 50px; margin-right: 15px; border-radius: 4px; border: 1px solid #ccc;">
                    <span style="font-size: 18px; font-weight: bold; text-align: left;">${country.name}</span>
                </div>
                <div style="width: 40%; text-align: right;">
                    <span style="font-size: 16px; color: #d32f2f; font-weight: bold;">${country.capital}</span>
                </div>
            </div>
        `;
    });
    refContainer.innerHTML = html;
}

if (submitBtn) {
    submitBtn.addEventListener('click', checkAnswer);
    capitalInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkAnswer();
    });
}

fetchCountries();
