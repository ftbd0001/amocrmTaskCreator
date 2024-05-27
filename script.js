const limit = 25;
let page = 1;
const baseURL = 'https://your-amocrm-domain.amocrm.ru'; // Замените на ваш домен amoCRM
let getContactsListQueryUrl = `${baseURL}/api/v4/contacts`;
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
            task_type_id: 1
        })
    }).done(function (response) {
        console.log('Задача создана для контакта:', contactId, response);
    }).fail(function (error) {
        console.error('Не удалось создать задачу для контакта:', contactId, error);
    });
}

function processContacts(contacts) {
    contacts.forEach(function (contact) {
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
    }).done(function (data) {
        if (data && data._embedded && data._embedded.contacts.length > 0) {
            processContacts(data._embedded.contacts);
            if (data._links && data._links.next) {
                page++;
                getContacts();
            }
        } else {
            console.log('Больше нет контактов для обработки');
        }
    }).fail(function (error) {
        console.error('Ошибка при получении контактов', error);
    });
}

getContacts();
