# 📧 How to Setup Real Emails for EaseHub

To receive the verification code in your actual email inbox (instead of the terminal), follow these steps to configure the backend.

## Prerequisites
- A **Gmail** account (you can use your personal one or create a new one).
- **2-Step Verification** MUST be enabled on that Google Account.

## Step-by-Step Implementation

### 1. Generate an App Password
Google does not allow you to use your login password for apps anymore. You need a special "App Password".

1.  Go to **[Google Account Security](https://myaccount.google.com/security)**.
2.  Scroll to the **"How you sign in to Google"** section.
3.  Click **"2-Step Verification"** and configure it if not already done.
4.  Once 2FA is on, go back to the Security page or use the Search bar at the top looking for **"App Passwords"**.
5.  Click **"App Passwords"**.
6.  **App name**: Type `EaseHub`.
7.  Click **Create**.
8.  Google will show you a **16-character code** (e.g., `abcd efgh ijkl mnop`). **COPY TIHS CODE.**

### 2. Configure the Backend

1.  Open the file `backend/.env` in your code editor.
2.  Update the email section as follows:

```env
# Replace with YOUR Gmail address
EMAIL_USER=your_email@gmail.com

# Replace with the 16-character code you just copied (no spaces)
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

### 3. Restart the Server

For the changes to take effect, you must restart the backend server.

1.  Go to your **Backend Configuration Terminal**.
2.  Press `Ctrl + C` to stop the server.
3.  Run `npm run dev` again.

### 4. Test It

1.  Go to the EaseHub Signup page.
2.  Sign up with a valid email address.
3.  Check your **spam folder** or **inbox**. You should receive the OTP code!

---

## 🛑 Troubleshooting

- **"Invalid Login" error?**
  - Make sure you copied the App Password correctly without spaces.
  - Ensure you are using the correct `EMAIL_USER` address.

- **Still not getting email?**
  - Check the backend terminal. If the email fails, the system will **Log the OTP to the console** so you are never stuck. Look for:
    ```
    ================ EMAIL MOCK ================
    To: ...
    Body: ... 123456 ...
    ============================================
    ```
