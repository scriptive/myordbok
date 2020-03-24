// import Vue from 'vue';
import axios from 'axios';

// import VueResource from 'vue-resource';
// Vue.use(VueResource);

import SearchEngine from './SearchEngine.vue';
import SpeechEngine from './SpeechEngine.vue';
import NavEngine from './NavEngine.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false

// Vue.directive('click-outside', {
//   bind: function (el, binding, vnode) {
//     el.clickOutsideEvent = function (event) {
//       // here I check that click was outside the el and his childrens
//       if (!(el == event.target || el.contains(event.target))) {
//         // and if it did, call method provided in attribute value
//         vnode.context[binding.expression](event);
//       }
//     };
//     document.body.addEventListener('click', el.clickOutsideEvent)
//   },
//   unbind: function (el) {
//     document.body.removeEventListener('click', el.clickOutsideEvent)
//   },
// });

new Vue({
  el: '#myordbok',
  data: {
    isLoading: false,
    isDone: false,
    showMobileMenu: false,
    activeFontToggle:'',
    api:{
      suggestion:'noitseggus/ipa/',
      speech:'hceeps/ipa/'
    }
  },
  components: {
    SearchEngine, SpeechEngine, NavEngine
  },
  methods: {
    async suggestion(q){
      return await axios.get(this.reverse(this.api.suggestion),{ params:{q:q}}).then(response=>response.data, ()=>new Array());
    },
    reverse(str){
      return str.split("").reverse().join("");
    },
    fontToggle(str){
      // console.log('fontToggle',str)
      // this.activeFontToggle = str;
      if (this.activeFontToggle != str){
        this.activeFontToggle = str;
      } else {
        this.activeFontToggle = '';
      }
    },
    fontActive(str){
      return this.activeFontToggle == str;
    },
    speech(params){
      return this.reverse(this.api.speech)+'?'+Object.keys(params).map(function(key) {
        return [key, params[key]].map(encodeURIComponent).join("=");
      }).join("&");
    }
  },
  watch: {
  },
  // beforeCreate() {
  //   console.log('beforeCreate')
  // },
  // created() {
  //   console.log('created')
  // },
  // beforeMount() {
  //   console.log('beforeMount')
  // },
  // mounted() {
  //   // console.log('mounted')
  // }
});

/*
new Vue({
  // router:router,
  data:{
    ready:false,
    loading:true,
    message:null,
    error:null,
    meta:{album:0,artist:0,genre:0,lang:[]},
    all:{
      // data:[],
      album:[],
      genre:[],
      artist:[],
      lang:[]
    },
    total:{
      track:0,
      album:0,
      artist:0
    },
    suggest:'ab?'
  },

  methods:{
    // async fetchTmp(){
    //   await this.$http.get('/api/track').then(response=>{
    //     this.all.data = response.data;
    //   }, error=>{
    //     this.error = error.statusText;
    //   });
    // },
    metadata(){
      const d = document.head.querySelector("[name~=application-name]").dataset;
      // for (const i of Object.keys(d)) this.meta[i]=d[i].includes(',')?d[i].split(','):parseInt(d[i]);
      for (const i of Object.keys(this.meta)) if (d.hasOwnProperty(i)) this.meta[i]=d[i].includes(',')?d[i].split(','):parseInt(d[i]);
      // await this.$http.get('/api').then(e=>this.meta = e.data, e=>this.error = e.statusText);
    },
    async fetch(uri){
      uri = uri.split("").reverse().join('');
      var id = uri.split('/').slice(-1)[0], k = id.split("").reverse().join('');
      var o = await this.getItem(k);
      if (JSON.stringify(o).length == this.meta[id]) {
        this.all[id] = o;
      } else {
        await this.$http.get(uri).then(response=>{
          this.all[id] = response.data;
        }, error=>{
          this.error = error.statusText;
        });
        await this.setItem(k,this.all[id]);
      }
    },
    async init(){
      // this.metadata();
      // await this.fetch('tsitra/ipa/');
      this.ready = true;
    },
    // async tmpartistSearch(artistName){
    //   var result = this.all.artist.filter(
    //     e=>e.thesaurus.find(
    //       s=> s.toLowerCase() == artistName.toLowerCase()
    //     ) || e.name.toLowerCase() == artistName.toLowerCase() || e.aka && e.aka == artistName || new RegExp(artistName, 'i').test(e.name)
    //   ).sort((a, b) => (a.plays < b.plays) ? 1 : -1);
    //   // console.log(this.all.artist[2]);

    //   result.forEach(e=>console.log(e.name));
    // },
    // async tmpartistName(artistName){
    //   var index = this.all.artist.findIndex(
    //     e=>e.thesaurus.find(
    //       s=> s.toLowerCase() == artistName.toLowerCase()
    //     ) || e.name.toLowerCase() == artistName.toLowerCase() || e.aka && e.aka == artistName
    //   );
    //   console.log(artistName,index)
    // },
    // async tmpAlbumList(langs){
    //   this.all.album.filter(
    //     album=>langs?album.lg == langs: true
    //   ).slice(0, 5).forEach(function(album,i){
    //     console.log(i,album.ab,album.tp)
    //   })
    // },
    // async getItem(k){
    //   return await JSON.parse(localStorage.getItem(k));
    // },
    // async setItem(k,v){
    //   localStorage.setItem(k, JSON.stringify(v));
    // }
  },
  watch: {
    // call again the method if the route changes
    // '$route': 'fetchTmp'

    suggest: function (value) {
        console.log(value);
    }

  },
  // async created() {
  //   await this.fetch('tsitra/ipa/');
  //   await this.fetch('erneg/ipa/');
  //   await this.fetch('mubla/ipa');
  //   await this.init();
  //   await this.tmpArtistSearch('zam');
  //   await this.tmpArtistName('jk kam');
  //   await this.tmpAlbumList();
  // },
  // beforeCreate() {},
  // created() {},
  // beforeMount() {},
  // mounted () {
  //   console.log(this.suggest)
  // },
  // render: h => h(main),
}).$mount('#abc');
*/