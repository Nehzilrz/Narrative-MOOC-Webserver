<template>
    <div class="page" @click="click(item)">
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
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        methods: {
            /*
            isActive(item) {
                const elements = document.getElementsByClassName('slideshow-page');
                var index = -1;
                if ((index = this.context.page.indexOf(item)) != -1) {
                    const element = elements[index];
                    if (!element) return false;
                    const top = element.getBoundingClientRect().top;
                    const bottom = element.getBoundingClientRect().bottom;
                    const height = element.getBoundingClientRect().height;
                    const view_height = this.viewport.height;
                    if (0 <= bottom && bottom <= view_height && bottom > height * 0.66) {
                        return true;
                    } else if (0 <= top && top <= view_height && (view_height - top) > height * 0.66) {
                        return true;
                    }
                }
                return false;
            },
            */
            click(item) {
                var index = -1;
                if ((index = this.context.page.indexOf(item)) != -1) {
                    const element = document.getElementsByClassName('slideshow-page')[index];
                    this.context.moveto.move(element); 
                }
            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
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

.page div {
  padding-top: 0.5vh;
}

.page svg {
  width: 8vh;
  height: 8vh;
  position: absolute;
  left: 35%;
  top: 2vh;
}
.page.active {
  border-color: #aaaaaa;
  border-width: 1.5px;
  opacity: 1;
}
.page:hover {
  border-color: #a0a0a0;
  border-width: 1.5px;
  opacity: 1;
}
</style>

