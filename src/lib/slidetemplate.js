function initTemplate(name, type, resources, follow_ups, chart_type, resource_id, id) {
    return {
        name: name,
        title: name,
        type: type,
        resource_id: resource_id,
        id: id,
        chart_type: chart_type,
        resources: Array.isArray(resources) ? resources : resources.split(' '),
        follow_ups: Array.isArray(follow_ups) ? follow_ups : follow_ups.split(' '),
        data: {},
    };
}

export function create(type, resource_id) {
    return templates[type] ? templates[type](resource_id) : null;
}

export const questions = {
    // 'O0': 'How often do learners access materials?',
    'O1': 'What are the popularity of different materials?',
    'O2': 'How often do learners access different materials?',
    'O3': 'How much time do students spend on different materials?',
    'O4': 'What materials have students accessed between start/end of assignment?',
    'S1': 'General distribution on education, age, gender, country',
    'S2': 'Which students are having difficulties?',
    'S3': 'Which students have not engaged in enough practice?',
    'V1': 'How much video content have students completed?',
    'V2': 'How much time do students spend on each video?',
    'V3': 'How often do students review each video?',
    'V4': 'When do students start/finish the videos?',
    'V5': 'Where in the video are students struggling with?',
    'V6': 'Where in the video are most discussed in the forum?',
    'V7': 'What is the content of the interested video segment?',
    'A0': 'How much time do students spend on each assignment?',
    'A1': 'How well do students perform? (correctness)',
    'A2': 'How many assignments do students finish?',
    'A3': 'Which assignments have the greatest number of attempts?',
    'A4': 'When do students start/finish the assignments?',
    'A5': 'Which assignments are most discussed in the forum?',
    'A6': 'What is the content of an interested assignment?',
    'F1': 'Which are the most discussed topics/threads/keywords?',
    'F2': 'Which are the most upvoted replies?',
    'F3': 'Who are the top questioners/responders?',
};

const templates = {
    'O0': (chapter_id) => initTemplate(
        questions['O0'],
        'student',
        'activies_summary',
        'student2',
        'barchart',
        chapter_id,
        'O0',
    ),
    // What are the activeness of student on different materials?
    'O1': (chapter_id) => initTemplate(
        questions['O1'],
        'student',
        'chapter_video_activies chapter_problem_activies',
        'O2',
        'barchart',
        chapter_id,
        'O1',
    ),        
    // How often do students access course materials?
    'O2': (chapter_id) => initTemplate(
        questions['O2'],
        'student',
        'chapter_video_activies chapter_problem_activies',
        'O3',
        'barchart',
        chapter_id,
        'O2',
    ),
    // How much time do students spend on different materials?
    'O3': (chapter_id) => initTemplate(
        questions['O3'],
        'student',
        'chapter_problem_activies chapter_video_activies',
        'O4 V1 A1',
        'barchart',
        chapter_id,
        'O3',
    ),
    'O4': (chapter_id) => initTemplate(
        questions['O4'],
        'student',
        'chapter_problem_activies chapter_video_activies',
        '',
        'barchart',
        chapter_id,
        'O4',
    ),
    'V1': (chapter_id) => initTemplate(
        questions['V1'],
        'video',
        'chapter_video_activies',
        'V2',
        'barchart',
        chapter_id,
        'V1',
    ),
    'V2': (chapter_id) => initTemplate(
        questions['V2'],
        'video',
        'chapter_video_activies',
        'V3',
        'barchart',
        chapter_id,
        'V2',
    ),
    'V3': (chapter_id) => initTemplate(
        questions['V3'],
        'video',
        'chapter_video_activies',
        'V4',
        'barchart',
        chapter_id,
        'V3'
    ),
    'V4': (chapter_id) => initTemplate(
        questions['V4'],
        'video',
        'chapter_problem_activies',
        'V5',
        'barchart',
        chapter_id,
        'V4'
    ),
    'V5': (chapter_id) => initTemplate(
        questions['V5'],
        'video',
        'chapter_problem_activies',
        'V6',
        'barchart',
        chapter_id,
        'V5'
    ),
    'V6': (chapter_id) => initTemplate(
        questions['V6'],
        'video',
        'chapter_problem_activies',
        'V7',
        'barchart',
        chapter_id,
        'V6'
    ),
    'V7': (chapter_id) => initTemplate(
        questions['V7'],
        'video',
        'chapter_problem_activies',
        '',
        'barchart',
        chapter_id,
        'V7'
    ),
    'A0': (chapter_id) => initTemplate(
        questions['A0'],
        'assignment',
        'chapter_problem_activies',
        'A1',
        'barchart',
        chapter_id,
        'A0',
    ),
    'A1': (chapter_id) => initTemplate(
        questions['A1'],
        'assignment',
        'chapter_problem_activies',
        'A2',
        'barchart',
        chapter_id,
        'A1',
    ),
    'A2': (chapter_id) => initTemplate(
        questions['A2'],
        'assignment',
        'chapter_problem_activies',
        'A3',
        'barchart',
        chapter_id,
        'A2',
    ),
    'A3': (chapter_id) => initTemplate(
        questions['A3'],
        'assignment',
        'chapter_problem_activies',
        'A4',
        'barchart',
        chapter_id,
        'A3',
    ),
    'A4': (chapter_id) => initTemplate(
        questions['A4'],
        'assignment',
        'chapter_problem_activies',
        'A5',
        'barchart',
        chapter_id,
        'A4'
    ),
    'A5': (chapter_id) => initTemplate(
        questions['A5'],
        'assignment',
        'chapter_problem_activies',
        'A6',
        'barchart',
        chapter_id,
        'A5'
    ),
    'A6': (chapter_id) => initTemplate(
        questions['A6'],
        'assignment',
        'chapter_problem_activies',
        '',
        'barchart',
        chapter_id,
        'A6'
    ),
    'V5': (video_id) => initTemplate(
        questions['V5'],
        'video',
        'video_peaks video_logs video_info',
        '',
        'areachart',
        video_id,
        `V5${index}`
    ),
    'S1': (video_id) => initTemplate(
        questions['S1'],
        'student',
        'student_overview',
        '',
        'barchart',
        video_id,
        'S1',
    ),
    'S2': (chapter_id) => initTemplate(
        questions['S2'],
        'student',
        'student_overview',
        '',
        'barchart',
        chapter_id,
        'S2',
    ),
    'S3': (chapter_id) => initTemplate(
        questions['S3'],
        'student',
        'student_overview',
        '',
        'barchart',
        chapter_id,
        'S3',
    ),
    'F1': (chapter_id) => initTemplate(
        questions['S3'],
        'student',
        'student_overview',
        '',
        'barchart',
        chapter_id,
        'F1',
    ),
    'F2': (chapter_id) => initTemplate(
        questions['S3'],
        'student',
        'student_overview',
        '',
        'barchart',
        chapter_id,
        'F2',
    ),
    'F3': (chapter_id) => initTemplate(
        questions['F3'],
        'student',
        'student_overview',
        '',
        'barchart',
        chapter_id,
        'F3',
    ),
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