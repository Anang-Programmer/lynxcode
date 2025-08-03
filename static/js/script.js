// DOM Elements
const codeInput = document.getElementById('codeInput');
const actionButtons = document.querySelectorAll('.action-btn');
const languageSelection = document.getElementById('languageSelection');
const targetLanguage = document.getElementById('targetLanguage');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const loadingSection = document.getElementById('loadingSection');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyResult');
const charCount = document.querySelector('.char-count');
const toast = document.getElementById('toast');

// State
let currentAction = null;
let isProcessing = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCharCount();
});

// Event Listeners
function setupEventListeners() {
    // Code input events
    codeInput.addEventListener('input', updateCharCount);
    codeInput.addEventListener('keydown', handleCodeInputKeydown);
    
    // Action button events
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => handleActionClick(btn));
    });
    
    // Clear button
    clearBtn.addEventListener('click', clearCode);
    
    // Copy button
    copyBtn.addEventListener('click', copyResult);
    
    // Enter key to process
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            if (currentAction && !isProcessing) {
                processCode();
            }
        }
    });
    
    // Language selection change event
    targetLanguage.addEventListener('change', () => {
        if (currentAction === 'translate' && codeInput.value.trim()) {
            processCode();
        }
    });
}

// Update character count
function updateCharCount() {
    const count = codeInput.value.length;
    charCount.textContent = `${count} karakter`;
    
    if (count > 5000) {
        charCount.style.color = '#dc3545';
    } else if (count > 3000) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#6c757d';
    }
}

// Handle code input keydown
function handleCodeInputKeydown(e) {
    // Tab key for indentation
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeInput.selectionStart;
        const end = codeInput.selectionEnd;
        
        codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end);
        codeInput.selectionStart = codeInput.selectionEnd = start + 4;
    }
}

// Handle action button click
function handleActionClick(btn) {
    if (isProcessing) return;
    
    const action = btn.dataset.action;
    
    // Remove active class from all buttons
    actionButtons.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    currentAction = action;
    
    // Show/hide language selection for translate
    if (action === 'translate') {
        languageSelection.style.display = 'block';
        // Don't auto-process for translate - wait for language selection
        if (codeInput.value.trim()) {
            showToast('Pilih bahasa target terlebih dahulu, kemudian klik tombol translate lagi atau tekan Ctrl+Enter', 'info');
        }
    } else {
        languageSelection.style.display = 'none';
        // Auto-process if code is present for non-translate actions
        if (codeInput.value.trim()) {
            processCode();
        }
    }
}

// Clear code
function clearCode() {
    codeInput.value = '';
    updateCharCount();
    hideResult();
    
    // Remove active states
    actionButtons.forEach(btn => btn.classList.remove('active'));
    currentAction = null;
    languageSelection.style.display = 'none';
    
    codeInput.focus();
}

// Process code with AI
async function processCode() {
    const code = codeInput.value.trim();
    
    if (!code) {
        showToast('Silakan masukkan kode terlebih dahulu!', 'error');
        return;
    }
    
    if (!currentAction) {
        showToast('Silakan pilih aksi terlebih dahulu!', 'error');
        return;
    }
    
    // Special validation for translate action
    if (currentAction === 'translate' && !targetLanguage.value) {
        showToast('Silakan pilih bahasa target untuk translate!', 'error');
        return;
    }
    
    if (isProcessing) return;
    
    isProcessing = true;
    showLoading();
    hideResult();
    
    try {
        const requestData = {
            task_type: currentAction,
            code_snippet: code
        };
        
        // Add target language for translate
        if (currentAction === 'translate') {
            requestData.target_language = targetLanguage.value;
        }
        
        const response = await fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult(data.result, data.task_type);
            showToast('Berhasil diproses!', 'success');
        } else {
            showToast(data.error || 'Terjadi kesalahan!', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan koneksi!', 'error');
    } finally {
        isProcessing = false;
        hideLoading();
    }
}

// Show loading
function showLoading() {
    loadingSection.style.display = 'block';
    resultSection.style.display = 'none';
}

// Hide loading
function hideLoading() {
    loadingSection.style.display = 'none';
}

// Show result
function showResult(result, taskType) {
    hideLoading();
    
    // Format result based on task type
    let formattedResult = formatAIResponse(result);
    
    resultContent.innerHTML = formattedResult;
    resultSection.style.display = 'block';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Apply syntax highlighting if Prism is available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(resultContent);
    }
}

// Hide result
function hideResult() {
    resultSection.style.display = 'none';
}

// Format AI response with proper markdown and styling
function formatAIResponse(text) {
    // Escape HTML first
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Format special code blocks with custom tags first
    text = text.replace(/\[KODE_DIPERBAIKI\]([\s\S]*?)\[\/KODE_DIPERBAIKI\]/g, (match, code) => {
        const codeId = generateCodeId();
        return `<div class="code-block-container">
            <div class="code-block-header">
                KODE YANG DIPERBAIKI:
                <button class="code-copy-btn" onclick="copyCode('${codeId}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre><code id="${codeId}" class="language-auto">${code.trim()}</code></pre>
        </div>`;
    });
    
    text = text.replace(/\[KODE_OPTIMIZED\]([\s\S]*?)\[\/KODE_OPTIMIZED\]/g, (match, code) => {
        const codeId = generateCodeId();
        return `<div class="code-block-container">
            <div class="code-block-header">
                KODE YANG DIOPTIMALKAN:
                <button class="code-copy-btn" onclick="copyCode('${codeId}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre><code id="${codeId}" class="language-auto">${code.trim()}</code></pre>
        </div>`;
    });
    
    text = text.replace(/\[KODE\]([\s\S]*?)\[\/KODE\]/g, (match, code) => {
        const codeId = generateCodeId();
        return `<div class="code-block-container">
            <div class="code-block-header">
                KODE:
                <button class="code-copy-btn" onclick="copyCode('${codeId}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre><code id="${codeId}" class="language-auto">${code.trim()}</code></pre>
        </div>`;
    });
    
    // Format regular code blocks (```code```)
    text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript';
        const codeId = generateCodeId();
        return `<div class="code-block-wrapper">
            <button class="code-copy-btn" onclick="copyCode('${codeId}')">
                <i class="fas fa-copy"></i> Copy
            </button>
            <pre><code id="${codeId}" class="language-${language}">${code.trim()}</code></pre>
        </div>`;
    });
    
    // Format inline code (`code`)
    text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    
    // Format headers
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Format bold text (**text** or __text__)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Format italic text (*text* or _text_)
    text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
    text = text.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>');
    
    // Format bullet lists
    text = text.replace(/^[\s]*[-*+]\s+(.*)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    
    // Format numbered lists
    text = text.replace(/^[\s]*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    
    // Format special sections
    text = text.replace(/\[PERBAIKAN\]([\s\S]*?)(?=\n\n|\[|$)/g, '<div class="result-highlight"><strong>PERBAIKAN:</strong>$1</div>');
    text = text.replace(/\[OPTIMASI\]([\s\S]*?)(?=\n\n|\[|$)/g, '<div class="result-highlight"><strong>OPTIMASI:</strong>$1</div>');
    text = text.replace(/\[PENJELASAN\]([\s\S]*?)(?=\n\n|\[|$)/g, '<div class="result-highlight"><strong>PENJELASAN:</strong>$1</div>');
    text = text.replace(/\[ERROR\]([\s\S]*?)(?=\n\n|\[|$)/g, '<div class="result-error"><strong>ERROR:</strong>$1</div>');
    text = text.replace(/\[WARNING\]([\s\S]*?)(?=\n\n|\[|$)/g, '<div class="result-warning"><strong>PERINGATAN:</strong>$1</div>');
    
    // Format dividers
    text = text.replace(/^---+$/gm, '<div class="result-section-divider"></div>');
    
    // Convert double line breaks to paragraph breaks
    text = text.replace(/\n\n+/g, '</p><p>');
    text = '<p>' + text + '</p>';
    
    // Clean up formatting
    text = text.replace(/<p><\/p>/g, '');
    text = text.replace(/<p>(<h[1-6]>)/g, '$1');
    text = text.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    text = text.replace(/<p>(<div)/g, '$1');
    text = text.replace(/(<\/div>)<\/p>/g, '$1');
    text = text.replace(/<p>(<ul>)/g, '$1');
    text = text.replace(/(<\/ul>)<\/p>/g, '$1');
    text = text.replace(/<p>(<pre>)/g, '$1');
    text = text.replace(/(<\/pre>)<\/p>/g, '$1');
    
    // Convert single line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Generate unique ID for code blocks
function generateCodeId() {
    return 'code-' + Math.random().toString(36).substr(2, 9);
}

// Copy specific code block
async function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    const button = event.target.closest('.code-copy-btn');
    
    if (!codeElement) return;
    
    try {
        const textContent = codeElement.textContent || codeElement.innerText;
        await navigator.clipboard.writeText(textContent);
        
        // Update button state
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = codeElement.textContent || codeElement.innerText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Update button state
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            button.classList.remove('copied');
        }, 2000);
    }
}

// Make copyCode function global
window.copyCode = copyCode;

// Copy result to clipboard
async function copyResult() {
    try {
        const textContent = resultContent.textContent || resultContent.innerText;
        await navigator.clipboard.writeText(textContent);
        showToast('Hasil berhasil disalin!', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = resultContent.textContent || resultContent.innerText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Hasil berhasil disalin!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-resize textarea
function autoResizeTextarea() {
    codeInput.style.height = 'auto';
    codeInput.style.height = Math.max(200, codeInput.scrollHeight) + 'px';
}

// Add auto-resize listener
codeInput.addEventListener('input', autoResizeTextarea);

// Keyboard shortcuts info
document.addEventListener('keydown', (e) => {
    // Ctrl+/ for help
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showToast('Shortcuts: Ctrl+Enter (Process), Tab (Indent), Ctrl+/ (Help)', 'info');
    }
});