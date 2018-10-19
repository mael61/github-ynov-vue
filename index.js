
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
      test:[{
      name:"zaeqsfm,qlmsfkq"
      }],
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
      vm = this;
      // console.log(this.userSelect.url+"/commits");
        this.listeRepos = false;
        this.singleRepos = true;

        console.log("test ultime" +vm.test)
        fetch(this.userSelect.url+"/commits",{
            headers: {
                "Authorization": "Basic bWFlbDYxOmE3dzFzNWU5YzM="
            },
            method: "GET"
        })
            // .then(response => console.log(response.json()))

            // .then((data)=>console.log(data))
            .then((data) =>   {
              console.log(vm.test)
                vm.test = data
                console.log(data)
            })
            .catch((err)=>console.error(err))

        console.log(vm.test);
    }
}


});

