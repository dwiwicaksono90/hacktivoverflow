<template>
    <div class="container">
        <div style="border: 1px solid grey; padding: 50px;">
            <div class="float-md-right small text-muted">{{time.slice(0, 10)}}</div>
            <h2>{{title}}</h2>
            <h5>by. {{author}}</h5>
            <div>share:
                <h5>
                    <a class="twitter-share-button fab fa-twitter fa-stack-1x" :href="'https://twitter.com/intent/tweet?text=Please help us to answer this problem... http:localhost:3000/threads/' + threadId  "
                        data-size="large"></a>
                </h5> <br>
            </div>
            <div v-html="question" class="text" ></div>
            <br><br>
            <!-- button edit/delete -->
            <div v-if="user && authorId === user.id">
                <button class="btn btn-primary" data-toggle="modal" data-target="#modal-edit" @click="getThread(threadId)">Edit</button>
                <button class="btn btn-primary" @click="deleteThread">Hapus</button>
                
                <!-- modal Edit article -->
                <div id="modal-edit" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content" style="padding: 5% 10%;">

                            <!-- form  -->
                            <div class="form-group">
                                <label for="exampleInputEmail1">Title</label>
                                <input type="text" class="form-control" id="exampleInputEmsacasail1" aria-describedby="emailHelp"
                                    placeholder="Judul" v-model="editTitle">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Tags</label>
                                <input type="text" class="form-control" id="exampleInputEm" aria-describedby="emailHelp"
                                    placeholder="tags" v-model="editTags">
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Question Detail</label>
                                <wysiwyg v-model='editQuestion'/>
                                <!-- <textarea class="form-control" id="exampleFormControlsacTextarea1" rows="20" v-html="editQuestion"></textarea> -->
                            </div>
                            <button class="btn btn-primary" data-dismiss="modal" @click="editThread">Submit</button>

                            <!--  -->
                        </div>
                    </div>
                </div>
                <!-- akhir modal -->
                
            </div>
            <div v-if="user && authorId !== user.id" >
                up: {{ upVotes.length }}
                <button class="btn btn-primary" @click="upThread">UpVote </button>
                down: {{ downVotes.length }}
                <button class="btn btn-primary" @click="downThread">DownVote </button>
            </div>
        </div>

        <div style="border: 1px solid grey; padding: 30px;">
            <h3 class="mb-2">Answer</h3>
            <AddComment v-if="user" :threadId="threadId" @get-thread="getThread(threadId)"></AddComment>
            <AnswerThumb :user="user" v-for="(answer, index) in answers" :key="index" :answer="answer" @get-thread="getThread(threadId)" ></AnswerThumb>
        </div>

    </div>
</template>
<script>
    import config from '@/assets/config.js'
    import {
        mapActions,
        mapState
    } from 'vuex'
    import AnswerThumb from '@/components/AnswerThumb.vue'
    import AddComment from '@/components/AddComment.vue'

    const {
        host
    } = config

    export default {
        name: 'ThreadDetail',
        props: [],
        components: {
            AnswerThumb,
            AddComment
        },
        data() {
            return {
                title: '',
                author: '',
                question: '',
                upVotes: '',
                downVotes: '',
                time: '',
                threadId: '',
                authorId: '',
                editTitle: '',
                editQuestion: '',
                editTags: '',
                answers: []
            }
        },
        methods: {
            getThread(id) {
                axios({
                        method: 'GET',
                        url: `${host}/threads/${id}`
                    })
                    .then((result) => {
                        console.log(result.data);
                        this.threadId = result.data._id
                        this.title = result.data.title
                        this.question = result.data.question
                        this.author = result.data.author.name
                        this.upVotes = result.data.upVotes
                        this.downVotes = result.data.downVotes
                        this.authorId = result.data.author._id
                        this.time = result.data.createdAt
                        this.editQuestion = result.data.question
                        this.editTitle = result.data.title
                        this.answers = result.data.answers
                        this.getStatusVote()
                    }).catch((err) => {
                        console.log(err);
                    });
            },
            getStatusVote(){

            },
            editThread() {
                axios({
                        method: 'PUT',
                        url: `${host}/threads/${this.threadId}`,
                        headers: {
                            token: localStorage.getItem('tokenHO')
                        },
                        data: {
                            title: this.editTitle,
                            text: this.editQuestion
                        }
                    })
                    .then((result) => {
                        this.getThread(this.threadId)
                        // this.$emit('get-all-articles')
                    }).catch((err) => {
                        console.log(err);
                    });
            },
            deleteThread() {
                axios({
                        method: 'DELETE',
                        url: `${host}/threads/${this.threadId}`,
                        headers: {
                            token: localStorage.getItem('tokenHO')
                        }
                    })
                    .then((result) => {
                        console.log('hapus sukses', result);
                        // this.$emit('get-all-articles')
                        this.$router.push({
                            path: '/'
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
            },
            upThread(){
                axios({
                    method: 'POST',
                    url: `${host}/threads/upvote/${this.threadId}`,
                    headers: {
                        token: localStorage.getItem('tokenHO')
                    }
                })
                .then((result) => {
                    console.log(result);
                    this.getThread(this.$route.params.id)
                }).catch((err) => {
                    console.log(err.response);
                });
            },
            downThread(){
                axios({
                    method: 'POST',
                    url: `${host}/threads/downvote/${this.threadId}`,
                    headers: {
                        token: localStorage.getItem('tokenHO')
                    }
                })
                .then((result) => {
                    console.log(result);
                    this.getThread(this.$route.params.id)
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        created() {
            this.getThread(this.$route.params.id)

        },
        computed: {
            ...mapState(['user']),
            getParamsId: function () {
                return this.$route.params.id
            }
        },
        watch: {
            getParamsId: function (val) {
                this.getThread(val)
            }
        }
    }
</script>
<style>
    img {
        max-width: 80%;
    }
    .text{
        background-color: #b3ecec;
    }
</style>