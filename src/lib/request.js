
import axios from 'axios';

export const serverUrl = 'http://10.89.83.202:3000/';

const cache = {};

export function request(self, item, type) {
    const convert_map = {
        'video_peaks': () => {
            if (!item.data.video_peaks) {
                return axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: item.resource_id } }).then((response) => {
                    item.data.video_peaks = response.data;
                })
            } else {
                return null;
            }
        },
        'video_logs': () => {
            if (!item.data.video_logs) {
                return axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: item.resource_id } }).then((response) => {
                  item.data.video_logs = response.data;
                });
            } else {
                return null;
            }
        },
        'video_info': () => {
            if (!item.data.video) {
                item.data.video = self.id2item[item.resource_id];
            } else {
                return null;
            }
        },
        'problem_activies': () => {
            if (!item.data.problem_activies) {
                const params =  { params: { id: item.resource_id } };
                const str = 'getProblemActivies' + JSON.stringify(params);
                if (cache[str]) {
                    item.data.activies = cache[str];
                    return null;
                }
                return axios.get(`${serverUrl}getProblemActivies`, params).then((response) => {
                  item.data.activies = response.data;
                  cache[str] = response.data;
                });
            } else {
                return null;
            }
        },
        'chapter_problem_activies': () => {
            if (!item.data.problem_activies) {
                const params = {
                    problems: self.id2item[item.resource_id].problems,
                    chapter: item.resource_id,
                };
                const str = 'getProblemsData' + JSON.stringify(params);
                if (cache[str]) {
                    item.data.problem_activies = cache[str];
                    return null;
                }
                return axios.post(`${serverUrl}getProblemsData`, params).then((response) => {
                  item.data.problem_activies = response.data;
                  cache[str] = response.data;
                });
            } else {
                return null;
            }
        },
        'chapter_video_activies': () => {
            if (!item.data.video_activies) {
                const params = {
                    videos: self.id2item[item.resource_id].videos,
                    chapter: item.resource_id,
                };
                const str = 'getVideosData' + JSON.stringify(params);
                if (cache[str]) {
                    item.data.video_activies = cache[str];
                    return null;
                }
                return axios.post(`${serverUrl}getVideosData`, params).then((response) => {
                  item.data.video_activies = response.data;
                  cache[str] = item.data.video_activies;
                });
            } else {
                return null;
            }
        },
        'chapter_activies': () => {
            if (!item.data.events) {
                const params = { params: {
                    start: self.id2item[item.resource_id].start,
                    time_length: 24 * 8,
                    time_scale: 'hour',
                }};
                const str = 'countEvent' + JSON.stringify(params);
                if (cache[str]) {
                    item.data.events = cache[str];
                    return null;
                }
                return axios.get(`${serverUrl}countEvent`, params).then((response) => {
                  cache[str] = response.data;
                  item.data.events = response.data;
                });
            } else {
                return null;
            }
        },
        'video_related_forum': () => {
            if (!item.data.videos) {
                const params = {
                    videos: self.id2item[item.resource_id].videos,
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getForumThreadVideoRelated`, params).then((response) => {
                  item.data.videos = response.data;
                });
            } else {
                return null;
            }
        },
        //most_discussed_threads most_discussed_keywords
        'assignment_related_forum': () => {
            if (!item.data.assignments) {
                const params = {
                    problems: self.id2item[item.resource_id].problems,
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getForumThreadProblemRelated`, params).then((response) => {
                  item.data.assignments = response.data;
                });
            } else {
                return null;
            }
        },
        'most_discussed_threads': () => {
            if (!item.data.threads) {
                const params = {
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getMostDiscussedThreads`, params).then((response) => {
                  item.data.threads = response.data;
                });
            } else {
                return null;
            }
        },
        'most_discussed_keywords': () => {
            if (!item.data.keywords) {
                const params = {
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getMostDiscussedKeywords`, params).then((response) => {
                  item.data.keywords = response.data;
                });
            } else {
                return null;
            }
        },
        'most_upvoted_threads': () => {
            if (!item.data.keywords) {
                const params = {
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getMostUpvotedThreads`, params).then((response) => {
                  item.data.threads = response.data;
                });
            } else {
                return null;
            }
        },
        'top_questioner_responser': () => {
            if (!item.data.keywords) {
                const params = {
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getTopQuestioners`, params).then((response) => {
                  item.data.threads = response.data;
                });
            } else {
                return null;
            }
        },
        'activies_summary': () => {
            if (!items.data.activies_summary) {
                return axios.get(`${serverUrl}countEvent`, { params: { 
                    start: Math.min(...self.chapters.map(d => d.start)), 
                    time_length: 24 * 90,
                    time_scale: 'hour',
                  }}).then((response) => {
                  self.data.activies_summary = response.data;
                });
            } else {
                return null;
            }
        },
        'user_basic_info': () => {
            if (!item.data.user_info) {
                return axios.post(`${serverUrl}getUserBasicInfo`, { users: item.data.users }).then((response) => {
                  item.data.user_info = response.data;
                });
            } else {
                return null;
            }
        },
        'student_overview': () => {
            if (!item.data.student_overview) {
                const params = {
                    chapter: item.resource_id,
                };
                const str = 'getChapterVideosInfo' + JSON.stringify(params);
                if (cache[str]) {
                    item.data.student_overview = cache[str];
                    return null;
                }
                return axios.post(`${serverUrl}getChapterVideosInfo`, params).then((response) => {
                  item.data.student_overview = response.data;
                  cache[str] = response.data;
                });
            } else {
                return null;
            }
        },
        'chapter_sequence': () => {
            if (!item.data.sequence) {
                const params = {
                    chapter: item.resource_id,
                };
                return axios.post(`${serverUrl}getChapterOperationSequence`, params).then((response) => {
                  item.data.sequence = response.data;
                });
            } else {
                return null;
            }
        }
    };
    return convert_map[type]();
}