/**
 * could be written better
 **/
 jQuery(document).ready(function($){
	var colh = 'orange lighten-4 kon',
	ctime = 0,
	gameboard = $("div#gameboard"),
	grid = 1,
	mode = 1,
	options = $("div#options"),
	time = $("span#time"),
	tStarted = 0,
	to = '',
 	colk = 'blue-grey lighten-4',
 	pro = 0;

	function _s(e){e.preventDefault();e.stopPropagation()}
		
	$("a#play").click(function(e){
		_s(e);
		grid = $("input#grid-size").val();
		mode = $("input#difficulty").is(":checked") ? 1 : 0;
		pro = $("input#superpro").is(":checked") ? 1 : 0;

		gaEvent('option-change', 'promode', pro);
		gaEvent('option-change', 'gridsize', grid);
		gaEvent('option-change', 'mode', mode == 1 ? 'shuffle' : 'free');

		loadGameBoard(grid);
		showA(gameboard, options);
	});

	function showA(A,B) {
		h='hide';
		A.removeClass(h);
		B.addClass(h);
	}
	
	function sTime () {
		tStarted=1;
		ctime++;
		time.text(ctime);
		to = window.setTimeout(sTime, 1000);
	}

	function finish() {
		window.clearTimeout(to);
		gaEvent('game', 'finished', mode + "#" + pro);
		gaEvent('score-track', mode + "#" + pro, ctime);
		$("span#modaltime").text(secondsToTime(ctime));
		$("div#game-complete-modal").openModal({
			dismissible: false
		});
		tStarted = 0;
		ctime = 0;
		time.text(ctime);
	}
	function reset()
	{
		window.clearTimeout(to);
		tStarted = 0;
		ctime = 0;
		time.text(ctime);
	}
	function secondsToTime(s)
	{
		var min = Math.floor(s/60);
		var sec = s % 60;
		if (sec < 10) { sec = "0" + sec}
		return min + ":" + sec;

	}

	loadGameBoard = function(squares)
	{
		y = "";
		reset();

		var xCols = Array();
		for (i = 1; i <= squares; i++) {
			xCols.push(i);
		}
		var yCols = xCols;

		if (pro) {
			xCols = shuffle(xCols);
			yCols = shuffle(yCols);
		}

		html = '<div class="grow-row-0"><div class="gcol '+colk+' white slabel">' + squares + "x</div>";

		for (d in xCols) {
			i = xCols[d];
			html += "<div class='gcol number-key "+colk+" y"+i+"'>" + i + "</div>";
		}

		html += "</div>";
		

		for (d in xCols) {
			i = xCols[d];
			html += '<div class="grow-row-' + i + '"><div class="gcol number-key '+y+colk+' x'+i+'"><strong>' + i + "</strong></div>";
			for (z in yCols) {
				j = yCols[z];
				html += "<div class='gcol trail trailx-" + i + " traily-" + j + "'>" + 
				"<input type='number' class='answer unanswered' data-x='" + i + "' data-y='" + j + "' maxlength='3' />"
				+ "</div>";
			}
			html += "</div>";
		}
		html += "<p class='flow-text center-align'>Choose A Square And Off You Go</p>";
		
		gameboard.html(html);
		readyGame();
	}


	function readyGame() {
		var $sums = $("input.answer");
		$("input#blank").focus();

		$sums.bind("blur", function(){
			var $this = $(this);
			if (!isCorrect($this)) {
				$this.removeClass("orange").addClass("red");
			}
		});	

		$sums.bind("focus", function(){
			var $this = $(this);
			if (!tStarted) { sTime(); }
			$this.addClass("orange lighten-4").val("");
			$("div.number-key.x" + $this.attr("data-x")).addClass(colh).removeClass(colk);
			$("div.trail.trailx-" + $this.attr("data-x")).addClass('trail-active');
			$("div.trail.traily-" + $this.attr("data-y")).addClass('trail-active');
			$("div.number-key.y"+ $this.attr("data-y")).addClass(colh).removeClass(colk);
			$this.parent().removeClass("trail-active");
		});
		$sums.bind("blur", function(){
			$("div.number-key.kon").removeClass(colh).addClass(colk);
			$("div.trail").removeClass('trail-active');
		});
		gaEvent('game', 'start', mode + "#" + pro);
		if (mode == 1) {
			gameA($sums);
		} else {
			gameB($sums);
		}
	}


	function gameB($sums) {
		
		var left = $sums.length - 1;

		$("input.unanswered").first().focus();

		function nextSum () {
			var $u = $("input.unanswered");
			$u.attr("disabled", "disabled").addClass("grey lighten-2");
			index = Math.floor(Math.random() * $u.length);
			var el = $($u[index]);
			el.removeAttr("disabled").removeClass("grey lighten-2").focus();
		}

		$sums.bind("keyup", function(){
			var $this = $(this);
			if (isCorrect($this)) {
				$this.removeClass("orange").addClass("green").attr("disabled", "disabled").removeClass("unanswered");
				left--;
				if (left >= 0) {
					nextSum()
				} else {
					finish();
				}
			}
		});
	}
	function gameA($sums) {
		var left = $sums.length;
		$sums.bind("keyup", function(){
			var $this = $(this);
			if (isCorrect($this)) {
				$this.removeClass("orange").addClass("green").attr("disabled", "disabled").removeClass("unanswered");
				left--;
				if (left > 0) {
					$("input.unanswered").first().focus();
				} else {
					finish();
				}
			}
		});
	}

	function isCorrect(x)
	{
		var val = parseInt(x.attr("data-x")) * parseInt(x.attr("data-y"));
		var ans = parseInt(x.val());
		return ans == val;
	}

	$("a.playagain").click(function(e){
		_s(e);
		gaEvent('play-again', 'yes', 'yes');
		$("div#game-complete-modal").closeModal();
		reset();
		showA(options, gameboard);
	});

	var w = $(window);
	var n = $("body>nav");
	var f = $("body>footer");
	var m = $("body>main");
	w.bind("resize", resize);
	function _x(e) {
		var a = parseInt(e.css("margin-top"));
		var b = parseInt(e.css("margin-bottom"));
		var c = parseInt(e.innerHeight())
		return parseInt(e.innerHeight()) + parseInt(e.css("margin-top")) + parseInt(e.css("margin-bottom"));
	}
	function resize(){
		var nh = parseInt($(window).innerHeight()) - (_x(n) + _x(f));
		$("body>main").css("min-height", nh+"px");
	}
	resize();

	function gaEvent(act,lab,val) {
		if (typeof(ga) != 'undefined') {
			ga("send","event",'100squares',act,lab,val);
		}
	}
});

//This script comes from other sources :)
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}