app.addModule('brands', function () {
	this.init = function () {
		$('.brands_arrow').click(function () {
			$('.brands_items').toggleClass('active');
			$(this).toggleClass('active');
		})
	}
});
app.addModule('characteristic', function () {
	this.init = function () {
		var nav = $('.characteristic_nav a');
		
		nav.click(function (e) {
			e.preventDefault();
			
			$('.characteristic_content').removeClass('active');
			$($(this).attr('href')).addClass('active');
			
			$('.characteristic_nav li').removeClass('active');
			$(this).closest('li').addClass('active');
		});
		
		$('.characteristic_head').click(function (e) {
			e.preventDefault();
			
			$('.characteristic_body').not($(this).next()).slideUp();
			$('.characteristic_item').not($(this).closest('.characteristic_item')).removeClass('active');
			
			$(this).closest('.characteristic_item').toggleClass('active');
			$(this).next().slideToggle();
		});
	}
});
app.addModule('dealer', function () {
	this.init = function () {
		$(document).on('click', '.dealer-block_link', function (e) {
			e.preventDefault();
			
			$('.dealer-block_content').not($(this).next()).slideUp();
			$('.dealer-block_item').not($(this).closest('.dealer-block_item')).removeClass('active');
			
			$(this).closest('.dealer-block_item').toggleClass('active');
			$(this).next().slideToggle();
		});
	}
});
app.addModule('pdd-open', function () {
	this.init = function () {
		$(document).on("click",'#pdd_select', function () {
			$.ajax({
				url: "/v1/pdds/training_select",
				dataType: 'text',
				data: {id: "select"},
				success: function (data, textStatus, jqXHR) {
					$("#pdd").html(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$("#pdd").empty()
				}
			});
		});
		$(document).on("click", '#pdd_start', function () {
			var ids = "/pdds/training/?ids="
			$('.checkbox_input:checked').each(function (index) {
				ids += $(this).attr("id") + ","
			});
			$("#pdd_start").attr("href", ids);
		});
		$(document).on("click", '#pdd_exam_select', function () {
			$.ajax({
				url: "/v1/pdds/exam_select",
				dataType: 'text',
				data: {sel: "select"},
				success: function (data, textStatus, jqXHR) {
					$("#pdd").html(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$("#pdd").empty()
				}
			});
		});
		$(document).on("click", '#pdd_exam_start', function () {
			var id = "/pdds/exam/?id=" + $('.checkbox_input:checked').attr("id")
			$("#pdd_exam_start").attr("href", id);
		});
	}
});
app.addModule('header', function () {
	this.init = function () {
		$('.header_menu-btn').click(function () {
			$('.header_nav').slideToggle(300, function () {
				$(this).toggleClass('active').removeAttr('style');
			});
		});
	}
});

app.addModule('mobile-load', function () {
	this.init = function () {
		$('[data-clone-id]').each(function () {
			var element = $('#' + $(this).attr('data-clone-id'));
			
			if (element.length) {
				$(this).append(
					element.clone(true, true).removeAttr('id').addClass('__cloned')
				);
			}
			
			$(this).removeAttr('data-clone-id');
		});
	};
});
app.addModule('popup', function () {
	this.init = function () {
		$('.popup').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$('.popup-image').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade',
			type: 'image'
		});
		
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
		
		$('.popup-close').click(function (e) {
			e.preventDefault();
			$.magnificPopup.close();
		});
	};
});
app.addModule('question', function () {
	this.init = function () {
		$('.question_button-2').click(function (e) {
			e.preventDefault();
			
			$('.question_tip').slideToggle();
		})
	}
});
app.addModule('select', function () {
	this.init = function () {
		$('.select').select2({
			language: "ru",
			placeholder: "Начните вводить название города....",
			allowClear: true,
			width: '100%'
		});
		
		$(document).on('input', '.select2-search__field', function () {
			if ($(this).val() === '') {
				$(this).closest('.select2-search').removeClass('active')
			} else {
				$(this).closest('.select2-search').addClass('active')
			}
		})
	}
});
app.addModule('tab', function () {
	var select;
	
	this.init = function () {
		var list = $('.tab_head');
		select = createSelect(list);
		list.after(select);

		list.find('a').click(function (e) {
			e.preventDefault();

			var $block = $($(this).attr('href'));
			
			change($block);
		});
	};

	function change(block) {
		var blockId = block.attr('id');
		var tabLink = block.closest('.tab')
		.find('.tab_head a[href="#' + blockId + '"]');
		
		block.closest('.tab').find('.tab_head a').removeClass('active');

		tabLink.addClass('active');
		
		block.closest('.tab').find('.tab_block').removeClass('active');
		
		block.addClass('active');
		
		select.find('option[value="#' + blockId + '"]').prop('selected', true);
	}

	function createSelect(list) {
		var a = list.find('a');
		var selectBlock = $('<div />').addClass('mobile-select');
		var select = $('<select />').addClass('select');
		selectBlock.append(select);

		a.each(function () {
			var option = $('<option />');
			option.val($(this).attr('href')).html($(this).text());
			select.append(option);
			if ($(this).closest('li').hasClass('active')) {
				option.prop('selected', true);
			}
		});

		select.on('change', function () {
			var block = $($(this).find('option:selected').val());
			
			change(block);
		});

		return selectBlock;
	}
});
app.addModule('timer', function () {
	var currentSeconds;
	
	this.init = function () {
		if (!$('.timer').length) {
			return;
		}
		
		var getSeconds = localStorage.getItem('seconds');
		var seconds = 0;
		
		if (getSeconds) {
			seconds = parseInt(getSeconds);
		}
		currentSeconds = seconds;
		
		setInterval(function () {
			currentSeconds += 1;
			localStorage.setItem('seconds', currentSeconds);
		}, 1000);
		
		initTimer(seconds);
	};
	
	window.initTimer = function (seconds) {
		$('.timer').timer({
			format: '%H:%M:%S',
			seconds: seconds
		});
		currentSeconds = seconds;
	};
	window.removeTimer = function () {
		$('.timer').timer('remove');
		localStorage.removeItem('seconds');
	};
	window.resetTimer = function (seconds) {
		window.removeTimer();
		window.initTimer(seconds);
	}
});
app.addModule('top-header', function () {
	this.init = function () {
		$('.top-header_user-txt').click(function () {
			$(this).closest('.top-header_user').toggleClass('active');
		});
		
		$('.top-header_btn').click(function () {
			$(this).toggleClass('active')
			$('.top-header_list').toggleClass('active')
		})
	}
});
app.addModule('video.games', function () {
	this.init = function () {
		var list = $('.video_list, .games_list');

		var block = createBlock(list);

		list.after(block);
	};

	function createBlock(list) {
		var a = list.find('a');
		var selectBlock = $('<div />').addClass('mobile-select');
		var select = $('<select />').addClass('select');
		selectBlock.append(select);

		a.each(function () {
			var option = $('<option />');
			option.val($(this).attr('href')).html($(this).text());
			select.append(option);
			if ($(this).closest('li').hasClass('active')) {
				option.prop('selected', true);
			}
		});

		select.on('change', function () {
			location.href = $(this).find('option:selected').val();
		});

		return selectBlock;
	}
});
jQuery(function () {
	app.modulesInit();
	
	var modules = app.getModules();

	for (var module in modules) {
		app.callModule(module);
	}
});