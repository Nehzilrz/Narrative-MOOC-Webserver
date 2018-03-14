<template>
  <div class="slideshow-inner-container">
      <template v-for="item, index in page">
          <material-popularity-slide v-if="item.id.includes('O1')" :context="context" :item="item">
          </material-popularity-slide>
          <material-frequency-slide v-else-if="item.id.includes('O2')" :context="context" :item="item">
          </material-frequency-slide>
          <material-time-spend-slide v-else-if="item.id.includes('O3')" :context="context" :item="item">
          </material-time-spend-slide>
          <material-sequence-slide v-else-if="item.id.includes('O4')" :context="context" :item="item">
          </material-sequence-slide>
          <assignment-time-spend-slide v-else-if="item.id.includes('A0')" :context="context" :item="item">
          </assignment-time-spend-slide>
          <assignment-time-spend-slide v-else-if="item.id.includes('A1')" :context="context" :item="item">
          </assignment-time-spend-slide>
          <video-time-spend-slide v-else-if="item.id.includes('V1')" :context="context" :item="item">
          </video-time-spend-slide>
          <video-time-spend-slide v-else-if="item.id.includes('V2')" :context="context" :item="item">
          </video-time-spend-slide>
          <video-time-spend-slide v-else-if="item.id.includes('V2')" :context="context" :item="item">
          </video-time-spend-slide>
          <video-frequency-slide v-else-if="item.id.includes('V3')" :context="context" :item="item">
          </video-frequency-slide>
          <video-frequency-slide v-else-if="item.id.includes('V4')" :context="context" :item="item">
          </video-frequency-slide>
          <video-peaks-slide v-else-if="item.id.includes('V5')" :context="context" :item="item">
          </video-peaks-slide>
          <video-time-spend-distribution-slide v-else-if="item.id.includes('S2')" :context="context" :item="item">
          </video-time-spend-distribution-slide>
      </template>
  </div>
</template>

<script>

import AssignmentTimeSpendSlide from "./Slideshow/AssignmentTimeSpend.vue";
import AssignmentPopularitySlide from "./Slideshow/AssignmentPopularity.vue";
import VideoPopularitySlide from "./Slideshow/VideoPopularity.vue";
import VideoPeaksSlide from "./Slideshow/VideoPeaks.vue";
import VideoFrequencySlide from "./Slideshow/VideoFrequency.vue";
import VideoTimeSpendSlide from "./Slideshow/VideoTimeSpend.vue";
import VideoTimeSpendDistributionSlide from "./Slideshow/VideoTimeSpendDistribution.vue";
import MaterialPopularitySlide from "./Slideshow/MaterialPopularity.vue";
import MaterialFrequencySlide from "./Slideshow/MaterialFrequency.vue";
import MaterialTimeSpendSlide from "./Slideshow/MaterialTimeSpend.vue";
import MaterialSequenceSlide from "./Slideshow/MaterialSequence.vue";

export default {
  data() {
    return {
    };
  },
  props: ["page", "context", "trigger"],
  components: {
    MaterialPopularitySlide,
    MaterialFrequencySlide,
    MaterialSequenceSlide,
    MaterialTimeSpendSlide,
    VideoPopularitySlide,
    VideoPeaksSlide,
    VideoTimeSpendSlide,
    VideoTimeSpendDistributionSlide,
    AssignmentPopularitySlide,
    AssignmentTimeSpendSlide,
    VideoFrequencySlide,
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
.slideshow-inner-container {
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

.slideshow-page {
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slideshow-content {
  width: 90%;
  left: 3vw;
  position: relative;
  transition: 0.2s;
  padding-top: 0.5vh;
  padding-bottom: 0.5vh;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  transition-timing-function: ease-in-out;
}

.slideshow-content.title {
  font-weight: 800;
  text-align: center;
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
}

.slideshow-content.text {
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  color: #222;
}
</style>

