// Changement de catégorie
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Mettre à jour le contenu affiché
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        updateStats();
    });
});

// Ajouter un exercice
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        const inputId = `newExercise${capitalizeFirst(category)}`;
        const input = document.getElementById(inputId);
        const checklistId = `checklist${capitalizeFirst(category)}`;
        const checklist = document.getElementById(checklistId);
        
        if (input.value.trim()) {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
                updateStats();
            });
            
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(input.value));
            
            checklist.appendChild(li);
            input.value = '';
            input.focus();
            
            updateStats();
            saveToLocalStorage();
        }
    });
});

// Appuyer sur Entrée pour ajouter
document.querySelectorAll('input[id^="newExercise"]').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const btn = this.nextElementSibling;
            btn.click();
        }
    });
});

// Mettre à jour les statistiques
function updateStats() {
    let totalExercises = 0;
    let completedExercises = 0;
    
    document.querySelectorAll('.checklist li').forEach(li => {
        totalExercises++;
        if (li.querySelector('input[type="checkbox"]').checked) {
            completedExercises++;
        }
    });
    
    const percentage = totalExercises === 0 ? 0 : Math.round((completedExercises / totalExercises) * 100);
    
    document.getElementById('progress').textContent = percentage + '%';
    document.getElementById('completed').textContent = completedExercises + '/' + totalExercises;
}

// Réinitialiser la journée
document.getElementById('resetBtn').addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les exercices du jour ?')) {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('li').classList.remove('completed');
        });
        updateStats();
        saveToLocalStorage();
        alert('✅ Tous les exercices ont été réinitialisés ! Bon entraînement ! 💪');
    }
});

// Sauvegarder dans le Local Storage
function saveToLocalStorage() {
    const data = {};
    
    document.querySelectorAll('.checklist').forEach(checklist => {
        const exercises = [];
        checklist.querySelectorAll('li').forEach(li => {
            const checkbox = li.querySelector('input[type="checkbox"]');
            exercises.push({
                name: li.textContent,
                completed: checkbox.checked
            });
        });
        data[checklist.id] = exercises;
    });
    
    localStorage.setItem('coachSportifData', JSON.stringify(data));
}

// Charger depuis le Local Storage
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('coachSportifData'));
    
    if (data) {
        Object.keys(data).forEach(checklistId => {
            const checklist = document.getElementById(checklistId);
            if (checklist) {
                // Garder seulement les éléments par défaut
                const defaultItems = checklist.querySelectorAll('li');
                
                defaultItems.forEach((li, index) => {
                    if (data[checklistId][index]) {
                        const checkbox = li.querySelector('input[type="checkbox"]');
                        checkbox.checked = data[checklistId][index].completed;
                        if (checkbox.checked) {
                            li.classList.add('completed');
                        }
                    }
                });
            }
        });
    }
    
    updateStats();
}

// Sauvegarder automatiquement lors de chaque changement
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        saveToLocalStorage();
    }
});

// Fonction utilitaire
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Charger les données au démarrage
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// Message de bienvenue
console.log('%c💪 Bienvenue sur Coach Sportif! 💪', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cSuivez vos exercices et atteignez vos objectifs!', 'color: #764ba2; font-size: 14px;');
