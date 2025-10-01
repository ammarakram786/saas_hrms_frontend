<template>
  <div class="layout-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span>&copy; 2024 HRMS SaaS. All rights reserved.</span>
      </div>
      <div class="footer-right">
        <span>Version 1.0.0</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Footer component
</script>

<style scoped>
.layout-footer {
  background-color: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  padding: 1rem 2rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-left,
.footer-right {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

@media screen and (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
