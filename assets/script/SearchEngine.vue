<template>
  <form name="search" ref="form" v-bind:class = "hasActive" @submit.prevent="submit">
    <p>
      <input type="search" ref="input" name="q" placeholder=" ...Search" autocomplete="off"
        v-model = "q"
        @keydown.down = "down"
        @keydown.up = "up"
        @input = "change"
        @focus = "onFocus"
        @click = "clickInput"
        @blur = "onBlur"
      >
    </p>
    <p><button type="submit" id="search">&#xe83d;</button></p>
    <ul v-if="hasFocus">
      <li v-for="(word,index) in suggestion" :key="index"
        class="hover-active"
        v-bind:class = "{'selected': isCurrent(index)}"
        @mousemove = "hover(index)"
        @click = "clickSuggestion(word)"
        v-html = "wordHighlight(word)"
      ></li>
    </ul>
    <!-- <ul v-else-if="hasFocus && history">
      <li v-for="(word,index) in history" :key="index"
        v-bind:class = "{'selected': isCurrent(index)}"
        @mousemove = "hover(index)"
        @click = "clickSubmit(word)"
        v-html = "wordHighlight(word)"
      ></li>
    </ul> -->
  </form>
</template>
<script src="./SearchEngine.js"></script>