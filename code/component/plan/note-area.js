// Enhanced notes functionality
document.addEventListener('DOMContentLoaded', function() {
    const notesTextarea = document.getElementById('notes');
    const charCount = document.getElementById('charCount');
    const notesSave = document.getElementById('notesSave');
    const notesClear = document.getElementById('notesClear');
    const key = 'travelNotes';
    const maxChars = 2000;

    // Load saved content
    const savedNotes = localStorage.getItem(key) || '';
    notesTextarea.value = savedNotes;
    updateCharCount();

    // Auto-save on input with debounce
    let saveTimeout;
    notesTextarea.addEventListener('input', function() {
        updateCharCount();
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveNotes();
        }, 1000);
    });

    // Manual save button
    notesSave.addEventListener('click', function() {
        saveNotes();
        showSaveFeedback();
    });

    // Clear button
    notesClear.addEventListener('click', function() {
        if (confirm('Тэмдэглэлийг бүгдийг устгах уу?')) {
            notesTextarea.value = '';
            localStorage.removeItem(key);
            updateCharCount();
            notesTextarea.focus();
        }
    });

    function updateCharCount() {
        const count = notesTextarea.value.length;
        charCount.textContent = count;
        
        if (count > maxChars * 0.9) {
            charCount.classList.add('warning');
            notesTextarea.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
            notesTextarea.classList.remove('warning');
        }
    }

    function saveNotes() {
        localStorage.setItem(key, notesTextarea.value);
    }

    function showSaveFeedback() {
        const originalText = notesSave.innerHTML;
        notesSave.innerHTML = '<svg><use href="../styles/icons.svg#icon-check"></use></svg> Хадгалагдсан';
        notesSave.style.background = 'var(--accent)';
        
        setTimeout(() => {
            notesSave.innerHTML = originalText;
            notesSave.style.background = '';
        }, 2000);
    }

    // Auto-resize textarea
    function autoResize() {
        notesTextarea.style.height = 'auto';
        notesTextarea.style.height = Math.min(notesTextarea.scrollHeight, 500) + 'px';
    }

    notesTextarea.addEventListener('input', autoResize);
    autoResize(); // Initial resize
});