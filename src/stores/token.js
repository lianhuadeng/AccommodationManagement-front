import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore('token', () => {

    // 定义响应式变量
    const token = ref(localStorage.getItem('token') || ''); // 初始化时从 localStorage 获取

    // 定义方法，修改 token 值
    const setToken = (newToken) => {
        token.value = newToken;
        localStorage.setItem('token', newToken); // 保存到 localStorage
    }

    // 移除 token 值
    const removeToken = () => {
        token.value = '';
        localStorage.removeItem('token'); // 从 localStorage 移除
    }

    // 返回响应式变量和方法
    return {
        token,
        setToken,
        removeToken
    }
});
