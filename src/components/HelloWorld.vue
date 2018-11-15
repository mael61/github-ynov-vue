<template>
    <div class="container">
        <nav class="navbar navbar-light navbar-expand-md bg-light justify-content-center">
        <div class="row" >
            <div  class="col-sm" >
                <select v-model="projetSelect" class="form-control">
                    <option v-for="projet in projets" :value="projet.name"> {{projet.name}}</option>
                </select>
            </div>
            <div  class="col-sm">
            <datepicker placeholder="Select Date Begin" v-model="dateBegin" @closed="constuitRepertoire()"
                        :format="dateFormat"></datepicker>
            </div>
            <div  class="col-sm">
                <datepicker placeholder="Select Date End" v-model="dateEnd" @closed="constuitRepertoire()"
                            :format="dateFormat"></datepicker>
            </div>

            <div  class="col-sm">
                <multiselect v-model="reposSelect" :options="repos" :multiple="true" :close-on-select="false"
                             :clear-on-select="false" :preserve-search="true" @close="constuitRepertoire()"
                             placeholder="Pick some" label="full_name" track-by="full_name" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
                    </template>
                </multiselect>
            </div>

        </div>
        </nav>


        <div v-if="listeRepos">

            <div class="card" v-for="repo in repos">
                <h5 class="card-title"> {{repo.owner.login }}</h5>
                <h6 class="card-subtitle mb-2 text-muted"> <a :href="repo.clone_url ">{{repo.clone_url }}</a> </h6>

            </div>
        </div>
        <div class="card" v-for="repo in allRepertoire" v-if="singleRepos">
            <div class="bg-light text-dark">
            <h5 class="card-title">{{repo.description[0].full_name}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Readme</h6>
            <h6  class="card-subtitle mb-2 text-muted"><code>{{repo.readme}}</code></h6>
            </div>
            <div class="card" v-for="commit in repo.commits">

                {{commit.commit.committer.date}}
                <p>{{commit.commit.message}}</p>
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
        components: {Multiselect, axios, BootstrapVue, Datepicker, moment},
        data() {
            return {
                dateBegin: "select date begin",
                dateEnd: "select date end",
                projetSelect: "",
                info: null,
                reposSelect: [],
                projetSelect: 'github-ynov-vue',
                projets: [{name: 'github-ynov-vue'}],
                test: [],
                repos: [],
                usersSelected: [],
                singleProjet: [],
                commits: [],
                repoSelectCommit: [],
                nameProjet: '',
                listeRepos: true,
                singleRepos: false,
                value: [],
                tempReadme: "",
                readmes: [],
                datesverif: '',
                projetSelected: [],
                allRepertoire: [],
            }
        },
        beforeMount() {
            this.getRepertoire();
        },
        mounted() {
        },
        methods: {
            getRepertoire() {
                axios.get(`https://api.github.com/search/repositories?q=github-ynov-vue`, {
                    headers: {
                        "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
                    }
                })
                    .then(res => {
                        this.repos = res.data.items
                    })
            },
            dateFormat(date) {
                return moment(date).format('YYYY-MM-D');
            },
            constuitRepertoire() {
                this.allRepertoire = []
                this.reposSelect.forEach(repertoire => {

                    let monRepertoire = {
                        description: [],
                        commits: [],
                        readme: ''
                    }

                    axios.get("https://raw.githubusercontent.com/" + repertoire.full_name + "/master/README.md", {responseType: 'text/plain'})
                        .then(res => {
                            // console.log(res)
                            // vm.projetSelected.readmes.push(res.data)
                            monRepertoire.readme = res.data;
                        })
                    monRepertoire.description.push(repertoire)

                    axios.get(repertoire.url + "/commits", {
                        headers: {
                            "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
                        }
                    })
                        .then(res => {
                            res.data.forEach(commit => {
                                this.datesverif = new Date(commit.commit.author.date)
                                if (this.datesverif >= this.dateBegin && this.datesverif <= this.dateEnd) {
                                    monRepertoire.commits.push(commit)
                                    console.log(monRepertoire)
                                }

                            })
                        })
                    this.allRepertoire.push(monRepertoire)

                })
                this.listeRepos = false;
                this.singleRepos = true;
                if (this.reposSelect.length == 0) {
                    this.listeRepos = true;
                }
            },
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
