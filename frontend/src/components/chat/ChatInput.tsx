import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image, Mic, MicOff, AlertCircle, X } from 'lucide-react';
import secureFileUpload from '../../utils/secureFileUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File, text: string) => void;
  onVoiceInput?: (audioBlob: Blob) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onFileUpload,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  // ============= AUTO-RESIZE =============
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // ============= SETUP SPEECH RECOGNITION =============
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }
      const base = baseTextRef.current;
      setInputValue((base + ' ' + finalText + interimText).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setUploadError('Microphone permission denied. Please allow mic access.');
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // ignore
      } else {
        setUploadError(`Voice error: ${event.error}`);
      }
      setIsListening(false);
      setTimeout(() => setUploadError(null), 3000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (e) {}
    };
  }, []);

  // ============= CLOSE FILE MENU =============
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFileMenu && !(event.target as Element).closest('.file-upload-btn') &&
          !(event.target as Element).closest('.file-menu')) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFileMenu]);

  // ============= CLEANUP PREVIEW =============
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ============= SEND =============
  const handleSend = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile, inputValue.trim());
    } else if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
    } else {
      return;
    }

    setInputValue('');
    baseTextRef.current = '';
    clearPreview();
    if (textareaRef.current) textareaRef.current.style.height = '44px';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============= FILE HANDLING =============
  const handleFileClick = () => {
    setShowFileMenu(false);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    setIsUploading(true);
    setUploadError(null);

    try {
      const validation = await secureFileUpload.validateFile(file);
      if (!validation.isValid) {
        setUploadError('Invalid file. PNG, JPG, WEBP only (max 50MB).');
        clearPreview();
        return;
      }
    } catch (error) {
      console.error('Validation error:', error);
      setUploadError('File validation failed');
      clearPreview();
    } finally {
      setIsUploading(false);
    }

    e.target.value = '';
  };

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ============= VOICE =============
  const handleVoiceClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setUploadError('Voice input not supported. Try Chrome or Edge.');
      setTimeout(() => setUploadError(null), 4000);
      return;
    }

    if (isListening) {
      try { recognition.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      baseTextRef.current = inputValue;
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error('Voice start error:', e);
      }
    }
  };

  return (
    <div className="input-area">
      {uploadError && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)}>×</button>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && previewUrl && (
        <div className="file-preview" style={{
          display: 'flex', alignItems: 'center',
          padding: '8px 12px', margin: '8px 16px',
          backgroundColor: '#f9f9f9', borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <img src={previewUrl} alt="Preview" style={{
            width: '40px', height: '40px', objectFit: 'cover',
            borderRadius: '6px', marginRight: '12px'
          }} />
          <span style={{
            flex: 1, fontSize: '14px', color: '#374151',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {selectedFile.name}
          </span>
          <button onClick={clearPreview} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px', color: '#6b7280', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Recording Indicator */}
      {isListening && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span className="recording-text">Listening... speak now</span>
          <button className="stop-recording" onClick={handleVoiceClick}>Stop</button>
        </div>
      )}

      <div className="input-container">
        <button
          className={`file-upload-btn ${isUploading ? 'uploading' : ''}`}
          onClick={() => setShowFileMenu(!showFileMenu)}
          disabled={isUploading || isListening}
          type="button"
          title="Upload Image"
        >
          <Plus size={20} />
        </button>

        {showFileMenu && (
          <div className="file-menu">
            <button onClick={handleFileClick} type="button">
              <Image size={16} />
              <span>Upload Image</span>
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        />

        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder={isListening ? 'Listening...' : 'Message MonsterX AI...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />

        <button
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceClick}
          type="button"
          title={isListening ? 'Stop Listening' : 'Voice Input'}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          className="send-button"
          onClick={handleSend}
          disabled={(!inputValue.trim() && !selectedFile) || isUploading || isListening}
          type="button"
          title="Send Message"
        >
          <Send size={18} />
        </button>
      </div>

      <p className="disclaimer">
        MonsterX AI can analyze images. PNG, JPG, WEBP supported up to 50MB.
      </p>
    </div>
  );
};

export default ChatInput;
