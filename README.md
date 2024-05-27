﻿
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



