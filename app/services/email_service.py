import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

# Email configuration
SMTP_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("EMAIL_PORT", 587))
SMTP_USER = os.getenv("EMAIL_USER", "")
SMTP_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

async def send_otp_email(to_email: str, otp: str, otp_type: str = "verification"):
    """
    Send OTP email for verification or password reset
    """
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        if otp_type == "verification":
            msg['Subject'] = "Verify Your Email - Monster AI"
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .otp {{ font-size: 36px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; letter-spacing: 5px; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Monster AI</h1>
                    </div>
                    <div class="content">
                        <h2>Email Verification</h2>
                        <p>Hello,</p>
                        <p>Your OTP for email verification is:</p>
                        <div class="otp">{otp}</div>
                        <p>This OTP will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Monster AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        else:  # reset password
            msg['Subject'] = "Reset Your Password - Monster AI"
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .otp {{ font-size: 36px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; letter-spacing: 5px; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Monster AI</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>Your OTP for password reset is:</p>
                        <div class="otp">{otp}</div>
                        <p>This OTP will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Monster AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        logging.info(f"✅ OTP email sent to {to_email}")
        return True
        
    except Exception as e:
        logging.error(f"❌ Failed to send email: {e}")
        # For development, just log the OTP
        print(f"\n🔐 OTP for {to_email}: {otp}\n")
        return False

# For testing without actual email
async def send_otp_email_dev(to_email: str, otp: str, otp_type: str = "verification"):
    """
    Development version - just prints OTP to console
    """
    print(f"\n{'='*50}")
    print(f"📧 TO: {to_email}")
    print(f"🔐 OTP: {otp}")
    print(f"📋 TYPE: {otp_type}")
    print(f"{'='*50}\n")
    return True
