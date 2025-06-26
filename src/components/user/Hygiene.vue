<script setup>

import {useRoute} from "vue-router";
import {ref} from "vue";
import {getHygiene, getUserInfo} from "@/api/user.js";

const route = useRoute()
const stu = ref(
    {

    }
)
const checkResult = ref();

getUserInfo().then(res=>{
  stu.value = res.data
})
getHygiene(stu.value.room).then(res=>{
  checkResult.value = res.data.records
})


</script>

<template>



</template>

<style scoped lang="scss">

</style>