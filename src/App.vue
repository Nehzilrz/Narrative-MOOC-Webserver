<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" :sticky="true">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  
      <b-navbar-brand href="#">Narrative MOOC</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="`${current_chapter ? (
            current_chapter.name + ' (' +
            new Date(current_chapter.start).toDateString().slice(4) + ' - ' +
            new Date((+new Date(current_chapter.start)) + 86400000 * 7).toDateString().slice(4) + ')'
            ) : 'Choose a time range'}`" right>
            <b-dropdown-item v-for="chapter in chapters" @click="chapterDropdownClick(chapter)">
              {{chapter.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        <b-nav-text>
          {{ course_name }}
        </b-nav-text>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="page-container">
      <div class="sidebar-container slideshow">
        <div class="header">
          <h5 class="title"> History </h5>
          <svg class="icon" width="32" height="32">
            <path transform="translate(-3, 4) scale(1.8)" fill="#ffffff" d="
              M10 1c3.866 0 7 3.134 7 7s-3.134 7-7 7v-1.5c1.469 0 2.85-0.572 3.889-1.611s1.611-2.42 1.611-3.889c0-1.469-0.572-2.85-1.611-3.889s-2.42-1.611-3.889-1.611c-1.469 0-2.85 0.572-3.889 1.611-0.799 0.799-1.322 1.801-1.52 2.889h2.909l-3.5 4-3.5-4h2.571c0.485-3.392 3.402-6 6.929-6zM13 7v2h-4v-5h2v3z">
            </path>
          </svg>
        </div>
        <div class="content">
          <template v-for="page, index in pages">
            <slideshow-thumb v-for="item in page" :item="item" :context="context" :class="{ active: item == slide }">
            </slideshow-thumb>
            <hr v-if="index != pages.length - 1">
          </template>
        </div>
      </div>
      <div class="body-container">
          <div class="slideshow-outter-container">
            <slideshow-container :context="this.context" :page="this.page" :trigger="this.trigger_counter">
            </slideshow-container>
            <ol class="carousel-switcher" v-if="pages && pages.length > 1">
              <li v-for="p in pages" :class="{ active: p == page }" @click="onChangePage(p)"></li>
            </ol>
          </div>
          <div class="sidebar-container tool">
            <div class="overview">
              <div class="header">
                <h5 class="title"> Overview </h5>
                <svg class="icon" width="32" height="32">
                  <path transform="translate(5, 32) scale(1.6) rotate(270)" fill="#ffffff" d="M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z"></path>
                  <!--path transform="translate(0, 7) scale(1.6)" fill="#ffffff" d="M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z"></path>
                  -->
                </svg>
              </div>
              <div class="content">
              </div>
            </div>
            <div class="marktool">
              <div class="header">
                <h5 class="title"> Mark </h5>
                <svg class="icon" width="32" height="32">
                  <path transform="translate(0, 7) scale(1.6)" fill="#ffffff" d="M6 10l2-1 7-7-1-1-7 7-1 2zM4.52 13.548c-0.494-1.043-1.026-1.574-2.069-2.069l1.548-4.262 2-1.217 6-6h-3l-6 6-3 10 10-3 6-6v-3l-6 6-1.217 2z"></path>
                </svg>
              </div>
              <div class="content">
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import * as mojs from "mo-js";
import * as MoveTo from "moveto";
import * as SlideTemplate from "./lib/slidetemplate";
import { request, serverUrl } from "./lib/request";
import SlideshowContainer from "./component/SlideshowContainer.vue";
import SlideshowThumb from "./component/SlideshowThumb.vue";

async function loadSlide(self, type, id) {
  const item = SlideTemplate.create(type, id);
  return Promise.all(
    item.resources.map(type => {
      return request(self, item, type);
    })
  ).then(async () => {
    item.loaded = true;
    if (!self.page) {
      self.page = [];
      self.pages.push(self.page);
    }
    self.page.push(item);
    self.trigger_counter += 1;
    return;
    const position = self.bubblechart_layout.find(d => d.class == item.type);
    if (position) {
      d3
        .select("#overview")
        .select("g")
        .transition()
        .duration(1000)
        .attr(
          "transform",
          `translate(${self.overview_width / 2 - position.x},
            ${self.overview_height / 2 - position.y})`
        );
    }
  });
}
export default {
  name: "app",
  data() {
    return {
      slides: [],
      pages: [],
      page: null,
      videos: [],
      problems: [],
      chapters: [],
      users: [],
      id2item: {},
      // current_video: null,
      // current_problem: null,
      current_chapter: null,
      trigger_counter: 0,
      color_schema: [
        "#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a"
      ],
      course_name: "Introduction to Computing with Java",
      course_id: "HKUSTx_COMP102x_2T2014",
      overview_width: 230,
      overview_height: 230,
      bubblechart_layout: null,
      right_sidebar_active: false,
      active_items: [],
      moveto: new MoveTo({ tolerance: 56, duration: 400 }),
      viewport: { top: 0, bottom: 800, height: 800 }
    };
  },
  components: {
    SlideshowContainer,
    SlideshowThumb
  },
  mounted() {
    window.onscroll = d => {
      this.viewport = {
        top: window.visualViewport.pageTop,
        bottom: window.visualViewport.pageTop + window.visualViewport.height,
        height: window.visualViewport.height
      };
    };
    axios
      .get(`${serverUrl}getVideoList`, { params: { courseId: this.course_id } })
      .then(response => {
        this.videos = response.data;
        this.videos.forEach(d => (this.id2item[d.id] = d));
      })
      .then(() => {
        axios
          .get(`${serverUrl}getProblemList`, {
            params: { courseId: this.course_id }
          })
          .then(response => {
            this.problems = response.data;
            this.problems.forEach(d => (this.id2item[d.id] = d));
          });
      })
      .then(() => {
        axios
          .get(`${serverUrl}getChapterList`, {
            params: { courseId: this.course_id }
          })
          .then(async response => {
            this.chapters = response.data;
            this.chapters.forEach(d => (this.id2item[d.id] = d));
            const chapter = this.chapters[4];
            this.current_chapter = chapter;

            await loadSlide(this, "O1", chapter.id);
            await loadSlide(this, "O2", chapter.id);
            await loadSlide(this, "S2", chapter.id);
            this.page = null;
            await loadSlide(this, "A0", chapter.id);
            await loadSlide(this, "V2", chapter.id);
            // loadSlide(this, 'V5', chapter.id);
          });
      });
  },
  computed: {
    history() {
      return [].concat(...this.pages);
    },
    slide() {
      const elements = document.getElementsByClassName("slideshow-page");
      return this.page
        ? this.page.find((item, index) => {
            const element = elements[index];
            if (!element) return false;
            const top = element.getBoundingClientRect().top;
            const bottom = element.getBoundingClientRect().bottom;
            const height = element.getBoundingClientRect().height;
            const view_height = this.viewport.height;
            if (
              0 <= bottom &&
              bottom <= view_height &&
              bottom > height * 0.66
            ) {
              return true;
            } else if (
              0 <= top &&
              top <= view_height &&
              view_height - top > height * 0.66
            ) {
              return true;
            }
            return false;
          })
        : null;
    },
    context() {
      return {
        current_chapter: this.current_chapter,
        videos: this.videos,
        chapters: this.chapters,
        problems: this.problems,
        slides: this.slides,
        history: this.history,
        id2item: this.id2item,
        color_schema: this.color_schema,
        video_color: this.color_schema[1],
        assignment_color: this.color_schema[3],
        page: this.page,
        pages: this.pages,
        selectVideo: item => {},
        selectAssignment: item => {},
        selectStudent: item => {},
        selectChapter: item => {},
        lastSlide: () => this.slides[this.slides.length - 1],
        loadSlide: (type, id) => loadSlide(this, type, id),
        followupSlides: slide =>
          slide.follow_ups.map(d => ({
            name: SlideTemplate.questions[d],
            type: d
          })),
        moveto: this.moveto
      };
    }
  },
  watch: {
    slides(val) {
      // this.bubblechart_layout = getBubbleChart(d3.select("#overview"), this.slide_structure);
    }
  },
  methods: {
    chapterDropdownClick(chapter) {
      this.current_chapter = chapter;
      loadSlide(this, "O1", chapter.id);
    },
    onChangePage(page) {
      if (this.page != page) {
        this.page = page;
      }
    }
  }
};
</script>

<style scope>
body {
  background-color: rgb(243, 244, 246);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
  max-height: 100%;
}

.page-container {
  width: 100%;
  overflow-x: hidden;
}

.body-container {
  height: 100%;
  width: 120vw;
  display: inline-flex;
  flex-direction: row;
}
.sidebar-container.tool {
  width: 20vw;
  left: 80vw;
  background: radial-gradient(circle at top, #333333, #111111);
  position: fixed;
}
.sidebar-container.tool .header {
  background: radial-gradient(circle at top, #353a3f, #333333);
  position: relative;
}
.sidebar-container.tool .header .icon {
  position: absolute;
  left: 82%;
  top: 0vh;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}
.sidebar-container.tool .content {
  background: radial-gradient(circle at top, #333333, #111111);
}
.sidebar-container.tool .overview .content {
  height: 43vh;
}
.sidebar-container.tool .review .content {
  height: 30vh;
}
.sidebar-container.tool .marktool .content {
  height: 40vh;
}

.slideshow-container {
  height: 100%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
}

.sidebar-container {
  height: 100%;
  overflow-y: hidden;
  z-index: 2;
  top: 56px;
  display: inline-flex;
  flex-direction: column;
  opacity: 0.9;
  color: white;
}
.sidebar-container .header {
  position: static;
  border-width: 1px 1.5px 1px 1.5px;
  border-style: solid;
  border-color: #666666;
  background: radial-gradient(circle at top, #353a3f, #333333);
  z-index: 3;
  top: 0px;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}
.sidebar-container .header .title {
  font-weight: 300;
  text-align: left;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  margin-top: 1vh;
  margin-bottom: 1vh;
  margin-left: 1.5vw;
}
.sidebar-container .content {
  transition: 0.5s;
  transition-timing-function: ease-in-out;
  background: radial-gradient(circle at top, #333333, #111111);
}

.sidebar-container.slideshow {
  left: -13vw;
  width: 16vw;
  position: fixed;
}
.sidebar-container.slideshow hr {
  border-color: #888888;
  border-width: 3px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.sidebar-container.slideshow:hover {
  left: 0vw;
  transition-delay: 0.5s;
}
.sidebar-container.slideshow:hover .page {
  left: 0vw;
  transition-delay: 0.3s;
}

.sidebar-container.slideshow .header {
  position: sticky;
  border-style: solid;
  border-color: #666666;
  background: radial-gradient(circle at top, #353a3f, #333333);
  width: 15.9vw;
}
.sidebar-container.slideshow .header .icon {
  position: absolute;
  left: 85%;
  top: 0vh;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}
.sidebar-container.slideshow:hover .header {
  width: 14vw;
  transition-delay: 0.5s;
}
.sidebar-container.slideshow:hover .header .icon {
  left: 80%;
  transition-delay: 0.5s;
}
.sidebar-container.slideshow .content {
  left: 0vw;
  width: 14vw;
  height: 100%;
  padding-bottom: 7vh;
  padding-top: 1vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.sidebar-container .content::-webkit-scrollbar {
  width: 10px;
}

.sidebar-container .content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

.sidebar-container .content::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

.carousel-switcher {
  position: fixed;
  top: 97%;
  left: 40%;
  z-index: 15;
  display: flex;
  opacity: 1;
}

.carousel-switcher li {
  position: relative;
  width: 30px;
  height: 5px;
  margin-right: 3px;
  margin-left: 3px;
  text-indent: -999px;
  background-color: rgba(119, 136, 153, 0.2);
}
.carousel-switcher li.active {
  background-color: rgba(119, 136, 153, 0.7);
}

#overview {
  width: 100%;
  height: 100%;
}
</style>
