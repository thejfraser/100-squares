/**
 * could be written better
 **/
 jQuery(document).ready(function($){
	var gameboard = $("div#gameboard");
	var time = $("span#time");
	var timerStarted = 0;
	var ctime = 0;
	var to = '';
	var grid = 1;
	var mode = 1;
	var options = $("div#options");

	function _s(e){e.preventDefault();e.stopPropagation()}
		
	$("a#play").click(function(e){
		_s(e);
		grid = $("input#grid-size").val();
		mode = $("input#difficulty").is(":checked") ? 1 : 0;
		loadGameBoard(grid);
		showA(gameboard, options);
	});

	function showA(A,B) {
		A.removeClass("hide");
		B.addClass("hide");
	}
	
	function startTime () {
		timerStarted = 1;
		ctime++;
		time.text(ctime);
		to = window.setTimeout(startTime, 1000);
	}
	function finish() {
		window.clearTimeout(to);
		$("span#modaltime").text(secondsToTime(ctime));
		$("div#game-complete-modal").openModal({
			dismissible: false
		});
		timerStarted = 0;
		ctime = 0;
		time.text(ctime);
	}
	function reset()
	{
		window.clearTimeout(to);
		timerStarted = 0;
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
		reset();
		html = "<div class='grow row-0'><div class='gcol white'>&nbsp;</div>";

		for (i = 1; i <= squares; i++) {
			html += "<div class='gcol blue-grey lighten-3'>" + i + "</div>";
		}

		html += "</div>";
		
		for (i = 1; i <= squares; i++) {
			html += "<div class='grow row-" + i + "'><div class='gcol blue-grey lighten-3'><strong>" + i + "</strong></div>";
			for (j = 1; j <= squares; j++) {
				html += "<div class='gcol'>" + 
				"<input type='text' class='answer unanswered' data-x='" + i + "' data-y='" + j + "' maxlength='3' />"
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
		
		$sums.bind("keypress", function(e){
			if (e.keyCode > 57 || e.keyCode < 48) {
				return false
		 	}
		});

		$sums.bind("focus", function(){
			if (!timerStarted) { startTime(); }
			$(this).addClass("orange lighten-4").val("")
		});

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
		$("div#game-complete-modal").closeModal();
		reset();
		showA(options, gameboard);
	});
});
