<script setup lang="ts">
import Hero from '@for-the-people-initiative/design-system/components/Hero/Hero.vue'
import Section from '@for-the-people-initiative/design-system/components/Section/Section.vue'
import Card from '@for-the-people-initiative/design-system/components/Card/Card.vue'
import Tag from '@for-the-people-initiative/design-system/components/Tag/Tag.vue'
import Button from '@for-the-people-initiative/design-system/components/Button/Button.vue'
import Footer from '@for-the-people-initiative/design-system/components/Footer/Footer.vue'

useHead({
  script: [
    {
      src: '/widget.js',
      type: 'text/javascript',
      'data-app-id': 'app_mhj_default',
      'data-api-url': 'https://ftp-feedback-api.onrender.com',
      'data-position': 'bottom-right',
      'data-theme': 'light',
      'data-categories': 'bug,suggestion,question',
    },
  ],
})

const dark = ref(false)

function openWidget() {
  document.querySelector('ftp-feedback')?.open()
}

function closeWidget() {
  document.querySelector('ftp-feedback')?.close()
}

function toggleTheme() {
  dark.value = !dark.value
  const el = document.querySelector('ftp-feedback') as any
  if (el) {
    el.setAttribute('theme', dark.value ? 'dark' : 'light')
    el.configure({ theme: dark.value ? 'dark' : 'light' })
  }
}

const scriptTagCode = `<script src="https://ftp-feedback-demo.netlify.app/widget.js"
        data-app-id="app_mhj_default"
        data-position="bottom-right"
        data-theme="light"
        data-categories="bug,suggestion,question"><\/script>`

const npmInstallCode = `npm install @ftp-feedback/widget`

const npmUsageCode = `import { FTPFeedback } from '@ftp-feedback/widget';

FTPFeedback.init({
  appId: 'app_mhj_default',
  position: 'bottom-right',
  theme: 'light',
  categories: ['bug', 'suggestion', 'question'],
  user: { id: 'user123', email: 'user@example.com' },
  onSubmit: (data) => console.log('Submitted:', data),
});

// Programmatic control
FTPFeedback.open();
FTPFeedback.close();`

const configCode = `Attribute        │ Default        │ Options
─────────────────┼────────────────┼──────────────────────
data-app-id      │ (required)     │ Your app ID
data-api-url     │ API default    │ Custom API endpoint
data-position    │ bottom-right   │ bottom-left, top-right, top-left
data-theme       │ light          │ dark, auto
data-categories  │ bug,suggestion │ Comma-separated list
data-user-id     │ —              │ Pre-fill user ID
data-user-email  │ —              │ Pre-fill user email`

const themingCode = `/* Add to your CSS — overrides the widget's defaults */
ftp-feedback {
  --ftp-primary: #e11d48;        /* Your brand color */
  --ftp-primary-hover: #f43f5e;  /* Hover state */
  --ftp-radius: 20px;            /* Rounder corners */
  --ftp-bg: #fafafa;             /* Background */
}`

const themingTokensCode = `Token               │ Default (light)  │ What it controls
────────────────────┼──────────────────┼──────────────────────
--ftp-primary       │ #f97316          │ Buttons, header, accents
--ftp-primary-hover │ #fb923c          │ Hover states
--ftp-bg            │ #ffffff          │ Widget background
--ftp-bg-secondary  │ #f5f5f5          │ Summary/code backgrounds
--ftp-text          │ #0a0e1f          │ Primary text
--ftp-text-secondary│ #7680a9          │ Subtitles, placeholders
--ftp-border        │ #e5e7eb          │ Borders, dividers
--ftp-radius        │ 13px             │ Widget border radius
--ftp-shadow        │ (elevation)      │ Widget drop shadow
--ftp-success       │ #22c55e          │ Submit button, success state
--ftp-error         │ #ef4444          │ Error messages`

const footerSocialLinks = [
  { icon: 'pi pi-github', href: 'https://github.com/for-the-people-initiative/ftp-feedback', label: 'GitHub' },
]
</script>

<template>
  <div>
    <Hero
      title="🗣️ FTP Feedback"
      subtitle="A universal, embeddable feedback widget. Add user feedback to any site in 2 minutes."
      alignment="center"
    />

    <Section variant="default" padding="lg">
      <!-- Method 1: Script Tag -->
      <Card>
        <template #title>
          <Tag color="info">Script Tag</Tag>
          Method 1: Script Tag (Easiest)
        </template>
        <template #subtitle>
          Just add one script tag. That's it. The widget appears automatically.
        </template>
        <template #content>
          <pre><code>{{ scriptTagCode }}</code></pre>
          <div style="margin-top: 12px;">
            <Tag color="success">
              <span class="live-dot" /> Widget is live on this page → click the button in the bottom-right!
            </Tag>
          </div>
        </template>
      </Card>

      <!-- Method 2: npm -->
      <Card style="margin-top: var(--space-l, 26px);">
        <template #title>
          <Tag color="success">ESM / npm</Tag>
          Method 2: npm Package
        </template>
        <template #subtitle>
          Install and use programmatically for full control.
        </template>
        <template #content>
          <pre><code>{{ npmInstallCode }}</code></pre>
          <pre style="margin-top: 12px;"><code>{{ npmUsageCode }}</code></pre>
        </template>
      </Card>

      <!-- Try It -->
      <Card style="margin-top: var(--space-l, 26px);">
        <template #title>🎮 Try It</template>
        <template #subtitle>Use these buttons to control the widget programmatically:</template>
        <template #content>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <Button label="Open Widget" variant="primary" @click="openWidget" />
            <Button label="Close Widget" variant="outlined" @click="closeWidget" />
            <Button label="Toggle Theme" variant="outlined" @click="toggleTheme" />
          </div>
        </template>
      </Card>

      <!-- Configuration -->
      <Card style="margin-top: var(--space-l, 26px);">
        <template #title>⚙️ Configuration</template>
        <template #content>
          <pre><code>{{ configCode }}</code></pre>
        </template>
      </Card>

      <!-- Theming -->
      <Card style="margin-top: var(--space-l, 26px);">
        <template #title>🎨 Custom Theming</template>
        <template #subtitle>
          Override CSS custom properties to match your brand. Variables pierce the Shadow DOM automatically.
        </template>
        <template #content>
          <pre><code>{{ themingCode }}</code></pre>
          <pre style="margin-top: 12px;"><code>{{ themingTokensCode }}</code></pre>
        </template>
      </Card>
    </Section>

    <Footer
      copyright="Built by For The People Initiative"
      :socialLinks="footerSocialLinks"
    />
  </div>
</template>

<style scoped>
pre {
  background: var(--surface-muted, #060813);
  color: var(--text-secondary, #9ea5c2);
  padding: var(--space-l, 26px);
  border-radius: var(--radius-rounded, 8px);
  border: 1px solid var(--border-subtle, #1a2244);
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

code {
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}

.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--feedback-success, #22c55e);
  border-radius: var(--radius-pill, 9999px);
  margin-right: var(--space-2xs, 4px);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
