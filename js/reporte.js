var ReporteSimple = function(theItem, parentContainer, headerContainer) {
        var vm = this;

        $('p.chance_me').each(function(){
        	$(this).html(chance.paragraph({sentences: 6})+'<br><br>'+chance.paragraph({sentences: 6}));
        });
        $('h1.chance_me').each(function(){
        	$(this).text(chance.word());
        });
        $('header.chance_me').each(function(){
        	$(this).text(chance.word());
        });
        $('body').append('<div class="mobile-menu hide"> <a href="#" class="menu open">&#9776;</a> <a href="#" class="menu close hide">&#9776;</a> <ul> <li></li> <li></li> <li></li> <li></li> <li></li> </ul> </div> <ul class="sublime-menu hide"> </ul>');
         this.headerContainer = (typeof headerContainer != "undefined") ? headerContainer : 'header';
        this.parentContainer = (typeof parentContainer != "undefined") ? parentContainer : 'section';
        this.theItem = (typeof theItem != "undefined") ? theItem : 'article';
        $(window).scroll($.debounce(100, function() {
            vm.positionSlides();
        }));


        window.addEventListener('scroll', function() {
            vm.positionHeaders();
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

        $(window).resize($.debounce(400, function() {
            vm.getHeights();
            vm.positionSlides();

        }));
        vm.getViewport();
        vm.getHeights();
    };


    ReporteSimple.prototype.getViewport = function() {

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

    ReporteSimple.prototype.positionSlides = function() {
        var vm = this;
        // debugger;
        $(vm.parentContainer).each(function() {
            var parentContainerEL = $(this),
                offset = parentContainerEL.offset(),
                scrollTop = ($(window).scrollTop() + ((vm.viewport[1]) / 2));
            if ((scrollTop > offset.top) && (scrollTop < offset.top + parentContainerEL.height())) {
                $(vm.theItem, this).each(function() {

                    $(this).removeClass('active_slide');
                    var el = $(this),
                        offset = el.offset(),
                        scrollTop = ($(window).scrollTop() + ((vm.viewport[1]) / 2));


                    if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
                        var thisZoom = $('.has_zoom', this);
                        $(vm.theItem).removeClass('active_slide');
                        $(this).addClass('active_slide');
                        $.scrollTo((el.offset().top + 5), 400);
                        $('.normal').not(thisZoom).removeClass('normal').addClass('zoom');
                        thisZoom.removeClass('zoom').addClass('normal');
                        var this_menu = $(vm.headerContainer, parentContainerEL).attr('data-section-menu-link');
                        var this_slide = $(this).attr('data-slide-menu-link');
		                $('.sublime-menu li.active').removeClass('active');
				        $('.sublime-menu li[data-section-menu-link="'+this_menu+'"]').addClass('active');
				        $('.sublime-menu li[data-slide-menu-link="'+this_slide+'"]').addClass('active');
                    }

                });
            }
        });

    };

    ReporteSimple.prototype.positionHeaders = function() {
        var vm = this;
        var menu = false;
        // debugger;
        $(vm.parentContainer).each(function() {
            var el = $(this),
                offset = el.offset(),
                scrollTop = $(window).scrollTop();
            if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
                floatingHeader = $(vm.headerContainer, this);
                floatingHeader.attr('style', 'position:fixed');
                menu = true;

            } else {
                $(vm.headerContainer, this).css('position', 'relative');
            }
        });

        if (menu) {
			$('.mobile-menu').removeClass('hide');
			$('.sublime-menu').removeClass('hide');
        }else{
        	$('.mobile-menu').addClass('hide');
			$('.sublime-menu').addClass('hide');
        }

    };

    ReporteSimple.prototype.getHeights = function() {
        var vm = this;
        $('.sublime-menu').html('');
        $(vm.parentContainer).each(function(i) {
            $(this).css('height', ($('' + vm.theItem, this).length * vm.viewport[1]));
            $(vm.theItem, this).css('height', (vm.viewport[1]));
        	$(this).addClass('section-'+i);
        });
        $('.has_zoom').addClass('zoom');
        $(vm.parentContainer).each(function(i){
            var this_header = $(vm.headerContainer, this);

        	// debugger;
        	var bgc = this_header.css('background-color');
        	this_header.attr('data-section-menu-link','header-'+i);
        	var color =vm.contrastingColor(bgc.replace('rgb(','').replace(')','').split(', '));
        	var data_title = this_header.attr('data-title') ? this_header.attr('data-title') : this_header.text();
        	$('.sublime-menu').append('<li class="section_marker" data-section-menu-link="header-'+i+'" style="background-color:'+bgc+';color:#'+color+'">'+data_title+'</li>');
            $(vm.theItem, this).each(function(j) {
	        	var data_title = $(this).attr('data-title') ? $(this).attr('data-title') : $(this).find('h1').first().text();
            	$(this).attr('data-slide-menu-link','slide-'+i+'-'+j);
	        	$('.sublime-menu').append('<li class="slide_marker" data-slide-menu-link="slide-'+i+'-'+j+'" style="background-color:'+bgc+';"><span>'+data_title+'</span></li>');

            });

        });
    };

    ReporteSimple.prototype.contrastingColor = function(color) {
    	var vm = this;
	    return (vm.luma(color) >= 165) ? '000' : 'fff';
	};
	ReporteSimple.prototype.luma = function(color) {
		var vm = this;
	    var rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
	    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
	};

    ReporteSimple.prototype.goNextSlide = function() {
        var vm = this;
        if ($('.active_slide').next(vm.theItem).length) {
            $.scrollTo(($('.active_slide').next(vm.theItem).offset().top + 5), 400);
        } else if ($('.active_slide').parent().next(vm.parentContainer).length) {
            $.scrollTo(($('.active_slide').parent().next(vm.parentContainer).find(vm.theItem).first().offset().top + 5), 400);
        }

    };
    ReporteSimple.prototype.goPrevSlide = function() {
        var vm = this;


        if ($('.active_slide').prev(vm.theItem).length) {
            $.scrollTo(($('.active_slide').prev(vm.theItem).offset().top + 5), 400);
        } else if ($('.active_slide').parent().prev(vm.parentContainer).length) {
            $.scrollTo(($('.active_slide').parent().prev(vm.parentContainer).find(vm.theItem).last().offset().top + 5), 400);
        }

    };





    new ReporteSimple('.slide', '.section');
    $(document).on('click', '.sublime-menu li.active', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
    });

    $(document).on('click', '.sublime-menu li.section_marker', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $( '.sublime-menu li.active').removeClass('active');
        var this_menu = $(this).attr('data-section-menu-link');
        var this_header = $('header[data-section-menu-link="'+this_menu+'"]').parent('.section');
        $.scrollTo((this_header.offset().top), 400);
    });

    $(document).on('click', '.sublime-menu li.slide_marker', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $( '.sublime-menu li.active').removeClass('active');
        var this_menu = $(this).attr('data-slide-menu-link');
        var this_slide = $('.slide[data-slide-menu-link="'+this_menu+'"]');
        var slide_to = (this_slide.offset().top + 50);
        $.scrollTo(slide_to, 400);
    });
    $(document).on('click', '.menu.open', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).html('&times;').removeClass('open').addClass('close');
        $('.mobile-menu').addClass('slide_left');
    });
    $(document).on('click', '.menu.close', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        $(this).html('&#9776;').removeClass('close').addClass('open');
        $('.mobile-menu').removeClass('slide_left');
    });
    $(document).on('click', 'header', function(event) {
        var header = $(this);
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        // debugger;
        if ($(this).parent('.section.closed').length) {
            $(this).parent('.section').animate({
                // opacity: 0.25,
                // left: "+=50",
                height: $(this).parent('.section').attr('data-originalHeight')
            }, 500, function() {
                $('header', this).css('position', 'fixed');
                $(this).removeClass('closed');
                $.scrollTo(($(this).offset().top), 400);

            });
        } else {
            $(this).parent('.section').attr('data-originalHeight', $(this).parent('.section').height());
            $(this).parent('.section').animate({
                // opacity: 0.25,
                // left: "+=50",
                height: header.height()
            }, 500, function() {
                $('header', this).css('position', 'relative');
                $(this).addClass('closed');
                // $.scrollTo(($(this).offset().top), 400);

            });
        }


    });
