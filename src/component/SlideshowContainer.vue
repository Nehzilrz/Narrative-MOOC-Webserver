<template>
  <div class="slideshow-inner-container">
      <div class="slideshow-content" v-if="!page || !page.length">
        <h4 style="text-align: center; padding: 10vw;"> Empty page. </h4>
      </div>
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
          <assignment-correctness-slide v-else-if="item.id.includes('A1')" :context="context" :item="item">
          </assignment-correctness-slide>
          <assignment-completeness-slide v-else-if="item.id.includes('A2')" :context="context" :item="item">
          </assignment-completeness-slide>
          <assignment-attempts-slide v-else-if="item.id.includes('A3')" :context="context" :item="item">
          </assignment-attempts-slide>
          <assignment-start-finish-slide v-else-if="item.id.includes('A4')" :context="context" :item="item">
          </assignment-start-finish-slide>
          <assignment-discussed-slide v-else-if="item.id.includes('A5')" :context="context" :item="item">
          </assignment-discussed-slide>
          <assignment-sequence-slide v-else-if="item.id.includes('A6')" :context="context" :item="item">
          </assignment-sequence-slide>
          <video-completeness-slide v-else-if="item.id.includes('V1')" :context="context" :item="item">
          </video-completeness-slide>
          <video-time-spend-slide v-else-if="item.id.includes('V2')" :context="context" :item="item">
          </video-time-spend-slide>
          <video-time-spend-slide v-else-if="item.id.includes('V2')" :context="context" :item="item">
          </video-time-spend-slide>
          <video-frequency-slide v-else-if="item.id.includes('V3')" :context="context" :item="item">
          </video-frequency-slide>
          <video-start-finish-slide v-else-if="item.id.includes('V4')" :context="context" :item="item">
          </video-start-finish-slide>
          <video-peaks-slide v-else-if="item.id.includes('V5')" :context="context" :item="item">
          </video-peaks-slide>
          <video-discussed-slide v-else-if="item.id.includes('V6')" :context="context" :item="item">
          </video-discussed-slide>
          <forum-discussed-slide v-else-if="item.id.includes('F1')" :context="context" :item="item">
          </forum-discussed-slide>
          <forum-most-upvoted-slide v-else-if="item.id.includes('F2')" :context="context" :item="item">
          </forum-most-upvoted-slide>
          <forum-questioner-slide v-else-if="item.id.includes('F3')" :context="context" :item="item">
          </forum-questioner-slide>
          <learner-profile-slide v-else-if="item.id.includes('S1')" :context="context" :item="item">
          </learner-profile-slide>
          <learner-difficulties-slide v-else-if="item.id.includes('S2')" :context="context" :item="item">
          </learner-difficulties-slide>
      </template>
  </div>
</template>

<script>

import AssignmentTimeSpendSlide from "./Slideshow/AssignmentTimeSpend.vue";
import VideoPopularitySlide from "./Slideshow/VideoPopularity.vue";
import VideoPeaksSlide from "./Slideshow/VideoPeaks.vue";
import VideoCompletenessSlide from "./Slideshow/VideoCompleteness.vue";
import VideoFrequencySlide from "./Slideshow/VideoFrequency.vue";
import VideoTimeSpendSlide from "./Slideshow/VideoTimeSpend.vue";
import VideoStartFinishSlide from "./Slideshow/VideoStartFinish.vue";
import VideoDiscussedSlide from "./Slideshow/VideoDiscussed.vue";
import VideoTimeSpendDistributionSlide from "./Slideshow/VideoTimeSpendDistribution.vue";
import MaterialPopularitySlide from "./Slideshow/MaterialPopularity.vue";
import MaterialFrequencySlide from "./Slideshow/MaterialFrequency.vue";
import MaterialTimeSpendSlide from "./Slideshow/MaterialTimeSpend.vue";
import MaterialSequenceSlide from "./Slideshow/MaterialSequence.vue";
import AssignmentCorrectnessSlide from "./Slideshow/AssignmentCorrectness.vue";
import AssignmentCompletenessSlide from "./Slideshow/AssignmentCompleteness.vue";
import AssignmentAttemptsSlide from "./Slideshow/AssignmentAttempts.vue";
import AssignmentStartFinishSlide from "./Slideshow/AssignmentStartFinish.vue";
import AssignmentDiscussedSlide from "./Slideshow/AssignmentDiscussed.vue";
import ForumDiscussedSlide from "./Slideshow/ForumDiscussed.vue";
import ForumKeywordSlide from "./Slideshow/ForumKeywords.vue";
import ForumMostUpvotedSlide from "./Slideshow/ForumMostUpvoted.vue";
import ForumQuestionerSlide from "./Slideshow/ForumQuestioner.vue";
import AssignmentSequenceSlide from "./Slideshow/AssignmentSequence.vue";
import LearnerProfileSlide from "./Slideshow/LearnerProfile.vue";
import LearnerDifficultiesSlide from "./Slideshow/LearnerDifficulties.vue";

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
    AssignmentTimeSpendSlide,
    VideoFrequencySlide,
    VideoCompletenessSlide,
    VideoStartFinishSlide,
    VideoDiscussedSlide,
    AssignmentCorrectnessSlide,
    AssignmentCompletenessSlide,
    AssignmentAttemptsSlide,
    AssignmentStartFinishSlide,
    AssignmentDiscussedSlide,
    ForumDiscussedSlide,
    ForumKeywordSlide,
    ForumMostUpvotedSlide,
    ForumQuestionerSlide,
    AssignmentSequenceSlide,
    LearnerProfileSlide,
    LearnerDifficultiesSlide,
  },
  methods: {

  },
  watch: {
    page() {
        /* this.$sr.reveal('.slideshow-content', {
        }, 2000);
        */
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
  position: relative;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slideshow-content {
  width: 90%;
  left: 3vw;
  transition: 0.2s;
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

.slideshow-content h5,h6 {
  font-weight: 600;
}


.slideshow-content {
  margin-left: 3vw;
  margin-right: 3vw;
  position: relative;
}



.slideshow-content.graph {
  perspective: 200px;
  background-attachment: fixed;
}

.slideshow-content.text {
  margin-left: 5vw;
}
</style>

