<template>
    <div class="slide-page">
        <div class="slide nm-block title">
            <h4> {{ item.name }} </h4>
        </div>
        <div class="p-2 nm-tooltip base" :id="'tooltip' + $vnode.tag" ref="tooltip">
        </div>
        <b-tooltip :show="tooltip_show" :target="'tooltip' + $vnode.tag">
            {{ tooltip_message }}
        </b-tooltip>
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <component v-bind:is="current_view" :context="context" :item="item"
            @showtooltip="showTooltip">
        </component>
        <follow-up :item="item" :context="context"></follow-up>
    </div>
</template>

<script>
import AssignmentTimeSpendSlide from "./AssignmentTimeSpend.vue";
import VideoPeaksSlide from "./VideoPeaks.vue";
import VideoCompletenessSlide from "./VideoCompleteness.vue";
import VideoFrequencySlide from "./VideoFrequency.vue";
import VideoTimeSpendSlide from "./VideoTimeSpend.vue";
import VideoStartFinishSlide from "./VideoStartFinish.vue";
import VideoDiscussedSlide from "./VideoDiscussed.vue";
import VideoTimeSpendDistributionSlide from "./VideoTimeSpendDistribution.vue";
import MaterialPopularitySlide from "./MaterialPopularity.vue";
import MaterialFrequencySlide from "./MaterialFrequency.vue";
import MaterialTimeSpendSlide from "./MaterialTimeSpend.vue";
import MaterialSequenceSlide from "./MaterialSequence.vue";
import AssignmentCorrectnessSlide from "./AssignmentCorrectness.vue";
import AssignmentCompletenessSlide from "./AssignmentCompleteness.vue";
import AssignmentAttemptsSlide from "./AssignmentAttempts.vue";
import AssignmentStartFinishSlide from "./AssignmentStartFinish.vue";
import AssignmentDiscussedSlide from "./AssignmentDiscussed.vue";
import ForumDiscussedSlide from "./ForumDiscussed.vue";
import ForumMostUpvotedSlide from "./ForumMostUpvoted.vue";
import ForumQuestionerSlide from "./ForumQuestioner.vue";
import AssignmentSequenceSlide from "./AssignmentSequence.vue";
import LearnerProfileSlide from "./LearnerProfile.vue";
import LearnerDifficultiesSlide from "./LearnerDifficulties.vue";
import EmptySlide from "./Empty.vue";
import { setTimeout } from 'plottable/build/src/utils/windowUtils';

export default {
  data() {
    return {
      current_view: "EmptySlide",
      tooltip_show: false,
      tooltip_message: 'Hello world',
      last_trigger_time: 0,
    };
  },
  created() {
    this.context.addtext_bus.$on("add-textbox", this.handle_addtext);
    const component_mapping = {
      O1: "MaterialPopularitySlide",
      O2: "MaterialFrequencySlide",
      O3: "MaterialTimeSpendSlide",
      O4: "MaterialSequenceSlide",
      A0: "AssignmentTimeSpendSlide",
      A1: "AssignmentCorrectnessSlide",
      A2: "AssignmentCompletenessSlide",
      A3: "AssignmentAttemptsSlide",
      A4: "AssignmentStartFinishSlide",
      A5: "AssignmentDiscussedSlide",
      A6: "AssignmentSequenceSlide",
      V1: "VideoCompletenessSlide",
      V2: "VideoTimeSpendSlide",
      V3: "VideoFrequencySlide",
      V4: "VideoStartFinishSlide",
      V5: "VideoPeaksSlide",
      V6: "VideoDiscussedSlide",
      F1: "ForumDiscussedSlide",
      F2: "ForumMostUpvotedSlide",
      F3: "ForumQuestionerSlide",
      S1: "LearnerProfileSlide",
      S2: "LearnerDifficultiesSlide",
    };
    this.current_view = component_mapping[this.item.id] || "EmptySlide";
  },
  destroyed() {
    this.context.addtext_bus.$off("add-textbox", this.handle_addtext);
  },
  components: {
    MaterialPopularitySlide,
    MaterialFrequencySlide,
    MaterialSequenceSlide,
    MaterialTimeSpendSlide,
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
    ForumMostUpvotedSlide,
    ForumQuestionerSlide,
    AssignmentSequenceSlide,
    LearnerProfileSlide,
    LearnerDifficultiesSlide,
    EmptySlide
  },
  methods: {
    handle_addtext(_id) {
      if (_id == this.item._id) {
        this.item.notes = this.item.notes.filter(d => d.value.text);
        this.item.notes.push({
          value: {
            text: "Click to edit",
            position: { x: 50, y: 50 }
          }
        });
      }
    },
    showTooltip(e) {
        this.last_trigger_time = e.time;
        setTimeout(() => {
            if (this.last_trigger_time == e.time) {
                this.tooltip_show = false;
            }
        }, 1500);
        if (this.tooltip_message == e.message) {
            return;
        }
        this.tooltip_message = e.message;
        const parent = this.$el.getBoundingClientRect();
        this.$refs.tooltip.style.left = `${e.position.x + parent.left - 3}px`;
        this.$refs.tooltip.style.top = `${e.position.y + parent.top - 10}px`;
        this.tooltip_show = true;
    }
  },
  props: ["context", "item"]
};
</script>

<style scoped>
.nm-tooltip.base {
    opacity: 0;
    position: absolute;
    z-index: 10;
}

.slide-page {
  position: relative;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slide {
  width: 90%;
  left: 1vw;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slide.title {
  font-weight: 800;
  text-align: center;
}

.slide.title h1,h2,h3,h4 {
  font-weight: 800;
}

.slide h5,h6 {
  font-weight: 600;
}

.slide {
  margin-left: 1vw;
  margin-right: 1vw;
}

.nm-block {
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slide.text {
  margin-left: 3vw;
}

</style>

