// ===== GOOGLE ANALYTICS 4 UTILITY =====
// Direct gtag.js wrapper — no npm package needed

const GA_ID = 'G-ND4HN9EFVZ';
const isProd = import.meta.env.PROD;

// ===== PAGE VIEW =====
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') return;

  if (isProd && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  } else {
    console.log('[GA4 PageView - DEV]', { path, title });
  }
};

// ===== CUSTOM EVENT =====
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  if (isProd && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.log('[GA4 Event - DEV]', eventName, params);
  }
};

// ===== PREDEFINED EVENT HELPERS =====
export const analytics = {
  signUp: (method: 'email' | 'google' = 'email') =>
    trackEvent('sign_up', { method }),

  login: (method: 'email' | 'google' = 'email') =>
    trackEvent('login', { method }),

  logout: () =>
    trackEvent('logout'),

  chatMessageSent: (chatId: string | null) =>
    trackEvent('chat_message_sent', {
      chat_id: chatId || 'new',
    }),

  messageLiked: (chatId: string) =>
    trackEvent('message_liked', { chat_id: chatId }),

  messageDisliked: (chatId: string) =>
    trackEvent('message_disliked', { chat_id: chatId }),

  regenerateClicked: () =>
    trackEvent('regenerate_clicked'),

  copyClicked: () =>
    trackEvent('copy_clicked'),

  voiceInputUsed: () =>
    trackEvent('voice_input_used'),

  fileUploaded: (fileType: string) =>
    trackEvent('file_uploaded', { file_type: fileType }),

  pricingViewed: () =>
    trackEvent('pricing_viewed'),

  passwordResetRequested: () =>
    trackEvent('password_reset_requested'),

  passwordResetCompleted: () =>
    trackEvent('password_reset_completed'),
};
