<template>
    <div class="slideshow-outbox">
        <template v-for="item, index in slides">
            <material-popularity-slide v-if="item.id == 'student0'" :context="context" :item="item">
            </material-popularity-slide>
        </template>
    </div>
</template>

<script>
    import Plottable from "plottable";
    import * as d3 from "d3";
    import { setTimeout } from 'plottable/build/src/utils/windowUtils';
    import { axisRight } from 'd3';
    import MaterialPopularitySlide from './Slideshow/MaterialPopularity.vue';

    const entropy_delta_threshold = 0.3;
    const max_entropy_delta_num = 3;
    let isScrolling = false;

    function scrollTo(anchor, duration) {   
        if (!anchor) return;     
        var scrollTop = document.documentElement.scrollTop;
        if (Math.abs(anchor.offsetTop - scrollTop) < 100) {
            return;
        }
        if (isScrolling) {
            return;
        }
        isScrolling = true;        
        var step = (anchor.offsetTop - scrollTop) / (duration / 1000) / 50;            

        function scroll() {     
            if (Math.abs(anchor.offsetTop - scrollTop) > Math.abs(step)) {
                scrollTop += step;
                document.documentElement.scrollTop = scrollTop;
                setTimeout(scroll, 20);
                return;
            } else {
                isScrolling = false;
                return;
            }
        }
        scroll();
    }

    export default {
        data() {
            return {
                slide_index: 0,
                slides: [],
                colorSchema: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", 
                    "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"
                ],
                show_video: [],
            };
        },
        props: ["slide", "context", "trigger"],
        components: {
            MaterialPopularitySlide,
        },
        methods: {
            paint() {
                if (!this.slide) {
                    return null;
                }
                var item = null;
                if (item = this.slides.find(d => this.slide.type == d.type && this.slide.index == d.index)) {
                    scrollTo(document.getElementById(`${item.type}_${item.index}`), 1000);
                    return;
                }
                this.slides.push(this.slide);
            },
        },
        watch: {
            trigger() {
                this.paint();
            },
        }
    };
</script>

<style scope>
.slideshow-outbox {
  left: 0px;
  top: 0px;
  min-height: 100%;
  width: 100%;
  padding-bottom: 10vh;
}

.slideshow-content {
  width: 90%;
  left: 3vw;
  position: relative;
}

.slideshow-content.title {
    font-weight: 800;
    text-align: center;
    padding-top: 5vh;
    padding-bottom: 2vh;
}

span.step {
  border-radius: 0.65em;
  -moz-border-radius: 0.65em;
  -webkit-border-radius: 0.65em;
  color: #ffffff;
  display: inline-block;
  font-weight: bold;
  line-height: 1.3em;
  margin-right: 4px;
  text-align: center;
  width: 1.3em; 
}
</style>

