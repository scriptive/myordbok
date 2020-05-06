<template>
  <div>
    <div class="name navMobile"></div>
    <div @click = 'navToggle' v-bind:class = "{'active': show}" class="toggle panel icon-panel"></div>
  </div>
</template>
<script>
export default {
  name: 'NavEngine',
  data: () => ({
    show:false
  }),
  methods:{
    navToggle(){
      this.show = !this.show;
      this.$parent.querySelector('li.showMobileMenu').classList.toggle('active');
    }
    // handler(rec) {
    //   console.log('handler',rec)
    // }
  },
  // computed:{
  //   abc(){
  //     return this.$parent.showMobileMenu;
  //   }
  // },
  // created() {
  //   Events.on('trainingAddded', this.handler)
  // },
  // destroyed() {
  //   Events.off('trainingAddded', this.handler) // assuming Events.off() removes the listener.
  // },
};
</script>