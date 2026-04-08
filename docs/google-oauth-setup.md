# Google OAuth Setup

## 1. Google Cloud Console

1. Go to https://console.cloud.google.com
2. Create a project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Under **Authorized redirect URIs**, add:
   ```
   https://kvdcyvkcxkzeoiellxmo.supabase.co/auth/v1/callback
   ```
7. Click **Create** and copy the **Client ID** and **Client Secret**

## 2. Supabase Dashboard

1. Go to your project dashboard
2. Navigate to **Authentication → Providers → Google**
3. Toggle **Enable Google provider**
4. Paste in the **Client ID** and **Client Secret** from step 1
5. Click **Save**

## 3. Disable Email Confirmations

1. In Supabase, go to **Authentication → Settings**
2. Uncheck **Enable email confirmations**
3. Click **Save**

New users can now sign up instantly without confirming their email, and sign in with Google.
