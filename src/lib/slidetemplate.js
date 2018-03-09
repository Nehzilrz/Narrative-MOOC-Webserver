export function createTemplate(name, type, resources, follow_ups, chart_type, resource_id, id, title) {
    return {
        name: name,
        title: title || name,
        type: type,
        resource_id: resource_id,
        id: id,
        chart_type: chart_type,
        resources: Array.isArray(resources) ? resources : resources.split(' '),
        follow_ups: Array.isArray(follow_ups) ? follow_ups : follow_ups.split(' '),
        data: {},
    };
}

export function createTemplatesOnChapter(chapter) {
    const chapter_id = chapter.id;
    const chapter_templates = [
        createTemplate(
            'How often do learners access materials?',
            'student',
            'activies_summary',
            'student2',
            'barchart',
            chapter_id,
            'O0',
        ),

        // What are the activeness of student on different materials?
        createTemplate(
            'What are the popularity of different materials?',
            'student',
            'chapter_video_activies chapter_problem_activies',
            'O2 student2',
            'barchart',
            chapter_id,
            'O1',
        ),

        // How often do students access course materials?
        createTemplate(
            'How often do learners access different materials?',
            'student',
            'chapter_video_activies chapter_problem_activies',
            'student2',
            'barchart',
            chapter_id,
            'O2',
        ),

        // How much time do students spend on different materials?
        createTemplate(
            'How much time do students spend on different materials?',
            'student',
            'chapter_problem_activies',
            'O3',
            'barchart',
            chapter_id,
            'student2'
        ),
        createTemplate(
            'When do students start or finish the course materials?',
            'student',
            'chapter_problem_activies chapter_video_activies',
            'S4',
            'barchart',
            chapter_id,
            'O3',
        ),
        createTemplate(
            'Which students are having difficulties?',
            'student',
            'student_overview',
            '',
            'barchart',
            chapter_id,
            'S4',
        ),

        createTemplate(
            'How much video content have students completed?',
            'video',
            'chapter_video_activies',
            'V2',
            'barchart',
            chapter_id,
            'video0',
        ),
        createTemplate(
            'How much time do students spend on each video?',
            'video',
            'chapter_video_activies',
            'V2',
            'barchart',
            chapter_id,
            'V2',
        ),
        createTemplate(
            'How often do students review each video?',
            'video',
            'chapter_video_activies',
            'video3',
            'barchart',
            chapter_id,
            'V2'
        ),
        createTemplate(
            'How much time do students spend on each assignment?',
            'assignment',
            'chapter_problem_activies',
            'assignment1',
            'barchart',
            chapter_id,
            'A0',
        ),
        createTemplate(
            'How many assignments do students finish?',
            'assignment',
            'chapter_problem_activies',
            'assignment2',
            'barchart',
            chapter_id,
            'assignment1',
        ),
        createTemplate(
            'Which assignments have the greatest number of attempts?',
            'assignment',
            'chapter_problem_activies',
            'assignment3',
            'barchart',
            chapter_id,
            'assignment2',
        ),
        createTemplate(
            'When do students start/finish the assignments?',
            'assignment',
            'chapter_problem_activies',
            'assignment4',
            'barchart',
            chapter_id,
            'assignment3'
        ),
        createTemplate(
            'How well do students perform?',
            'assignment',
            'chapter_problem_activies',
            'assignment5',
            'barchart',
            chapter_id,
            'assignment4',
        ),
    ];

    const video_templates = chapter.videos.map((video_id, index) =>
        createTemplate(
            'Where in the video are students struggling with?',
            'video',
            'video_peaks video_logs video_info',
            '',
            'areachart',
            video_id,
            `V5${index}`
        ),
    );

    return chapter_templates.concat(video_templates);
}
/*
    for (const id of chapter.videos) {
    this.addSlide({
        name: `Where in the video are students struggling with? (Video ${this.item_map[id].name})`,
        sub'Peaks in the video',
        id: id,
        type: 'video_student_struggling_with',
        'video_peaks', 'video_logs', 'video_info']
        'video0',
        subcategory: 'video_peak',
    });
    }
*/