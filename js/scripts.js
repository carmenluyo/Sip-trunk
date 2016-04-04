/* Simple Slide (Plugin) */
$(function () {
    var ID = {
        slideshow: 'zona-slides',
        slide: 'slide',
        counter: 'contador',
        navigation: 'navigation',
        next: 'next',
        previous: 'previous',
        current: 'current'
    };

    var labels = {
        next: '&rarr;',
        previous: '&larr;',
        separator: ' - '
    };

    var audioConfig = {
        path: "audios/",
        stopOnNext: true,
        tagAudio: "audio"
    };

    var slideConfig = {
        slideEval: "eval",
        slideBegin: "begin",
        slideEnd: "end",
        slideSuccess: "success",
        slideFail: "fail",
        errorTimeOut: 5
    };

    var controls = {
        controlCorrect: "correct"
    };

    var $slideshow = $('#' + ID.slideshow);
    var $slides = $slideshow.children().addClass(ID.slide);
    var $currentSlide;
    var $firstSlide = $slides.first();
    var $lastSlide = $slides.last();

    var $counter = $('#' + ID.counter);
    var $next = $('.' + ID.next);
    var $previous = $('#' + ID.previous);

    var globalAudio = null;


    /*** FUNCTIONS ***/

    var res = {
        error: false,
        slideNumber: null
    };

    var updateCounter = function () {
        // updates the counter
        $counter.text(thisSlidePointer + labels.separator + lastSlidePointer);
    };

    var hideCurrentSlide = function () {
        // hide the current slide
        $currentSlide.fadeOut().removeClass(ID.current);


    };

    var nextSlide = function () {
        var inputChecked = $currentSlide.find("input:checked");

        // if this slide is for evaluation and the user didn't interact with it
        if (($currentSlide.data(slideConfig.slideEval) && inputChecked.length == 0) || $currentSlide.data(slideConfig.slideFail)) {
            return null;
        }

        // set error if the slide is for evaluation and the user did a wrong answer
        if ($currentSlide.data(slideConfig.slideEval) && !inputChecked.data(controls.controlCorrect)) {
            res = {
                error: true,
                slideNumber: thisSlidePointer
            }
        }

        var nextSlide;

        if ($currentSlide.data(slideConfig.slideEnd) && res.error) {
            res = {};
            var begin = $currentSlide;
            var less = 2;
            do {
                less++;
                begin = begin.prev();
                if (begin == undefined || begin == null || begin == []) {
                    alert("no se encontró ningún inicio para volver");
                    break;
                }
            } while (!begin.data(slideConfig.slideBegin));

            nextSlide = $currentSlide.next().next();

            setTimeout(function () {
                thisSlidePointer -= less;
                transitionTo(begin);
            }, slideConfig.errorTimeOut * 1000);

        } else if ($currentSlide.data(slideConfig.slideSuccess)) {
            nextSlide = $currentSlide.next().next();
        } else {
            res = {};
            nextSlide = $currentSlide.next();
        }

        transitionTo(nextSlide);

    };

    var handleAudio = function (slide) {
        if (slide.data(audioConfig.tagAudio)) {
            if (globalAudio) {
                globalAudio.pause();
            }
            globalAudio = new Audio(audioConfig.path + slide.data(audioConfig.tagAudio));
            globalAudio.play();
        } else if (globalAudio && audioConfig.stopOnNext) {
            globalAudio.pause();
        }
    };

    var transitionTo = function (slide) {

        handleAudio(slide);

        // hide current slide
        hideCurrentSlide();

        // not the last slide => go to the next one and increment the counter
        if (thisSlidePointer != lastSlidePointer) {
            slide.fadeIn().addClass(ID.current);
            $currentSlide = slide;
            thisSlidePointer++;
        }
        else {
            // is the last slide => go back to the first slide and reset the counter.
            $firstSlide.fadeIn().addClass(ID.current);
            $currentSlide = $firstSlide;
            thisSlidePointer = 1;
        }

        // update counter
        updateCounter();
    };

    var previousSlide = function () {

        // hide current slide
        hideCurrentSlide();

        // get the previous slide
        var previousSlide;
        if ($currentSlide.prev().data(slideConfig.slideFail)) {
            previousSlide = $currentSlide.prev().prev();
        } else {
            previousSlide = $currentSlide.prev();
        }

        handleAudio(previousSlide);

        // If not the first slide, go to the previous one and decrement the counter
        if (thisSlidePointer != 1) {
            previousSlide.fadeIn().addClass(ID.current);
            $currentSlide = previousSlide;
            thisSlidePointer--;
        }
        else {
            // This must be the first slide, so go back to the last slide and set the counter.
            $lastSlide.fadeIn().addClass(ID.current);
            $currentSlide = $lastSlide;
            thisSlidePointer = lastSlidePointer;
        }

        // update counter
        updateCounter();
    };

    /*** INIT SLIDESHOW ***/

    // Initially hide all slides
    $slides.hide();

    // The first slide is number first!
    var thisSlidePointer = 1;

    // The last slide position is the total number of slides
    var lastSlidePointer = $slides.length - 5;

    // The first slide is always the first slide! So let's make visible and set the counter
    $currentSlide = $firstSlide.show().addClass(ID.current);
    updateCounter();


    /*** EVENTS ***/

    // "next" arrow clicked => next slide
    $next.click(nextSlide);

    // "previous" arrow clicked => previous slide
    $previous.click(previousSlide);

    // Add keyboard shortcuts for changing slides
    $(document).keydown(function (e) {
        if (e.which == 39) {
            // right key pressed => next slide
            nextSlide();
            return false;
        }
        else if (e.which == 37) {
            // left key pressed => previous slide
            previousSlide();
            return false;
        }
    });

});

/* Llamados Animate.css */

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});