import razorpay
import os
import json
from datetime import datetime

class RazorPayService:
    def __init__(self):
        self.key_id = os.getenv('RAZORPAY_KEY_ID')
        self.key_secret = os.getenv('RAZORPAY_KEY_SECRET')
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
    
    def create_order(self, amount, currency='INR'):
        """Create payment order"""
        order = self.client.order.create({
            'amount': amount * 100,  # Convert to paise
            'currency': currency,
            'payment_capture': 1,
            'notes': {
                'created_at': datetime.now().isoformat()
            }
        })
        return order
    
    def verify_payment(self, order_id, payment_id, signature):
        """Verify payment signature"""
        params = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        try:
            self.client.utility.verify_payment_signature(params)
            return True
        except Exception as e:
            print(f"Verification failed: {e}")
            return False
    
    def get_payment_details(self, payment_id):
        """Get payment details"""
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except:
            return None
