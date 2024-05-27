
## Установка

1. **Скачайте или клонируйте репозиторий:**

   git clone https://github.com/ftbd1/amocrmTaskCreator.git
   cd amocrmTaskCreator


2. **Установите зависимости:**

   npm install
 

3. **Настройте Access Token для API amoCRM:**

   Откройте файл `script.js` и замените `YOUR_ACCESS_TOKEN` на ваш реальный токен доступа, а `https://your-amocrm-domain.amocrm.ru` на ваш домен amoCRM:

   const baseURL = 'https://your-amocrm-domain.amocrm.ru'; // Замените на ваш домен amoCRM


## Запуск

1. **Запустите локальный веб-сервер:**

   npm start

2. **Откройте браузер и перейдите по адресу:**

   http://localhost:3000


## Описание скрипта

### Переменные

- `limit`: Лимит на количество контактов в одном запросе. В данном скрипте установлено значение 25.
- `page`: Номер текущей страницы для пагинации запросов. Начальное значение - 1.
- `getContactsListQueryUrl`: URL для запроса списка контактов из amoCRM API.

### Функции

#### `createTaskForContact(contactId)`

Эта функция создаёт новую задачу для контакта, у которого нет сделок.

- **Параметры:**
  - `contactId`: ID контакта, для которого создаётся задача.
- **Описание:**
  - Выполняет AJAX запрос методом POST для создания задачи.
  - Данные запроса включают текст задачи, время завершения, идентификатор сущности (контакт) и тип задачи.

#### `processContacts(contacts)`

Эта функция обрабатывает массив контактов, проверяя наличие сделок у каждого контакта, и создает задачу для контактов без сделок.

- **Параметры:**
  - `contacts`: Массив объектов контактов.
- **Описание:**
  - Проходит по каждому контакту в массиве.
  - Проверяет наличие сделок.
  - Если сделок нет, вызывает функцию `createTaskForContact`.

#### `getContacts()`

Эта функция запрашивает список контактов с сервера amoCRM и обрабатывает их.

- **Описание:**
  - Выполняет AJAX запрос методом GET для получения списка контактов.
  - Если данные контактов получены, функция вызывает `processContacts` для обработки контактов.
  - Если есть следующая страница, увеличивает номер страницы и вызывает `getContacts` снова.

## Файлы проекта

### `index.html`

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>amoCRM Task Creator</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <h1>Создание задач в amoCRM</h1>
    <script src="script.js"></script>
</body>
</html>


### `script.js`

const limit = 25;
let page = 1;
const baseURL = 'https://your-amocrm-domain.amocrm.ru'; // Замените на ваш домен amoCRM
let getContactsListQueryUrl = `${baseURL}/api/v4/contacts`;

// Функция для создания задачи для контакта
function createTaskForContact(contactId) {
    $.ajax({
        url: `${baseURL}/api/v4/tasks`,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Замените на ваш токен доступа
        },
        contentType: 'application/json',
        data: JSON.stringify({
            text: 'Контакт без сделок',
            complete_till: Math.floor(Date.now() / 1000) + 3600,
            entity_id: contactId,
            entity_type: 'contacts',
            task_type_id: 1 // стандартная задача
        })
    }).done(function(response) {
        console.log('Задача создана для контакта:', contactId, response);
    }).fail(function(error) {
        console.error('Не удалось создать задачу для контакта:', contactId, error);
    });
}

function processContacts(contacts) {
    contacts.forEach(function(contact) {
        if (!contact._embedded || !contact._embedded.leads || contact._embedded.leads.length === 0) {
            createTaskForContact(contact.id);
        }
    });
}

function getContacts() {
    $.ajax({
        url: getContactsListQueryUrl,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Замените на ваш токен доступа
        },
        data: {
            limit: limit,
            with: 'leads',
            page: page
        }
    }).done(function(data) {
        if (data && data._embedded && data._embedded.contacts.length > 0) {
            processContacts(data._embedded.contacts);
            if (data._links && data._links.next) {
                page++;
                getContacts(); 
            }
        } else {
            console.log('Больше нет контактов для обработки');
        }
    }).fail(function(error) {
        console.error('Ошибка при получении контактов', error);
    });
}

getContacts();


### `server.js`


const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Ошибка загрузки index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.url === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Ошибка загрузки script.js');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Не найдено');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});


### `package.json`


{
  "name": "amocrm-task-creator",
  "version": "1.0.0",
  "description": "Простой сервер на Node.js для создания задач для контактов без сделок в amoCRM",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "http": "0.0.0",
    "fs": "0.0.1-security",
    "path": "0.12.7"
  },
  "author": "",
  "license": "ISC"
}
# amocrmTaskCreator
