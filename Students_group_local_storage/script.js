const STUDENTS_LIST_KEY = 'studentsList';
const DELETE_BTN_CLASS = 'delete-btn';

const studentsListEl = document.querySelector('#students-list');
const studentNameInput = document.querySelector('#name-input');
const studentMarksInput = document.querySelector('#marks-input');
const addStudentBtn = document.querySelector('#add-student-btn');
const studentTemplate = document.querySelector('#student-template').innerHTML;
const averageGroupMarkEl = document.querySelector('#average-group-input');

let students = [];

addStudentBtn.addEventListener('click', onAddStudentBtnClick);
studentsListEl.addEventListener('click', onDeleteBtnClick);

init();

function init() {
    restoreData();
    renderStudentsList();
    showAverageMark();
}

function restoreData() {
    const data = JSON.parse(localStorage.getItem(STUDENTS_LIST_KEY));
    if (data) {
        students = data;
    }
}

function renderStudentsList() {
    students.forEach(student => renderStudent(student))
}

function onAddStudentBtnClick() {
    submitForm();
}

function submitForm() {
    if (!isMarksInvalid()) {
        const student = {
            id: Date.now(),
            name: studentNameInput.value,
            marks: studentMarksInput.value,
            averageMark: averageMark(getStudentMarks(studentMarksInput.value))
        }
        addStudent(student);
        clearInputs();
    } else alert('Введите оценки через запятую. Оценки должны быть числами')
} 

function isMarksInvalid() {
    return studentMarksInput.value.split(',').find(item => isNaN(item));
}

function addStudent(student) {
    students.push(student);
    saveData();
    renderStudent(student);
    showAverageMark();
}

function saveData() {
    localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(students));
}

function renderStudent(student) {
    const html = studentTemplate
        .replace('{{id}}', student.id)
        .replace('{{name}}', student.name)
        .replace('{{marks}}', student.marks)
        .replace('{{average-mark}}', student.averageMark)
    
    studentsListEl.insertAdjacentHTML('beforeend', html);
}

function clearInputs() {
    studentNameInput.value = '';
    studentMarksInput.value = '';
}

function averageMark(marks) {
    return marks.reduce((total, mark) => total + mark) / marks.length;
}

function calcAverageGroupMark() {
    let allMarks = students.map(student => getStudentMarks(student.marks)).flat();
    return averageMark(allMarks);
}

function showAverageMark() {
    averageGroupMarkEl.value = calcAverageGroupMark();
}

function getStudentMarks(marks) {
    return marks.split(',').map(item => +item);
}

function onDeleteBtnClick(e) {
    switch(true) {
        case e.target.classList.contains(DELETE_BTN_CLASS):
            deleteStudent(e);
            break;
    }
}

function deleteStudent(e) {
    const student = e.target.parentElement.parentElement;
    const studentId = +student.dataset.studentId;
   
    deleteFromDom(student);
    deleteFromBLL(studentId);
    saveData();
    showAverageMark();
}

function deleteFromDom(student) {
    student.remove();
}

function deleteFromBLL(studentId) {
    students = students.filter(el => el.id !== studentId)
}

