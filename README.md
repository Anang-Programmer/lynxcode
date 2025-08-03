# Lynx Code - AI-Powered Code Assistant

## Project Title
**Lynx Code** - Asisten Coding Berbasis AI

## Description
Lynx Code adalah aplikasi web yang dirancang khusus untuk membantu developer dalam menyelesaikan berbagai tugas pemrograman menggunakan kekuatan Artificial Intelligence. Aplikasi ini mengintegrasikan model AI Granite 3.2-8B dari IBM melalui platform Replicate untuk memberikan bantuan coding yang akurat dan responsif.

Aplikasi ini menyediakan empat fitur utama:
- **Fix Code**: Menganalisis dan memperbaiki error/bug dalam kode
- **Optimize**: Meningkatkan performa dan efisiensi kode
- **Explain**: Memberikan penjelasan detail tentang cara kerja kode
- **Translate/Convert**: Mengkonversi kode antar bahasa pemrograman

## Technologies Used

### Backend
- **Flask** - Web framework Python yang ringan dan fleksibel
- **Python 3.13.0** - Bahasa pemrograman utama
- **Replicate API** - Platform untuk mengakses model AI
- **IBM Granite 3.2-8B Instruct** - Model AI untuk pemrosesan bahasa natural
- **python-dotenv** - Manajemen environment variables

### Frontend
- **HTML5** - Struktur markup modern
- **CSS3** - Styling dengan gradient backgrounds dan glassmorphism effects
- **JavaScript (Vanilla)** - Interaktivitas dan AJAX requests
- **Prism.js** - Syntax highlighting untuk kode
- **Font Awesome** - Icon library
- **Google Fonts (JetBrains Mono)** - Typography untuk kode

### External Libraries & CDNs
- **Prism.js** - Code syntax highlighting
- **Font Awesome 6.0** - Icons
- **Google Fonts** - Custom typography

## Features

### 🔧 Fix Code
- Deteksi otomatis error dan bug dalam kode
- Analisis mendalam terhadap syntax errors, logic errors, dan runtime errors
- Memberikan solusi perbaikan dengan penjelasan dalam bahasa Indonesia
- Mendukung berbagai bahasa pemrograman populer

### ⚡ Optimize Code
- Analisis performa kode untuk efisiensi yang lebih baik
- Optimasi dari segi kecepatan eksekusi dan penggunaan memori
- Implementasi best practices dan design patterns
- Saran refactoring untuk maintainability yang lebih baik

### 💡 Explain Code
- Penjelasan line-by-line dalam bahasa Indonesia yang mudah dipahami
- Breakdown konsep programming yang kompleks
- Analisis algoritma dan struktur data
- Konteks dan tujuan dari setiap bagian kode

### 🌐 Code Translation/Conversion
- Konversi kode antar bahasa pemrograman
- Mendukung 10 bahasa pemrograman populer:
  - Python, JavaScript, Java, C++, C#
  - Go, Rust, PHP, Ruby, TypeScript
- Penjelasan perbedaan syntax dan paradigma antar bahasa
- Mempertahankan logika dan fungsionalitas original

### 🎨 User Interface Features
- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **Real-time Character Counter** - Monitoring input length
- **Syntax Highlighting** - Code display yang mudah dibaca
- **Copy to Clipboard** - Satu klik untuk copy hasil
- **Loading Indicators** - Feedback visual saat processing
- **Toast Notifications** - Notifikasi status operasi
- **Glassmorphism UI** - Modern design dengan blur effects

## Setup Instructions

### Prerequisites
Pastikan sistem Anda memiliki:
- Python 3.7 atau lebih tinggi
- pip (Python package installer)
- Akun Replicate dengan API token

### 1. Clone Repository
```bash
git clone https://github.com/Anang-Programmer/lynxcode.git
cd lynx-code
```

### 2. Install Dependencies Melalui File Requirements.txt
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Buat file `.env` di root directory dan tambahkan:
```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

**Cara mendapatkan Replicate API Token:**
1. Daftar di [replicate.com](https://replicate.com)
2. Masuk ke dashboard
3. Buka menu "Account" → "API Tokens"
4. Generate token baru dan copy

### 4. Run Application
```bash
python app.py
```

### 5. Access Application
Buka browser dan navigasi ke:
```
http://localhost:5000
```

### File Structure
```
lynx-code/
├── app.py                 # Main Flask application
├── .env                   # Environment variables (create this)
├── README.md             # Project documentation
├── templates/
│   └── index.html        # Main HTML template
├── static/
    ├── css/
    │   └── style.css     # Styling dan UI components
    └── js/
        └── script.js     # Frontend JavaScript logic
```

## AI Support Explanation

### Model AI yang Digunakan
Lynx Code menggunakan **IBM Granite 3.2-8B Instruct**, sebuah model bahasa besar yang dioptimalkan untuk tugas-tugas pemrograman dan instruksi teknis. Model ini dipilih karena:

- **Specialized for Code**: Dilatih khusus untuk memahami dan menghasilkan kode
- **Multilingual Support**: Mendukung berbagai bahasa pemrograman
- **Instruction Following**: Sangat baik dalam mengikuti instruksi spesifik
- **Balanced Performance**: Ukuran 8B parameter memberikan keseimbangan antara kualitas dan kecepatan

### Cara Kerja AI Integration

#### 1. Prompt Engineering
Setiap fitur menggunakan prompt yang dioptimalkan:
```python
prompts = {
    "fix": "Tugas: Analisis kode berikut, temukan errornya...",
    "optimize": "Tugas: Optimalkan kode berikut agar lebih efisien...",
    "explain": "Tugas: Jelaskan kode berikut dalam bahasa Indonesia...",
    "translate": "Tugas: Konversikan kode berikut menjadi..."
}
```

#### 2. System Prompt
AI dikonfigurasi dengan system prompt untuk konsistensi:
```
"Anda adalah seorang ahli pemrograman senior yang sangat ahli 
dalam berbagai bahasa dan paradigma pemrograman. Anda memberikan 
jawaban yang akurat, jelas, dan to the point dalam bahasa Indonesia."
```

#### 3. Parameter Optimization
- **Temperature: 0.2** - Output yang konsisten dan fokus
- **Max Tokens: 1024** - Respons yang cukup detail namun efisien
- **Streaming: Yes** - Real-time response untuk UX yang lebih baik

#### 4. Error Handling
- Validasi input sebelum dikirim ke AI
- Timeout handling untuk request yang lama
- Fallback responses untuk error scenarios
- Rate limiting untuk mencegah abuse

### Keunggulan AI Support
- **Bahasa Indonesia**: Semua respons dalam bahasa Indonesia yang natural
- **Context Aware**: Memahami konteks dan tujuan kode
- **Multi-Language**: Mendukung 10+ bahasa pemrograman
- **Real-time**: Respons cepat dengan streaming
- **Accurate**: Model yang dilatih khusus untuk coding tasks

### Limitasi dan Considerations
- **API Dependency**: Memerlukan koneksi internet dan Replicate API
- **Token Limits**: Batasan 10.000 karakter per request
- **Cost**: Penggunaan API berbayar (sesuai usage Replicate)
- **Response Time**: Bergantung pada kompleksitas request dan server load

---

**Created by Jaka Perdana - Hacktiv8**  
*Powered by IBM Granite AI through Replicate Platform*
