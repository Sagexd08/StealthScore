# Content Security Policy (CSP) Compliance Guide

## 🔒 Overview

This guide explains how Stealth Score maintains Content Security Policy compliance to prevent XSS attacks and ensure secure operation without `unsafe-eval`.

## 🛡️ Current CSP Configuration

### Strict CSP Headers
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'strict-dynamic' [trusted domains];
style-src 'self' 'unsafe-inline' [trusted domains];
font-src 'self' [trusted domains] data:;
img-src 'self' data: https: blob: [trusted domains];
connect-src 'self' [API endpoints] wss:;
frame-src [trusted iframes];
worker-src 'self' blob:;
manifest-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
```

### Key Security Features
- ❌ **No `unsafe-eval`** - Prevents dynamic code execution
- ✅ **`strict-dynamic`** - Allows trusted scripts to load other scripts
- ✅ **Specific domains** - Only trusted external resources allowed
- ✅ **`object-src 'none'`** - Prevents plugin execution

## 🔧 CSP-Compliant Configurations

### 1. GSAP Animation Library
**File**: `frontend/src/utils/gsap-config.ts`

**Key Features**:
- Disables eval usage in GSAP
- Safe animation creation utilities
- CSP-compliant ScrollTrigger configuration
- Proper cleanup functions

**Usage**:
```typescript
import { gsap, createSafeAnimation } from '../utils/gsap-config';

// Instead of direct gsap.to()
const animation = createSafeAnimation(target, {
  opacity: 1,
  duration: 1
});
```

### 2. Crypto Operations
**File**: `frontend/src/utils/crypto-config.ts`

**Key Features**:
- Static encryption/decryption without eval
- CSP-compliant CryptoJS configuration
- Safe key generation and validation
- Secure hash and HMAC functions

**Usage**:
```typescript
import { CryptoUtils } from '../utils/crypto-config';

const encrypted = CryptoUtils.encrypt(data, key);
const hash = CryptoUtils.hash(data, 'SHA256');
```

### 3. Web3 Integration
**File**: `frontend/src/utils/web3-config.ts`

**Key Features**:
- Safe provider and signer creation
- CSP-compliant contract interactions
- Static transaction creation
- Secure message signing/verification

**Usage**:
```typescript
import { Web3Utils } from '../utils/web3-config';

const provider = Web3Utils.createProvider(rpcUrl);
const contract = Web3Utils.createContract(address, abi, signer);
```

## 📋 CSP Deployment Configuration

### 1. Nginx Configuration
**File**: `nginx.conf`
- HTTP header-based CSP
- Production-ready security headers
- Optimized for performance

### 2. Firebase Hosting
**File**: `firebase.json`
- Static hosting CSP headers
- Consistent with nginx configuration
- Automatic deployment integration

### 3. HTML Meta Tag
**File**: `frontend/index.html`
- Fallback CSP meta tag
- Ensures CSP even without server headers
- Development environment support

## 🚫 Prohibited Patterns

### ❌ Avoid These Patterns
```javascript
// DON'T: Dynamic code execution
eval('some code');
new Function('return something');
setTimeout('code string', 1000);
setInterval('code string', 1000);

// DON'T: Unsafe GSAP usage
gsap.to(target, { onComplete: eval });

// DON'T: Dynamic crypto operations
CryptoJS.algo.SHA256.create().update(eval(data));
```

### ✅ Use These Instead
```javascript
// DO: Static function references
setTimeout(() => someFunction(), 1000);
setInterval(() => someFunction(), 1000);

// DO: Safe GSAP animations
import { createSafeAnimation } from '../utils/gsap-config';
createSafeAnimation(target, { onComplete: safeCallback });

// DO: Static crypto operations
import { CryptoUtils } from '../utils/crypto-config';
CryptoUtils.hash(data, 'SHA256');
```

## 🔍 Testing CSP Compliance

### Browser Console Checks
1. Open browser developer tools
2. Check for CSP violation errors
3. Look for `unsafe-eval` warnings
4. Verify no dynamic code execution

### Automated Testing
```bash
# Build and test
npm run build
npm run preview

# Check for CSP violations in console
# Should see no eval-related errors
```

### CSP Violation Monitoring
- Monitor browser console for violations
- Check network tab for blocked resources
- Verify all external scripts are whitelisted

## 🛠️ Troubleshooting

### Common Issues

**1. GSAP Eval Violations**
- **Cause**: Direct GSAP usage without safe configuration
- **Solution**: Use `gsap-config.ts` utilities
- **Fix**: Import from utils instead of direct GSAP

**2. Crypto Library Violations**
- **Cause**: Dynamic algorithm selection
- **Solution**: Use static crypto configurations
- **Fix**: Use `crypto-config.ts` utilities

**3. Web3 Provider Issues**
- **Cause**: Dynamic provider creation
- **Solution**: Use safe provider utilities
- **Fix**: Use `web3-config.ts` configurations

### Debug Steps
1. Check browser console for CSP violations
2. Verify all external domains are whitelisted
3. Ensure no eval usage in custom code
4. Test with strict CSP headers enabled

## 📚 Best Practices

### 1. Library Integration
- Always use CSP-compliant configurations
- Test new libraries for eval usage
- Create safe wrapper utilities when needed
- Document any CSP requirements

### 2. Code Review
- Check for dynamic code execution
- Verify safe animation patterns
- Ensure static crypto operations
- Test CSP compliance before deployment

### 3. Deployment
- Enable CSP headers in production
- Monitor for violations in logs
- Test across different browsers
- Verify external resource loading

## 🔄 Maintenance

### Regular Tasks
- [ ] Monitor CSP violation logs
- [ ] Update trusted domains as needed
- [ ] Test new library versions for compliance
- [ ] Review and update CSP policies

### When Adding New Features
- [ ] Check library CSP compatibility
- [ ] Create safe configuration utilities
- [ ] Test for eval usage
- [ ] Update CSP headers if needed
- [ ] Document any new requirements

## 📞 Support

For CSP-related issues:
1. Check this guide first
2. Review browser console errors
3. Test with safe utility functions
4. Update CSP headers if needed

Remember: **Security first** - Never add `unsafe-eval` to fix CSP violations. Always find CSP-compliant alternatives.
