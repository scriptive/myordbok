<template>
  <span @click = 'speech' v-bind:class = "{'playing': isplaying}" class="speech icon-volume-up"></span>
</template>
<script>
export default {
  name: 'speech-engine',
  props: ['word','lang'],
  data: () => ({
    isplaying:false
  }),
  methods:{
    speech(){
      // var element = e.target;
      // console.log(e)
      // $(clickedElement).siblings().removeClass('active');
      // $(clickedElement).addClass('active');
      // console.log(this.word, this.lang)
      this.isplaying = true;
      var audio = document.createElement('audio');
      audio.src = this.$parent.speech({q:this.word,l:this.lang});
      audio.load();
      audio.play();
      audio.addEventListener("ended", () => this.isplaying = false);
    }
  }
};
</script>