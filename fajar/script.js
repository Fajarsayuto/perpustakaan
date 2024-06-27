document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const clearIcon = document.getElementById('clearIcon');

    const micButton = document.getElementById('micButton');
    const micIcon = document.getElementById('micIcon');

    const novelList = document.getElementById('novelList');
    const novels = Array.from(novelList.getElementsByClassName('card'));

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Add a language dropdown or selection element
    const languageSelect = document.getElementById('languageSelect');
    recognition.lang = languageSelect.value;  // Set default language

    languageSelect.addEventListener('change', function() {
        recognition.lang = languageSelect.value;  // Change language based on selection
    });

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]+$/, '');  // Remove trailing punctuation
        searchInput.value = transcript;
        searchIcon.style.display = 'none';
        clearIcon.style.display = 'block';
        filterNovels(transcript.toLowerCase());
    };

    recognition.onspeechend = function() {
        micIcon.classList.remove('active');
        micIcon.style.fill = 'none';
        micIcon.style.stroke = 'currentColor';
        document.getElementById('message').innerText = '';
    };

    recognition.onnomatch = function() {
        micIcon.classList.remove('active');
        micIcon.style.fill = 'none';
        micIcon.style.stroke = 'currentColor';
        document.getElementById('message').innerText = '';
    };

    recognition.onerror = function(event) {
        micIcon.classList.remove('active');
        micIcon.style.fill = 'none';
        micIcon.style.stroke = 'currentColor';
        document.getElementById('message').innerText = 'Error occurred in recognition: ' + event.error;
    };

    micButton.addEventListener('click', function() {
        if (micIcon.classList.contains('active')) {
            micIcon.classList.remove('active');
            micIcon.style.fill = 'none';
            micIcon.style.stroke = 'currentColor';
            recognition.stop();
            document.getElementById('message').innerText = '';
        } else {
            micIcon.classList.add('active');
            micIcon.style.fill = 'red';
            micIcon.style.stroke = 'red';
            recognition.start();
            document.getElementById('message').innerText = '';
        }
    });

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim().toLowerCase();
        filterNovels(query);

        if (query.length > 0) {
            searchIcon.style.display = 'none';
            clearIcon.style.display = 'block';
        } else {
            searchIcon.style.display = 'block';
            clearIcon.style.display = 'none';
        }
    });

    clearIcon.addEventListener('click', function() {
        searchInput.value = '';
        searchIcon.style.display = 'block';
        clearIcon.style.display = 'none';
        searchInput.focus();
        filterNovels('');
    });

    function filterNovels(query) {
        novels.forEach(novel => {
            const title = novel.querySelector('.card-title').textContent.toLowerCase();
            if (title.includes(query)) {
                novel.style.display = 'block';
            } else {
                novel.style.display = 'none';
            }
        });
    }
});
