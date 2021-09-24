import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () =>
    import ('../views/login/Login')
const Home = () =>
    import ('../views/home/Home')
const Users = () =>
    import ('../views/users/Users')
const Welcome = () =>
    import ('../views/Welcome')

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
        ]
    }
]
const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // console.log(to, from, next);
    if (to.path === '/login') return next()
    const token = sessionStorage.getItem('token');
    if (!token) next('/login')
    next()
})


export default router;