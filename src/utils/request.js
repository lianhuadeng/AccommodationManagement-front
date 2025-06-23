//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';

import { useTokenStore } from '@/stores/token.js';
import { ElMessage } from 'element-plus';
import router from '@/router';

const baseURL = '/api';
const instance = axios.create({ baseURL })

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        //请求前的回调函数
        //添加token
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    err => {
        Promise.reject(err);
    }
)

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        return result.data;
    },
    err => {
        //判断响应状态码，如果为401，则未登录，跳转到登录页面
        if (err.response.status === 401) {
            //跳转到登录页面
            tokenStore.removeToken();
            ElMessage.error('请先登录');
            router.push('/login');
            return Promise.reject(err);
        }
        ElMessage.error('服务异常')
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

//添加响应拦截器
// instance.interceptors.response.use(
//     result => {
//         if (result.status === 0) {
//             return result.data;
//         } else {
//             ElNotification({
//                 title: '错误',
//                 message: '服务异常',
//                 type: 'error',
//             });
//             return Promise;
//         }
//     },
//     err => {
//         alert('服务异常');
//         return Promise.reject(err);//异步的状态转化成失败的状态
//     }
// )
export default instance;