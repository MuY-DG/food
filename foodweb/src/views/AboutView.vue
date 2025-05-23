<template>
  <div class="about-page">
    <div class="about-container">
      <section class="about-header">
        <h1>关于美食推荐平台</h1>
        <div class="divider"></div>
      </section>

      <section class="about-content">
        <h2>我们的使命</h2>
        <p>
          美食推荐平台致力于为广大美食爱好者提供优质的菜品分享和烹饪技巧交流平台。我们相信美食不仅仅是满足味蕾的享受，更是文化交流的桥梁和生活情趣的体现。
        </p>

        <h2>平台特色</h2>
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🌟</div>
            <h3>精选推荐</h3>
            <p>严选高品质菜品，让您的烹饪之旅充满惊喜。</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">🍲</div>
            <h3>多元分类</h3>
            <p>覆盖各地美食，从家常小菜到异国料理，应有尽有。</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">📝</div>
            <h3>详细教程</h3>
            <p>图文并茂的操作步骤，让复杂的烹饪过程变得简单易懂。</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">👨‍🍳</div>
            <h3>专业指导</h3>
            <p>来自资深厨师的专业建议，提升您的烹饪技巧。</p>
          </div>
        </div>

        <h2>联系我们</h2>
        <p>我们非常重视您的反馈和建议。如果您对平台有任何意见或建议，请通过以下方式联系我们：</p>
        <ul class="contact-list">
          <li><strong>邮箱：</strong> contact@foodrecommend.com</li>
          <li><strong>电话：</strong> 123-456-7890</li>
          <li><strong>地址：</strong> 中国北京市朝阳区美食街100号</li>
        </ul>

        <div class="join-us">
          <h2>加入我们</h2>
          <p>如果您热爱美食，擅长烹饪，欢迎加入我们的平台，分享您的独特食谱和烹饪技巧。</p>
          <router-link to="/register" class="join-button">立即注册</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 0;
  background-color: var(--background-color);
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h1 {
  font-size: 2.5rem;
  color: var(--heading-color);
  margin-bottom: 1rem;
}

.divider {
  height: 3px;
  width: 80px;
  background: linear-gradient(to right, var(--primary-color), #42b983);
  margin: 0 auto;
}

.about-content h2 {
  font-size: 1.8rem;
  color: var(--heading-color);
  margin: 2rem 0 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.about-content h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

.about-content p {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: var(--text-color);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.feature-item {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px var(--shadow-color);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.3rem;
  color: var(--heading-color);
  margin-bottom: 0.8rem;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.contact-list li {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
}

.contact-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.join-us {
  background-color: var(--background-soft);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  margin: 3rem 0;
}

.join-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.join-button:hover {
  background-color: #33a06f;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>
