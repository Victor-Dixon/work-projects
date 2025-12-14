# Security Fix Execution Plan

**Date:** December 13, 2024  
**Status:** ✅ Ready to Execute

---

## 🎯 **Clear Action Plan**

### Phase 1: Critical Fixes (This Week)

#### 1. Fix Swarm Website - Vulnerable API Endpoints 🔴
**Priority:** CRITICAL  
**Time:** 15 minutes  
**File:** `~/Aria/websites/Swarm_website/wp-content/themes/swarm-theme/functions.php`

**Action:** Remove old v1 endpoints (lines 164-246)
- Remove `swarm_register_api_routes()` function
- Remove `swarm_check_api_permission()` function (vulnerable)
- Remove `swarm_update_agent()` function
- Remove `swarm_add_mission_log()` function
- Remove the `add_action('rest_api_init', 'swarm_register_api_routes')` line

**Why:** v2 endpoints are already secure, v1 endpoints are completely open

**Testing:** Verify v1 endpoints no longer work, v2 endpoints still work

---

#### 2. Fix Swarm Website - API Authentication 🔴
**Priority:** HIGH  
**Time:** 30 minutes  
**File:** `~/Aria/websites/Swarm_website/wp-content/themes/swarm-theme/functions.php`

**Action:** Already handled if removing v1 endpoints (above)

**OR** if keeping v1 endpoints, fix the function (see `ADMIN_ACCESS_FIXES.md`)

---

#### 3. Fix FreeRideInvestor - SQL Query 🟡
**Priority:** MEDIUM  
**Time:** 10 minutes  
**File:** `~/Aria/websites/FreeRideInvestor/plugins/freeride-investor/includes/class-fri-cron.php`

**Action:** Line 64 - Use `$wpdb->prepare()`
```php
// Change from:
$alerts = $wpdb->get_results("SELECT * FROM $table_name WHERE active = 1", ARRAY_A);

// To:
$alerts = $wpdb->get_results(
    $wpdb->prepare("SELECT * FROM {$table_name} WHERE active = %d", 1),
    ARRAY_A
);
```

---

### Phase 2: Security Improvements (This Month)

#### 4. Mask API Keys in Logs 🟡
**Priority:** MEDIUM  
**Time:** 30 minutes  
**File:** `~/Aria/websites/FreeRideInvestor/plugins/freeride-investor/includes/class-fri-data-fetcher.php`

**Action:** Mask API keys in log statements (lines 103, 147, 179, 234)

---

#### 5. Mask API Key in Admin Panel 🟡
**Priority:** MEDIUM  
**Time:** 15 minutes  
**File:** `~/Aria/websites/Swarm_website/wp-content/themes/swarm-theme/swarm-api-enhanced.php`

**Action:** Line 484 - Mask API key display

---

#### 6. Add Rate Limiting 🟡
**Priority:** MEDIUM  
**Time:** 2 hours  
**Files:** Both projects

**Action:** Implement rate limiting on API/AJAX endpoints

---

### Phase 3: Cleanup (After Migration)

#### 7. Revoke Old GitHub Token 🟢
**Priority:** LOW  
**Time:** 5 minutes  
**Action:** After migration to Victor-Dixon GitHub is complete

---

## 📋 **Quick Reference**

### Documents Created:
- ✅ `COMPLETE_AUDIT_SUMMARY.md` - Executive summary
- ✅ `SWARM_WEBSITE_SECURITY_AUDIT.md` - Deep audit
- ✅ `FREERIDEINVESTOR_SECURITY_AUDIT.md` - Deep audit
- ✅ `ADMIN_ACCESS_SECURITY_CHECK.md` - Admin access audit
- ✅ `ADMIN_ACCESS_FIXES.md` - Fix instructions
- ✅ `NEXT_STEPS_ACTION_PLAN.md` - Detailed action plan
- ✅ `UPDATED_PRIORITIES.md` - Priority adjustments
- ✅ `EXECUTION_PLAN.md` - This document

### Key Findings:
- 🔴 Swarm Website v1 API endpoints are completely open
- 🔴 Swarm Website old auth function always returns true
- 🟡 FreeRideInvestor SQL query needs prepare()
- 🟡 API keys logged in plain text
- 🟢 Old GitHub token (lower priority - migrating)

---

## ✅ **Execution Checklist**

### Immediate (This Week):
- [ ] Fix Swarm Website v1 API endpoints (remove vulnerable code)
- [ ] Test v1 endpoints are blocked
- [ ] Test v2 endpoints still work
- [ ] Fix FreeRideInvestor SQL query

### Soon (This Month):
- [ ] Mask API keys in logs
- [ ] Mask API key in admin panel
- [ ] Add rate limiting

### Later:
- [ ] Revoke old GitHub token (after migration)

---

## 🎯 **Success Criteria**

✅ All critical vulnerabilities fixed  
✅ Live websites are secure  
✅ No public access to admin functions  
✅ Code follows WordPress best practices  
✅ Ready for production deployment

---

**Status:** ✅ Ready to execute  
**Estimated Time:** ~4 hours for critical fixes, ~6 hours total

*Execution plan created: December 13, 2024*

