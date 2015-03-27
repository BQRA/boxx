$(function(){

	/////////// menu actions
	$('body').on('click', '[data-action="start"]', function(){
		$('.main-menu').hide(0);
		$('.playing').show(0);
	});
	$('body').on('click', '#menu.closed', function(){
		$(this).addClass('opened');
		$(this).removeClass('closed');
		$('.pause').slideDown(300);
	});
	$('body').on('click', '#menu.opened, #continue', function(){
		$('#menu.opened').addClass('closed');
		$('#menu.opened').removeClass('opened');
		$('.pause').slideUp(300);
	});
	$('body').on('click', '#exit', function(){
		$('.playing').hide(0);
		$('.gameover').hide(0);
		$('.main-menu').show(0);
		$('#menu.opened').addClass('closed');
		$('#menu.opened').removeClass('opened');
		$('.pause').slideUp(300);
	});
	$('body').on('click', '#about', function(){
		$('.about').show(0);
		$('.main-menu').hide(0);
	});
	$('body').on('click', '.menu.opened', function(){
		$('.about').hide(0);
		$('.main-menu').show(0);
	});

	$('body').on('click', '[data-action="restart"], [data-action="start"]', function(){
		$('ul.numbers li').remove();
		$('#menu.opened').addClass('closed');
		$('#menu.opened').removeClass('opened');
		$('.gameover').hide(0);
		$('.pause').slideUp(300);
		$('#score, #move').text('0');
		var boxes = [
			['1', '1'],
			['1', '2'],
			['1', '3'],
			['1', '4'],
			['2', '1'],
			['2', '2'],
			['2', '3'],
			['2', '4'],
			['3', '1'],
			['3', '2'],
			['3', '3'],
			['3', '4'],
			['4', '1'],
			['4', '2'],
			['4', '3'],
			['4', '4']
		];
		for (var i = 1; i >= 0; i--) {
			makeNew(boxes);
			numbers();
		}
	});


	/////////// game calculating
	var scoreThis = 0;

	function numbers(){
		$('.numbers li').removeClass();
		$('.numbers li:contains("4")').addClass('li4');
		$('.numbers li:contains("8")').addClass('li8');
		$('.numbers li:contains("16")').addClass('li16');
		$('.numbers li:contains("32")').addClass('li32');
		$('.numbers li:contains("64")').addClass('li64');
		$('.numbers li:contains("128")').addClass('li128');
		$('.numbers li:contains("256")').addClass('li256');
		$('.numbers li:contains("512")').addClass('li512');
		$('.numbers li:contains("1024")').addClass('li1024');
		$('.numbers li:contains("2048")').addClass('li2048');
	}

	function sorting(data1, data2) {
		var $numbers = $('ul.numbers'),
		$numbersli = $numbers.children('li');
			$numbersli.sort(function(a,b){
				var c = a.getAttribute(data1),
				d = b.getAttribute(data1),
				e = a.getAttribute(data2),
				f = b.getAttribute(data2);
				if(c == d) {
			        return (e < f) ? -1 : (e > f) ? 1 : 0;
			    } else {
			        return (c < d) ? -1 : 1;
			    }
			});
		$numbersli.detach().appendTo($numbers);	
	}

	function move() {
		var moveNumber = parseInt($('.tools #move').text());
		$('.tools #move').text(moveNumber+1);
	}

	function makeNew(boxes) {
		var content = [ '2', '2', '2', '2', '2', '2', '2', '2', '4' ];
		var rand = boxes[Math.floor(Math.random()* boxes.length)];
		var randContent = content[Math.floor(Math.random()* content.length)];
		$('.numbers').append('<li class="new" data-y="' + rand[0] + '" data-x="' + rand[1] + '">' + randContent + '</li>');
	}

	function action(selector, a, b, dir) {
		var ok = 0;

		$('.numbers li').removeClass('new');

		// collect if there are same at the way
		setTimeout(function(){

			for (var i = 1; i <= 4; i++) {
				var collectSel = dir == 'normal' ? $('.numbers li[data-' + a + '="' + i + '"]:not(.fork)') : $($('.numbers li[data-' + a + '="' + i + '"]:not(.fork)').get().reverse());
				collectSel.map(function() {
					var x = parseInt($(this).text()),
					collector = parseInt($(this).attr('data-' + b)),
					plus = dir == 'normal' ? [-1, -2, -3] : [1, 2, 3],
					newCollector1 = $('.numbers li[data-' + a + '="' + i + '"][data-' + b + '="' + (collector+(plus[0])) + '"]').text(),
					newCollector2 = $('.numbers li[data-' + a + '="' + i + '"][data-' + b + '="' + (collector+(plus[1])) + '"]').text(),
					newCollector3 = $('.numbers li[data-' + a + '="' + i + '"][data-' + b + '="' + (collector+(plus[2])) + '"]').text(),
					blankAndCollect = newCollector1 != '' ? (collector+(plus[0])) : (newCollector2 != '' ? (collector+(plus[1])) : (collector+(plus[2])) ),
					y = $('.numbers li[data-' + a + '="' + i + '"][data-' + b + '="' + blankAndCollect + '"]:not(.fork)'), 
					z = parseInt(y.text());
					if ( x == z ) {
						ok = 1;
						y.text(x + z).addClass('fork');
						$(this).remove();
						// score 
						var score = parseInt($('#score').text())
						$('#score').text( score + (z*2) );
					}
				});	
			};
		}, 1);

		// move with animation
		setTimeout(function(){
			$(selector).map(function(index) {
				var count = dir == 'normal' ? ['1','2','3'] : ['4','3','2'];
				var ifelse = dir == 'normal' ? ($(this).attr('data-' + b)-1) == '0' : (parseInt($(this).attr('data-' + b))+1) == '5';
				var c = dir == 'normal' ? ($(this).attr('data-' + b)-1) : (parseInt($(this).attr('data-' + b))+1)

				var sel = $('[data-' + a + '=' + $(this).attr('data-' + a) + '][data-' + b + '=' + c + ']').text();
				if ( ifelse ) { // dayalilar 
				} else if ( sel != '' ) { 
				} else if ( $('[data-' + a + '=' + $(this).attr('data-' + a) + '][data-' + b + '=' + count[0] + ']').length == 0 ) {
					$(this).attr('data-' + b, count[0]);
					ok = 1;
				} else if ( $('[data-' + a + '=' + $(this).attr('data-' + a) + '][data-' + b + '=' + count[1] + ']').length == 0 ) {
					$(this).attr('data-' + b, count[1]);
					ok = 1;
				} else if ( $('[data-' + a + '=' + $(this).attr('data-' + a) + '][data-' + b + '=' + count[2] + ']').length == 0 ) {
					$(this).attr('data-' + b, count[2]);
					ok = 1;
				}
			});
		}, 2);

		// counting blank boxes
		setTimeout(function(){
			if ( ok == 1 ) {
				var boxes = [
					['1', '1'],
					['1', '2'],
					['1', '3'],
					['1', '4'],
					['2', '1'],
					['2', '2'],
					['2', '3'],
					['2', '4'],
					['3', '1'],
					['3', '2'],
					['3', '3'],
					['3', '4'],
					['4', '1'],
					['4', '2'],
					['4', '3'],
					['4', '4']
				];
				var showBoxes = [];
				$('.numbers li').map(function() {
					showBoxes.push([$(this).attr('data-y'), $(this).attr('data-x')])
				});

				for (var j = showBoxes.length - 1; j >= 0; j--) {
				    for (var i = boxes.length - 1; i >= 0; i--) {
				        if ( JSON.stringify(boxes[i]) == JSON.stringify(showBoxes[j]) ) {
				            boxes.splice(i, 1);
				        }
				    }
				}
			}
			if ( boxes == undefined ) {

			} else {
				makeNew(boxes);

				// score +1
				move();
			}
		}, 3);

		setTimeout(function(){			
			numbers();
		}, 201);

		setTimeout(function(){
			if ( $('ul.numbers li').length > 15 ) {
				var gameover = true;
				for (var i = 0; i < $('ul.numbers li').length; i++) {
					var a = parseInt($('ul.numbers li').eq(i).text()),
					forX = $('ul.numbers li').eq(i).attr('data-x'),
					forY = $('ul.numbers li').eq(i).attr('data-y');
					if ( 
						a == $('ul.numbers li[data-x="' + (parseInt(forX)+1) + '"][data-y="' + forY + '"]').text() || 
						a == $('ul.numbers li[data-x="' + forX + '"][data-y="' + (parseInt(forY)+1) + '"]').text() 
					) {
						gameover = false;
					}
				};
				if ( gameover == true ) {
					$('.gameover').fadeIn(500);
				}
			}
		}, 202)

	}

	numbers();

	// touch actions
	$(".game-container").swipe( {
	    //Generic swipe handler for all directions
	    swipeLeft:function(event, direction, distance, duration, fingerCount) {
	    	sorting('data-y', 'data-x');
			action('.numbers li', 'y', 'x', 'normal');  
	    },
	    swipeUp:function(event, direction, distance, duration, fingerCount) {
	    	sorting('data-x', 'data-y');
			action('.numbers li', 'x', 'y', 'normal');	
	    },
	    swipeRight:function(event, direction, distance, duration, fingerCount) {
	    	sorting('data-y', 'data-x');
			action($('.numbers li').get().reverse(), 'y', 'x', 'reverse');
	    },
	    swipeDown:function(event, direction, distance, duration, fingerCount) {
	    	sorting('data-x', 'data-y');
			action($('.numbers li').get().reverse(), 'x', 'y', 'reverse');
	    }
	});

	// keyboard actions
	$(document).keydown(function(event) {
		if ( event.which == 37 ) {
			sorting('data-y', 'data-x');
			action('.numbers li', 'y', 'x', 'normal');
		} else if ( event.which == 38 ) {
			sorting('data-x', 'data-y');
			action('.numbers li', 'x', 'y', 'normal');	
		} else if ( event.which == 39 ) {
			sorting('data-y', 'data-x');
			action($('.numbers li').get().reverse(), 'y', 'x', 'reverse');
		} else if ( event.which == 40 ) {
			sorting('data-x', 'data-y');
			action($('.numbers li').get().reverse(), 'x', 'y', 'reverse');
		}
	});

});
































