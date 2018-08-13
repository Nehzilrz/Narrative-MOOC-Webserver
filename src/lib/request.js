
import axios from 'axios';

export const serverUrl = 'http://localhost:3000/';
// export const serverUrl = 'http://10.89.83.202:3000/';

const cache = {};

export async function request(self, item, type) {
    const data = item.data;
    const convert_map = {
        'video_peaks': async (data, filter = null) => {
            if (!data.video_peaks) {
                data.video_peaks = (await axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: item.resource_id } })).data;
            } else {
                return null;
            }
        },
        'video_logs': async (data, filter = null) => {
            if (!data.video_logs) {
                data.video_logs = (await axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: item.resource_id } })).data;
            } else {
                return null;
            }
        },
        'video_info': async (data, filter = null) => {
            if (!data.video) {
                data.video = self.$mapping[item.resource_id];
            } else {
                return null;
            }
        },
        'problem_activies': async (data, filter = null) => {
            if (!data.problem_activies) {
                const params =  { params: { id: item.resource_id } };
                const str = 'getProblemActivies' + JSON.stringify(params);
                if (cache[str]) {
                    data.activies = cache[str];
                    return null;
                }
                data.activies = (await axios.get(`${serverUrl}getProblemActivies`, params)).data;
                cache[str] = data.activies;
            } else {
                return null;
            }
        },
        'chapter_problem_activies': async (data, filter = null) => {
            if (!data.problem_activies) {
                const params = {
                    problems: self.$mapping[item.resource_id].problems,
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                const str = 'getProblemsData' + JSON.stringify(params);
                if (cache[str]) {
                    data.problem_activies = cache[str];
                    return null;
                }
                data.problem_activies = (await axios.post(`${serverUrl}getProblemsData`, params)).data;
                cache[str] = data.problem_activies;
            } else {
                return null;
            }
        },
        'chapter_video_activies': async (data, filter = null) => {
            if (!data.video_activies) {
                const params = {
                    videos: self.$mapping[item.resource_id].videos,
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                const str = 'getVideosData' + JSON.stringify(params);
                if (cache[str]) {
                    data.video_activies = cache[str];
                    return null;
                }
                data.video_activies = (await axios.post(`${serverUrl}getVideosData`, params)).data;
                cache[str] = data.video_activies;
            } else {
                return null;
            }
        },
        'chapter_activies': async (data, filter = null) => {
            if (!data.events) {
                const params = { params: {
                    start: self.$mapping[item.resource_id].start,
                    time_length: 24 * 8,
                    time_scale: 'hour',
                }};
                const str = 'countEvent' + JSON.stringify(params);
                if (cache[str]) {
                    data.events = cache[str];
                    return null;
                }
                data.events = (await axios.get(`${serverUrl}countEvent`, params)).data;
                cache[str] = data.events;
            } else {
                return null;
            }
        },
        'video_related_forum': async (data, filter = null) => {
            if (!data.videos) {
                const params = {
                    videos: self.$mapping[item.resource_id].videos,
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.videos = (await axios.post(`${serverUrl}getForumThreadVideoRelated`, params)).data;
            } else {
                return null;
            }
        },
        //most_discussed_threads most_discussed_keywords
        'assignment_related_forum': async (data, filter = null) => {
            if (!data.assignments) {
                const params = {
                    problems: self.$mapping[item.resource_id].problems,
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.assignments = (await axios.post(`${serverUrl}getForumThreadProblemRelated`, params)).data;
            } else {
                return null;
            }
        },
        'most_discussed_threads': async (data, filter = null) => {
            if (!data.threads) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.threads = (await axios.post(`${serverUrl}getMostDiscussedThreads`, params)).data;
            } else {
                return null;
            }
        },
        'most_discussed_keywords': async (data, filter = null) => {
            if (!data.keywords) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.keywords = (await axios.post(`${serverUrl}getMostDiscussedKeywords`, params)).data;
            } else {
                return null;
            }
        },
        'most_upvoted_threads': async (data, filter = null) => {
            if (!data.keywords) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.threads = (await axios.post(`${serverUrl}getMostUpvotedThreads`, params)).data;
            } else {
                return null;
            }
        },
        'top_questioner_responser': async (data, filter = null) => {
            if (!data.threads) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.threads = (await axios.post(`${serverUrl}getTopQuestioners`, params)).data;
            } else {
                return null;
            }
        },
        'activies_summary': async (data, filter = null) => {
            if (!items.data.activies_summary) {
                self.data.activies_summary = (await axios.get(`${serverUrl}countEvent`, { params: { 
                    start: Math.min(...self.chapters.map(d => d.start)), 
                    time_length: 24 * 90,
                    time_scale: 'hour',
                  }})).data;
            } else {
                return null;
            }
        },
        'user_info': async (data, filter = null) => {
            if (!data.user_info) {
                data.user_info = (await axios.post(`${serverUrl}getUserBasicInfo`, {
                    condition: item.condition,
                    chapter: item.resource_id,
                })).data;
            } else {
                return null;
            }
        },
        'user_difficulties': async (data, filter = null) => {
            if (!data.difficulties) {
                data.difficulties = (await axios.post(`${serverUrl}getUserDifficulties`, {
                    condition: item.condition,
                    chapter: item.resource_id,
                })).data;
            } else {
                return null;
            }
        },
        'student_overview': async (data, filter = null) => {
            if (!data.student_overview) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                const str = 'getChapterVideosInfo' + JSON.stringify(params);
                if (cache[str]) {
                    data.student_overview = cache[str];
                    return null;
                }
                data.student_overview = (await axios.post(`${serverUrl}getChapterVideosInfo`, params)).data;
                cache[str] = data.student_overview;
            } else {
                return null;
            }
        },
        'chapter_sequence': async (data, filter = null) => {
            if (!data.sequence) {
                const params = {
                    chapter: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.sequence = (await axios.post(`${serverUrl}getChapterOperationSequence`, params)).data;
            } else {
                return null;
            }
        },
        'assignment_sequence': async (data, filter = null) => {
            if (!data.sequence) {
                const params = {
                    assignment: item.resource_id,
                };
                if (filter) {
                    params.condition = filter;
                }
                data.sequence = (await axios.post(`${serverUrl}getAssignmentOperationSequence`, params)).data;
            } else {
                return null;
            }
        },
    };
    await convert_map[type](item.data);
    if (item.comparison) {
        if (!item._data[item.comparison_name]) {
            item._data[item.comparison_name] = {};
        }
        await convert_map[type](
            item._data[item.comparison_name],
            item.condition
        );
    }
    return;
}