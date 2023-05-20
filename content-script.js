$(function () {
        // Ajax Promise wrapper
        const ajax = (options) => new Promise((resolve, reject) => $.ajax(options).done(resolve).fail(reject))

        // Gets the list of courses, given key and classification (async)
        const get_courses = async (sesskey, classification) => (await ajax({
            type: "POST",
            // For more info: https://docs.moodle.org/dev/Web_service_API_functions
            url: `https://moodle.unive.it/lib/ajax/service.php?sesskey=${sesskey}&info=core_course_get_enrolled_courses_by_timeline_classification`,
            data: JSON.stringify([{
                "index": 0,
                "methodname": "core_course_get_enrolled_courses_by_timeline_classification",
                "args": {
                    "offset": 0,
                    "limit": 0,
                    "classification": classification,
                    "sort": "fullname",
                    "customfieldname": "",
                    "customfieldvalue": ""
                }
            }]),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }))[0].data.courses  // Trust me, it's there

        // Finds all tiles that link to a course and replaces the text content
        const rename = data => data.forEach(c => $(`a[href="https://moodle.unive.it/course/view.php?id=${c.id}"] .media-body`).text(c.fullname))

        // Fetches the courses and replaces the names
        const run = async sesskey => rename((await Promise.all([
            get_courses(sesskey, "all"),
            get_courses(sesskey, "hidden")
        ])).flat())

        // Creates the listener for the session key
        document.addEventListener('mdf-data', e => run(e.detail))

        // Attaches (and removes) the bridge to get the key
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL('mdf-bridge.js');
        s.onload = () => s.remove();
        (document.head || document.documentElement).appendChild(s);
    }
)