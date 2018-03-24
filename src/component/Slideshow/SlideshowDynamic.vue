<template>
    <component v-bind:is="current_view" :context="context" :item="item">
    </component>
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

export default {
  data() {
      return {
          current_view: 'EmptySlide',
      }
  },
  created() {
      const id = this.item.id;
      const component_mapping = {
        'O1': 'MaterialPopularitySlide',
        'O2': 'MaterialFrequencySlide',
        'O3': 'MaterialTimeSpendSlide',
        'O4': 'MaterialSequenceSlide',
        'A0': 'AssignmentTimeSpendSlide',
        'A1': 'AssignmentCorrectnessSlide',
        'A2': 'AssignmentCompletenessSlide',
        'A3': 'AssignmentAttemptsSlide',
        'A4': 'AssignmentStartFinishSlide',
        'A5': 'AssignmentDiscussedSlide',
        'A6': 'AssignmentSequenceSlide',
        'V1': 'VideoCompletenessSlide',
        'V2': 'VideoTimeSpendSlide',
        'V3': 'VideoFrequencySlide',
        'V4': 'VideoStartFinishSlide',
        'V5': 'VideoPeaksSlide',
        'V6': 'VideoDiscussedSlide',
        'F1': 'ForumDiscussedSlide',
        'F2': 'ForumMostUpvotedSlide',
        'F3': 'ForumQuestionerSlide',
        'S1': 'LearnerProfileSlide',
        'S2': 'LearnerDifficultiesSlide',
      };
      this.current_view = component_mapping[id] || 'EmptySlide';
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
    EmptySlide,
  },
  props: ['context', 'item'],
}
</script>
