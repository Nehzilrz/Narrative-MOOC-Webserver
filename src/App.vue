<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" :sticky="true">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  
      <b-navbar-brand href="#">Narrative MOOC</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
        <!--
          <b-nav-item-dropdown :text="`Video: ${current_video && current_video.name}`" right>
            <b-dropdown-item v-for="video in videos.filter(d => !current_chapter || d.chapter_name == current_chapter.name)"
              @click="videoDropdownClick(video)">
              {{(video.chapter_name.includes('Week') ?
                (video.chapter_name.slice(video.chapter_name.indexOf('Week'), 7) + ' - ')
                : '') + video.name
              }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="`Problem: ${current_problem && current_problem.name}`" right>
            <b-dropdown-item v-for="problem in problems.filter(d => !current_chapter || d.chapter_name == current_chapter.name)"
              @click="problemDropdownClick(problem)">
              {{(problem.chapter_name.includes('Week') ?
                (problem.chapter_name.slice(problem.chapter_name.indexOf('Week'), 7) + ' - ')
                : '') + problem.name
              }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          -->
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
          <div v-for="item in history" class="page" @click="onThumbnailClick(item)" :class="{ active: item == slide }">
            <div> {{`${item.name}`}} </div>
            <svg v-if="item.chart_type =='piechart'" ersion="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#ffffff" opacity=0.15 d="M7 9v-7c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7c0-1.126-0.266-2.189-0.738-3.131l-6.262 3.131zM14.262 3.869c-1.149-2.294-3.521-3.869-6.262-3.869v7l6.262-3.131z"></path>
            </svg>
            <svg v-else-if="item.chart_type =='linechart'" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#ffffff" opacity=0.15 d="M2 14h14v2h-16v-16h2zM4.5 13c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5c0.044 0 0.088 0.002 0.131 0.006l1.612-2.687c-0.154-0.235-0.243-0.517-0.243-0.819 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.302-0.090 0.583-0.243 0.819l1.612 2.687c0.043-0.004 0.087-0.006 0.131-0.006 0.033 0 0.066 0.001 0.099 0.004l2.662-4.658c-0.165-0.241-0.261-0.532-0.261-0.845 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5-0.033 0-0.066-0.001-0.099-0.004l-2.662 4.658c0.165 0.241 0.261 0.532 0.261 0.845 0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.302 0.090-0.583 0.243-0.819l-1.612-2.687c-0.043 0.004-0.087 0.006-0.131 0.006s-0.088-0.002-0.131-0.006l-1.612 2.687c0.154 0.235 0.243 0.517 0.243 0.819 0 0.828-0.672 1.5-1.5 1.5z"></path>
            </svg>
            <svg v-else-if="item.chart_type =='barchart'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#ffffff" opacity=0.15 d="M0 13h16v2h-16zM2 9h2v3h-2zM5 5h2v7h-2zM8 8h2v4h-2zM11 2h2v10h-2z"></path>
            </svg>
            <svg v-else-if="item.chart_type =='stackedbarchart'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#ffffff" opacity=0.15 d="M4.5 6h-3c-0.275 0-0.5 0.225-0.5 0.5v9c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5zM4.5 15h-3v-4h3v4zM9.5 4h-3c-0.275 0-0.5 0.225-0.5 0.5v11c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-11c0-0.275-0.225-0.5-0.5-0.5zM9.5 15h-3v-5h3v5zM14.5 2h-3c-0.275 0-0.5 0.225-0.5 0.5v13c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-13c0-0.275-0.225-0.5-0.5-0.5zM14.5 15h-3v-6h3v6z"></path>
            </svg>
            <svg v-else-if="item.chart_type =='areachart'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-chart-area fa-w-16" style="font-size: 64px;">
              <path fill="#ffffff" opacity=0.15 d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zM372.7 159.5L288 216l-85.3-113.7c-5.1-6.8-15.5-6.3-19.9 1L96 248v104h384l-89.9-187.8c-3.2-6.5-11.4-8.7-17.4-4.7z" class=""></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#ffffff" opacity=0.15 d="M6 1h10v2h-10v-2zM6 7h10v2h-10v-2zM6 13h10v2h-10v-2zM0 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 14c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="body-container">
          <slideshow-container :context="this.context" :page="this.page" :trigger="this.trigger_counter">
          </slideshow-container>
          <div class="sidebar-container tool" :class="{'sidebar-active': right_sidebar_active}">
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
            <!--
            <div class="review">
              <div class="header">
                <h5 class="title"> Review </h5>
              </div>
              <div class="content">
              </div>
            </div>
            -->
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
          <!--
          <b-card bg-variant="secondary" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab" >
              <b-btn block href="#" v-b-toggle.accordion0 variant="secondary" >Overview</b-btn>
            </b-card-header>
            <b-collapse id="accordion0" visible accordion="my-accordion0" role="tabpanel">
              <b-card-body>
                <svg id="overview" :width="overview_width" :height="overview_height">
                </svg>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card bg-variant="secondary" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion1 variant="secondary">Notes</b-btn>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p v-if="current_video" class="card-text">
                  The current video is {{ current_video && current_video.name }}, </br>
                  Id: {{ current_video && current_video.id }}, </br>
                  Entropy: {{ current_video && Number(current_video.entropy).toFixed(2) }}, </br>
                  Duration: {{ current_video && current_video.duration }}s, </br>
                  Chapter Name: {{ current_video && current_video.chapter_name }}, </br>
                  Released on {{ current_video && new Date(current_video.release_date).toDateString() }}, </br>
                  Average Grade: {{ current_video && Number(current_video.average_grade).toFixed(1) }}, </br>
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card bg-variant="secondary" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion2 variant="secondary">Mark Tools</b-btn>
            </b-card-header>
            <b-collapse id="accordion2" visible accordion="my-accordion2" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
      </b-form-row>
    </b-container>
    -->
  </div>
</template>

<script>
import SlideshowContainer from "./component/SlideshowContainer.vue";
import axios from "axios";
import * as d3 from "d3";
import * as mojs from "mo-js";
import * as SlideTemplate from "./lib/slidetemplate";
import { request, serverUrl } from "./lib/request";
import { getBubbleChart } from "./lib/bubblechart";

const maxPeakNum = 15;

function loadSlide(self, item) {
  Promise.all(
    item.resources.map(type => {
      return request(self, item, type);
    })
  ).then(() => {
    self.history.push(item);
    if (!self.page) {
      self.page = [];
      self.pages.push(self.page);
    }
    self.page.push(item);
    self.trigger_counter += 1;
    return;
    const position = self.bubblechart_layout.find(d => d.class == item.type);
    if (position) {
      d3.select("#overview")
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
      history: [],
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
      right_sidebar_active: false
    };
  },
  components: {
    SlideshowContainer
  },
  mounted() {
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
          .then(response => {
            this.chapters = response.data;
            this.chapters.forEach(d => (this.id2item[d.id] = d));
            const chapter = this.chapters[4];
            this.current_chapter = chapter;
            for (const slide of SlideTemplate.createTemplatesOnChapter(chapter)) {
              this.slides.push(slide);
            }
            loadSlide(this, this.slides.find(d => d.id.includes("O1")));
            loadSlide(this, this.slides.find(d => d.id.includes("O2")));
            loadSlide(this, this.slides.find(d => d.id.includes("V2")));
            loadSlide(this, this.slides.find(d => d.id.includes("V5")));
          });
      });
  },
  computed: {
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
        selectVideo: (item) => {},
        selectAssignment: (item) => {},
        selectStudent: (item) => {},
        selectChapter: (item) => {},
        addSlide: slide => this.slides.push(slide),
        lastSlide: () => this.slides[this.slides.length - 1],
        loadSlide: item => loadSlide(this, item),
        followupSlides: slide =>
          slide.follow_ups.map(d =>
            this.slides.find(
              x => x.id.includes(d) && slide.resource_id == x.resource_id
            )
          ),
        moveto: item => loadSlide(this, item)
      };
    },
    slide() {
      return null;
    },
    slide_structure() {
      const ret = this.slides.filter(d => d.index == 0).map(d => {
        if (!d.subcategory) {
          return {
            id: `course.${d.category}.${d.type}`,
            name: d.name,
            value: Math.random() * 10 + 30
          };
        } else {
          return {
            id: `course.${d.category}.${d.subcategory}.${d.type}`,
            name: d.subname,
            value: Math.random() * 10 + 15
          };
        }
      });
      ret.push({
        id: "course.video",
        name: "video",
        value: Math.random() * 10 + 10
      });
      ret.push({
        id: "course.assignment",
        name: "assignment",
        value: Math.random() * 10 + 10
      });
      ret.push({
        id: "course.student",
        name: "student",
        value: Math.random() * 10 + 10
      });
      ret.push({ id: "course", name: "course" });
      return ret;
    }
  },
  watch: {
    slides(val) {
      // this.bubblechart_layout = getBubbleChart(d3.select("#overview"), this.slide_structure);
    }
  },
  methods: {
    onThumbnailClick(item) {
      Promise.all(
        item.resources.map(type => {
          return request(this, item, type);
        })
      ).then(() => {
        // this.history.push(item);
        this.trigger_counter += 1;
        return;
        const position = this.bubblechart_layout.find(
          d => d.class == item.type
        );
        if (position) {
          d3
            .select("#overview")
            .select("g")
            .transition()
            .duration(1000)
            .attr(
              "transform",
              `translate(${this.overview_width / 2 - position.x},${this
                .overview_height /
                2 -
                position.y})`
            );
        }
      });
    },
    /*

    paint() {
      if (!this.slide) {
        return null;
      }
      var item = null;
      if (
        (item = this.slides.find(
          d => this.slide.type == d.type && this.slide.index == d.index
        ))
      ) {
        scrollTo(document.getElementById(`${item.type}_${item.index}`), 1000);
        return;
      }
      this.slides.push(this.slide);
    }

      videoDropdownClick(video) {
        this.current_video = video;
        for (const chapter of this.chapters) {
          if (chapter.videos.includes(video.id)) {
            this.current_chapter = chapter;
          }
        }
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      problemDropdownClick(problem) {
        this.current_problem = problem;
        for (const chapter of this.chapters) {
          if (chapter.problems.includes(problem.id)) {
            this.current_chapter = chapter;
          }
        }
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      */
    chapterDropdownClick(chapter) {
      this.current_chapter = chapter;
      for (const slide of SlideTemplate.createTemplatesOnChapter(chapter)) {
        this.slides.push(slide);
      }
      loadSlide(this, this.slides.find(d => d.id == "O1"));
    }
  }
};

/*
      const RADIUS = 28;
      const circle = new mojs.Shape({
        left: 0, top: 0,
        stroke:   'red',
        strokeWidth: { [2*RADIUS] : 0 },
        fill:     'none',
        scale:    { 0: 1, easing: 'quad.out' },
        radius:   RADIUS,
        duration:  450
      });

      const burst = new mojs.Burst({
        left: 0, top: 0,
        radius:   { 6: RADIUS - 7 },
        angle:    45,
        children: {
          shape:        'line',
          radius:       RADIUS/7.3,
          scale:        1,
          stroke:       'red',
          strokeDasharray: '100%',
          strokeDashoffset: { '-100%' : '100%' },
          degreeShift:     'stagger(0,-5)',
          duration:     700,
          delay:        200,
          easing:       'quad.out',
        }
      });

      class Star extends mojs.CustomShape {
        getShape () {
          return '<path d="M5.51132201,34.7776271 L33.703781,32.8220808 L44.4592855,6.74813038 C45.4370587,4.30369752 47.7185293,3 50,3 C52.2814707,3 54.5629413,4.30369752 55.5407145,6.74813038 L66.296219,32.8220808 L94.488678,34.7776271 C99.7034681,35.1035515 101.984939,41.7850013 97.910884,45.2072073 L75.9109883,63.1330483 L82.5924381,90.3477341 C83.407249,94.4217888 80.4739296,97.6810326 77.0517236,97.6810326 C76.0739505,97.6810326 74.9332151,97.3551083 73.955442,96.7032595 L49.8370378,81.8737002 L26.044558,96.7032595 C25.0667849,97.3551083 23.9260495,97.6810326 22.9482764,97.6810326 C19.3631082,97.6810326 16.2668266,94.4217888 17.4075619,90.3477341 L23.9260495,63.2960105 L2.08911601,45.2072073 C-1.98493875,41.7850013 0.296531918,35.1035515 5.51132201,34.7776271 Z" />';
        }
      }
      mojs.addShape( 'star', Star );

      const star = new mojs.Shape({
        left: 0, top: 0,
        shape:    'star',
        fill:     'red',
        scale:    { 0 : 1 },
        easing:   'elastic.out',
        duration: 1600,
        delay:    300,
        radius:   RADIUS/2.25
      });

      const timeline = new mojs.Timeline({ speed: 1.5 });

      timeline
        .add( burst, circle, star );

      document.addEventListener( 'click', function (e) {
        const coords = { x: e.pageX, y: e.pageY };
        burst.tune(coords);
        circle.tune(coords);
        star.tune(coords);
        timeline.replay();
      });
  */
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
  left: 86%;
  top: 0vh;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}
.sidebar-container.tool .content {
  background: radial-gradient(circle at top, #333333, #111111);
}
.slideshow-container.sidebar-active {
  width: 100vw;
}
.sidebar-container.tool.sidebar-active {
  left: 100vw;
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
.sidebar-container.slideshow:hover {
  left: 0vw;
  transition-delay: 0.5s;
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

.sidebar-container.slideshow .page {
  height: 12vh;
  width: 12.7vw;
  margin: 0.5vh 0.5vw 1vh 0.5vw;
  left: -2vw;
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  border-color: #525252;
  border-style: solid;
  border-width: 1.5px;
  font-size: 12px;
  position: relative;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.sidebar-container.slideshow .page div {
  padding-top: 0.5vh;
}

.sidebar-container.slideshow .page svg {
  width: 8vh;
  height: 8vh;
  position: absolute;
  left: 35%;
  top: 2vh;
}

.sidebar-container.slideshow:hover .page {
  left: 0vw;
  transition-delay: 0.5s;
}
.sidebar-container.slideshow .page.active {
  border-color: #585858;
  border-width: 1.5px;
  opacity: 1;
}
.sidebar-container.slideshow .page:hover {
  border-color: #585858;
  border-width: 1.5px;
  opacity: 1;
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

.right-sidebar {
  margin-top: 5px;
  color: white;
}

.card-body {
  padding: 0px;
}

#overview {
  width: 100%;
  height: 100%;
}
</style>
