# Authentication Usage Guide

## 🏆 Recommended Approach: Hybrid (Middleware + Composables)

### **1. Global Middleware (Route Protection)**
- **File**: `middleware/auth.global.ts`
- **Purpose**: Protects all routes except auth pages
- **When**: Runs before page rendering
- **Best for**: Route protection, preventing unauthorized access

### **2. Composables (Component Logic)**
- **File**: `composables/useAuth.ts`
- **Purpose**: Access auth data and actions in components
- **When**: Runs after component mount
- **Best for**: Conditional rendering, user data display

## 📋 Usage Examples

### **Basic Auth Data Access**
```vue
<script setup>
const { user, isAuthenticated, logout } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    <h1>Welcome, {{ user?.first_name }}!</h1>
    <button @click="logout">Logout</button>
  </div>
</template>
```

### **Conditional Rendering**
```vue
<script setup>
const { showIfAuthenticated, showIfHasPermission } = useAuthConditional()
</script>

<template>
  <div v-if="showIfAuthenticated">
    <h1>Dashboard</h1>
    <div v-if="showIfHasPermission('admin')">
      <AdminPanel />
    </div>
  </div>
</template>
```

### **Manual Auth Checks**
```vue
<script setup>
const { requireAuth, requireGuest } = useAuthGuard()

// In a method
const handleSensitiveAction = () => {
  requireAuth() // Redirects to login if not authenticated
  // Proceed with action
}
</script>
```

### **Permission-Based Rendering**
```vue
<script setup>
const { hasPermission, hasRole } = useAuth()
</script>

<template>
  <div>
    <button v-if="hasPermission('create_user')">Create User</button>
    <AdminPanel v-if="hasRole('admin')" />
  </div>
</template>
```

## 🎯 When to Use What

| Use Case | Approach | Example |
|----------|----------|---------|
| Route Protection | Global Middleware | `middleware/auth.global.ts` |
| User Data Display | `useAuth()` | `const { user, userFullName } = useAuth()` |
| Conditional Rendering | `useAuthConditional()` | `v-if="showIfAuthenticated"` |
| Permission Checks | `useAuth()` | `hasPermission('admin')` |
| Manual Redirects | `useAuthGuard()` | `requireAuth()` |

## ✅ Benefits

- **No Flash Issues**: Middleware runs before rendering
- **Clean Code**: Separation of concerns
- **Reusable**: Composables work everywhere
- **Type Safe**: Full TypeScript support
- **Performance**: Middleware is faster than component checks
- **Maintainable**: Single source of truth for auth logic
