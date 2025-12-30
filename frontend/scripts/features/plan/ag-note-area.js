/**
 * Аяллын тэмдэглэл бичих функц
 * LocalStorage-д хадгална, auto-save, тэмдэг тоолох зэрэг
 */
document.addEventListener('DOMContentLoaded', function() {
    const notesTextarea = document.getElementById('notes');
    const charCount = document.getElementById('charCount');
    const notesSave = document.getElementById('notesSave');
    const notesClear = document.getElementById('notesClear');
    const key = 'travelNotes';
    const maxChars = 2000;

    // Элементүүд олдсон эсэхийг шалгах (тухайн хуудас дээр байхгүй бол алдаа гаргахгүй)
    if (!notesTextarea || !charCount || !notesSave || !notesClear) {
        return; // Элементүүд олдохгүй бол зогсоох
    }

    // Хадгалсан тэмдэглэлийг ачаалах
    const savedNotes = localStorage.getItem(key) || '';
    notesTextarea.value = savedNotes;
    updateCharCount();

    // Бичих үед автоматаар хадгалах (1 секундийн дараа)
    let saveTimeout;
    notesTextarea.addEventListener('input', function() {
        updateCharCount();

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveNotes();
        }, 1000);
    });

    // "Хадгалах" товч дарахад
    notesSave.addEventListener('click', function() {
        saveNotes();
        showSaveFeedback();
    });

    // "Цэвэрлэх" товч дарахад
    notesClear.addEventListener('click', function() {
        if (confirm('Тэмдэглэлийг бүгдийг устгах уу?')) {
            notesTextarea.value = '';
            localStorage.removeItem(key);
            updateCharCount();
            notesTextarea.focus();
        }
    });

    /**
     * Тэмдэгтийн тоог шинэчлэх
     * 90%-аас давахад анхааруулга харуулна
     */
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

    /**
     * Тэмдэглэлийг localStorage-д хадгалах
     */
    function saveNotes() {
        localStorage.setItem(key, notesTextarea.value);
    }

    /**
     * Хадгалсны дараах харааны пиидбэк харуулах
     */
    function showSaveFeedback() {
        const originalText = notesSave.innerHTML;
        notesSave.innerHTML = '<svg><use href="./styles/icons.svg#icon-check"></use></svg> Хадгалагдсан';
        notesSave.style.background = 'var(--accent)';

        setTimeout(() => {
            notesSave.innerHTML = originalText;
            notesSave.style.background = '';
        }, 2000);
    }

    /**
     * Textarea-г автоматаар өргөнд нь тааруулах
     * Контент ихсэхэд textarea-н өндөр нэмэгдэнэ
     */
    function autoResize() {
        notesTextarea.style.height = 'auto';
        notesTextarea.style.height = Math.min(notesTextarea.scrollHeight, 500) + 'px';
    }

    notesTextarea.addEventListener('input', autoResize);
    autoResize(); // Эхний ачаалалт үед өндрийг тохируулах
});