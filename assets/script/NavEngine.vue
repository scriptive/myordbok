<template>
  <div>
    <div class="name navMobile"></div>
    <div @click = 'navToggle' v-bind:class = "{'active': show}" class="toggle panel icon-panel"></div>
  </div>
</template>
<script>
export default {
  name: 'NavEngine',
  // props: ['showMobileMenu'],
  data: () => ({
    show:false
  }),
  methods:{
    navToggle(){
      this.show = !this.show;
      console.log('nav toggle',this.show)

      this.$parent.showMobileMenu = this.show;
    }
  },
  computed:{
    // abc(){
    //   return this.$parent.showMobileMenu;
    // }
  }
};
</script>