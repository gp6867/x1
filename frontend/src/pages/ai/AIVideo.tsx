import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Upload, Video, Image, Loader, Download, Sparkles, Clock, Film, Wand2, AlertCircle, Crown, Zap } from 'lucide-react';

const AIVideo: React.FC = () => {
  const { token, user } = useAuthStore();
  const [state, setState] = useState({
    photo: null, video: null, duration: 10, quality: '720p', prompt: '',  // 👈 Changed default to 720p
    generating: false, resultUrl: null, progress: 0, error: null,
    photoPreview: null, videoPreview: null
  });

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setState(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setState(prev => ({ ...prev, video: file, videoPreview: URL.createObjectURL(file) }));
    }
  };

  const generateVideo = async () => {
    if (!state.photo || !state.video) {
      setState(prev => ({ ...prev, error: 'Upload photo and video' }));
      return;
    }
    setState(prev => ({ ...prev, generating: true, progress: 0, error: null }));

    const formData = new FormData();
    formData.append('photo', state.photo);
    formData.append('reference_video', state.video);
    formData.append('duration', state.duration.toString());
    formData.append('quality', state.quality);
    if (state.prompt) formData.append('prompt', state.prompt);

    try {
      const interval = setInterval(() => {
        setState(prev => ({ ...prev, progress: Math.min(prev.progress + 10, 90) }));
      }, 500);

      const response = await fetch('http://localhost:5000/api/ai/video/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      clearInterval(interval);
      const data = await response.json();
      if (data.success) {
        setState(prev => ({ ...prev, resultUrl: data.video_url, progress: 100, generating: false }));
      } else {
        setState(prev => ({ ...prev, error: data.message, generating: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to generate', generating: false }));
    }
  };

  const getPlanBadge = () => {
    const plan = user?.plan || 'free';
    if (plan === 'free') return { text: 'Free', icon: null, color: 'gray' };
    if (plan === 'pro') return { text: 'Pro', icon: Crown, color: 'emerald' };
    if (plan === 'pro_plus') return { text: 'Pro+', icon: Zap, color: 'purple' };
    return { text: 'Ultimate', icon: Crown, color: 'amber' };
  };

  const planBadge = getPlanBadge();
  const PlanIcon = planBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 shadow-sm rounded-full px-3 py-1 mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">AI Motion Transfer</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Motion Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Upload photo + video → bring your image to life</p>
        </div>

        {/* Two Column Layout - Compact */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Photo Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">1</span>
                  Source Image
                </h3>
              </div>
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 transition"
                onClick={() => photoInputRef.current?.click()}
              >
                {state.photoPreview ? (
                  <div className="relative">
                    <img src={state.photoPreview} alt="Preview" className="w-full max-h-40 object-contain rounded-lg" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, photo: null, photoPreview: null })); }}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload</p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG · Max 10MB</p>
                  </div>
                )}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            {/* Video Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">2</span>
                  Reference Video
                </h3>
              </div>
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 transition"
                onClick={() => videoInputRef.current?.click()}
              >
                {state.videoPreview ? (
                  <div className="relative">
                    <video src={state.videoPreview} className="w-full max-h-40 object-contain rounded-lg" controls />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, video: null, videoPreview: null })); }}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Film className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload video</p>
                    <p className="text-xs text-slate-400 mt-0.5">MP4 · 5-15 sec · Max 50MB</p>
                  </div>
                )}
              </div>
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Settings Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-emerald-500" />
                  Settings
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Duration</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[5, 10, 15, 30, 60].map(sec => (
                      <button
                        key={sec}
                        onClick={() => setState(prev => ({ ...prev, duration: sec }))}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          state.duration === sec
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality - FIXED with 2K option */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Quality</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {['720p', '1080p', '2K', '4K'].map(q => (
                      <button
                        key={q}
                        onClick={() => setState(prev => ({ ...prev, quality: q }))}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          state.quality === q
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Prompt (optional)</label>
                  <input
                    value={state.prompt}
                    onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Describe the motion..."
                    className="w-full p-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4">
                <button
                  onClick={generateVideo}
                  disabled={!state.photo || !state.video || state.generating}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {state.generating ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Generating {state.progress}%
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      Generate Video
                    </>
                  )}
                </button>

                {state.generating && (
                  <div className="mt-3">
                    <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${state.progress}%` }} />
                    </div>
                  </div>
                )}

                {state.error && (
                  <p className="text-xs text-red-500 mt-2 text-center">{state.error}</p>
                )}

                {state.resultUrl && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <video 
                      src={`http://localhost:5000${state.resultUrl}`}
                      className="w-full rounded-lg mb-2"
                      controls
                    />
                    <a
                      href={`http://localhost:5000${state.resultUrl}`}
                      download
                      className="text-emerald-600 text-sm flex items-center gap-1"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                )}

                {!state.resultUrl && !state.generating && (
                  <p className="text-xs text-slate-400 text-center mt-3">Your video will appear here</p>
                )}
              </div>
            </div>

            {/* Plan Badge */}
            {PlanIcon && (
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${planBadge.color}-50 text-${planBadge.color}-600`}>
                  <PlanIcon className="w-3 h-3" />
                  <span>{planBadge.text} Plan</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVideo;
