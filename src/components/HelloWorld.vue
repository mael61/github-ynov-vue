<template>
    <div class="container">
        <div class="row">
            <select v-model="projetSelect">
                <option v-for="projet in projets" :value="projet.name"> {{projet.name}}</option>
            </select>
            <datepicker placeholder="Select Date Begin" v-model="dateBegin"    @closed="selectUser()" :format="dateFormat"></datepicker>
            <datepicker placeholder="Select Date End" v-model="dateEnd"   @closed="selectUser()" :format="dateFormat" ></datepicker>
            <div>
                <multiselect v-model="userSelect" :options="users" :multiple="true" :close-on-select="false"
                             :clear-on-select="false" :preserve-search="true" @close="selectUser()"
                             placeholder="Pick some" label="full_name" track-by="full_name" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                                                                                             v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                    </template>
                </multiselect>
            </div>

        </div>
        <div v-if="listeRepos">
            <div class="card" v-for="user in users">
                {{user.owner.login }} || {{user.clone_url }}
            </div>
        </div>
        <div v-if="singleRepos">
            {{userSelect.length}}
            <div class="card" v-for="readme in readmes">
                <div class="card-body">
                    {{readme}}
                </div>
            </div>
            <div class="card" v-for="commit in commits">
                <div class="card-body">
                    <h4 class="card-title"> {{commit.commit.author.name}} </h4>
                    <p class="card-text"> {{commit.commit.message}}.</p>
                    <p> {{commit.commit.author.date}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import Multiselect from 'vue-multiselect'
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import Datepicker from 'vuejs-datepicker'
    import moment from 'moment'
    // register globally

    export default {
        name: 'HelloWorld',
        components: {Multiselect, axios, BootstrapVue,Datepicker,moment},
        data() {
            return {
                dateBegin:"",
                dateEnd:"",
                projetSelect: "",
                info: null,
                userSelect: [],
                projet1: 'github-ynov-vue',
                projets: [{name: 'github-ynov-vue'}],
                test: [],
                users: [],
                usersSelected: [],
                singleProjet: [],
                commits: [],
                nameProjet: '',
                listeRepos: true,
                singleRepos: false,
                value: [],
                readmes: [],
                datesverif:'',


            }
        },
        mounted() {
            axios.get(`https://api.github.com/search/repositories?q=github-ynov-vue`, {
                headers: {
                    "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
                }
            })
                .then(res => {
                    console.log(res)
                    this.users = res.data.items
                })


        },
        methods: {

            dateFormat(date) {
                return moment(date).format('YYYY-MM-D');
            },


            selectUser() {
                var vm = this;
                console.log(vm.userSelect.length)

                vm.readmes = []
                vm.commits = []
                vm.userSelect.forEach((user) => {
                    axios.get(user.url + "/commits", {
                        headers: {
                            "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
                        }
                    })
                        .then(res => {
                            console.log(res)
                            res.data.forEach((commit) => {
                                console.log( this.dateBegin)
                                console.log( this.dateEnd)
                                // console.log( commit.commit.author.date)
                                vm.datesverif = new Date(commit.commit.author.date)
                                console.log(vm.datesverif)
                                if( vm.datesverif >= this.dateBegin && vm.datesverif <= this.dateEnd){
                                    console.log("insert")
                                    vm.commits.push(commit)
                                }

                            })
                            console.log("https://raw.githubusercontent.com/" + user.full_name + "/master/README.md")
                            axios.get("https://raw.githubusercontent.com/" + user.full_name + "/master/README.md", {responseType: 'text/plain'})
                                .then(res => {
                                    console.log(res)
                                    vm.readmes.push(res.data)
                                })
                        })
                })


                // console.log(this.userSelect.url + "/commits");
                this.listeRepos = false;
                this.singleRepos = true;
                if (this.userSelect.length == 0) {
                    this.listeRepos = true;
                }

            }


        }
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
