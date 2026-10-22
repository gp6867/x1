import smtplib
import logging
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# ===== RESEND (PRIMARY) =====
try:
    import resend
    resend.api_key = os.getenv("RESEND_API_KEY", "").strip()
    RESEND_AVAILABLE = bool(resend.api_key)
except ImportError:
    resend = None
    RESEND_AVAILABLE = False
    logging.warning("⚠️ resend package not installed — falling back to SMTP only")

RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev").strip()
RESEND_FROM_NAME = os.getenv("RESEND_FROM_NAME", "MonsterX AI").strip()

# ===== SMTP FALLBACK =====
SMTP_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
SMTP_USER = os.getenv("EMAIL_USER", "").strip()
SMTP_PASSWORD = os.getenv("EMAIL_PASSWORD", "").strip()
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER).strip()


# =====================================================================
# ===== HTML TEMPLATES =====
# =====================================================================
def _build_html(otp: str, otp_type: str) -> str:
    if otp_type == "verification":
        heading = "Email Verification"
        message = "Your OTP for email verification is:"
        subject = "Verify Your Email - MonsterX AI"
    else:
        heading = "Password Reset Request"
        message = "Your OTP for password reset is:"
        subject = "Reset Your Password - MonsterX AI"

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #f4f4f7; }}
            .container {{ max-width: 600px; margin: 20px auto; padding: 0; }}
            .header {{ background: linear-gradient(135deg, #10a37f 0%, #0e8c6d 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }}
            .header h1 {{ margin: 0; font-size: 24px; }}
            .header p {{ margin: 6px 0 0; font-size: 13px; opacity: 0.9; }}
            .content {{ background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; }}
            .content h2 {{ color: #1f2937; margin-top: 0; }}
            .content p {{ color: #4b5563; }}
            .otp {{ font-size: 38px; font-weight: bold; color: #10a37f; text-align: center; padding: 20px; letter-spacing: 8px; background: #f0fdf9; border-radius: 10px; margin: 20px 0; border: 1px dashed #10a37f; }}
            .warning {{ font-size: 13px; color: #6b7280; text-align: center; margin-top: 20px; }}
            .footer {{ text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px; }}
            .footer a {{ color: #10a37f; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>MonsterX AI</h1>
                <p>by Xone AI</p>
            </div>
            <div class="content">
                <h2>{heading}</h2>
                <p>Hello,</p>
                <p>{message}</p>
                <div class="otp">{otp}</div>
                <p class="warning">This OTP will expire in <strong>10 minutes</strong>.</p>
                <p class="warning">If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 MonsterX AI by Xone AI. All rights reserved.</p>
                <p><a href="https://www.xoneai.in">www.xoneai.in</a></p>
            </div>
        </div>
    </body>
    </html>
    """


def _subject(otp_type: str) -> str:
    if otp_type == "verification":
        return "Verify Your Email - MonsterX AI"
    return "Reset Your Password - MonsterX AI"


# =====================================================================
# ===== RESEND SENDER =====
# =====================================================================
def _send_via_resend(to_email: str, otp: str, otp_type: str) -> bool:
    if not RESEND_AVAILABLE:
        return False
    try:
        params = {
            "from": f"{RESEND_FROM_NAME} <{RESEND_FROM_EMAIL}>",
            "to": [to_email],
            "subject": _subject(otp_type),
            "html": _build_html(otp, otp_type),
        }
        response = resend.Emails.send(params)
        logging.info(f"✅ OTP email sent via Resend to {to_email} (id={response.get('id', 'n/a')})")
        return True
    except Exception as e:
        logging.error(f"❌ Resend failed: {type(e).__name__}: {e}")
        return False


# =====================================================================
# ===== SMTP SENDER (FALLBACK) =====
# =====================================================================
def _send_via_smtp(to_email: str, otp: str, otp_type: str) -> bool:
    if not (SMTP_USER and SMTP_PASSWORD):
        logging.warning("⚠️ SMTP credentials missing — cannot fallback")
        return False
    try:
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL or SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = _subject(otp_type)
        msg.attach(MIMEText(_build_html(otp, otp_type), 'html'))

        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logging.info(f"✅ OTP email sent via SMTP to {to_email}")
        return True
    except Exception as e:
        logging.error(f"❌ SMTP failed: {type(e).__name__}: {e}")
        return False


# =====================================================================
# ===== MAIN FUNCTION =====
# =====================================================================
async def send_otp_email(to_email: str, otp: str, otp_type: str = "verification"):
    """
    Send OTP email — tries Resend first, falls back to SMTP.
    Returns True if any provider succeeds.
    """
    # 1. Try Resend (primary)
    if RESEND_AVAILABLE:
        if _send_via_resend(to_email, otp, otp_type):
            return True
        logging.warning("🔄 Resend failed — trying SMTP fallback")

    # 2. Try SMTP (fallback)
    if _send_via_smtp(to_email, otp, otp_type):
        return True

    # 3. Both failed — log OTP for manual retrieval
    logging.error("❌ All email providers failed")
    print(f"\n{'='*50}")
    print(f"📧 TO: {to_email}")
    print(f"🔐 OTP: {otp}")
    print(f"📋 TYPE: {otp_type}")
    print(f"⚠️ Email delivery failed — OTP printed above for manual use")
    print(f"{'='*50}\n")
    return False


# =====================================================================
# ===== DEV / TEST FUNCTION =====
# =====================================================================
async def send_otp_email_dev(to_email: str, otp: str, otp_type: str = "verification"):
    """Development version — just prints OTP to console"""
    print(f"\n{'='*50}")
    print(f"📧 TO: {to_email}")
    print(f"🔐 OTP: {otp}")
    print(f"📋 TYPE: {otp_type}")
    print(f"{'='*50}\n")
    return True
