const CONTACT_LIST_KEY = 'contactList';
const DELETE_BTN_CLASS = 'delete-btn';

const nameInputEl = document.querySelector('#name-input');
const surnameInputEl = document.querySelector('#surname-input');
const phoneInputEl = document.querySelector('#phone-input');
const emailInputEl = document.querySelector('#email-input');
const addBtnEl = document.querySelector('#add-contact-btn');


const contactTemplate = document.querySelector('#contact-template').innerHTML;
const contactsContainerEl = document.querySelector('#contacts-container');

let contactList = [];

init();

addBtnEl.addEventListener('click', onAddContactBtnClick);
contactsContainerEl.addEventListener('click', onDeleteBtnClick);

function init() {
    restoreData();
    renderAllContacts();
}

function onAddContactBtnClick() {
    submitForm();
}

function onDeleteBtnClick(e) {
    switch(true) {
        case e.target.classList.contains(DELETE_BTN_CLASS):
            deleteContact(e);
            break;
    }
}

function submitForm() {

    if (isFormValid()) {
        const contact = {
            id: Date.now(),
            name: nameInputEl.value,
            surname: surnameInputEl.value,
            phone: phoneInputEl.value,
            email: emailInputEl.value,
        }

        contactList.push(contact);
        saveData();
        renderContact(contact);
        clearInputs();

    } else alert('Заполните все поля');

}

function isFormValid() { 
    return nameInputEl.value && surnameInputEl.value && phoneInputEl.value && emailInputEl.value;
}

function clearInputs() {
    nameInputEl.value = '';
    surnameInputEl.value = '';
    phoneInputEl.value = '';
    emailInputEl.value = '';
}

function saveData() {
    localStorage.setItem(CONTACT_LIST_KEY, JSON.stringify(contactList));
}

function restoreData() {
    const data = JSON.parse(localStorage.getItem(CONTACT_LIST_KEY));
    if (data) {
        contactList = data;
    }
    
}

function renderContact(contact) {
    const html = contactTemplate
                    .replace('{{id}}', contact.id )
                    .replace('{{name}}', contact.name)
                    .replace('{{surname}}', contact.surname)
                    .replace('{{phone}}', contact.phone)
                    .replace('{{email}}', contact.email);
    
    contactsContainerEl.insertAdjacentHTML('beforeend', html)

}

function renderAllContacts() {
    contactList.forEach(contact => renderContact(contact))
}

function deleteContact(e) {
    const contact = e.target.parentElement.parentElement;
    const contactId = +contact.dataset.contactId;
   
    deleteFromDom(contact);
    deleteFromBLL(contactId);
    saveData();
}

function deleteFromDom(contact) {
    contact.remove();
}

function deleteFromBLL(contactId) {
    contactList = contactList.filter(el => el.id !== contactId)
}