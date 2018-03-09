<template>
    <div class="slideshow-container">
        <template v-for="item, index in page">
            <material-popularity-slide v-if="item.id.includes('O1')" :context="context" :item="item">
            </material-popularity-slide>
            <video-time-spend-slide v-else-if="item.id.includes('V2')" :context="context" :item="item">
            </video-time-spend-slide>
            <video-peaks-slide v-else-if="item.id.includes('V5')" :context="context" :item="item">
            </video-peaks-slide>
        </template>
    </div>
</template>

<script>

import MaterialPopularitySlide from "./Slideshow/MaterialPopularity.vue";
import VideoPopularitySlide from "./Slideshow/VideoPopularity.vue";
import AssignmentPopularitySlide from "./Slideshow/AssignmentPopularity.vue";
import VideoPeaksSlide from "./Slideshow/VideoPeaks.vue";
import VideoTimeSpendSlide from "./Slideshow/VideoTimeSpend.vue";

export default {
  data() {
    return {
    };
  },
  props: ["page", "context", "trigger"],
  components: {
    MaterialPopularitySlide,
    VideoPopularitySlide,
    AssignmentPopularitySlide,
    VideoPeaksSlide,
    VideoTimeSpendSlide,
  },
  methods: {
  },
  watch: {
    trigger() {
      // this.paint();
    }
  }
};
</script>

<style scope>
.slideshow-container {
  left: 0px;
  top: 0px;
  height: 100%;
  width: 80vw;
  display: inline-flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 10vh;
}

.slideshow-content {
  width: 90%;
  left: 3vw;
  position: relative;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slideshow-content.title {
  font-weight: 800;
  text-align: center;
  padding-top: 5vh;
  padding-bottom: 2vh;
}

.slideshow-content.title h1,
h2,
h3,
h4 {
  font-weight: 800;
}

.slideshow-content.graph {
  perspective: 200px;
  background-attachment: fixed;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slideshow-content.text {
  padding-top: 1vh;
  padding-bottom: 1vh;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  color: #222;
}
</style>

