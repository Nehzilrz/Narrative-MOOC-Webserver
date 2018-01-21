<template>
  <div id="app">
    <b-nav tabs>
      <b-nav-item active><h5>Narrative MOOC</h5><hr/>Dashboard</b-nav-item>
      <b-nav-item><h5>01</h5><hr/>Assumed Pattern</b-nav-item>
      <b-nav-item><h5>02</h5><hr/>Uncertain Pattern</b-nav-item>
      <b-nav-item><h5>03</h5><hr/>Conclusion</b-nav-item>
    </b-nav>
    <b-container fluid>
      <b-form-row>
        <b-col cols="10">
          <div class="slideshow-container">
            <slideshow :logdata="this.currentVideoLogs"
              :entropyRange="[this.minEntropyDelta, this.maxEntropyDelta]">
            </slideshow>
          </div>
          <div class="thumbnail-container">
            <div v-for="item in videos" class="thumbnail" @click="onThumbnailClick(item)"
              :class="{ active: item == currentVideo }" >
              <div class="thumbnail-text">
                {{`${item.name}`}}
              </div>
              <div class="thumbnail-percentage" :style="
                { width: (item.maxEntropyDelta || 0) / maxEntropyDelta * 100 + '%'}">
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
                  {{ text }}
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
                  {{ text }}
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
        videos: [],
        currentVideo: null,
        currentVideoLogs: null,
        currentVideoPeaks: null,
        maxEntropyDelta: 0,
        minEntropyDelta: 2.718,
      }
    },
    components: {
      slideshow,
    },
    mounted() {
      axios.get(`${serverUrl}getVideoList`, { params: { courseId: courseId} }).then((response) => {
        this.videos = response.data;
        for (var i = 0; i < this.videos.length; ++i) {
          const videoId = this.videos[i].originalId;
          const video = this.videos[i];
          video.index = i;
          axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: videoId} }).then((response) => {
            const videoLogs = response.data;
            axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: videoId} }).then((response) => {
              const actionPeaks = response.data;
              const peaks = [];
              for (const action in actionPeaks.peaks) {
                for (const peak of actionPeaks.peaks[action]) {
                  peaks.push(peak);
                }
              }
              videoLogs.peaks = peaks.sort((a, b) => b.entropyDelta - a.entropyDelta);
              videoLogs.peaks.forEach((peak, index) => { peak.index = index; });    
              this.videos[video.index].logs = videoLogs;
              if (videoLogs.peaks.length) {
                this.videos[video.index].maxEntropyDelta = videoLogs.peaks[0].entropyDelta;
                if (videoLogs.peaks[0].entropyDelta > this.maxEntropyDelta) {
                  this.maxEntropyDelta = videoLogs.peaks[0].entropyDelta;
                } else if (videoLogs.peaks[0].entropyDelta < this.minEntropyDelta) {
                  this.minEntropyDelta = videoLogs.peaks[0].entropyDelta;
                }
              }
            }).catch();
          });
        }
      }).catch();
    },
    methods: {
      onThumbnailClick(item) {
        this.currentVideo = item;
      },
    },
    watch: {
      currentVideo() {
        const videoId = this.currentVideo.originalId;
        if (this.currentVideo.logs == null) {
          axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: videoId} }).then((response) => {
            const videoLogs = response.data;// .slice(0, maxPeakNum);
            axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: videoId} }).then((response) => {
              const actionPeaks = response.data;
              const peaks = [];
              for (const action in actionPeaks.peaks) {
                for (const peak of actionPeaks.peaks[action]) {
                  peaks.push(peak);
                }
              }
              videoLogs.peaks = peaks.sort((a, b) => b.entropyDelta - a.entropyDelta);
              this.currentVideoPeaks = peaks;
              this.currentVideoLogs = videoLogs;
            }).catch();
          });
        } else {
          this.currentVideoLogs = this.currentVideo.logs;
          this.currentVideoPeaks = this.currentVideo.logs.peaks;
        }
      }
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

  .nav-link {
    padding-left: 0px;
    padding-right: 0px;
    margin-left: 0px;
    margin-right: 0px;
    color: #333333;
    font-size: 10px;
    width: 15vw;
  }

  .nav-item {
    padding-left: 0px;
    padding-right: 0px;
    margin-left: 0px;
    margin-right: 0px;
  }

  hr {
      height: 6px;
      border: 0;
      box-shadow: inset 0 2px 2px -2px rgba(0,0,0,0.5);
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
    position:relative;
  }

  .thumbnail.active {
    background: rgb(249, 248, 246);
    box-shadow: 3px -3px 0.5px 0.5px rgb(152, 193, 192);
  }
  
  .thumbnail:hover {
    background: rgb(249, 248, 246);
  }

  .thumbnail-percentage {
    position:absolute;
    height: 100%;
    background: rgb(175, 201, 201);
    opacity: 0.5;
    z-index: 1;
  }

  .thumbnail:hover .thumbnail-percentage {
    opacity: 0.5;
  }

  .thumbnail-text {
    position:absolute;
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
  }
  
  .bd-sidebar {
    color: white;
  }
</style>