<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Modern HR Management
            <span class="text-primary-500">Made Simple</span>
          </h1>
          <p class="hero-description">
            Streamline your human resources with our comprehensive HRMS solution. 
            Manage employees, track attendance, process payroll, and more with ease.
          </p>
          <div class="hero-actions">
            <Button 
              label="Get Started" 
              icon="pi pi-arrow-right" 
              size="large"
              @click="navigateTo('/login')"
            />
            <Button 
              label="Learn More" 
              icon="pi pi-play" 
              class="p-button-outlined"
              size="large"
              @click="scrollToFeatures"
            />
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-card">
            <i class="pi pi-users text-6xl text-primary-500 mb-4"></i>
            <h3>HRMS Dashboard</h3>
            <p>Complete HR management at your fingertips</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="text-center mb-8">
          <h2 class="section-title">Powerful Features</h2>
          <p class="section-description">
            Everything you need to manage your workforce effectively
          </p>
        </div>
        
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3">
            <PCard class="feature-card">
              <template #content>
                <div class="text-center">
                  <i class="pi pi-users text-4xl text-primary-500 mb-3"></i>
                  <h4 class="feature-title">Employee Management</h4>
                  <p class="feature-description">
                    Complete employee lifecycle management with detailed profiles and organizational structure.
                  </p>
                </div>
              </template>
            </PCard>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <PCard class="feature-card">
              <template #content>
                <div class="text-center">
                  <i class="pi pi-clock text-4xl text-green-500 mb-3"></i>
                  <h4 class="feature-title">Attendance Tracking</h4>
                  <p class="feature-description">
                    Real-time attendance monitoring with clock in/out functionality and detailed reports.
                  </p>
                </div>
              </template>
            </PCard>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <PCard class="feature-card">
              <template #content>
                <div class="text-center">
                  <i class="pi pi-calendar text-4xl text-orange-500 mb-3"></i>
                  <h4 class="feature-title">Leave Management</h4>
                  <p class="feature-description">
                    Streamlined leave request and approval process with automated workflows.
                  </p>
                </div>
              </template>
            </PCard>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <PCard class="feature-card">
              <template #content>
                <div class="text-center">
                  <i class="pi pi-wallet text-4xl text-purple-500 mb-3"></i>
                  <h4 class="feature-title">Payroll Processing</h4>
                  <p class="feature-description">
                    Automated payroll calculations with tax deductions and payslip generation.
                  </p>
                </div>
              </template>
            </PCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <div class="grid align-items-center">
          <div class="col-12 lg:col-6">
            <h2 class="section-title">Why Choose Our HRMS?</h2>
            <p class="section-description">
              Our comprehensive solution helps you manage your workforce efficiently 
              while reducing administrative overhead and improving employee satisfaction.
            </p>
            
            <div class="benefits-list">
              <div class="benefit-item">
                <i class="pi pi-check-circle text-green-500 mr-3"></i>
                <span>Reduced Administrative Work</span>
              </div>
              <div class="benefit-item">
                <i class="pi pi-check-circle text-green-500 mr-3"></i>
                <span>Improved Data Accuracy</span>
              </div>
              <div class="benefit-item">
                <i class="pi pi-check-circle text-green-500 mr-3"></i>
                <span>Enhanced Employee Experience</span>
              </div>
              <div class="benefit-item">
                <i class="pi pi-check-circle text-green-500 mr-3"></i>
                <span>Real-time Analytics & Reporting</span>
              </div>
              <div class="benefit-item">
                <i class="pi pi-check-circle text-green-500 mr-3"></i>
                <span>Secure & Compliant</span>
              </div>
            </div>
          </div>
          
          <div class="col-12 lg:col-6">
            <div class="benefits-image">
              <div class="benefits-card">
                <PChart type="doughnut" :data="benefitsChartData" :options="benefitsChartOptions" style="height: 300px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="text-center">
          <h2 class="cta-title">Ready to Transform Your HR?</h2>
          <p class="cta-description">
            Join thousands of companies already using our HRMS solution
          </p>
          <div class="cta-actions">
            <Button 
              label="Start Free Trial" 
              icon="pi pi-rocket" 
              size="large"
              @click="navigateTo('/login')"
            />
            <Button 
              label="Contact Sales" 
              icon="pi pi-phone" 
              class="p-button-outlined"
              size="large"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="grid">
          <div class="col-12 md:col-4">
            <div class="footer-brand">
              <h3 class="footer-title">HRMS</h3>
              <p class="footer-description">
                Modern human resource management system for the digital age.
              </p>
            </div>
          </div>
          
          <div class="col-12 md:col-2">
            <h4 class="footer-heading">Product</h4>
            <ul class="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#demo">Demo</a></li>
            </ul>
          </div>
          
          <div class="col-12 md:col-2">
            <h4 class="footer-heading">Company</h4>
            <ul class="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="col-12 md:col-2">
            <h4 class="footer-heading">Support</h4>
            <ul class="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#status">Status</a></li>
            </ul>
          </div>
          
          <div class="col-12 md:col-2">
            <h4 class="footer-heading">Legal</h4>
            <ul class="footer-links">
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="flex justify-content-between align-items-center">
            <p class="footer-copyright">
              © 2024 HRMS. All rights reserved.
            </p>
            <div class="footer-social">
              <Button icon="pi pi-twitter" class="p-button-text p-button-sm" />
              <Button icon="pi pi-linkedin" class="p-button-text p-button-sm" />
              <Button icon="pi pi-github" class="p-button-text p-button-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: 'default'
})

// Redirect authenticated users to appropriate dashboard
const authStore = useAuthStore()

// Chart data for benefits section
const benefitsChartData = computed(() => ({
  labels: ['Time Saved', 'Accuracy', 'Satisfaction', 'Efficiency'],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ]
    }
  ]
}))

const benefitsChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    // Redirect authenticated users to dashboard
    navigateTo('/dashboard')
  } else {
    // Redirect unauthenticated users to login
    navigateTo('/auth/login')
  }
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-card h3 {
  color: white;
  margin-bottom: 1rem;
}

.hero-card p {
  color: rgba(255, 255, 255, 0.8);
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background: var(--surface-50);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-color-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.feature-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.feature-description {
  color: var(--text-color-secondary);
  line-height: 1.6;
}

/* Benefits Section */
.benefits-section {
  padding: 4rem 0;
  background: white;
}

.benefits-list {
  margin-top: 2rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.benefits-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.benefits-card {
  background: var(--surface-50);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

/* CTA Section */
.cta-section {
  background: var(--primary-color);
  color: white;
  padding: 4rem 0;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Footer */
.footer {
  background: var(--surface-900);
  color: var(--text-color);
  padding: 3rem 0 1rem;
}

.footer-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-description {
  color: var(--text-color-secondary);
  line-height: 1.6;
}

.footer-heading {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid var(--surface-700);
  margin-top: 2rem;
  padding-top: 2rem;
}

.footer-copyright {
  color: var(--text-color-secondary);
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
