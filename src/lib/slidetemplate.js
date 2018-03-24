
const edges = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 1, target: 4 },
    { source: 2, target: 5 },
    { source: 4, target: 6 },
    { source: 5, target: 7 },
    { source: 8, target: 9 },
    { source: 9, target: 10 }
];

const groups = [
    "O1 O2 O3 O4",
    "V1 V2 V3 V4",
    "A1 A2 A3 A4",
    "F1 F2 F3",
    "V6",
    "A5",
    "V5 V7",
    "A6",
    "S1",
    "S2",
    "S3"
].map(d => d.split(" "));
  
const grouptype = [
    "student",
    "video",
    "assignment",
    "forum",
    "video",
    "assignment",
    "video",
    "assignment",
    "student",
    "student",
    "student"
];
  
const groupId = {};
groups.forEach((d, i) => d.forEach(x => (groupId[x] = i)));

const isAdjacent = (a, b) => {
  if (!a) return false;
  a = groupId[a];
  b = groupId[b];
  return a == b || edges.find(e => e.source == a && e.target == b);
};
  
export const relation = {
    groups: groups,
    edges: edges,
    grouptype: grouptype,
    groupIdOf: x => groupId[x],
    isAdjacent: isAdjacent,
};
  
export const questions = {
    // 'O0': 'How often do learners access materials?',
    O1: "What are the popularity of different materials?",
    O2: "How often do learners access different materials?",
    O3: "How much time do students spend on different materials?",
    O4: "What materials have students accessed between start/end of assignment?",
    S1: "General distribution on education, age, gender, country",
    S2: "Which students are having difficulties?",
    S3: "Which students have not engaged in enough practice?",
    V1: "How much video content have students completed?",
    V2: "How much time do students spend on each video?",
    V3: "How often do students review each video?",
    V4: "When do students start/finish the videos?",
    V5: "Where in the video are students struggling with?",
    V6: "Which videos are most discussed in the forum?",
    V7: "What is the content of the interested video segment?",
    A1: "How well do students perform? (correctness)",
    A2: "How many assignments do students finish?",
    A3: "Which assignments have the greatest number of attempts?",
    A4: "When do students start/finish the assignments?",
    A5: "Which assignments are most discussed in the forum?",
    A6: "What is the content of an interested assignment?",
    F1: "Which are the most discussed topics/threads/keywords?",
    F2: "Which are the most upvoted replies?",
    F3: "Who are the top questioners/responders?",   
};

export const scopeOf = type => {
  if ('O1 O2 O3 O4 V1 V2 V3 V4 V6 A1 A2 A3 A4 A5 F1 F2 F3 F4'.includes(type)) {
    return 0;
  } else if ('V5 V7'.includes(type)) {
    return 1;
  } else if ('A6'.includes(type)) {
    return 2;
  } else {
    return 3;
  }
};

export const abbr_questions = {
    O1: "material popularity",
    O2: "access frequency",
    O3: "total time-cost",
    O4: "activity sequence",
    S1: "learner profile",
    S2: "struggling learners",
    S3: "disengaged learners",
    V1: "video completeness",
    V2: "video time-cost",
    V3: "video review frequency",
    V4: "video start/finish time",
    V5: "difficult video concept",
    V6: "arguable video",
    V7: "interested video segment",
    A0: "assignment time-cost",
    A1: "assignment correctness",
    A2: "assignment completeness",
    A3: "assignment attempts",
    A4: "assignment start/finish time",
    A5: "arguable assignment",
    A6: "interested assignment",
    F1: "popular topics/threads/keywords",
    F2: "upvoted replies",
    F3: "top forum participants",
    F4: "popular keywords",
};

function initTemplate(
  type,
  resources,
  follow_ups,
  chart_type,
  resource_id,
  id
) {
  return {
    name: questions[id],
    abbrname: abbr_questions[id],
    title: name,
    type: type,
    resource_id: resource_id,
    id: id,
    chart_type: chart_type,
    resources: Array.isArray(resources)
      ? resources
      : resources == "" ? [] : resources.split(" "),
    follow_ups: Array.isArray(follow_ups)
      ? follow_ups
      : follow_ups == "" ? [] : follow_ups.split(" "),
    data: {}
  };
}

let _id_counter = 0;
export function create(type, resource_id) {
  const ret = templates[type] ? templates[type](resource_id) : {};
  ret._id = ++_id_counter;
  ret.notes = [];
  ret.cache = {};
  return ret;
}


const templates = {
  O0: chapter_id =>
    initTemplate(
      "student",
      "activies_summary",
      "O1",
      "barchart",
      chapter_id,
      "O0"
    ),
  // What are the activeness of student on different materials?
  O1: chapter_id =>
    initTemplate(
      "student",
      "chapter_video_activies chapter_problem_activies",
      "O2",
      "barchart",
      chapter_id,
      "O1"
    ),
  // How often do students access course materials?
  O2: chapter_id =>
    initTemplate(
      "student",
      "chapter_video_activies chapter_problem_activies",
      "O3",
      "barchart",
      chapter_id,
      "O2"
    ),
  // How much time do students spend on different materials?
  O3: chapter_id =>
    initTemplate(
      "student",
      "chapter_problem_activies chapter_video_activies",
      "O4 V1 A1 F1",
      "piechart",
      chapter_id,
      "O3"
    ),
  O4: chapter_id =>
    initTemplate(
      "student",
      "chapter_sequence",
      "",
      "barchart",
      chapter_id,
      "O4"
    ),
  V1: chapter_id =>
    initTemplate(
      "video",
      "chapter_video_activies",
      "V2",
      "barchart",
      chapter_id,
      "V1"
    ),
  V2: chapter_id =>
    initTemplate(
      "video",
      "chapter_video_activies",
      "V3",
      "barchart",
      chapter_id,
      "V2"
    ),
  V3: chapter_id =>
    initTemplate(
      "video",
      "chapter_video_activies",
      "V4",
      "barchart",
      chapter_id,
      "V3"
    ),
  V4: chapter_id =>
    initTemplate(
      "video",
      "chapter_video_activies",
      "V6",
      "barchart",
      chapter_id,
      "V4"
    ),
  V5: video_id =>
    initTemplate(
      "video",
      "video_peaks video_logs video_info",
      "V7",
      "areachart",
      video_id,
      "V5"
    ),
  V6: chapter_id =>
    initTemplate(
      "video",
      "video_related_forum",
      "V5",
      "barchart",
      chapter_id,
      "V6"
    ),
  V7: chapter_id =>
    initTemplate(
      "video",
      "chapter_problem_activies",
      "",
      "barchart",
      chapter_id,
      "V7"
    ),
  A0: chapter_id =>
    initTemplate(
      "assignment",
      "chapter_problem_activies",
      "A1",
      "barchart",
      chapter_id,
      "A0"
    ),
  A1: chapter_id =>
    initTemplate(
      "assignment",
      "chapter_problem_activies",
      "A2",
      "barchart",
      chapter_id,
      "A1"
    ),
  A2: chapter_id =>
    initTemplate(
      "assignment",
      "chapter_problem_activies",
      "A3",
      "barchart",
      chapter_id,
      "A2"
    ),
  A3: chapter_id =>
    initTemplate(
      "assignment",
      "chapter_problem_activies",
      "A4",
      "barchart",
      chapter_id,
      "A3"
    ),
  A4: chapter_id =>
    initTemplate(
      "assignment",
      "chapter_problem_activies",
      "A5",
      "barchart",
      chapter_id,
      "A4"
    ),
  A5: chapter_id =>
    initTemplate(
      "assignment",
      "assignment_related_forum",
      "",
      "barchart",
      chapter_id,
      "A5"
    ),
  A6: chapter_id =>
    initTemplate(
      "assignment",
      "assignment_sequence",
      "",
      "barchart",
      chapter_id,
      "A6"
    ),
  S1: video_id =>
    initTemplate(
      "student",
      "user_info",
      "S2",
      "barchart",
      video_id,
      "S1"
    ),
  S2: chapter_id =>
    initTemplate(
      "student",
      "user_difficulties",
      "S3",
      "barchart",
      chapter_id,
      "S2"
    ),
  S3: chapter_id =>
    initTemplate(
      "student",
      "user_info",
      "",
      "barchart",
      chapter_id,
      "S3"
    ),
  F1: chapter_id =>
    initTemplate(
      "forum",
      "most_discussed_threads most_discussed_keywords",
      "F2",
      "barchart",
      chapter_id,
      "F1"
    ),
    /*
  F4: chapter_id =>
    initTemplate(
      "student",
      "most_discussed_keywords",
      "F2",
      "barchart",
      chapter_id,
      "F4"
    ),*/
  F2: chapter_id =>
    initTemplate(
      "forum",
      "most_upvoted_threads",
      "F3",
      "barchart",
      chapter_id,
      "F2"
    ),
  F3: chapter_id =>
    initTemplate(
      "forum",
      "top_questioner_responser",
      "",
      "barchart",
      chapter_id,
      "F3"
    )
};
/*
    for (const id of chapter.videos) {
    this.addSlide({
        name: `Where in the video are students struggling with? (Video ${this.item_map[id].name})`,
        sub'Peaks in the video',
        id: id,
        type: 'video_student_struggling_with',
        'video_peaks', 'video_logs', 'video_info']
        'V1',
        subcategory: 'video_peak',
    });
    }
*/
