document.addEventListener("DOMContentLoaded", function () {
  // feather
  feather.replace();

  // search, clear, mic, novelList
  const searchInput = document.getElementById("searchInput");
  const searchIcon = document.getElementById("searchIcon");
  const clearIcon = document.getElementById("clearIcon");
  const micButton = document.getElementById("micButton");
  const micIcon = document.getElementById("micIcon");
  const novelList = document.getElementById("novelList");
  const novels = Array.from(novelList.getElementsByClassName("card"));

  // API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Pilihan Bahasa
  const languageSelect = document.getElementById("languageSelect");
  recognition.lang = languageSelect.value;

  // Proses perubahan bahasa
  languageSelect.addEventListener("change", function () {
    recognition.lang = languageSelect.value;
  });

  // Event handler untuk hasil pengenalan suara
  recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript;
    transcript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]+$/, ""); // Remove trailing punctuation
    searchInput.value = transcript;
    searchIcon.style.display = "none";
    clearIcon.style.display = "block";
    filterNovels(transcript.toLowerCase());
  };

  // Event handler untuk akhir pengenalan suara
  recognition.onspeechend = function () {
    micIcon.classList.remove("active");
    micIcon.style.fill = "none";
    micIcon.style.stroke = "currentColor";
    document.getElementById("message").innerText = "Not Found";
  };

  // Event handler untuk kasus ketika tidak ada hasil pengenalan suara yang sesuai
  recognition.onnomatch = function () {
    micIcon.classList.remove("active");
    micIcon.style.fill = "none";
    micIcon.style.stroke = "currentColor";
    document.getElementById("message").innerText = "";
  };

  recognition.onerror = function (event) {
    micIcon.classList.remove("active");
    micIcon.style.fill = "none";
    micIcon.style.stroke = "currentColor";
    document.getElementById("message").innerText = "";
    showAlert("Error occurred in recognition: " + event.error);
  };

  // Event listener untuk tombol mikrofon
  micButton.addEventListener("click", function () {
    if (micIcon.classList.contains("active")) {
      micIcon.classList.remove("active");
      micIcon.style.fill = "none";
      micIcon.style.stroke = "currentColor";
      recognition.stop();
      document.getElementById("message").innerText = "";
    } else {
      micIcon.classList.add("active");
      micIcon.style.fill = "red";
      micIcon.style.stroke = "red";
      recognition.start();
      document.getElementById("message").innerText = "";
    }
  });

  // Event listener untuk input pencarian
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    filterNovels(query);

    if (query.length > 0) {
      searchIcon.style.display = "none";
      clearIcon.style.display = "block";
    } else {
      searchIcon.style.display = "block";
      clearIcon.style.display = "none";
    }
  });

  // Event listener untuk ikon clear pencarian
  clearIcon.addEventListener("click", function () {
    searchInput.value = "";
    searchIcon.style.display = "block";
    clearIcon.style.display = "none";
    searchInput.focus();
    filterNovels("");
  });

  // Fungsi untuk memfilter daftar novel berdasarkan input pencarian
  function filterNovels(query) {
    novels.forEach((novel) => {
      const title = novel.querySelector(".card-title").textContent.toLowerCase();
      if (title.includes(query)) {
        novel.style.display = "block";
      } else {
        novel.style.display = "none";
      }
    });
  }

  function showAlert(message) {
    const alertMessage = document.getElementById("alertMessage");
    const floatingAlert = document.getElementById("floatingAlert");

    alertMessage.textContent = message;
    floatingAlert.style.display = "flex";

    setTimeout(() => {
      floatingAlert.style.display = "none";
    }, 3000);
  }
});
