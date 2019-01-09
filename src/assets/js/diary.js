
var selection = { X: 0, Y: 0 },
	mouse = { X: 0, Y: 0 },
	selecting = false;

$(function(){
	$(document).on('mousedown', function(e){
		if(!$(e.target).hasClass('diary-row')) return;
		selection.X = e.pageX;
		selection.Y = e.pageY;
		if($(e.target).hasClass('selected') && e.which == 3) return;
		selecting = true;
	});

	$(document).on('mousemove', function(e){
		mouse.Y = e.pageY; 
		mouse.X = e.pageX;
		if(selecting){
			row_collision(selection.Y, mouse.X, mouse.Y, selection.X, 'selected');
			selection_rectangle(selection.X, selection.Y, mouse.X, mouse.Y);
		} else {
			$('.selection-rectangle').remove();
		}
	}).on('mouseup', function(e){
		
		if(selecting){ 
			row_collision(selection.Y, mouse.X, mouse.Y, selection.X, 'selected');
			selection_rectangle(selection.X, selection.Y, mouse.X, mouse.Y);
		} else {
			$('.selection-rectangle').remove();
		}
		selecting = false;
	});

});


function selection_rectangle(x1, y1, x2, y2){
	if(!selecting) return;
	if(!$('.selection-rectangle').length) $('#staff').append('<div class="selection-rectangle"></div>');
	let minX = $('#staff').offset().left+4;
	let minY = $('#staff').offset().top;
	let maxX = minX + $('#staff').outerWidth();
	let maxY = minY + $('#staff').outerHeight();

	if(x1 > x2) x1 = [x2, x2 = x1][0];
	if(y1 > y2) y1 = [y2, y2 = y1][0];

	if(x1 < minX) x1 = minX;
	if(x2 > maxX) x2 = maxX;
	if(y1 < minY) y1 = minY;
	if(y2 > maxY) y2 = maxY;

	$('.selection-rectangle').css('top', y1);
	$('.selection-rectangle').css('left', x1);
	$('.selection-rectangle').css('width', x2-x1);
	$('.selection-rectangle').css('height', y2-y1);
}

function row_collision(top, right, bottom, left, classname){
	bottom++;
	if(top > bottom) top = [bottom, bottom = top][0];
	if(left > right) left = [right, right = left][0];
	$('#staff .diary-row').removeClass('selected');
	$('#staff .diary-row').each(function(){
		var row_top = $(this).offset().top;
		var row_left = $(this).offset().left;
		var row_bottom = row_top + $(this).height();
		var row_right = row_left + $(this).width();
		if (bottom < row_top || top > row_bottom || right < row_left || left > row_right){
			// No detection
		} else {
			$(this).addClass(classname);
		}
	});
}
