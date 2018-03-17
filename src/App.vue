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
                <draggable :list="page">
                  <div v-for="item in page" class="page" @click="findNext(null, item)" :class="{ active: item == slide }">
                    <div> {{`${item.name}`}} </div>
                    <svg v-if="item.chart_type =='piechart'" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#ffffff" opacity=0.15 d="
                          M7 9v-7c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7c0-1.126-0.266-2.189-0.738-3.131l-6.262 3.131zM14.262 3.869c-1.149-2.294-3.521-3.869-6.262-3.869v7l6.262-3.131z">
                        </path>
                    </svg>
                    <svg v-else-if="item.chart_type =='linechart'" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#ffffff" opacity=0.15 d="
                          M2 14h14v2h-16v-16h2zM4.5 13c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5c0.044 0 0.088 0.002 0.131 0.006l1.612-2.687c-0.154-0.235-0.243-0.517-0.243-0.819 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.302-0.090 0.583-0.243 0.819l1.612 2.687c0.043-0.004 0.087-0.006 0.131-0.006 0.033 0 0.066 0.001 0.099 0.004l2.662-4.658c-0.165-0.241-0.261-0.532-0.261-0.845 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5-0.033 0-0.066-0.001-0.099-0.004l-2.662 4.658c0.165 0.241 0.261 0.532 0.261 0.845 0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.302 0.090-0.583 0.243-0.819l-1.612-2.687c-0.043 0.004-0.087 0.006-0.131 0.006s-0.088-0.002-0.131-0.006l-1.612 2.687c0.154 0.235 0.243 0.517 0.243 0.819 0 0.828-0.672 1.5-1.5 1.5z">
                        </path>
                    </svg>
                    <svg v-else-if="item.chart_type =='barchart'" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#ffffff" opacity=0.15 d="
                          M0 13h16v2h-16zM2 9h2v3h-2zM5 5h2v7h-2zM8 8h2v4h-2zM11 2h2v10h-2z">
                        </path>
                    </svg>
                    <svg v-else-if="item.chart_type =='stackedbarchart'" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#ffffff" opacity=0.15 d="
                          M4.5 6h-3c-0.275 0-0.5 0.225-0.5 0.5v9c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5zM4.5 15h-3v-4h3v4zM9.5 4h-3c-0.275 0-0.5 0.225-0.5 0.5v11c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-11c0-0.275-0.225-0.5-0.5-0.5zM9.5 15h-3v-5h3v5zM14.5 2h-3c-0.275 0-0.5 0.225-0.5 0.5v13c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-13c0-0.275-0.225-0.5-0.5-0.5zM14.5 15h-3v-6h3v6z">
                        </path>
                    </svg>
                    <svg v-else-if="item.chart_type =='areachart'" viewBox="0 0 512 512" class="svg-inline--fa fa-chart-area fa-w-16" style="font-size: 64px;">
                        <path fill="#ffffff" opacity=0.15 d="
                          M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zM372.7 159.5L288 216l-85.3-113.7c-5.1-6.8-15.5-6.3-19.9 1L96 248v104h384l-89.9-187.8c-3.2-6.5-11.4-8.7-17.4-4.7z" class="">
                        </path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#ffffff" opacity=0.15 d="
                          M6 1h10v2h-10v-2zM6 7h10v2h-10v-2zM6 13h10v2h-10v-2zM0 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 14c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z">
                        </path>
                    </svg>
                  </div>
                </draggable>
                <hr v-if="index != pages.length - 1">
          </template>
        </div>
      </div>
      <div class="body-container">
          <div class="slideshow-outter-container">
            <slideshow-container :context="this.context" :page="this.page" :trigger="this.trigger_counter">
            </slideshow-container>
            <div class="carousel-switcher" v-if="pages && pages.length > 1">
              <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                <b-button-group class="mx-1">
                  <b-btn size="sm" variant="outline-secondary"
                    @click="onChangePage(pages[Math.max(0, pages.indexOf(page) - 1)])"
                  >&lsaquo;</b-btn>            
                  <b-btn size="sm" variant="outline-secondary" v-for="p, index in pages" :class="{ active: p == page }" @click="onChangePage(p)">
                    {{ index + 1 }}
                  </b-btn>
                  <b-btn size="sm" variant="outline-secondary"
                    @click="page = []; pages.push(page);"
                  >New</b-btn>
                  <b-btn size="sm" variant="outline-secondary"
                    @click="onChangePage(pages[Math.min(pages.length - 1, pages.indexOf(page) + 1)])"
                  >&rsaquo;</b-btn>
                </b-button-group>
              </b-button-toolbar>
            </div>
          </div>
          <div class="sidebar-container tool" :class="{ open: sidebar_active }">
            <div class="overview">
              <div class="header">
                <h5 class="title"> Overview </h5>
                <svg class="expand" @click="adjustSidebar()" viewBox="0 0 448 512">
                  <path v-if="!sidebar_active" fill="#ffffff" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h24c6.6 0 12 5.4 12 12v100h100c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v100H12c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h100v100c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12zm176 0V368h100c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12z" class=""></path>
                  <path v-if="sidebar_active" fill="#ffffff" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H48v100c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v24c0 6.6 5.4 12 12 12h100v100c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-24c-6.6 0-12 5.4-12 12v100H300c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-24c0-6.6-5.4-12-12-12H48V332c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" class=""></path>
                </svg>
                <svg class="icon" width="32" height="32">
                  <path transform="translate(5, 32) scale(1.6) rotate(270)" fill="#ffffff" d="
                    M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z">
                  </path>
                  <!--path transform="translate(0, 7) scale(1.6)" fill="#ffffff" d="M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z"></path>
                  -->
                </svg>
              </div>
              <div class="content">
                <svg id="overview" width="800" height="800">
                </svg>
              </div>
            </div>
            <div class="marktool">
              <div class="header">
                <h5 class="title"> Mark </h5>
                <svg class="icon" width="32" height="32">
                  <path transform="translate(0, 7) scale(1.6)" fill="#ffffff" d="
                    M6 10l2-1 7-7-1-1-7 7-1 2zM4.52 13.548c-0.494-1.043-1.026-1.574-2.069-2.069l1.548-4.262 2-1.217 6-6h-3l-6 6-3 10 10-3 6-6v-3l-6 6-1.217 2z">
                  </path>
                </svg>
              </div>
              <div class="content">
                <div class="vc-compact">
                  <ul class="vc-compact-colors">
                    <li v-for="color in colors" class="vc-compact-color-item"
                      :style="{ background: color }" @click="current_color = color">
                      <div v-if="color == current_color" class="vc-compact-dot">
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="text-highlighter">
                  <p >
                  Text Highlighter
                  </p>
                  <svg @click="enable_highlight_text = enable_highlight_text == 1 ? 0 : 1" viewBox="0 0 512 512">
                      <path fill="#fff" :opacity="enable_highlight_text == 1 ? 1 : 0.3" d="M488.96,34.56c-28.16-30.72-76.8-30.72-107.52,0L133.12,282.88l107.52,110.08l248.32-250.88    C519.68,113.92,519.68,65.28,488.96,34.56z"/>
                      <polygon :fill="current_color" :opacity="enable_highlight_text == 1 ? 1 : 0.6" points="97.28,321.28 23.04,392.96 40.96,446.72 0,500.48 51.2,500.48 79.36,482.56 133.12,500.48 204.8,428.8   "/>
                  </svg>
                  <svg @click="enable_highlight_text = enable_highlight_text == 2 ? 0 : 2; current_color = 'rgba(0, 0, 0, 0)';" viewBox="0 0 512 512">
                    <path fill="#fff" :opacity="enable_highlight_text == 2 ? 1 : 0.3" d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 416H150.628l-80-80 124.686-124.686z"/>
                  </svg>
                </div>
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
  import textwidth from "./lib/text-width";
  import draggable from "vuedraggable";
  import {
    request,
    serverUrl
  } from "./lib/request";
  import SlideshowContainer from "./component/SlideshowContainer.vue";
  import colors from "./lib/colors";
  
  export default {
    name: "app",
    data() {
      return {
        enable_highlight_text: false,
        current_color: "#fff",
        colors: colors,
        slides: [],
        pages: [],
        page: null,
        videos: [],
        problems: [],
        groups: [[0]],
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
        overview: {
          width: 800,
          height: 400,
          padding: 50,
          question_offset_x: 10,
          question_offset_y: 22,
          area_width: 200,
          margin: 50,
          fontsize: 12,
          fontfamily: "Arial",
          textpadding_left_right: 5,
          textpadding_top_bottom: 5,
          layer_gap: 15,
          svg: null,
          position: {
            x: 0,
            y: 0
          }
        },
        bubblechart_layout: null,
        sidebar_active: false,
        active_items: [],
        moveto: new MoveTo({
          tolerance: 56,
          duration: 400
        }),
        viewport: {
          top: 0,
          bottom: 800,
          height: 800
        }
      };
    },
    components: {
      SlideshowContainer,
      draggable
    },
    mounted() {
      const colors = d3
        .select("#overview")
        .append("g")
        .attr("class", "color");
  
      this.overview.svg = d3
        .select("#overview")
        .append("g")
        .attr("transform", `translate(0,0)`);
  
      for (let i = 0; i < this.color_schema.length; ++i) {
        for (let j = 0; j < this.color_schema.length; ++j) {
          const defs = colors.append("defs");
          const grad = defs
            .append("linearGradient")
            .attr("id", `c${i}${j}`)
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", 1);
          grad
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", this.color_schema[i]);
          grad
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", this.color_schema[j]);
        }
      }
      window.onscroll = d => {
        this.viewport = {
          top: window.visualViewport.pageTop,
          bottom: window.visualViewport.pageTop + window.visualViewport.height,
          height: window.visualViewport.height
        };
      };
      axios
        .get(`${serverUrl}getVideoList`, {
          params: {
            courseId: this.course_id
          }
        })
        .then(response => {
          this.videos = response.data;
          this.videos.forEach(d => (this.id2item[d.id] = d));
        })
        .then(() => {
          axios
            .get(`${serverUrl}getProblemList`, {
              params: {
                courseId: this.course_id
              }
            })
            .then(response => {
              this.problems = response.data;
              this.problems.forEach(d => (this.id2item[d.id] = d));
            });
        })
        .then(() => {
          axios
            .get(`${serverUrl}getChapterList`, {
              params: {
                courseId: this.course_id
              }
            })
            .then(async response => {
              this.chapters = response.data;
              this.chapters.forEach(d => (this.id2item[d.id] = d));
            });
        });
    },
    computed: {
      history() {
        return [].concat(...this.pages);
      },
      slide() {
        if (this.page && this.page.length == 1) {
          return this.page[0];
        }
        const elements = document.getElementsByClassName("slideshow-page");
        return this.page ?
          this.page.find((item, index) => {
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
          }) :
          null;
      },
      context() {
        return {
          current_chapter: this.current_chapter,
          videos: this.videos,
          chapters: this.chapters,
          problems: this.problems,
          slides: this.slides,
          history: this.history,
          groups: this.groups,
          id2item: this.id2item,
          color_schema: this.color_schema,
          video_color: this.color_schema[1],
          assignment_color: this.color_schema[3],
          page: this.page,
          pages: this.pages,
          enable_highlight_text: this.enable_highlight_text,
          current_color: this.current_color,
          selectVideo: (item, parent) => this.findNext(parent, {
            id: "V5", resource_id: item.id, group: parent.group
          }),
          selectAssignment: (item, parent) => {},
          selectStudent: (item, parent) => {},
          selectChapter: (item, parent) => {},
          loadSlide: (id, resource_id, parent) => this.findNext(parent, {
            id, resource_id, group: parent.group
          }),
          followupSlides: slide =>
            slide.follow_ups.map(d => ({
              name: SlideTemplate.questions[d],
              type: d
            })),
          moveto: this.moveto
        };
      },
      overview_graph() {
        let nodes = [];
        let edges = [];
        let nodes_num = 0;
        for (const x of this.history) {
          if (
            x.parent &&
            SlideTemplate.relation.groupIdOf(x.id) ==
            SlideTemplate.relation.groupIdOf(x.parent.id) &&
            x.scope_id == x.parent.scope_id
          ) {
            x.group_id = x.parent.group_id;
          } else {
            x.group_id = nodes_num++;
            nodes.push([]);
            if (x.parent) {
              edges.push({
                source: x.parent.group_id,
                target: x.group_id
              });
            }
          }
          nodes[x.group_id].push(x);
        }
  
        const virtualnodes = [];
        const virtualedges = [];
  
        for (var i = 0; i < nodes.length; ++i) {
          const node = nodes[i];
          const ids = node.map(d => d.id);
          const group_id = SlideTemplate.relation.groupIdOf(node[0].id);
          const virtualnode = SlideTemplate.relation.groups[group_id]
            .filter(d => !ids.includes(d))
            .map(d => ({
              name: SlideTemplate.questions[d],
              abbrname: SlideTemplate.abbr_questions[d],
              type: node[0].type,
              id: d,
              _id: -1,
              parent_id: node[0]._id,
            }));
          for (const x of virtualnode) {
            node.push(x);
          }
  
          const targets = edges
            .filter(d => d.source == i)
            .map(d => SlideTemplate.relation.groupIdOf(nodes[d.target][0].id));
          let virtualtargets = SlideTemplate.relation.edges.filter(
            d => group_id == d.source && !targets.includes(d.target)
          );
          virtualtargets = virtualtargets.map(d =>
            SlideTemplate.relation.groups[d.target].map(e => ({
              name: SlideTemplate.questions[e],
              abbrname: SlideTemplate.abbr_questions[e],
              type: SlideTemplate.relation.grouptype[d.target],
              id: e,
              _id: -1,
              parent_id: node[0]._id,
            }))
          );
          for (const target of virtualtargets) {
            virtualnodes.push(target);
            virtualedges.push({
              source: i,
              target: nodes_num
            });
            nodes_num++;
          }
        }
        nodes = nodes.concat(virtualnodes);
        edges = edges.concat(virtualedges);
        const depth = [];
        for (let i = 0; i < nodes.length; ++i) {
          depth[i] = Math.max(
            ...edges
            .filter(e => e.target == i)
            .map(e => depth[e.source] + 1)
            .concat([0])
          );
        }
        const max_depth = Math.max(...depth) + 1;
        nodes = nodes.map((d, i) => {
          const padding = 25;
          const data = d.map(item => ({
            _id: item._id,
            name: item.abbrname,
            parent_id: item.parent_id,
            id: item.id,
            type: item.type,
            padding: padding,
            height: this.overview.fontsize + 2 * this.overview.textpadding_top_bottom,
            width: padding +
              2 * this.overview.textpadding_left_right +
              textwidth(item.abbrname, {
                family: this.overview.fontfamily,
                size: this.overview.fontsize
              })
          }));
          const max_width = Math.max(
            ...data.map(t => t.width + 2 * this.overview.textpadding_top_bottom)
          );
          data.forEach((t, i) => {
            t.x = (max_width - t.width) / 2;
            t.y =
              i == 0 ?
              0 :
              data[i - 1].y +
              data[i - 1].height +
              this.overview.textpadding_top_bottom;
          });
          return {
            depth: depth[i],
            data: data,
            height: Math.max(...data.map(t => t.height + t.y)),
            width: max_width,
            index: i
          };
        });
        const cdegree = {};
        edges = edges.map(d => {
          cdegree[d.source] = (cdegree[d.source] || 0) + 1;
          return {
            rank: cdegree[d.source] - 1 || 0,
            source: nodes[d.source],
            target: nodes[d.target]
          };
        });
  
        nodes.forEach(d => {
          d.degree = edges.filter(e => e.source == d).length || 1;
        });
  
        const width = this.overview.width - this.overview.padding * 2;
        const height = this.overview.height - this.overview.padding * 2;
  
        let y1 = this.overview.padding;
        const margin = 20;
        const max_offset = 20;
        const layer_gap = this.overview.layer_gap;
        for (let i = 0; i < max_depth; ++i) {
          const nodes_i = nodes
            .filter(d => d.depth == i)
            .sort(
              (a, b) =>
              edges.find(d => d.target == a).source.x -
              edges.find(d => d.target == b).source.x
            );
          const n = nodes_i.length;
  
          let x1 = 0;
          nodes_i.forEach((d, j) => {
            d.x = x1;
            x1 += d.width;
          });
          nodes_i.forEach(d => {
            d.x = this.overview.padding + width / 2 + d.x - x1 / 2;
            d.y = y1;
          });
          nodes_i.forEach((d, j) => {
            const from = edges.find(e => e.target == d);
            if (!from) return;
            const parent = edges.find(e => e.target == d).source;
            if (
              parent.x + max_offset < d.x &&
              (j == 0 ||
                parent.x > nodes_i[j - 1].x + nodes_i[j - 1].width + margin)
            ) {
              const delta = d.x - parent.x;
              for (var k = j; k < nodes_i.length; ++k) {
                nodes_i[k].x -= delta;
              }
            }
          });
          const max_degree = Math.max(...nodes_i.map(d => d.degree)) || 1;
          y1 += Math.max(...nodes_i.map(d => d.height));
          if (i != max_depth - 1) {
            y1 += layer_gap * max_degree;
          }
        }
  
        nodes.forEach(d => {
          // d.y = this.overview.padding + height / 2 + d.y - y1 / 2;
          d.background = [];
          for (let i = 0; i < d.data.length; ++i) {
            const t = d.data[i];
            const shorter_than_prev = i && t.width < d.data[i - 1].width;
            d.background.push({
              x0: t.x - 5,
              x1: t.x + t.width + 5,
              y: t.y + (shorter_than_prev ? 5 : -5)
            });
            const shorter_than_next =
              i + 1 < d.data.length && t.width < d.data[i + 1].width;
            d.background.push({
              x0: t.x - 5,
              x1: t.x + t.width + 5,
              y: t.y + t.height + (shorter_than_next ? -5 : 5)
            });
          }
          d.type = d.data[0].type;
          d.top = d.background[0];
          d.bottom = d.background[d.background.length - 1];
        });
  
        return {
          nodes,
          edges
        };
      }
    },
    watch: {
      slides(val) {
        // this.bubblechart_layout = getBubbleChart(d3.select("#overview"), this.slide_structure);
      }
    },
    methods: {
      paintOverview() {
        const graph = this.overview_graph;
        const svg = this.overview.svg;
        svg.selectAll("*").remove();
  
        const view = svg
          .append("g")
          .attr("class", "view")
          .attr(
            "transform",
            `translate(${this.overview.padding},${this.overview.padding})`
          );
  
        const nodes = view
          .selectAll(".nodes")
          .data(graph.nodes)
          .enter()
          .append("g")
          .attr("class", "nodes")
          .attr("transform", d => `translate(${d.x},${d.y})`);
  
        const edges = view
          .selectAll(".edges")
          .data(graph.edges)
          .enter()
          .append("g")
          .attr("class", "edges");
  
        const edge_color_scale = e => {
          let a = ["video", "assignment", "student", "forum"].indexOf(
            e.source.type
          );
          let b = ["video", "assignment", "student", "forum"].indexOf(
            e.target.type
          );
          if (a == -1) a = 8;
          else a = a * 2;
          if (b == -1) b = 8;
          else b = b * 2;
          return `url(#c${a}${b})`;
        };
  
        edges
          .append("path")
          .attr("d", (d, i) => {
            const x0 =
              d.source.x +
              d.source.bottom.x0 +
              (d.source.bottom.x1 - d.source.bottom.x0) *
              (d.rank / d.source.degree);
            const y0 = d.source.y + d.source.height + 4.9;
            const x1 =
              d.source.x +
              d.source.bottom.x0 +
              (d.source.bottom.x1 - d.source.bottom.x0) *
              ((d.rank + 1) / d.source.degree);
            const y1 = d.source.y + d.source.height + 4.9;
            const x2 = d.target.x + d.target.top.x0;
            const y2 = d.target.y - 4.9;
            const x3 = d.target.x + d.target.top.x1;
            const y3 = d.target.y - 4.9;
            return `M${x0},${y0} 
              C${x0},${(y0 * 2 + y2) / 3}
              ${x2},${(y0 + y2 * 2) / 3}
              ${x2},${y2}
              L${x3},${y3} 
              C${x3},${(y3 * 2 + y1) / 3}
              ${x1},${(y3 + y1 * 2) / 3}
              ${x1},${y1}
              Z`;
          })
          .attr("fill", d => edge_color_scale(d))
          .attr("opacity", 0.2);
  
        const color_schema = type => {
          const schema = [
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
          ];
          if (type == "video") {
            return schema.slice(0, 2);
          } else if (type == "assignment") {
            return schema.slice(2, 4);
          } else if (type == "student") {
            return schema.slice(4, 6);
          } else if (type == "forum") {
            return schema.slice(6, 8);
          } else {
            return schema.slice(8, 10);
          }
        };
  
        const text_dx = 25;
        const text_dy = 14;
        const color_scale = d => color_schema(d.type)[0];
        const type_color_scale = type => color_schema(type)[0];
  
        const outerArea = d3
          .area()
          .curve(d3.curveBasis)
          .x0(d => d.x0)
          .x1(d => d.x1)
          .y(d => d.y);
  
        nodes
          .append("path")
          .attr("d", d => outerArea(d.background))
          .style("fill", d => color_scale(d))
          .style("opacity", 0.2);
  
        const items = nodes
          .selectAll(".node")
          .data(d => d.data)
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.x},${d.y})`)
          .on("click", d => {
            if (d._id == -1) {
              const parent = this.history.find(e => e._id == d.parent_id);
              this.findNext(parent, { id: d.id, resource_id: null, group: parent.group });
            } else {
              this.findNext(null, this.history.find(e => e._id == d._id));
            }
          });
  
        items
          .append("rect")
          .attr("width", d => d.width)
          .attr("height", d => d.height)
          .attr("rx", 5)
          .attr("ry", 5)
          .style("fill", d => color_scale(d))
          .style("fill-opacity", d => (d._id == -1 ? 0.5 : 1));
  
        items
          .append("circle")
          .attr("cx", 10)
          .attr("cy", d => d.height / 2)
          .attr("r", 5)
          .style("fill", "white")
          .style("fill-opacity", d => (d._id == -1 ? 0.3 : 1));
  
        items
          .append("text")
          .text(d => d.name)
          .attr("dx", d => d.padding)
          .attr("dy", d => d.height / 2 + 4)
          .style("font-size", "12px")
          .style("font-family", "Arial")
          .style("fill", d => (d._id == -1 ? "#bbbbbb" : "white"));
      },
      async findNext(state1, state2) {
        // jump
        if (!state2.item) {
          let item = null;
          if (Array.isArray(this.page) &&
            (item = this.page.find(d => 
                d.resource_id == state2.resource_id && 
                d.id == state2.id && d.group == state2.group
            ))
          ) {
            state2.item = item;
          }
        }
      
        if (state2.item) {
          const item = state2.item;
          var index = -1;
          if ((index = this.page.indexOf(item)) != -1) {
            const element = document.getElementsByClassName("slideshow-page")[index];
            this.moveto.move(element);
            this.adjustOverviewViewport(item);
          } else {
            this.page = this.pages.find(page => page.includes(item));
            setTimeout(() => {
              index = this.page.indexOf(item);
              const element = document.getElementsByClassName("slideshow-page")[index];
              this.moveto.move(element);
              this.adjustOverviewViewport(item);
            }, 200);
          }
        } else {
          if (state2.resource_id == null) {
            if (state1 && state1.id && state2.id && SlideTemplate.scopeOf(state1.id) == SlideTemplate.scopeOf(state2.id)) {
              state2.resource_id = state1.resource_id;
            } else {
              return;
            }
          }
          const item = SlideTemplate.create(state2.id, state2.resource_id);
          item.group = (state2.group || state2.group == 0) ? state2.group : state1.group;
          return Promise.all(
            item.resources.map(type => {
              return request(this, item, type);
            })
          ).then(async() => {
            item.loaded = true;
            item.parent = state1;
            const last = this.page && this.page.length && this.page[this.page.length - 1];
            if (!this.page || 
              (last && !SlideTemplate.relation.isAdjacent(last.id, item.id)) || 
              (last && last.group != item.group)) {
              this.page = [];
              this.pages.push(this.page);
            }
            this.page.push(item);
            this.trigger_counter += 1;
            this.$nextTick(() => {
              this.findNext(null, item);
            });
            this.paintOverview();
          });
        }
      },
      async chapterDropdownClick(chapter) {
        this.current_chapter = chapter;
        await this.findNext(null, { id: "O1", resource_id: chapter.id, group: 0, item: null });
      },
      onChangePage(page) {
        if (this.page != page) {
          this.page = page;
        }
      },
      adjustSidebar() {
        this.sidebar_active = !this.sidebar_active;
        this.adjustOverviewViewport();
      },
      adjustOverviewViewport(item) {
        if (this.sidebar_active) {
          this.overview.svg
            .select(".view")
            .attr(
              "transform",
              `translate(
                ${this.overview.position.x}, ${this.overview.position.y})`
            )
            .transition()
            .duration(500)
            .attr("transform", `translate(0, 0)`);
          this.overview.position = {
            x: 0,
            y: 0
          };
        } else {
          item = item || this.slide;
          if (!item) return;
          const node = this.overview_graph.nodes.find(d =>
            d.data.map(e => e._id).includes(item._id)
          );
          if (!node) return;
          const x = -(node.x + node.width / 2) + 150;
          const y = -node.y + this.overview.padding;
          const position = {
            x,
            y
          };
          this.overview.svg
            .select(".view")
            .attr(
              "transform",
              `translate(
              ${this.overview.position.x}, ${this.overview.position.y})`
            )
            .transition()
            .duration(500)
            .attr(
              "transform",
              `translate(
              ${position.x}, ${position.y})`
            );
          this.overview.position = position;
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
    transition: 0.2s;
    transition-timing-function: ease-in-out;
  }
  
  .sidebar-container.tool.open {
    width: 60vw;
    left: 40vw;
  }
  
  .sidebar-container.tool .header {
    background: radial-gradient(circle at top, #353a3f, #333333);
    position: relative;
  }
  
  .sidebar-container.tool .header svg.icon {
    position: absolute;
    left: 36%;
    top: 0vh;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
  }
  
  .sidebar-container.tool.open .header svg.icon {
    position: absolute;
    left: 12%;
    top: 0vh;
  }
  
  .sidebar-container.tool .header svg.expand {
    position: absolute;
    display: block;
    left: 88%;
    top: 0.5vh;
    width: 32px;
    height: 32px;
    opacity: 0.3;
  }
  
  .sidebar-container.tool .header svg.expand:hover {
    opacity: 1;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
  }
  
  .sidebar-container.tool.open .header svg.expand {
    left: 96%;
  }
  
  .sidebar-container.tool .content {
    background: radial-gradient(circle at top, #333333, #111111);
  }
  
  .sidebar-container.tool .overview .content {
    height: 40vh;
  }
  
  .sidebar-container.tool.open .overview .content {
    height:83vh;
  }
  
  .sidebar-container.tool .review .content {
    height: 30vh;
  }
  
  .sidebar-container.tool .marktool .content {
    height: 40vh;
  }

  .sidebar-container.tool .text-highlighter {
    display: inline-flex;
    width: 100%;
    padding-top: 5px;
    padding-left: 5px;
    border-radius: 2px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.16);
    background-color: rgba(0, 0, 0, 0);
  }

  .sidebar-container.tool .text-highlighter p {
    font-size: 16px;
    font-weight: 700;
    padding-left: 1vw;
    margin-top: 0.7vh;
    margin-bottom: 0.4vh;
  }
  .sidebar-container.tool .text-highlighter svg {
    margin-left: 2vw;
    margin-top: 0.4vh;
    margin-bottom: 0.4vh;
    width: 32px; 
    height: 32px
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
    opacity: 1;
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
    top: 92vh;
    left: 65vw;
    opacity: 0.6;
  }
  
  .page {
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
  
  .sidebar-container.slideshow .page.active {
    border-color: #aaaaaa;
    border-width: 1.5px;
    opacity: 1;
  }
  
  .sidebar-container.slideshow .page:hover {
    border-color: #a0a0a0;
    border-width: 1.5px;
    opacity: 1;
  }
  
  #overview {
    width: 100%;
    height: 100%;
  }
  
  #overview .node:hover rect {
    stroke-width: 3;
    stroke: lightgray;
    stroke-opacity: 1;
  }
  
  .vc-compact {
    padding-top: 5px;
    padding-left: 5px;
    width: 20vw;
    border-radius: 2px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.16);
    background-color: rgba(0, 0, 0, 0);
  }
  
  .vc-compact-colors {
    overflow: hidden;
    padding: 0;
    margin: 0;
  }
  
  .vc-compact-color-item {
    list-style: none;
    width: 15px;
    height: 15px;
    border-width: 0.5px;
    border-style: solid;
    border-color: rgba(255,255,255,0.1);
    float: left;
    margin-right: 5px;
    margin-bottom: 5px;
    position: relative;
    cursor: pointer;
  }
  
  .vc-compact-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-radius: 50%;
    opacity: 1;
    background: #fff;
}
</style>
