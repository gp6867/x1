import hashlib
import base64
import json
import requests
import os
from datetime import datetime

class PhonePePayment:
    def __init__(self):
        self.merchant_id = os.getenv('PHONEPE_MERCHANT_ID', '')
        self.salt_key = os.getenv('PHONEPE_SALT_KEY', '')
        self.salt_index = os.getenv('PHONEPE_SALT_INDEX', '1')
        self.env = os.getenv('PHONEPE_ENV', 'SANDBOX')
        
        if self.env == 'SANDBOX':
            self.base_url = "https://api-preprod.phonepe.com/apis/pg"
        else:
            self.base_url = "https://api.phonepe.com/apis/pg"
    
    def create_order(self, user_id, amount, plan_name):
        """Create payment order"""
        order_id = f"MONSTER_{user_id}_{int(datetime.now().timestamp())}"
        
        payload = {
            "merchantId": self.merchant_id,
            "merchantTransactionId": order_id,
            "merchantUserId": str(user_id),
            "amount": amount * 100,
            "redirectUrl": f"http://localhost:5000/api/payment/callback",
            "redirectMode": "REDIRECT",
            "callbackUrl": f"http://localhost:5000/api/payment/webhook",
            "paymentInstrument": {"type": "PAY_PAGE"}
        }
        
        payload_json = json.dumps(payload)
        payload_base64 = base64.b64encode(payload_json.encode()).decode()
        
        checksum_string = payload_base64 + "/pg/v1/pay" + self.salt_key
        checksum = hashlib.sha256(checksum_string.encode()).hexdigest() + "###" + self.salt_index
        
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum
        }
        
        response = requests.post(
            f"{self.base_url}/v1/pay",
            json={"request": payload_base64},
            headers=headers
        )
        
        return response.json()
    
    def verify_payment(self, transaction_id):
        """Verify payment status"""
        checksum_string = f"/pg/v1/status/{self.merchant_id}/{transaction_id}" + self.salt_key
        checksum = hashlib.sha256(checksum_string.encode()).hexdigest() + "###" + self.salt_index
        
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": self.merchant_id
        }
        
        response = requests.get(
            f"{self.base_url}/v1/status/{self.merchant_id}/{transaction_id}",
            headers=headers
        )
        
        return response.json()
