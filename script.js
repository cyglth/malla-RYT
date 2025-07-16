document.addEventListener('DOMContentLoaded', function() {
    // Cargar estado guardado si existe
    const savedState = localStorage.getItem('coursesState');
    if (savedState) {
        const coursesState = JSON.parse(savedState);
        Object.keys(coursesState).forEach(courseId => {
            if (coursesState[courseId]) {
                const courseElement = document.querySelector(`[data-id="${courseId}"]`);
                if (courseElement) {
                    courseElement.classList.add('completed');
                    courseElement.classList.remove('locked', 'available');
                }
            }
        });
    }
    
    // Actualizar disponibilidad de todos los cursos
    updateAllCoursesAvailability();
    
    // Agregar botón de reset
    addResetButton();
});

function toggleCourse(element) {
    if (element.classList.contains('locked')) return;
    
    element.classList.toggle('completed');
    element.classList.toggle('available');
    
    saveCoursesState();
    updateAllCoursesAvailability();
}

function updateAllCoursesAvailability() {
    document.querySelectorAll('.course[data-requires]').forEach(course => {
        if (!course.classList.contains('completed')) {
            const requirements = course.getAttribute('data-requires').split(',');
            const allRequirementsMet = requirements.every(req => {
                const requiredCourse = document.querySelector(`[data-id="${req}"]`);
                return requiredCourse && requiredCourse.classList.contains('completed');
            });
            
            course.classList.toggle('locked', !allRequirementsMet);
            course.classList.toggle('available', allRequirementsMet);
        }
    });
}

function saveCoursesState() {
    const coursesState = {};
    document.querySelectorAll('.course').forEach(course => {
        coursesState[course.getAttribute('data-id')] = course.classList.contains('completed');
    });
    localStorage.setItem('coursesState', JSON.stringify(coursesState));
}

function addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar Malla';
    resetButton.style.cssText = `
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #d63384;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    resetButton.onclick = () => {
        if (confirm('¿Estás seguro de que quieres reiniciar toda tu malla curricular?')) {
            localStorage.removeItem('coursesState');
            document.querySelectorAll('.course').forEach(course => {
                course.classList.remove('completed', 'available');
                if (course.hasAttribute('data-requires')) {
                    course.classList.add('locked');
                }
            });
            document.querySelectorAll('.semester:first-child .course').forEach(course => {
                course.classList.remove('locked');
                course.classList.add('available');
            });
        }
    };
    document.querySelector('.container').appendChild(resetButton);
}
