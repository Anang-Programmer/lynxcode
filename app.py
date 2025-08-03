from flask import Flask, render_template, request, jsonify, stream_template
import replicate
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

def get_ai_assistance(task_type, code_snippet, target_language=None):
    """
    Memanggil model AI untuk berbagai tugas terkait coding.
    
    Args:
        task_type (str): Tipe tugas: "fix", "optimize", "explain", "translate".
        code_snippet (str): Potongan kode yang akan diproses.
        target_language (str): Bahasa target untuk translate (opsional).
    
    Returns:
        Iterator dari output model AI.
    """
    prompts = {
        "fix": "Tugas: Analisis kode berikut, temukan errornya, dan berikan versi yang sudah diperbaiki beserta penjelasannya dalam bahasa Indonesia.",
        "optimize": "Tugas: Optimalkan kode berikut agar lebih efisien (dari segi kecepatan, memori, dan best practices). Berikan versi yang sudah dioptimalkan dan jelaskan perubahannya dalam bahasa Indonesia.",
        "explain": "Tugas: Jelaskan kode berikut dalam bahasa Indonesia yang mudah dimengerti, baris per baris, dan berikan ringkasan tujuannya. Gunakan bahasa yang sederhana dan mudah dipahami.",
        "translate": f"Tugas: Konversikan kode berikut menjadi kode {target_language or 'Python'} yang ekuivalen. Berikan kode yang sudah dikonversi dan jelaskan perbedaan utamanya dalam bahasa Indonesia."
    }

    if task_type not in prompts:
        raise ValueError("Tipe tugas tidak valid.")

    # Gabungkan instruksi tugas dengan kode dari pengguna
    final_prompt = f"{prompts[task_type]}\n\n[KODE]\n{code_snippet}\n[/KODE]"
    
    try:
        output = replicate.run(
            "ibm-granite/granite-3.2-8b-instruct",
            input={
                "prompt": final_prompt,
                "system_prompt": "Anda adalah seorang ahli pemrograman senior yang sangat ahli dalam berbagai bahasa dan paradigma pemrograman. Anda memberikan jawaban yang akurat, jelas, dan to the point dalam bahasa Indonesia.",
                "max_tokens": 1024,
                "temperature": 0.2,
            }
        )
        return output
    except Exception as e:
        return [f"Error: {str(e)}"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_code():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Data tidak valid'}), 400
            
        task_type = data.get('task_type')
        code_snippet = data.get('code_snippet')
        target_language = data.get('target_language')
        
        # Validasi input
        if not code_snippet or not code_snippet.strip():
            return jsonify({'error': 'Kode tidak boleh kosong'}), 400
        
        if not task_type:
            return jsonify({'error': 'Tipe tugas harus dipilih'}), 400
        
        if task_type not in ['fix', 'optimize', 'explain', 'translate']:
            return jsonify({'error': 'Tipe tugas tidak valid'}), 400
            
        # Validasi khusus untuk translate
        if task_type == 'translate':
            if not target_language or not target_language.strip():
                return jsonify({'error': 'Bahasa target harus dipilih untuk translate'}), 400
        
        # Batasi panjang kode
        if len(code_snippet) > 10000:
            return jsonify({'error': 'Kode terlalu panjang (maksimal 10.000 karakter)'}), 400
            
        # Proses dengan AI
        result_iterator = get_ai_assistance(task_type, code_snippet, target_language)
        
        # Kumpulkan semua output
        full_result = ""
        for item in result_iterator:
            full_result += str(item)
        
        # Validasi hasil
        if not full_result or full_result.strip() == "":
            return jsonify({'error': 'AI tidak memberikan respons yang valid'}), 500
        
        return jsonify({
            'success': True,
            'result': full_result,
            'task_type': task_type
        })
        
    except ValueError as e:
        return jsonify({'error': f'Error validasi: {str(e)}'}), 400
    except Exception as e:
        print(f"Error in process_code: {str(e)}")  # Log untuk debugging
        return jsonify({'error': f'Terjadi kesalahan server: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)