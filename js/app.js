app.addModule('brands', function () {
	this.init = function () {
		$('.brands_arrow').click(function () {
			$('.brands_items').toggleClass('active');
			$(this).toggleClass('active');
		})
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
	}
});
app.addModule('training', function () {
	var self = this;
	var data = [];
	var baseUrl = 'http://auto.roscontent.ru';
	
	this.init = function () {
		window.resetTimer();
		
		var categories = [1, 3, 2, 8, 11, 12, 13, 14];
		
		trainingStart(categories);
		
		$(document).on('click', '.training_questions a', function (e) {
			e.preventDefault();
			var id = $(this).attr('href');
			
			changeQuestion(id);
		});
		
		$('#answer-button').click(function (e) {
			e.preventDefault();
			
			if (!$('.checkbox_input:checked').length) {
				return;
			}
			answer();
			goToNext();
			checkFinish();
		});
		$('#go-to-next').click(function (e) {
			e.preventDefault();
			goToNext();
		});
	};
	
	function trainingStart(categories) {
		$('#training-category').addClass('__hidden');
		$('#training-question').removeClass('__hidden');
		
		self.fillQuestions(categories);
	}
	
	this.fillQuestions = function (categories) {
		fillData(categories, function () {
			initFirst();
		});
	};
	function goToNext() {
		var next = $('.training_questions a.current').next();
		
		if (next.hasClass('answered')) {
			next = $('.training_questions a.answered:last').next();
		}
		
		if (!next.length) {
			next = $('.training_questions a:not(.answered):first');
		}
		
		if (next.length && !next.hasClass('answered')) {
			changeQuestion(next.attr('href'));
		}
	}
	function changeQuestion(id) {
		var item = getItemById(id);
		
		changeHtmlData(item);
		setAnswered();
		
	}
	function fillData(categories, callback) {
		$.ajax({
			method: 'get',
			url: '/json.txt',
			success: function (dataV) {
				var i  = 1;
				
				data = JSON.parse(dataV);
				
				data = data.filter(function (value) {					
					return value['id'] in categories;
				});
				
				data.forEach(function (item) { 
					item.index = i++;
				});
				
				callback();
			}
		});
	}
	function initFirst() {
		data.forEach(function (item) { 
			var link = $('<a />');
			link.html(item.index);
			link.attr('href', item.id);
			
			if (item.index == 1) {
				link.addClass('current');
				changeQuestion(item['id']);
			}
			
			$('.training_questions').append(link);
		});
	}
	function getItemById(id) {
		var arr = data.filter(function (item) { 
			return item['id'] == id;
		});
		
		return arr[0];
	}
	function changeHtmlData(item) {
		$('.question_image img').attr('src', baseUrl + item.image.url);
		$('.question_text span').html(item.index);
		$('.question_name').html(item.title);
		$('.question_tip').html(item.hint);
		
		$('.training_questions a').removeClass('current');
		$('.training_questions a[href="'+ item['id'] + '"]').addClass('current');
		
		$('.question_answers').html('')
		item.answers.forEach(function (answer) { 
			var label = $('<label />').addClass('checkbox __radio');
			var input = $('<input />')
				.attr('type', 'radio')
				.addClass('checkbox_input')
				.attr('name', 'answer')
				.attr('data-id', answer.id)
				.attr('data-correct', answer.is_correct);
			var ico = $('<div />').addClass('checkbox_ico');
			var text = $('<div />').addClass('checkbox_text').html(answer.title);
			
			label.append(input);
			label.append(ico);
			label.append(text);
			
			$('.question_answers').append(label);
		});
	}
	function answer() {
		var checked = $('.checkbox_input:checked');
		var correct = checked.attr('data-correct');
		var current = $('.training_questions a.current');
		
		if (correct == 'true') {
			current.addClass('valid')
		} else {
			current.addClass('invalid')
		}
		
		current.addClass('answered').attr('data-checked-id', checked.attr('data-id'));
	}
	function setAnswered() {
		var current = $('.training_questions a.current');
		var checked = current.attr('data-checked-id');

		if (current.hasClass('answered')) {
			$('.checkbox_input').prop('disabled', true);
			$('.checkbox_input[data-correct="true"]')
					.prop('checked', true)
					.closest('label')
					.addClass('__is-valid');
		}
		
		if (current.hasClass('invalid')) {
			$('.checkbox_input').prop('disabled', true);
			$('.checkbox_input[data-id="' + checked + '"]')
					.prop('checked', true)
					.closest('label')
					.addClass('__is-invalid');
		}
	}
	function checkFinish() {
		var links = $('.training_questions a');
		
		if (!$('.training_questions a:not(.answered)').length) {
			$('#training-question').addClass('__hidden');
			$('#training-done').addClass('__show');
			
			var html = "<p>Вопросов: <span>" + data.length + "</span></p>";
			html+= "<p>Правильно: <span class=\"green\">" + links.filter('.valid').length  + "</span></p>";
			html+= "<p>Ошибок: <span class=\"red\">" + links.filter('.invalid').length + "</span></p>";
			html+= "<p>Потрачено: <span>" + $('.timer').html() + "</span></p>";
			
			$('#training-done').html(html);
			
			window.removeTimer();
		}
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