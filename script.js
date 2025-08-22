document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const views = {
        setup: document.getElementById('setup-view'),
        marks: document.getElementById('marks-view'),
        report: document.getElementById('report-view'),
    };

    // Setup View
    const studentNameInput = document.getElementById('student-name');
    const subjectCountInput = document.getElementById('subject-count');
    const generateFieldsBtn = document.getElementById('generate-fields-btn');
    
    // Marks View
    const marksInputContainer = document.getElementById('marks-input-container');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Report View
    const reportName = document.getElementById('report-name');
    const reportTotal = document.getElementById('report-total');
    const reportAverage = document.getElementById('report-average');
    const reportGrade = document.getElementById('report-grade');
    const marksSummary = document.getElementById('marks-summary');
    const calculateAnotherBtn = document.getElementById('calculate-another-btn');
    
    // --- STATE ---
    let studentName = '';
    let subjectCount = 0;

    // --- FUNCTIONS ---

    // Function to switch between views
    function switchView(viewName) {
        Object.values(views).forEach(view => view.classList.remove('active'));
        views[viewName].classList.add('active');
    }

    // Generate input fields for marks
    generateFieldsBtn.addEventListener('click', () => {
        studentName = studentNameInput.value.trim() || 'Anonymous';
        subjectCount = parseInt(subjectCountInput.value);

        if (isNaN(subjectCount) || subjectCount < 1) {
            alert('Please enter a valid number of subjects.');
            return;
        }

        marksInputContainer.innerHTML = ''; // Clear previous fields
        for (let i = 1; i <= subjectCount; i++) {
            const label = document.createElement('label');
            label.textContent = `Subject ${i}`;
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Mark ${i}`;
            input.className = 'mark-input';
            input.min = 0;
            input.max = 100;
            const group = document.createElement('div');
            group.className = 'input-group';
            group.appendChild(label);
            group.appendChild(input);
            marksInputContainer.appendChild(group);
        }
        switchView('marks');
    });

    // Calculate grades
    calculateBtn.addEventListener('click', () => {
        const markInputs = document.querySelectorAll('.mark-input');
        const marks = [];
        let allFieldsValid = true;

        markInputs.forEach(input => {
            let value = parseInt(input.value);
            if (isNaN(value)) {
                value = 0; // Default to 0 if empty or invalid
            }
            // Clamp the value between 0 and 100, same as Java logic
            value = Math.max(0, Math.min(100, value));
            marks.push(value);
        });

        const totalMarks = marks.reduce((sum, current) => sum + current, 0);
        const averagePercentage = totalMarks / subjectCount;
        const grade = getGradeFor(averagePercentage);

        displayReport(marks, totalMarks, averagePercentage, grade);
        switchView('report');
    });
    
    // Reset the calculator
    calculateAnotherBtn.addEventListener('click', () => {
        studentNameInput.value = '';
        subjectCountInput.value = '';
        switchView('setup');
    });
    
    // Helper function to determine grade
    function getGradeFor(avg) {
        if (avg >= 90) return "A+";
        if (avg >= 80) return "A";
        if (avg >= 70) return "B";
        if (avg >= 60) return "C";
        if (avg >= 50) return "D";
        if (avg >= 40) return "E";
        return "F";
    }

    // Display the final report
    function displayReport(marks, total, average, grade) {
        reportName.textContent = studentName;
        reportTotal.textContent = `${total} / ${subjectCount * 100}`;
        reportAverage.textContent = `${average.toFixed(2)}%`;
        reportGrade.textContent = grade;
        
        // Style the grade display
        reportGrade.className = 'value grade'; // Reset classes
        const gradeClass = `grade-${grade.toLowerCase().replace('+', 'plus')}`;
        reportGrade.classList.add(gradeClass);
        
        marksSummary.textContent = marks.join(' | ');
    }
});
