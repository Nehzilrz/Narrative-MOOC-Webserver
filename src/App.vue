<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  
      <b-navbar-brand href="#">Narrative MOOC</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <!--
      <b-nav-item active><h5>Narrative MOOC</h5><hr/>Dashboard</b-nav-item>
      <b-nav-item><h5>01</h5><hr/>Assumed Pattern</b-nav-item>
      <b-nav-item><h5>02</h5><hr/>Uncertain Pattern</b-nav-item>
      <b-nav-item><h5>03</h5><hr/>Conclusion</b-nav-item>-->


        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="`Video: ${current_video && current_video.name}`" right>
            <b-dropdown-item v-for="video in videos" @click="videoDropdownClick(video)">
              {{video.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="`Problem: ${current_problem && current_problem.name}`" right>
            <b-dropdown-item v-for="problem in problems" @click="problemDropdownClick(problem)">
              {{problem.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="`Chapter: ${current_chapter && current_chapter.name}`" right>
            <b-dropdown-item v-for="chapter in chapters" @click="chapterDropdownClick(chapter)">
              {{chapter.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <b-form-row>
        <b-col cols="10">
          <div class="slideshow-container">
            <slideshow :context="this.context" :slide="this.slide" :index="this.slide_index">
            </slideshow>
          </div>
          <div class="thumbnail-container">
            <div v-for="item in slides" class="thumbnail" @click="onThumbnailClick(item)" :class="{ active: item == slide }">
              <div class="thumbnail-text">
                {{`${item.name}`}}
              </div>
            </div>
          </div>
        </b-col>
        <b-col class="bd-sidebar">
          <b-card bg-variant="dark" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion1 variant="dark">Notes</b-btn>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  The current video is {{ current_video }}
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
  </div>
</template>

<script>
  import slideshow from "./component/Slideshow.vue";
  import axios from 'axios'

  const serverUrl = 'http://localhost:3000/';
  const courseId = 'HKUSTx_COMP102x_2T2014';
  const maxPeakNum = 15;

  export default {
    name: 'app',
    data() {
      return {
        text: `
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                      richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                      brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                      tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                      assumenda shoreditch et. Nihil ani
                    `,
        slides: [],
        slide: null,
        videos: [],
        problems: [],
        chapters: [],
        logs: [],
        users: [],
        current_video: null,
        current_problem: null,
        current_chapter: null,
        slide_index: 0,
      }
    },
    components: {
      slideshow,
    },
    mounted() {
      axios.get(`${serverUrl}getVideoList`, { params: { courseId: courseId } }).then((response) => {
        this.videos = response.data;
        this.slides.push({
          name: 'Peaks in a Video',
          type: 'video_peaks',
          data: ['video_peaks', 'video_logs'],
        });
      }).then(() => {
        axios.get(`${serverUrl}getProblemList`, { params: { courseId: courseId } }).then((response) => {
          this.problems = response.data;
          this.slides.push({
            name: 'Activies in a Problem',
            type: 'problem_activies',
            data: ['problem_activies'],
          });
          this.slides.push({
            name: 'Attempts in a Problem',
            type: 'problem_attempts',
            data: ['problem_activies'],
          });
        });
      }).then(() => {
        axios.get(`${serverUrl}getChapterList`, { params: { courseId: courseId } }).then((response) => {
          this.chapters = response.data;
          return;
          this.slides.push({
            name: 'Problem Overview in a Chapter',
            type: 'problem_overview',
            data: [],
          });
          this.slides.push({
            name: 'Video overview in a Chapter',
            type: 'video_overview',
            data: [],
          });
        });
      });
    },
    computed: {
      context() {
        return {
          current_video: this.current_video,
          current_chapter: this.current_chapter,
          current_problem: this.current_problem,
          videos: this.videos,
          chapters: this.chapters,
          problems: this.problems,
        }
      },
    },
    methods: {
      onThumbnailClick(item) {
        Promise.all(item.data.map((type) => {
          if (type == 'video_peaks' && this.current_video && !this.current_video.video_peaks) {
            return axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: this.current_video.id } }).then((response) => {
              this.current_video.video_peaks = response.data;
            });
          } else if (type == 'video_logs' && this.current_video && !this.current_video.video_logs) {
            return axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: this.current_video.id } }).then((response) => {
              this.current_video.video_logs = response.data;
            });
          } else if (type == 'problem_activies' && this.current_problem && !this.current_problem.problem_activies) {
            return axios.get(`${serverUrl}getProblemActivies`, { params: { id: this.current_problem.id } }).then((response) => {
              this.current_problem.activies = response.data;
              console.log(this.current_problem.id, response.data);
            });
          } else {
            return '';
          }
        })).then(() => {
          this.slide = item;
          this.slide_index += 1;
        });
      },
      videoDropdownClick(video) {
        this.current_video = video;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      problemDropdownClick(problem) {
        this.current_problem = problem;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      chapterDropdownClick(chapter) {
        this.current_chapter = chapter;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
    },
    watch: {
    }
  }
</script>

<style scope>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    max-height: 100%;
  }

  .bd-sidebar {
    overflow-y: hidden;
    max-height: 86.5vh;
    background: #f1f1f1;
  }

  hr {
    height: 6px;
    border: 0;
    box-shadow: inset 0 2px 2px -2px rgba(0, 0, 0, 0.5);
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .thumbnail {
    height: 11vh;
    width: 11vw;
    margin: 2vh 1vw 2vh 1vw;
    box-sizing: border-box;
    display: inline-flex;
    text-align: center;
    box-shadow: 0.5px -0.5px 0.5px 0.5px rgb(203, 205, 202);
    background: rgb(243, 245, 242);
    white-space: normal;
    font-size: 14px;
    position: relative;
  }

  .thumbnail.active {
    background: rgb(249, 248, 246);
    box-shadow: 3px -3px 0.5px 0.5px rgb(152, 193, 192);
  }

  .thumbnail:hover {
    background: rgb(249, 248, 246);
  }

  .thumbnail-percentage {
    position: absolute;
    height: 100%;
    background: rgb(175, 201, 201);
    opacity: 0.5;
    z-index: 1;
  }

  .thumbnail:hover .thumbnail-percentage {
    opacity: 0.5;
  }

  .thumbnail-text {
    position: absolute;
    z-index: 0;
  }

  .thumbnail-container {
    height: 15.5vh;
    max-width: 100%;
    z-index: 1;
    padding-top: 2px;
    top: 2px;
    display: inline-block;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    background: rgb(233, 234, 236);
  }

  .slideshow-container {
    height: 70vh;
    width: 100%;
    display: inline-block;
    background: rgb(255, 255, 255);
    margin-top: 5px;
  }

  .bd-sidebar {
    margin-top: 5px;
    color: white;
  }
</style>