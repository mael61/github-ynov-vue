
var app = new Vue({

  el: '#app',

  data: {
    info: null,
      userSelect:'',
      projetSelect:'',
      projets:[
          {
            name:"github-ynov-vue"
          }
      ],
    users:[],
    singleProjet:[],
      commits:[],
    nameProjet:'',
    listeRepos: true,
    singleRepos: false,
  },

  mounted () {

      fetch("https://api.github.com/search/repositories?q=github-ynov-vue",{
          headers: {
              "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
          },
          method: "GET"
      })
          .then(response =>response.json())
          .then((data) => {
              this.users = data.items

          })


  },
methods:{
    selectUser() {
        this.commits = []
        console.log(this.userSelect.url + "/commits");
        this.listeRepos = false;
        this.singleRepos = true;

        fetch(this.userSelect.url + "/commits", {
            headers: {
                "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
            },
            method: "GET"
        })
            .then(response => response.json())

            .then((data) => {

                data.forEach((proj) => {
                    this.commits.push(proj)
                })
            })

        fetch(this.userSelect.url + "/master/README.md", {
            headers: {
                "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
            },
            method: "GET"
        })

    }


}



});

