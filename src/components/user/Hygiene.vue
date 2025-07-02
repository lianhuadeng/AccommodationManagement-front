<script setup>
//TODO - Implement
//TODO 楼栋分配宿管
import {ref} from "vue";
import {getHygiene} from "@/api/user.js";
const query = ref({
  pageNum:'1',
  pageSize:'10',
  total:0
})

const checkResult = ref([]);

getHygiene().then(res=>{
  checkResult.value = res.data
})


</script>

<template>


</template>

<style scoped lang="scss">

</style>