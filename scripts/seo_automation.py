#!/usr/bin/env python3
"""
SEO Automation Script for Xone AI
- Pings Google & Bing with sitemap
- Optionally uses Google Indexing API (requires service account)
"""

import urllib.request
import urllib.parse
import json
import sys
import os

SITE_URL = "https://www.xoneai.in"
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

def ping_sitemap():
    """Ping Google and Bing with the sitemap URL"""
    engines = [
        f"https://www.google.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}",
        f"https://www.bing.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}",
    ]
    for url in engines:
        try:
            response = urllib.request.urlopen(url, timeout=10)
            print(f"✅ Pinged: {url.split('/')[2]} → Status {response.status}")
        except Exception as e:
            print(f"❌ Failed: {url.split('/')[2]} → {e}")

def submit_indexing_api():
    """
    Google Indexing API (requires service account JSON)
    Place your service account file at: scripts/service_account.json
    """
    service_account_path = os.path.join(os.path.dirname(__file__), "service_account.json")
    if not os.path.exists(service_account_path):
        print("ℹ️ Google Indexing API skipped (no service_account.json found)")
        return

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("⚠️ Install dependencies: pip install google-auth google-auth-httplib2 google-api-python-client")
        return

    credentials = service_account.Credentials.from_service_account_file(
        service_account_path,
        scopes=["https://www.googleapis.com/auth/indexing"]
    )
    service = build("indexing", "v3", credentials=credentials)

    urls = [
        f"{SITE_URL}/",
        f"{SITE_URL}/home",
        f"{SITE_URL}/chat",
        f"{SITE_URL}/pricing",
        f"{SITE_URL}/blog",
        f"{SITE_URL}/login",
        f"{SITE_URL}/register",
        f"{SITE_URL}/compare/monsterx-vs-chatgpt",
        f"{SITE_URL}/alternatives/chatgpt",
    ]

    for url in urls:
        try:
            body = {"url": url, "type": "URL_UPDATED"}
            service.urlNotifications().publish(body=body).execute()
            print(f"✅ Indexing requested: {url}")
        except Exception as e:
            print(f"❌ Indexing failed: {url} → {e}")

if __name__ == "__main__":
    print(f"🔍 Running SEO automation for {SITE_URL}")
    print("-" * 50)
    ping_sitemap()
    print("-" * 50)
    submit_indexing_api()
    print("-" * 50)
    print("🎉 SEO automation complete!")
