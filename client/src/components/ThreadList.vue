<template>
<div class="container" style="border:1px solid grey">
    <thread-tumb v-for="(thread,index) in allThreads" :key="index" :thread="thread" ></thread-tumb>
</div>
</template>

<script>
import config from '@/assets/config.js'
import ThreadTumb from '@/components/ThreadTumb.vue'

const { host } = config

export default {
    name: 'ThreadList',
    components: {
        ThreadTumb
    },
    props: [],
    created(){
        this.getAllThreads()
    },
    data() {
        return {
           allThreads: []
        }
    },
    methods: {
        getAllThreads(){
            axios({
                method: 'GET',
                url: `${host}/threads`
            })
            .then((result) => {
                console.log(result.data);
                this.allThreads = result.data
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style>
    p {
        text-align: right;
    }
</style>
