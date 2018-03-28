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
          <n-svg type="history" class="icon"></n-svg>
        </div>
        <div class="content">
          <template v-for="page, index in pages">
            <draggable :list="page">
              <div v-for="item in page" class="page" @click="findNext(null, item)" :class="{ active: item == slide }">
                <div> {{`${item.name}`}} </div>
                <n-svg :type="item.chart_type" style="opacity:0.15"></n-svg>
              </div>
            </draggable>
            <hr v-if="index != pages.length - 1">
          </template>
        </div>
      </div>
      <div class="body-container">
        <slideshow-container v-for="item in pages" :context="context" :page="item" v-show="item == page">
          <div class="slide nm-block" v-if="(!page || !page.length) && !context.current_chapter">
            <b-list-group>
              <b-list-group-item v-for="chapter in context.chapters" 
                href="javascript:void(0);"
                @click="current_chapter = chapter"
                >{{ chapter.name }}
                  (
                    {{ new Date(chapter.start).toDateString().slice(4) }}
                  ) 
              </b-list-group-item>
            </b-list-group>
          </div>
          <div class="slide nm-block" v-if="(page && !page.length) && context.current_chapter"
            style="list-style: none; padding-top: 5vh;">
            <div style="width: 50%; float: left;">
              <h5> Overall Questions </h5>
              <ul>
                <li v-for="id in 'O1 O2 O3 O4'.split(' ')">
                  <b-link href="javascript:void(0);"
                  @click="startPage(id)">
                    {{ questions[id] }}
                  </b-link>
                </li>
              </ul>
              <h5> Assignment Questions </h5>
              <ul>
                <li v-for="id in 'A1 A2 A3 A4'.split(' ')">
                  <b-link href="javascript:void(0);"
                  @click="startPage(id)">
                    {{ questions[id] }}
                  </b-link>
                </li>
              </ul>
              <h5> Video Questions </h5>
              <ul>
                <li v-for="id in 'V1 V2 V3 V4'.split(' ')">
                  <b-link href="javascript:void(0);"
                  @click="startPage(id)">
                    {{ questions[id] }}
                  </b-link>
                </li>
              </ul>
              <h5> Forum Questions </h5>
              <ul>
                <li v-for="id in 'F1 F2 F3'.split(' ')">
                  <b-link href="javascript:void(0);"
                  @click="startPage(id)">
                    {{ questions[id] }}
                  </b-link>
                </li>
              </ul>
            </div>
            <div style="width: 50%; float: left;">
              <h5> Learner Oriented Questions </h5>
              <ul>
                <li v-for="id in 'S1 S2 S3'.split(' ')">
                  <b-link href="javascript:void(0);"
                  @click="startPage(id)">
                    {{ questions[id] }}
                  </b-link>
                </li>
              </ul>
            </div>
          </div>
        </slideshow-container>
        <div class="carousel-remove" v-if="pages.length > 1 && page && !presentation_mode">
          <b-button-toolbar key-nav aria-label="Toolbar with button groups">
            <b-button-group class="mx-1">
              <b-btn size="sm" variant="outline-secondary"
                @click="removeCurrentPage()"
              >X</b-btn>
            </b-button-group>
          </b-button-toolbar>
        </div>
        <div class="carousel-switcher" v-if="pages && !presentation_mode">
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
      <div class="screen-bottom-tips" 
        v-if="pages && presentation_mode && bottom_tip_enabled"
        @click="bottom_tip_enabled = false">
        <h3> {{ page_index == 0 ? 'Press ↓ to Next' : 'Press ← to Back'}} </h3>
      </div>
      <div class="sidebar-container tool" :class="{ open: sidebar_active }">
        <div class="overview">
          <div class="header">
            <h5 class="title"> Overview </h5>
            <n-svg class="expand" type="expand" v-if="!sidebar_active" @click="adjustSidebar()"></n-svg>
            <n-svg class="expand" type="shrink" v-if="sidebar_active" @click="adjustSidebar()"></n-svg>
            <n-svg class="icon" type="overview"></n-svg>
          </div>
          <div class="content">
            <svg id="overview" width="800" height="800">
            </svg>
          </div>
        </div>
        <div class="marktool">
          <div class="header">
            <h5 class="title"> Mark </h5>
            <n-svg class="icon" type="pencil"></n-svg>
          </div>
          <div class="content">
            <div class="vc-compact" v-if="!presentation_mode">
              <ul class="vc-compact-colors">
                <li v-for="color in colors" class="vc-compact-color-item"
                  :style="{ background: color }" @click="current_color = color">
                  <div v-if="color == current_color" class="vc-compact-dot">
                  </div>
                </li>
              </ul>
            </div>
            <div class="text-highlighter" v-if="!presentation_mode">
              <p>
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
            <div class="box chart-highlighter" :class="{ active: enable_highlight_chart }"  v-if="!presentation_mode">
              <p>
              Chart Highlighter
              </p>
              <n-svg @click="onChartHighlight" type="chart"></n-svg>
            </div>
            <div class="text-box" @click="addTextbox"  v-if="!presentation_mode">
              <p>
              Add Textbox
              </p>
              <n-svg type="textbox"></n-svg>
            </div>
            <div class="box interaction-box" @click="addTextbox"  v-if="!presentation_mode">
              <p>
                Add Related Question
              </p>
              <n-svg type="jump"></n-svg>
            </div>
            <div class="box presentation-box">
              <p>
                Presentation Mode
              </p>
              <n-svg
                @click="presentation_mode = !presentation_mode"
                :style="{ opacity: presentation_mode ? 1 : 0.5 }"
                type="presentation">
              </n-svg>
            </div>
            <div class="box file-box">
              <p>
                File
              </p>
              <b-dropdown variant="link" size="lg" no-caret>
                <template slot="button-content">
                  <n-svg type="load"></n-svg>
                </template>
                <b-dropdown-item-button v-for="id in stories" @click="loadStory(id)">
                  load the story of {{ new Date(id).toISOString().replace(/-/g, '.').replace(/T/, ',').slice(5, 16) }}
                </b-dropdown-item-button>
              </b-dropdown>
              <n-svg @click="saveStory()" type="save"></n-svg>
              <b-dropdown variant="link" size="lg" no-caret>
                <template slot="button-content">
                  <n-svg type="remove"></n-svg>
                </template>
                <b-dropdown-item-button v-for="id in stories" @click="removeStory(id)">
                  remove the story of {{ new Date(id).toISOString().replace(/-/g, '.').replace(/T/, ',').slice(5, 16) }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import * as d3 from "d3";
import * as MoveTo from "moveto";
import * as SlideTemplate from "./lib/slidetemplate";
import draggable from "vuedraggable";
import { request, serverUrl } from "./lib/request";
import { get_overview_graph, paintOverview } from "./lib/overview_v1";
import SlideshowContainer from "./component/SlideshowContainer.vue";
import { colors, color_schema } from "./lib/colors";
import { local } from "d3";
import NSvg from "./component/Widgets/NSvg.vue";

export default {
  name: "app",
  data() {
    return {
      is_painting: false,
      stories: JSON.parse(localStorage.getItem('narrative_mooc_stories') || '[]'),
      page_index: 0,
      bottom_tip_enabled: true,
      current_case_study: "",
      case_studys: [],
      enable_highlight_text: false,
      current_color: "#fff",
      current_element_id: null,
      overview_graph: null,
      colors: colors,
      pages: [],
      page: null,
      questions: JSON.parse(JSON.stringify(SlideTemplate.questions)),
      videos: [],
      problems: [],
      groups: [null],
      chapters: [],
      presentation_mode: false,
      // current_video: null,
      // current_problem: null,
      current_chapter: null,
      trigger_counter: 0,
      color_schema: color_schema,
      enable_highlight_chart: false,
      course_name: "Introduction to Computing with Java",
      course_id: "HKUSTx_COMP102x_2T2014",
      $bus: new Vue(),
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
      sidebar_active: false,
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
    draggable,
    NSvg
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
      const height = document.documentElement.clientHeight;
      const top = -document.body.getBoundingClientRect().top;
      this.viewport = {
        top,
        height,
        bottom: top + height,
      };
    };

    this.$bus.$on("select_chapter", item => {
      if (!this.current_chapter) {
        this.current_chapter = item;
      }
    });

    this.$bus.$on("select_video", (item, parent) => {
      this.findNext(parent, {
        id: "V5",
        resource_id: item.id,
        group: parent.group
      });
    });

    this.$bus.$on("select_assignment", (item, parent) => {
      this.findNext(parent, {
        id: "A6",
        resource_id: item.id,
        group: parent.group
      });
    });

    this.$bus.$on("select_student", (item, parent) => {
      this.groups.push(item.users);
      this.findNext(parent, {
        id: "S1",
        resource_id: this.current_chapter.id,
        condition: item.users,
        group: this.groups.length - 1
      });
    });

    this.$bus.$on("load_slide", (id, resource_id, parent) => {
      this.findNext(parent, {
        id,
        resource_id,
        group: parent.group
      });
    });

    axios
      .get(`${serverUrl}getVideoList`, {
        params: {
          courseId: this.course_id
        }
      })
      .then(response => {
        this.videos = response.data;
        this.videos.forEach(d => (this.$mapping[d.id] = d));
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
            this.problems.forEach(d => (this.$mapping[d.id] = d));
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
            this.chapters.forEach(d => (this.$mapping[d.id] = d));
            this.page = [];
            this.pages.push(this.page);
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
      const elements = document.getElementsByClassName("slide-page");
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
        presentation_mode: this.presentation_mode,
        current_element_id: this.current_element_id,
        current_chapter: this.current_chapter,
        videos: this.videos,
        chapters: this.chapters,
        problems: this.problems,
        history: this.history,
        groups: this.groups,
        color_schema: this.color_schema,
        video_color: this.color_schema[1],
        assignment_color: this.color_schema[3],
        page: this.page,
        pages: this.pages,
        enable_highlight_text: this.enable_highlight_text,
        enable_highlight_chart: this.enable_highlight_chart,
        current_color: this.current_color,
        moveto: this.moveto
      };
    }
  },
  watch: {
    page(val) {
      this.page_index = this.pages.indexOf(val);
    },
    current_color(val) {},
    presentation_mode(val) {
      this.$bus.$emit("presentation", val);
      this.bottom_tip_enabled = true;
      if (val) {
        const pages = document.getElementsByClassName("slide-page");
        const elements = [];
        for (const page of pages) {
          const contents = page.getElementsByClassName("nm-block");
          for (const content of contents) {
            content.style.opacity = 0;
            elements.push({
              cursor: page,
              target: content
            });
          }
        }
        let step = 0;
        this.paintOverview();

        document.onkeydown = event => {
          if (event.keyCode == 37) {
            this.page = this.pages[0];
            this.moveto.move(elements[step].cursor);
          } else if (event.keyCode == 38 && this.page_index == 0) {
            while (
              step > 0 &&
              elements[step - 1].target.getElementsByClassName("nm-block")
                .length > 1
            ) {
              elements[--step].target.style.opacity = 0;
            }
            if (step > 0) {
              elements[--step].target.style.opacity = 0;
              if (step > 0) {
                this.moveto.move(elements[step - 1].cursor);
                const entities = elements[
                  step - 1
                ].target.getElementsByClassName("entity");
                if (entities.length) {
                  const entity_id = entities[0].title;
                  this.current_element_id = entity_id;
                  this.$bus.$emit("refresh-chart", entity_id);
                } else {
                  this.$bus.$emit("refresh-chart", "");
                }
              }
              const height = document.documentElement.clientHeight;
              const top = -document.body.getBoundingClientRect().top;
              this.viewport = {
                top,
                height,
                bottom: top + height,
              };
              this.adjustOverviewViewport();
            }
            event.returnValue = false;
          } else if (event.keyCode == 40 && this.page_index == 0) {
            while (
              step < elements.length &&
              elements[step].target.getElementsByClassName("nm-block").length >
                1
            ) {
              elements[step++].target.style.opacity = 1;
            }
            if (step < elements.length) {
              elements[step].target.style.opacity = 1;
              this.moveto.move(elements[step].cursor);
              elements[step].target.style.opacity = 1;
              const entities = elements[step].target.getElementsByClassName(
                "entity"
              );
              if (entities.length) {
                const entity_id = entities[0].title;
                this.current_element_id = entity_id;
                this.$bus.$emit("refresh-chart", entity_id);
              } else {
                this.$bus.$emit("refresh-chart", "");
              }
              const height = document.documentElement.clientHeight;
              const top = -document.body.getBoundingClientRect().top;
              this.viewport = {
                top,
                height,
                bottom: top + height,
              };
              this.adjustOverviewViewport();
              step += 1;
            }
            event.returnValue = false;
          }
        };
      } else {
        document.onkeydown = event => {};
      }
    }
  },
  methods: {
    getSlide() {
      if (this.page && this.page.length == 1) {
        return this.page[0];
      }
      const elements = document.getElementsByClassName("slide-page");
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
    get_overview_graph() {
      return get_overview_graph(this);
    },
    saveStory() {
      const data = JSON.stringify({
        videos: this.videos,
        problems: this.problems,
        chapters: this.chapters,
        current_chapter_id: this.current_chapter.id,
        pages: this.pages,
        groups: this.groups,
      });
      const time = +new Date();
      this.stories.push(time);
      localStorage.setItem('narrative_mooc_stories', JSON.stringify(this.stories));
      localStorage.setItem(`narrative_mooc_${time}`, data);
      alert('Save successful!');
    },
    loadStory(id) {
      const data = JSON.parse(localStorage.getItem(`narrative_mooc_${id}`));
      this.videos = data.videos;
      this.problems = data.problems;
      this.chapters = data.chapters;
      this.groups = data.groups;
      this.videos.forEach(d => (this.$mapping[d.id] = d));
      this.problems.forEach(d => (this.$mapping[d.id] = d));
      this.chapters.forEach(d => (this.$mapping[d.id] = d));
      const current_chapter_id = data.current_chapter_id;
      this.current_chapter = this.chapters.find(
        d => d.id == current_chapter_id
      );
      this.pages = data.pages;
      this.page = this.pages && this.pages.length && this.pages[0];
      this.paintOverview();
    },
    removeStory(id) {
      localStorage.removeItem(`narrative_mooc_${id}`);
      this.stories.splice(this.stories.indexOf(id));
      localStorage.setItem('narrative_mooc_stories', JSON.stringify(this.stories));
    },
    paintOverview() {
      paintOverview(this);
    },
    async findNext(state1, state2) {
      // jump
      let item = null;
      if (
        !state2.item &&
        (Array.isArray(this.history) &&
          (item = this.history.find(
            d =>
              d.resource_id == state2.resource_id &&
              d.id == state2.id &&
              d.group == state2.group
          )))
      ) {
        var index = -1;
        if ((index = this.page.indexOf(item)) != -1) {
          const element = document.getElementsByClassName("slide-page")[index];
          this.moveto.move(element);
          this.adjustOverviewViewport(item);
        } else {
          this.page = this.pages.find(page => page.includes(item));
          setTimeout(() => {
            index = this.page.indexOf(item);
            const element = document.getElementsByClassName("slide-page")[
              index
            ];
            this.moveto.move(element);
            this.adjustOverviewViewport(item);
          }, 200);
        }
      } else if (state2.item) {
        item = state2.item;
        var index = -1;
        if ((index = this.page.indexOf(item)) != -1) {
          const element = document.getElementsByClassName("slide-page")[index];
          this.moveto.move(element);
          this.adjustOverviewViewport(item);
        } else {
          this.page = this.pages.find(page => page.includes(item));
          setTimeout(() => {
            index = this.page.indexOf(item);
            const element = document.getElementsByClassName("slide-page")[
              index
            ];
            this.moveto.move(element);
            this.adjustOverviewViewport(item);
          }, 200);
        }
      } else {
        if (state2.resource_id == null) {
          if (
            state1 &&
            state1.id &&
            state2.id &&
            SlideTemplate.scopeOf(state1.id) == SlideTemplate.scopeOf(state2.id)
          ) {
            state2.resource_id = state1.resource_id;
          } else {
            return;
          }
        }
        item = SlideTemplate.create(state2.id, state2.resource_id);
        item.resource_data =
          state2.resource_data || (state1 && state1.resource_data);
        item.group =
          state2.group || state2.group == 0 ? state2.group : state1.group;
        return Promise.all(
          item.resources.map(type => request(this, item, type))
        ).then(async () => {
          item.loaded = true;
          item.parent = state1 && state1._id;
          const last =
            this.page && this.page.length && this.page[this.page.length - 1];
          if (
            !this.page ||
            // (last && !SlideTemplate.relation.isAdjacent(last.id, item.id)) ||
            (last && last.group != item.group)
          ) {
            this.page = [];
            this.pages.push(this.page);
          }
          this.page.push(item);
          this.overview_graph = this.get_overview_graph();
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
      await this.findNext(null, {
        id: "O1",
        resource_id: chapter.id,
        group: 0,
        item: null
      });
    },
    async startPage(id) {
      await this.findNext(null, {
        id: id,
        resource_id: this.current_chapter.id,
        condition: {},
        group: 0,
        item: null
      });
    },
    onChangePage(page) {
      if (this.page != page) {
        this.page = page;
        this.overview_graph = this.get_overview_graph();
        /*
          this.$sr.reveal('.slide', {
            rotate: {x: 65} 
          });
          */
      }
    },
    adjustSidebar() {
      this.sidebar_active = !this.sidebar_active;
      this.adjustOverviewViewport();
    },
    addTextbox() {
      if (this.slide) {
        this.$bus.$emit("add-textbox", this.slide._id);
      }
    },
    removeCurrentPage() {
      const current = this.pages.indexOf(this.page);
      this.pages.splice(current);
      this.page = this.pages[this.pages.length > current ? current : Math.max(0, current - 1)];
    },
    onChartHighlight() {
      this.enable_highlight_chart = !this.enable_highlight_chart;
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
        item = item || this.getSlide();
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
  padding-right: 10px;
  overflow-x: hidden;
}

.page-container .body-container {
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
}

.body-container {
  height: 100%;
  width: 80%;
  display: inline-flex;
  flex-direction: row;
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

.sidebar-container.tool {
  width: 20%;
  left: 80%;
  background: radial-gradient(circle at top, #333333, #111111);
  position: fixed;
  transition: 0.2s;
  overflow-y: hidden;
  transition-timing-function: ease-in-out;
}

.sidebar-container.tool.open {
  width: 60%;
  left: 40%;
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
  height: 83vh;
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
  height: 32px;
}

.sidebar-container.tool .text-box {
  display: inline-flex;
  width: 100%;
  padding-top: 5px;
  padding-left: 5px;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.16);
  background-color: rgba(0, 0, 0, 0);
}

.sidebar-container.tool .text-box p {
  font-size: 16px;
  font-weight: 700;
  padding-left: 1vw;
  margin-top: 0.7vh;
  margin-bottom: 0.4vh;
}
.sidebar-container.tool .text-box svg {
  margin-left: 4vw;
  margin-top: 0.4vh;
  margin-bottom: 0.4vh;
  width: 32px;
  height: 32px;
  opacity: 0.5;
}
.sidebar-container.tool .text-box svg:hover {
  opacity: 1;
}

.sidebar-container.tool .box {
  display: inline-flex;
  width: 100%;
  padding-top: 5px;
  padding-left: 5px;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.16);
  background-color: rgba(0, 0, 0, 0);
}

.sidebar-container.tool .box p {
  font-size: 16px;
  font-weight: 700;
  padding-left: 1vw;
  margin-top: 0.7vh;
  margin-bottom: 0.4vh;
}
.sidebar-container.tool .box svg {
  margin-left: 1.7vw;
  margin-top: 0.4vh;
  margin-bottom: 0.4vh;
  width: 32px;
  height: 32px;
  opacity: 0.5;
}
.sidebar-container.tool .box svg:hover {
  opacity: 1;
}
.sidebar-container.tool .chart-highlighter.active svg {
  opacity: 1;
}
.sidebar-container.tool .file-box svg {
  margin-top: 0.4vh;
  margin-bottom: 0.4vh;
  width: 27px;
  height: 27px;
  opacity: 0.5;
}
.sidebar-container.tool .file-box button {
  padding: 0px;
}

.slideshow-container {
  height: 100%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
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

::-webkit-scrollbar {
  width: 10px;
  height: 0px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

.carousel-switcher {
  position: fixed;
  bottom: 4vh;
  right: 4%;
  opacity: 0.6;
}

.carousel-remove {
  position: fixed;
  top: 1vh;
  right: 0%;
}
.carousel-remove button {
  height: 22px;
  width: 24px;
  border-radius: 0;
  padding: 0;
}


.screen-bottom-tips {
  z-index: 5;
  opacity: 0.3;
  position: fixed;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
  bottom: 0vh;
  left: 0vw;
  height: 10vh;
  width: 83%;
  text-align: center;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.screen-bottom-tips:hover {
  opacity: 0.7;
}

.screen-bottom-tips h3 {
  padding-top: 3.5vh;
  color: #212121;
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
  border-color: rgba(255, 255, 255, 0.1);
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
