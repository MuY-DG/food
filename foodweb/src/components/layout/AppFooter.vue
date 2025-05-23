<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>美食推荐</h3>
          <p>分享美食，传递快乐</p>
        </div>

        <div class="footer-section links">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>联系我们</h3>
          <p>邮箱: contact@foodrecommend.com</p>
          <p>电话: 123-456-7890</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 美食推荐平台. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--background-soft);
  color: var(--text-color);
  padding: 2rem 0 1rem;
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--heading-color);
  position: relative;
}

.footer-section h3::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background-color: var(--primary-color);
  margin-top: 0.5rem;
}

.links ul {
  list-style: none;
  padding: 0;
}

.links li {
  margin-bottom: 0.5rem;
}

.links a {
  color: var(--text-color);
  transition: color 0.3s;
}

.links a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.9rem;
  color: var(--text-color-light);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-section {
    min-width: 100%;
  }
}
</style>
