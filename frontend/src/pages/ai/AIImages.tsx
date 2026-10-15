import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Loader, Download, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AIImages: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/ai/images/generate`,
        { 
          prompt: prompt,
          negative_prompt: negativePrompt,
          steps: 30,
          width: 512,
          height: 512
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        if (response.data.images && response.data.images[0]) {
          const imgUrl = `data:image/png;base64,${response.data.images[0]}`;
          setImageUrl(imgUrl);
          setHistory(prev => [imgUrl, ...prev].slice(0, 10));
        } else if (response.data.description) {
          // Fallback: show description
          setError(response.data.description);
        }
      } else {
        setError(response.data.message || 'Failed to generate image');
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError(err.response?.data?.message || 'Failed to connect to image service');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ai-images-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>
          <Sparkles size={24} />
          AI Image Generator
        </h1>
      </div>

      <div className="ai-images-container">
        {/* Input Section */}
        <div className="input-section">
          <div className="prompt-box">
            <label>Describe your image</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains, digital art, 4k"
              rows={3}
            />
          </div>

          <div className="prompt-box">
            <label>Negative prompt (optional)</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, bad quality, distorted"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            className="generate-btn"
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <Loader size={20} className="spin" />
                Generating...
              </>
            ) : (
              <>
                <Image size={20} />
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Result Section */}
        {(imageUrl || loading) && (
          <div className="result-section">
            <h2>Generated Image</h2>
            {loading ? (
              <div className="loading-placeholder">
                <Loader size={40} className="spin" />
                <p>Creating your masterpiece...</p>
              </div>
            ) : (
              <div className="image-result">
                <img src={imageUrl} alt="Generated" />
                <button className="download-btn" onClick={downloadImage}>
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section">
            <h2>Recent Generations</h2>
            <div className="history-grid">
              {history.map((img, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => setImageUrl(img)}
                >
                  <img src={img} alt={`History ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImages;
