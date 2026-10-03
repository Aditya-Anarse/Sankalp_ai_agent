# Cloudflare Tunnel Setup for Instagram OAuth Development

## 1. Overview
Meta's **Instagram Business Login** requires valid HTTPS callback URIs for OAuth redirects—even during local development. Plain HTTP URLs like `http://localhost:8000/social-accounts/instagram/callback` are rejected by Meta with:
> *"Error saving redirect URIs. Verify your redirect URIs and try again."*

To provide a secure, free HTTPS endpoint without modifying or hardcoding backend source code, we use **Cloudflare Tunnel (`cloudflared`)**.

---

## 2. Prerequisites & Tool Location
The official `cloudflared` binary is downloaded in:
```text
tools/cloudflared.exe
```
*(Note: `tools/` is excluded from git tracking in `.gitignore`)*

---

## 3. Step-by-Step Development Workflow

### Step 1: Start the FastAPI Backend
In your terminal, activate your virtual environment or run directly:
```powershell
backend\.venv\Scripts\uvicorn.exe app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
The backend listens locally on `http://127.0.0.1:8000`.

### Step 2: Start Cloudflare Tunnel
In a second terminal, execute:
```powershell
tools\cloudflared.exe tunnel --url http://127.0.0.1:8000
```

### Step 3: Obtain the Public HTTPS URL
Watch the terminal output of `cloudflared`. You will see a line similar to:
```text
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://<random-words>.trycloudflare.com
```
Example: `https://monitor-supplements-question-accomplished.trycloudflare.com`

### Step 4: Update `.env`
Open `.env` in the repository root and set `INSTAGRAM_REDIRECT_URI`:
```env
INSTAGRAM_REDIRECT_URI=https://<random-words>.trycloudflare.com/social-accounts/instagram/callback
```
*(Save the file. If uvicorn is running with `--reload`, it will automatically reload configuration)*

### Step 5: Register the Callback in Meta Developer Portal
1. Open [Meta for Developers](https://developers.facebook.com/apps/).
2. Select your app: **Sankalp**.
3. Navigate to **Instagram** -> **Set up Instagram business login** (or **Settings**).
4. In the **Valid OAuth Redirect URIs** field, paste:
   ```text
   https://<random-words>.trycloudflare.com/social-accounts/instagram/callback
   ```
5. Click **Save Changes**. Meta will accept the URL without the previous error.

---

## 4. Verification Endpoints

### 1. Health Check
```powershell
curl -s https://<random-words>.trycloudflare.com/health
```
Expected output:
```json
{"status":"healthy","database":"connected","ai_configured":true,"product":"SANKALP AI"}
```

### 2. OAuth Diagnostic Check
```powershell
curl -s https://<random-words>.trycloudflare.com/social-accounts/instagram/oauth-debug
```
Verify that `Generated_redirect_uri` displays the exact tunnel callback URL.

---

## 5. Free Tunnel Characteristics & Limitations

| Feature | Behavior |
| :--- | :--- |
| **Cost** | 100% Free, no credit card or account needed |
| **SSL/TLS** | Valid official Cloudflare SSL certificate |
| **URL Persistence** | Ephemeral: restarting `cloudflared` generates a new subdomain URL |
| **Workflow on Restart** | Simply copy the new subdomain, update `INSTAGRAM_REDIRECT_URI` in `.env`, and update the redirect URI in Meta's dashboard |
