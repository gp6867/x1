import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image, Mic, MicOff, AlertCircle, X } from 'lucide-react';
import secureFileUpload from '../../utils/secureFileUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void;
  onVoiceInput?: (audioBlob: Blob) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onFileUpload,
  onVoiceInput 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ============= AUTO-RESIZE =============
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // ============= RECORDING TIMER =============
  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ============= SEND MESSAGE WITH FILE =============
  const handleSend = () => {
    // Agar file hai to pehle file upload karo
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
    
    // Message bhejo (agar file hai to uske saath, nahi to sirf text)
    if (selectedFile) {
      onSendMessage(inputValue.trim() || '📎 Image');
    } else if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
    } else {
      return; // Kuch nahi hai to return
    }
    
    // Cleanup
    setInputValue('');
    clearPreview();
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  // ============= KEY PRESS HANDLER =============
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============= FILE BUTTON CLICK =============
  const handleFileClick = () => {
    setShowFileMenu(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ============= FILE SELECT HANDLER =============
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    
    console.log('📁 File selected:', file.name);
    console.log('🖼️ Preview created');

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file (but DON'T upload yet)
      const validation = await secureFileUpload.validateFile(file);

      if (!validation.isValid) {
        setUploadError('Invalid file. Please upload PNG or JPG only.');
        clearPreview();
        return;
      }

      // File valid hai, preview dikhao but upload mat karo
      // Upload sirf send button pe hoga
      
    } catch (error) {
      console.error('File validation error:', error);
      setUploadError('File validation failed');
      clearPreview();
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadError(null), 3000);
    }

    // Clear input so same file can be selected again
    e.target.value = '';
  };

  // ============= CLEAR PREVIEW =============
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============= FORMAT TIME =============
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============= START RECORDING =============
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (onVoiceInput) {
          onVoiceInput(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsListening(true);
      
    } catch (error) {
      setUploadError('Microphone access denied');
      setTimeout(() => setUploadError(null), 3000);
    }
  };

  // ============= STOP RECORDING =============
  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // ============= VOICE BUTTON CLICK =============
  const handleVoiceClick = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="input-area">
      {/* Error Message */}
      {uploadError && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)}>×</button>
        </div>
      )}
      
      {/* File Preview - NEW */}
      {selectedFile && previewUrl && (
        <div className="file-preview" style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          margin: '8px 16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'cover',
              borderRadius: '6px',
              marginRight: '12px'
            }}
          />
          <span style={{ 
            flex: 1, 
            fontSize: '14px', 
            color: '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {selectedFile.name}
          </span>
          <button 
            onClick={clearPreview}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Recording Indicator */}
      {isListening && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span className="recording-time">{formatTime(recordingTime)}</span>
          <span className="recording-text">Recording...</span>
          <button className="stop-recording" onClick={stopRecording}>Stop</button>
        </div>
      )}
      
      {/* Input Container */}
      <div className="input-container">
        {/* File Upload Button */}
        <button 
          className={`file-upload-btn ${isUploading ? 'uploading' : ''}`}
          onClick={() => setShowFileMenu(!showFileMenu)}
          disabled={isUploading || isListening}
          type="button"
          title="Upload Image"
        >
          <Plus size={20} />
        </button>
        
        {/* File Menu */}
        {showFileMenu && (
          <div className="file-menu">
            <button onClick={handleFileClick} type="button">
              <Image size={16} />
              <span>Upload Image</span>
            </button>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
        />
        
        {/* Message Textarea */}
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder={isListening ? "Listening..." : "Message Xone AI..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          disabled={isListening}
        />
        
        {/* Voice Button */}
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceClick}
          type="button"
          title={isListening ? "Stop Recording" : "Start Voice Input"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        {/* Send Button */}
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
      
      {/* Disclaimer */}
      <p className="disclaimer">
        Xone AI can generate and analyze images. PNG and JPG supported up to 50MB.
      </p>
    </div>
  );
};

export default ChatInput;
