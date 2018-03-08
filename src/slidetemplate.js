export function createTemplate(name, type, resources, follow_ups, resource_id, id, title) {
    return {
        name: name,
        title: title || name,
        type: type,
        resource_id: resource_id,
        id: id,
        resources: Array.isArray(resources) ? resources : resources.split(' '),
        follow_ups: Array.isArray(follow_ups) ? follow_ups : follow_ups.split(' '),
        data: {},
    };
}

export function createTemplatesOnChapter(chapter) {
    const chapter_id = chapter.id;
    const chapter_templates = [
        // What are the activeness of student on different materials?
        createTemplate(
            'What are the popularity of different materials?',
            'student',
            'chapter_video_activies chapter_problem_activies',
            'student1 student2',
            chapter_id,
            'student0',
        ),

        // How often do students access course materials?
        createTemplate(
            'How often do students access course materials?',
            'student',
            'chapter_activies',
            'student2',
            chapter_id,
            'student1',
        ),

        // How much time do students spend on different materials?
        createTemplate(
            'How much time do students spend on different materials?',
            'student',
            'chapter_problem_activies',
            'student3',
            chapter_id,
            'student2'
        ),
        createTemplate(
            'When do students start or finish the course materials?',
            'student',
            'chapter_problem_activies chapter_video_activies',
            'student4',
            chapter_id,
            'student3',
        ),
        createTemplate(
            'Which students are having difficulties?',
            'student',
            'student_overview',
            '',
            chapter_id,
            'student4',
        ),

        createTemplate(
            'How much video content have students completed?',
            'video',
            'chapter_video_activies',
            'video1',
            chapter_id,
            'video0',
        ),
        createTemplate(
            'How much time do students spend on each video?',
            'video',
            'chapter_video_activies',
            'video2',
            chapter_id,
            'video1',
        ),
        createTemplate(
            'How often do students review each video?',
            'video',
            'chapter_video_activies',
            'video3',
            chapter_id,
            'video2'
        ),
        createTemplate(
            'How many assignments do students finish?',
            'assignment',
            'chapter_problem_activies',
            'assignment2',
            chapter_id,
            'assignment1',
        ),
        createTemplate(
            'Which assignments have the greatest number of attempts?',
            'assignment',
            'chapter_problem_activies',
            'assignment3',
            chapter_id,
            'assignment2',
        ),
        createTemplate(
            'When do students start/finish the assignments?',
            'assignment',
            'chapter_problem_activies',
            'assignment4',
            chapter_id,
            'assignment3'
        ),
        createTemplate(
            'How well do students perform?',
            'assignment',
            'chapter_problem_activies',
            'assignment5',
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
            video_id,
            `video4${index}`
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