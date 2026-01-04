// --- 1. SLIDER LOGIC (SAMA) ---
const track = document.getElementById('slider-track');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const slideCounter = document.getElementById('slide-counter');
let currentIndex = 0;
const totalSlides = slides.length;

function updateSlidePosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slideCounter.textContent = `Slide ${currentIndex + 1} / ${totalSlides}`;
}
nextBtn.addEventListener('click', () => { currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1; updateSlidePosition(); });
prevBtn.addEventListener('click', () => { currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1; updateSlidePosition(); });
let autoSlide = setInterval(() => { nextBtn.click(); }, 5000);
const stopAutoSlide = () => { clearInterval(autoSlide); autoSlide = setInterval(() => { nextBtn.click(); }, 5000); };
nextBtn.addEventListener('click', stopAutoSlide);
prevBtn.addEventListener('click', stopAutoSlide);

// --- 2. CHATBOT LOGIC (DATA JADWAL MANUAL 1IA14) ---
// Data diambil dari gambar jadwal yang dikirim
const scheduleData = {
    // Senin: Jam 1/2, 3/4, 6/7
    senin: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Peng. Tekno. Komp. & Inf. C</b><br>🏫 Ruang J1110 - Dosen: SINDY NOVA",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Peng. Tekno. Komp. & Inf. A</b><br>🏫 Ruang J1110 - Dosen: WIWIED WIDIYANINGSIH",
        "🕒 12.30 - 14.30 (Jam 6/7)<br>📚 <b>Peng. Tekno. Komp. & Inf. B</b><br>🏫 Ruang J1110 - Dosen: ANGGRAENI RIDWAN"
    ],
    // Selasa: Kosong di gambar
    selasa: [
        "✅ <b>Tidak ada jadwal kuliah</b> di hari Selasa. Bisa nugas atau healing lur!"
    ],
    // Rabu: Jam 1/2, 3/4, 6/7, 8/9
    rabu: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Bahasa Indonesia</b><br>🏫 Ruang J1510 - Dosen: MELANIAWATI",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Fisika & Kimia Dasar 1B</b><br>🏫 Ruang J1510 - Dosen: DJONAEDI SALEH",
        "🕒 12.30 - 14.30 (Jam 6/7)<br>📚 <b>Algoritma & Pemrograman 1B</b><br>🏫 Ruang J1110 - Dosen: WALIYA RAHMAWANTI",
        "🕒 14.30 - 16.30 (Jam 8/9)<br>📚 <b>Algoritma & Pemrograman 1A</b><br>🏫 Ruang J1110 - Dosen: TASMILYANTI"
    ],
    // Kamis: Jam 1/2, 3/4, 5/6, 8/9
    kamis: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Matematika Dasar 1</b><br>🏫 Ruang J153 - Dosen: YUNIARSO ARIF KRESNO",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Pendidikan Pancasila</b><br>🏫 Ruang J153 - Dosen: MUHAMMAD ABDULLAH S",
        "🕒 11.30 - 13.30 (Jam 5/6)<br>📚 <b>Algoritma & Pemrograman 1C</b><br>🏫 Ruang J153 - Dosen: MITA LAILASARI",
        "🕒 14.30 - 16.30 (Jam 8/9)<br>📚 <b>Fisika & Kimia Dasar 1A</b><br>🏫 Ruang J153 - Dosen: EKO APRIANTO NUGROHO"
    ],
    // Jumat: Kosong di gambar
    jumat: [
        "✅ <b>Free Class!</b> Hari Jumat kosong lur. Siap-siap buat weekend."
    ],
    // Sabtu: Jam 3/4, 5/6
    sabtu: [
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Matematika Informatika 1</b><br>🏫 Ruang J127 - Dosen: AMELIA NUGRAENI",
        "🕒 11.30 - 13.30 (Jam 5/6)<br>📚 <b>Bahasa Inggris</b><br>🏫 Ruang J127 - Dosen: CINTANIA DHARMA B"
    ],
    minggu: [
        "😴 <b>Libur lur!</b> Tidur yang cukup."
    ]
};

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll ke bawah
}

function getBotResponse(input) {
    input = input.toLowerCase();
    
    // Logic Hari Ini & Besok
    const today = new Date().getDay(); // 0=Minggu, 1=Senin, dst
    const daysMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    
    let targetDay = '';

    if (input.includes('besok')) {
        let tomorrowIdx = (today + 1) % 7;
        targetDay = daysMap[tomorrowIdx];
    } else if (input.includes('hari ini') || input.includes('sekarang')) {
        targetDay = daysMap[today];
    } else {
        // Cek nama hari manual
        for (let day of daysMap) {
            if (input.includes(day)) {
                targetDay = day;
                break;
            }
        }
    }

    // Return Jawaban
    if (targetDay && scheduleData[targetDay]) {
        let response = `<b>Jadwal ${targetDay.toUpperCase()}:</b><br><br>`;
        response += scheduleData[targetDay].join('<br><br>');
        return response;
    } else {
        return "Waduh, gue ga paham. Coba tanya: <b>'Jadwal Senin'</b>, <b>'Besok ada apa'</b>, atau <b>'Hari ini'</b>.";
    }
}

// Event Klik Tombol Kirim
sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        userInput.value = '';
        
        // Simulasi mikir bentar
        setTimeout(() => {
            const reply = getBotResponse(text);
            addMessage(reply, 'bot');
        }, 500);
    }
});

// Event Tekan Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});


// --- 3. YEAR FOOTER ---
document.getElementById('year').textContent = new Date().getFullYear();
console.log("Dashboard Loaded. Chatbot Active.");