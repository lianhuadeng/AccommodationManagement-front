import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        showAddFoundDrawer: false, // 控制 <el-drawer> 的显示
    }),
    actions: {
        toggleAddFoundDrawer(status) {
            this.showAddFoundDrawer = status
        },
    },
})