<template>
    <div class="slide-page">
        <div class="nm-block title">
          <div class="left-group">
            <b-alert show variant="secondary">
              ← back
            </b-alert>
          </div>
          <h4> {{ item.name }} </h4>
          <div class="right-group">
            <multiselect
              v-model="filter"
              :options="options"
              :multiple="true"
              :close-on-select="true"
              label="name"
              track-by="name"
              placeholder="General">
            </multiselect>
          </div>
        </div>
        <div class="tooltip" :class="{ active: tooltip_show} " ref="tooltip">
          <p>{{ tooltip_message }}</p>
        </div>
        <!--
        <div class="p-2 nm-tooltip base" :id="'tooltip' + _id" ref="tooltip">
        </div>
        <b-tooltip :show="tooltip_show" :target="'tooltip' + _id">
            {{ tooltip_message }}
        </b-tooltip>
        -->
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <div class="component-container">
          <component ref="left" v-show="!comparison" class="nm-block main-content"
            v-bind:is="current_view"
            :context="context" :item="item" :data="item.data"
              @showtooltip="showTooltip">
          </component>
          <component ref="right" v-if="comparison" class="nm-block main-content"
            v-bind:is="current_view"
            :context="context" :item="item" :data="item._data"
              @showtooltip="showTooltipWithOffset">
          </component>
        </div>
        <follow-up :item="item" :context="context"></follow-up>
    </div>
</template>

<script>
import AssignmentTimeSpendSlide from "./Slideshows/AssignmentTimeSpend.vue";
import VideoPeaksSlide from "./Slideshows/VideoPeaks.vue";
import VideoCompletenessSlide from "./Slideshows/VideoCompleteness.vue";
import VideoFrequencySlide from "./Slideshows/VideoFrequency.vue";
import VideoTimeSpendSlide from "./Slideshows/VideoTimeSpend.vue";
import VideoStartFinishSlide from "./Slideshows/VideoStartFinish.vue";
import VideoDiscussedSlide from "./Slideshows/VideoDiscussed.vue";
import VideoTimeSpendDistributionSlide from "./Slideshows/VideoTimeSpendDistribution.vue";
import MaterialPopularitySlide from "./Slideshows/MaterialPopularity.vue";
import MaterialFrequencySlide from "./Slideshows/MaterialFrequency.vue";
import MaterialTimeSpendSlide from "./Slideshows/MaterialTimeSpend.vue";
import MaterialSequenceSlide from "./Slideshows/MaterialSequence.vue";
import AssignmentCorrectnessSlide from "./Slideshows/AssignmentCorrectness.vue";
import AssignmentCompletenessSlide from "./Slideshows/AssignmentCompleteness.vue";
import AssignmentAttemptsSlide from "./Slideshows/AssignmentAttempts.vue";
import AssignmentStartFinishSlide from "./Slideshows/AssignmentStartFinish.vue";
import AssignmentDiscussedSlide from "./Slideshows/AssignmentDiscussed.vue";
import ForumDiscussedSlide from "./Slideshows/ForumDiscussed.vue";
import ForumMostUpvotedSlide from "./Slideshows/ForumMostUpvoted.vue";
import ForumQuestionerSlide from "./Slideshows/ForumQuestioner.vue";
import AssignmentSequenceSlide from "./Slideshows/AssignmentSequence.vue";
import LearnerProfileSlide from "./Slideshows/LearnerProfile.vue";
import LearnerDifficultiesSlide from "./Slideshows/LearnerDifficulties.vue";
import EmptySlide from "./Slideshows/Empty.vue";
import { setTimeout } from 'plottable/build/src/utils/windowUtils';
import Multiselect from 'vue-multiselect';
import { request } from "../lib/request";

export default {
  data() {
    return {
      _id: -1,
      comparison: false,
      current_view: "EmptySlide",
      tooltip_show: false,
      tooltip_message: 'Hello world',
      last_trigger_time: 0,
      filter: [],
      options: [
        { name: 'top students', value: { key: 'grade', rule: { $gt: 0.80 } }},
        { name: 'poor students', value: { key: 'grade', rule: { $lt: 0.20 } }},
        { name: 'certificated', value: { key: 'mode', rule: 'honor' }},
        { name: 'audited', value: { key: 'mode', rule: 'audit' }},
        { name: 'drop out', value: { key: 'last_login', rule: { $lt: this.context.current_chapter.start / 1000 + 86400 * 7 }}},
      ],
    };
  },
  created() {
    this._id = ~~(Math.random() * 65536);
    this.$bus.$on("add-textbox", this.handle_addtext);
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
  watch: {
    filter(vec) {
      const condition = {};
      for (const x of vec) {
        condition[x.value.key] = x.value.rule;
      }
      this.item.condition = condition;
      this.comparison = false;
      this.item._data = {};
      this.item.comparison = true;
      if (vec.length > 0) {
        return Promise.all(
          this.item.resources.map(type => {
            return request(this, this.item, type);
          })
        ).then(async () => {
          this.comparison = true;
          this.$refs.left.$forceUpdate();
        });
      } else {
        this.item.comparison = false;
        this.$refs.left.$forceUpdate();
        if (this.comparison) {
          this.comparison = false;
        }
      }
    }
  },
  destroyed() {
    this.$bus.$off("add-textbox", this.handle_addtext);
  },
  components: {
    Multiselect,
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
        this.$refs.tooltip.style.left = `${e.position.x - 40}px`;
        this.$refs.tooltip.style.top = `${e.position.y - 20}px`;
        this.tooltip_show = true;
    },
    showTooltipWithOffset(e) {
      e.position.x += this.$refs.right.$el.getBoundingClientRect().left - 
        this.$refs.left.$el.getBoundingClientRect().left;
      this.showTooltip(e);
    },
  },
  props: ["context", "item"]
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.nm-tooltip.base {
    opacity: 0;
    position: absolute;
    z-index: 10;
}

.nm-block {
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slide-page {
  position: relative;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slide-page .title {
  display: inline-flex;
  flex-direction: row;
  width: 100%;
}
.slide-page .title h4 {
  font-weight: 800;
  text-align: center;
  width: 100%;
}
.slide-page .title .right-group {
  position: absolute;
  right: 2%;
}
.slide-page .title .left-group {
  position: absolute;
  opacity: 0;
  left: 0%;
}
.slide-page h5,h6 {
  font-weight: 600;
}

.slide-page .main-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 2;
  flex-grow: 2;
}

.component-container {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  align-content: space-around;
  height: 100%;
  width: 100%;
}

.slide-page .text.nm-block {
  padding-left: 2em;
}

.b1w {
  flex-basis: 16em;
  padding-left: .5em;
  padding-right: .5em;
  margin-left: .5em;
  margin-right: .5em;
}
.b2w {
  flex-basis: 32em;
  padding-left: .5em;
  padding-right: .5em;
  margin-left: .5em;
  margin-right: .5em;
}
.b3w {
  flex-basis: 48em;
  padding-left: .75em;
  padding-right: .75em;
  margin-left: .75em;
  margin-right: .75em;
}
.b4w {
  flex-basis: 64em;
  padding-left: 1em;
  padding-right: 1em;
  margin-left: 1em;
  margin-right: 1em;
}
.bh {
  height: 100%;
  margin-bottom: .5em;
}
.b1h {
  height: 50px;
  margin-bottom: 1em;
}
.b2h {
  height: 100px;
  margin-bottom: 1em;
}
.b3h {
  height: 150px;
  margin-bottom: 2em;
}
.b4h {
  height: 200px;
  margin-bottom: 2em;
}
.b5h {
  height: 250px;
  margin-bottom: 2em;
}
.b6h {
  height: 300px;
  margin-bottom: 2em;
}
.b7h {
  height: 350px;
  margin-bottom: 2em;
}
.b8h {
  height: 400px;
  margin-bottom: 3em;
}



.tooltip {
  visibility: hidden;
  z-index: 1;
  opacity: .40;
  
  padding: 5px 10px 0px 10px;

  background: #333;
  color: #eeeeee;
  
  position: absolute;

  border-radius: 9px;
  font-size: 16px;
  font-weight: 500;

  transform: translateY(9px);
  transition: all 0.3s ease-in-out;
  
  box-shadow: 0 0 3px rgba(56, 54, 54, 0.86);
}


/* tooltip  after*/
.tooltip::after {
  content: " ";
  width: 0;
  height: 0;
  
  border-style: solid;
  border-width: 12px 12.5px 0 12.5px;
  border-color: #333 transparent transparent transparent;

  position: absolute;
  left: 40%;

}

.tooltip.active {
  visibility: visible;
  transform: translateY(-10px);
  opacity: 1;
    transition: .3s linear;
  animation: odsoky 1s ease-in-out infinite alternate;
}

@keyframes odsoky {
  0%{
    transform: translateY(6px);	
  }
  100%{
    transform: translateY(1px);	
  }
}
/*hover ToolTip*/
.top:hover {transform: translateY(-6px);  }

</style>

