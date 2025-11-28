import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import IssuesList from './components/IssuesList.vue'
import CreateIssue from './components/CreateIssue.vue'
import './style.css'

const routes = [
  { path: '/', component: IssuesList },
  { path: '/create', component: CreateIssue },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')



