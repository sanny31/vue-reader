import Vue from 'vue'
import Router from 'vue-router'
import notfound from '@/components/NotFound'
import home from '@/components/Home'
import books from '@/components/Books'
import reader from '@/components/Reader'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index.html',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'home',
      component: home
    },
    {
      path: '/books',
      name: 'books',
      component: books
    },
    {
      path: '/reader',
      name: 'reader',
      component: reader
    },
    {
      path: '*',
      name: 'notfound',
      component: notfound
    }
  ]
})
export default router
