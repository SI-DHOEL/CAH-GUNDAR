// =========================================
// 1. SLIDER LOGIC (GESER GAMBAR JADWAL)
// =========================================
const track = document.getElementById('slider-track');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const slideCounter = document.getElementById('slide-counter');

let currentIndex = 0;
const totalSlides = slides.length;

// Fungsi Update Posisi Slide
function updateSlidePosition() {
    // Geser track ke kiri sesuai index
    if(track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        if(slideCounter) slideCounter.textContent = `Slide ${currentIndex + 1} / ${totalSlides}`;
    }
}

// Tombol Next
if(nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex === totalSlides - 1) {
            currentIndex = 0; // Loop ke awal
        } else {
            currentIndex++;
        }
        updateSlidePosition();
    });
}

// Tombol Prev
if(prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = totalSlides - 1; // Loop ke akhir
        } else {
            currentIndex--;
        }
        updateSlidePosition();
    });
}

// Auto Slide (Geser otomatis tiap 5 detik)
let autoSlide = setInterval(() => {
    if(nextBtn) nextBtn.click();
}, 5000);

// Stop Auto Slide kalau user klik tombol (biar gak ganggu)
const stopAutoSlide = () => {
    clearInterval(autoSlide);
    // Restart timer lagi setelah interaksi
    autoSlide = setInterval(() => {
        if(nextBtn) nextBtn.click();
    }, 5000); 
};

if(nextBtn) nextBtn.addEventListener('click', stopAutoSlide);
if(prevBtn) prevBtn.addEventListener('click', stopAutoSlide);


// =========================================
// 2. CHATBOT LOGIC (DATA JADWAL KAMPUS)
// =========================================

// Database Jadwal (Berdasarkan Gambar yang dikirim sebelumnya)
const scheduleData = {
    // Senin
    senin: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Peng. Tekno. Komp. & Inf. C</b><br>🏫 Ruang J1110 - Dosen: SINDY NOVA",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Peng. Tekno. Komp. & Inf. A</b><br>🏫 Ruang J1110 - Dosen: WIWIED WIDIYANINGSIH",
        "🕒 12.30 - 14.30 (Jam 6/7)<br>📚 <b>Peng. Tekno. Komp. & Inf. B</b><br>🏫 Ruang J1110 - Dosen: ANGGRAENI RIDWAN"
    ],
    // Selasa
    selasa: [
        "✅ <b>Tidak ada jadwal kuliah</b> di hari Selasa. Bisa nugas atau healing lur!"
    ],
    // Rabu
    rabu: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Bahasa Indonesia</b><br>🏫 Ruang J1510 - Dosen: MELANIAWATI",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Fisika & Kimia Dasar 1B</b><br>🏫 Ruang J1510 - Dosen: DJONAEDI SALEH",
        "🕒 12.30 - 14.30 (Jam 6/7)<br>📚 <b>Algoritma & Pemrograman 1B</b><br>🏫 Ruang J1110 - Dosen: WALIYA RAHMAWANTI",
        "🕒 14.30 - 16.30 (Jam 8/9)<br>📚 <b>Algoritma & Pemrograman 1A</b><br>🏫 Ruang J1110 - Dosen: TASMILYANTI"
    ],
    // Kamis
    kamis: [
        "🕒 07.30 - 09.30 (Jam 1/2)<br>📚 <b>Matematika Dasar 1</b><br>🏫 Ruang J153 - Dosen: YUNIARSO ARIF KRESNO",
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Pendidikan Pancasila</b><br>🏫 Ruang J153 - Dosen: MUHAMMAD ABDULLAH S",
        "🕒 11.30 - 13.30 (Jam 5/6)<br>📚 <b>Algoritma & Pemrograman 1C</b><br>🏫 Ruang J153 - Dosen: MITA LAILASARI",
        "🕒 14.30 - 16.30 (Jam 8/9)<br>📚 <b>Fisika & Kimia Dasar 1A</b><br>🏫 Ruang J153 - Dosen: EKO APRIANTO NUGROHO"
    ],
    // Jumat
    jumat: [
        "✅ <b>Free Class!</b> Hari Jumat kosong lur. Siap-siap buat weekend."
    ],
    // Sabtu
    sabtu: [
        "🕒 09.30 - 11.30 (Jam 3/4)<br>📚 <b>Matematika Informatika 1</b><br>🏫 Ruang J127 - Dosen: AMELIA NUGRAENI",
        "🕒 11.30 - 13.30 (Jam 5/6)<br>📚 <b>Bahasa Inggris</b><br>🏫 Ruang J127 - Dosen: CINTANIA DHARMA B"
    ],
    // Minggu
    minggu: [
        "😴 <b>Libur lur!</b> Tidur yang cukup."
    ]
};

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fungsi Menambah Pesan ke Chatbox
function addMessage(text, sender) {
    if(!chatMessages) return;
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll ke bawah
}

// Logic Otak Chatbot
function getBotResponse(input) {
    input = input.toLowerCase();
    
    // Logic Hari Ini & Besok
    const today = new Date().getDay(); // 0=Minggu, 1=Senin, dst
    const daysMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    
    let targetDay = '';

    if (input.includes('besok')) {
        let tomorrowIdx = (today + 1) % 7;
        targetDay = daysMap[tomorrowIdx];
    } else if (input.includes('hari ini') || input.includes('sekarang') || input === 'jadwal') {
        targetDay = daysMap[today];
    } else {
        // Cek nama hari manual di input user
        for (let day of daysMap) {
            if (input.includes(day)) {
                targetDay = day;
                break;
            }
        }
    }

    // Return Jawaban
    if (targetDay && scheduleData[targetDay]) {
        let response = `<b>📅 Jadwal ${targetDay.toUpperCase()}:</b><br><br>`;
        response += scheduleData[targetDay].join('<br><br>');
        return response;
    } else {
        return "🤖 Waduh, bot belum paham. Coba ketik: <b>'Jadwal Senin'</b>, <b>'Besok'</b>, atau <b>'Hari ini'</b>.";
    }
}

// Event Klik Tombol Kirim
if(sendBtn) {
    sendBtn.addEventListener('click', () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            userInput.value = '';
            
            // Simulasi mikir bentar (500ms)
            setTimeout(() => {
                const reply = getBotResponse(text);
                addMessage(reply, 'bot');
            }, 500);
        }
    });
}

// Event Tekan Enter di Input
if(userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });
}


// =========================================
// 3. SAPAAN REAL-TIME (TYPEWRITER EFFECT)
// =========================================
const hour = new Date().getHours();
const greetingElement = document.querySelector('.subtitle'); 

let greetingText = '';
if (hour >= 4 && hour < 11) {
    greetingText = '🌄 Selamat Pagi, Semangat Kuliah!';
} else if (hour >= 11 && hour < 15) {
    greetingText = '☀️ Selamat Siang, Jangan Lupa Makan!';
} else if (hour >= 15 && hour < 18) {
    greetingText = '🌇 Selamat Sore, Tetap Produktif!';
} else {
    greetingText = '🌙 Selamat Malam, Waktunya Istirahat.';
}

// Efek Typewriter
if(greetingElement) {
    let i = 0;
    greetingElement.innerHTML = ''; 
    greetingElement.style.color = '#D4AF37'; // Ubah warna teks sapaan jadi emas
    greetingElement.style.fontWeight = 'bold';

    function typeWriter() {
        if (i < greetingText.length) {
            greetingElement.innerHTML += greetingText.charAt(i);
            i++;
            setTimeout(typeWriter, 50); // Kecepatan ngetik
        }
    }
    // Delay dikit sebelum mulai ngetik biar loading page kelar
    setTimeout(typeWriter, 500);
}


// =========================================
// 4. UTILITIES & 3D TILT INIT
// =========================================

// Update Tahun di Footer
const yearSpan = document.getElementById('year');
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

// Inisialisasi Vanilla Tilt (Efek 3D Kartu)
// Script ini jalan kalau library vanilla-tilt.js sudah dimuat di HTML
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 10,           // Kemiringan maksimal
        speed: 400,        // Kecepatan animasi
        glare: true,       // Efek kilau cahaya
        "max-glare": 0.2,  // Opacity kilau
        gyroscope: true,   // Support gerak HP
    });
}

console.log("Dashboard Loaded. All Systems (Slider, Chatbot, Greeting, Tilt) Active.");