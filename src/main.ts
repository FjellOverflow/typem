import '@/assets/style.css'

import App from '@/App.vue'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import router from '@/plugins/router'
import i18n from '@/plugins/i18n'
import { checkIfInstallable } from '@/plugins/pwaInstall'

const app = createApp(App)

app.use(DataLoaderPlugin, { router })
app.use(router)
app.use(i18n)

app.mount('#app')

checkIfInstallable()
