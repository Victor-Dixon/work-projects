# GitHub Token Revocation Guide

## 🚨 CRITICAL: Revoke Exposed Token Immediately

A GitHub Personal Access Token was exposed in your git remote URL. This token must be revoked immediately to prevent unauthorized access to your repositories.

---

## Step-by-Step Instructions

### Step 1: Access GitHub Token Settings

1. Go to: **https://github.com/settings/tokens**
2. You may need to log in to GitHub
3. You'll see a list of all your Personal Access Tokens

### Step 2: Identify the Exposed Token

The exposed token starts with: `ghp_`

**Note:** If you can't identify which token was exposed:
- Look for tokens created around the time you set up the `websites` repository
- Check tokens with repository access permissions
- If unsure, you can revoke all tokens and create new ones

### Step 3: Revoke the Token

1. Find the token in the list
2. Click the **"Revoke"** button (or trash icon) next to it
3. Confirm the revocation
4. The token will be immediately invalidated

### Step 4: Verify Revocation

After revoking, test that the token no longer works:
```bash
cd ~/Aria/websites
git fetch origin
```

If the token was properly revoked, you should see an authentication error (which is good - it means the token is dead).

---

## Create a New Token (If Needed)

### Option 1: Use SSH (Recommended)

**Best Practice:** Use SSH keys instead of tokens for authentication.

1. **Generate SSH Key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH Key to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Save

3. **Update Remote to Use SSH:**
   ```bash
   cd ~/Aria/websites
   git remote set-url origin git@github.com:Dadudekc/websites.git
   ```

### Option 2: Create New Personal Access Token

If you need to use HTTPS with a token:

1. **Create New Token:**
   - Go to: https://github.com/settings/tokens/new
   - Give it a descriptive name (e.g., "Websites Repo - 2024")
   - Select expiration (recommend 90 days or less)
   - Select minimal permissions needed:
     - ✅ `repo` (for repository access)
   - Click "Generate token"

2. **Copy Token Immediately:**
   - GitHub only shows the token once
   - Save it securely (password manager)

3. **Use Token:**
   - Don't put it in the remote URL
   - Use GitHub CLI or credential helper instead
   - Or use it when prompted for password

---

## Security Best Practices

### ✅ DO:
- Use SSH keys for authentication (most secure)
- Use tokens with minimal permissions
- Set token expiration dates
- Store tokens in password managers
- Use GitHub CLI for authentication
- Use environment variables for CI/CD

### ❌ DON'T:
- Never commit tokens to git
- Never put tokens in remote URLs
- Never share tokens publicly
- Never use tokens with excessive permissions
- Never use tokens without expiration

---

## Check Git History for Token Exposure

The token might be in your git history. Check:

```bash
cd ~/Aria/websites
git log --all --full-history --source -- "*config*"
```

If the token appears in history:
1. Consider using `git-filter-repo` to remove it
2. Or create a new repository if sensitive
3. Force push (⚠️ coordinate with team first)

---

## Verify Your Repositories Are Secure

After revoking the token:

1. **Check Remote URLs:**
   ```bash
   git remote -v
   ```
   Should NOT contain any tokens

2. **Test Authentication:**
   ```bash
   git fetch origin
   ```
   Should work with SSH or prompt for credentials

3. **Review Repository Access:**
   - Go to: https://github.com/settings/access
   - Check who has access to your repositories
   - Remove any unauthorized access

---

## Additional Security Steps

1. **Enable Two-Factor Authentication (2FA):**
   - Go to: https://github.com/settings/security
   - Enable 2FA for your account

2. **Review Active Sessions:**
   - Go to: https://github.com/settings/security
   - Check "Active sessions"
   - Revoke any suspicious sessions

3. **Review Repository Settings:**
   - Check branch protection rules
   - Review collaborator access
   - Enable security alerts

---

## Summary

1. ✅ **Revoke the exposed token** at https://github.com/settings/tokens
2. ✅ **Set up SSH authentication** (recommended)
3. ✅ **Verify remote URLs** don't contain tokens
4. ✅ **Review repository access** and security settings

---

**Status:** ⚠️ **URGENT** - Complete these steps immediately.

*Guide created: December 13, 2024*

