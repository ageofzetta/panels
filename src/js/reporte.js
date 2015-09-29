var simplePanels = function(theItem, parentContainer, headerContainer) {
    var vm = this;



    vm.headerContainer = (typeof headerContainer != "undefined") ? headerContainer : 'header';
    vm.parentContainer = (typeof parentContainer != "undefined") ? parentContainer : 'section';
    vm.theItem = (typeof theItem != "undefined") ? theItem : 'article';
    vm.renderMenu();
    var vm = this;
    var timeout;
    window.addEventListener('scroll', function() {
        // Get only the last window resize change
        vm.positionHeaders();
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            vm.positionSlides();
        }, 300);
    });


    document.onkeydown = function(event) {

        event = event || window.event;

        if (event.keyCode == 34 || event.keyCode == 39 || event.keyCode == 40) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            vm.goNextSlide();
        } else if (event.keyCode == 33 || event.keyCode == 37 || event.keyCode == 38) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            vm.goPrevSlide();
        }

    };

    $(document).on('click', '.panelAction.open', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).removeClass('open').addClass('close');
        $(this).parent().parent(vm.parentContainer).removeClass('disabled');
        $.scrollTo(($(this).parent().parent(vm.parentContainer).offset().top + 50), 1000);
    });

    $(document).on('click', '.panelAction.close', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).removeClass('close').addClass('open');
        $(this).parent().parent(vm.parentContainer).addClass('disabled');
        vm.goNextSlide();
    });

    document.querySelector('a.nextPanel').addEventListener('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        vm.goNextSlide();

    }, false);

    document.querySelector('a.prevPanel').addEventListener('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        vm.goPrevSlide();


    }, false);

    $(document).on('click', '.sublime-menu li.section_marker', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        if ($(this).hasClass("active")) return;
        $('.sublime-menu li.section_marker.active').removeClass('active');
        var this_menu = $(this).attr('data-section-menu-link');
        var this_header = $('header[data-section-menu-link="' + this_menu + '"]').parent('.section');
        this_header.removeClass('disabled');
        $('.panelAction', this_header).removeClass('open').addClass('close');
        $(this).addClass("active");

        $.scrollTo((this_header.offset().top + 50), 1000);
    });

    $(document).on('click', '.sublime-menu li.slide_marker', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        if ($(this).hasClass("active")) return;
        var this_menu = $(this).attr('data-slide-menu-link');
        var this_slide = $('.slide[data-slide-menu-link="' + this_menu + '"]');
        var slide_to = (this_slide.offset().top + 50);
        $(this).addClass("active");

        $.scrollTo(slide_to, 1000);
    });

    $(document).on('click', '.menu.open', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).html('&times;').removeClass('open').addClass('close');
        $('.sublime-menu').addClass('slide_left');
    });
    $(document).on('click', '.menu.close', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).html('&#9776;').removeClass('close').addClass('open');
        $('.sublime-menu').removeClass('slide_left');
    });


    var supportsOrientationChange = "onorientationchange" in window;
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    window.addEventListener(orientationEvent, function() {
        vm.getHeights();
        vm.positionSlides();
    }, 400);

    var timeout_resize;
    window.addEventListener('resize', function() {
        // Get only the last window resize change
        clearTimeout(timeout_resize);
        timeout_resize = setTimeout(function() {
            vm.getHeights();
            vm.positionSlides();
        }, 400);
    });
    vm.getViewport();
    vm.getHeights();
};


simplePanels.prototype.renderMenu = function() {
    var vm = this;
    $('body').append('<div class="panelsNavigation"> <a href="" class="nextPanel hide"></a> <a href="" class="prevPanel hide"></a><a href="#" class="menu open">&#9776;</a><ul class="sublime-menu hide"><li><strong>Menu</strong></li></ul></div>');
    $(vm.parentContainer).each(function(i) {
        $(this).addClass('section-' + i).addClass('disabled border_box');
        var this_header = $(vm.headerContainer, this);
        var bgc = this_header.css('background-color');
        this_header.attr('data-section-menu-link', 'header-' + i).addClass('panelHeader');
        var color = vm.contrastingColor(bgc.replace('rgb(', '').replace(')', '').split(', '));
        var data_title = this_header.attr('data-title') ? this_header.attr('data-title') : this_header.text();
        this_header.append('<a href="#" class="panelAction open"></a href="#">');
        $('.sublime-menu').append('<li class="section_marker" data-section-menu-link="header-' + i + '" style="background-color:' + bgc + ';color:#' + color + '">' + data_title + '</li>');
        $(vm.theItem, this).each(function(j) {
            $(this).addClass('borderedSlide');
            var data_title = $(this).attr('data-title') ? $(this).attr('data-title') : $(this).find('h1').first().text();
            $(this).attr('data-slide-menu-link', 'slide-' + i + '-' + j);
            $('.sublime-menu').append('<li class="slide_marker" data-slide-menu-link="slide-' + i + '-' + j + '" style="background-color:' + bgc + ';"><span>' + data_title + '</span></li>');
        });
    });

};

simplePanels.prototype.getViewport = function() {

    var viewPortWidth;
    var viewPortHeight;
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth;
        viewPortHeight = window.innerHeight;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth !== 0) {
        viewPortWidth = document.documentElement.clientWidth;
        viewPortHeight = document.documentElement.clientHeight;
    } else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    }

    this.viewport = [viewPortWidth, viewPortHeight];
};

simplePanels.prototype.positionSlides = function() {
    var vm = this;
    $(vm.parentContainer).each(function() {

        var parentContainerEL = $(this),
            offset = parentContainerEL.offset(),
            scrollTop = ($(window).scrollTop() + ((vm.viewport[1]) / 2));
        if ((scrollTop > offset.top) && (scrollTop < offset.top + parentContainerEL.height())) {
            if ($(this).hasClass('disabled')) {
            return false;
        }else{
            console.log('test')
        }
            $(vm.theItem, this).each(function() {

                $(this).removeClass('active_slide');
                var el = $(this),
                    offset = el.offset(),
                    scrollTop = ($(window).scrollTop() + ((vm.viewport[1]) / 2));


                if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
                    var thisZoom = $('.has_zoom', this);
                    $(vm.theItem).removeClass('active_slide');
                    $(this).addClass('active_slide');
                    $.scrollTo((el.offset().top + 5), 200);
                    $('.normal').not(thisZoom).removeClass('normal').addClass('zoom');
                    thisZoom.removeClass('zoom').addClass('normal');
                    var this_menu = $(vm.headerContainer, parentContainerEL).attr('data-section-menu-link');
                    var this_slide = $(this).attr('data-slide-menu-link');
                    $('.sublime-menu li.active').removeClass('active');
                    $('.sublime-menu li[data-section-menu-link="' + this_menu + '"]').addClass('active');
                    $('.sublime-menu li[data-slide-menu-link="' + this_slide + '"]').addClass('active');
                    return false;
                }

            });
            return false;
        }
    });


};

simplePanels.prototype.positionHeaders = function() {
    var vm = this;
    var menu = false;
    $(vm.parentContainer).each(function() {

        var el = $(this),
            offset = el.offset(),
            scrollTop = $(window).scrollTop();
        if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
            if ($(this).hasClass('disabled')) {
                return false;
            } else {
                console.log('test')
            }
            floatingHeader = $(vm.headerContainer, this);
            floatingHeader.addClass('active_header');
            menu = true;

        } else {
            $(vm.headerContainer, this).removeClass('active_header');
        }
    });

    if (menu) {
        $('.sublime-menu, .nextPanel, .prevPanel').removeClass('hide');
    } else {
        $('.sublime-menu, .nextPanel, .prevPanel').addClass('hide');
    }

};

simplePanels.prototype.getHeights = function() {

    var vm = this;
    vm.getViewport();

    $(vm.parentContainer).each(function(i) {
        $(this).css('height', ($('' + vm.theItem, this).length * vm.viewport[1]));
        $(vm.theItem, this).css('height', (vm.viewport[1]));
        $('.sublime-menu').css('height', (vm.viewport[1] - $('header').height()) + 'px');

        $(vm.theItem, this).each(function(j) {
            $('div', this).first().addClass('has_zoom normal');
        });
    });
};

simplePanels.prototype.contrastingColor = function(color) {
    var vm = this;
    return (vm.luma(color) >= 165) ? '000' : 'fff';
};
simplePanels.prototype.luma = function(color) {
    var vm = this;
    var rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
};

simplePanels.prototype.goNextSlide = function() {
    var vm = this;
    if ($('.active_slide').next(vm.theItem).length) {
        $.scrollTo(($('.active_slide').next(vm.theItem).offset().top + 5), 400);
    } else if ($('.active_slide').parent().next(vm.parentContainer).length) {
        $.scrollTo(($('.active_slide').parent().next(vm.parentContainer).find(vm.theItem).first().offset().top + 5), 400);
    }

};
simplePanels.prototype.goPrevSlide = function() {
    var vm = this;


    if ($('.active_slide').prev(vm.theItem).length) {
        $.scrollTo(($('.active_slide').prev(vm.theItem).offset().top + 5), 400);
    } else if ($('.active_slide').parent().prev(vm.parentContainer).length) {
        $.scrollTo(($('.active_slide').parent().prev(vm.parentContainer).find(vm.theItem).last().offset().top + 5), 400);
    }

};
