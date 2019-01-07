
var booking_move = [];
var mouse_pos = [];
var mouse_selection_begin = [];
var selecting = false;

var highlight = {
	clear: function(){
		$('.highlight').removeClass('highlight invalid');
	}
}
var selection = {
	clear: function(){
		$('.selected').removeClass('selected');
	}
}

var reservation = {
	siblings: function(row){
		staff_id = row.closest('.diary-col').attr('staff-id');
		if(row.prev('.reserved, .adding-reservation-'+staff_id).length) row = row.prevUntil('.diary-row:not(.reserved):not(.adding-reservation-'+staff_id+'), .diary-row.removing-reservation');
		if(row.next('.reserved, .adding-reservation-'+staff_id).length) row = row.nextUntil('.diary-row:not(.reserved):not(.adding-reservation-'+staff_id+'), .diary-row.removing-reservation').addBack();
		return row;
	},	
	update_siblings_id: function(row, id) {
		var rows = this.siblings(row);
		rows.attr('data-reservation-id', id);
	},
	selected_rows: function(){
		return $('.diary-row.selected.reserved');
	},
	selected_ids: function() {
		var ids = [];
		$.each(this.selected_rows(), function(index, row){
			var id = $(row).attr('data-reservation-id');
			if(ids.indexOf(id) < 0) ids.push(id);
		});
		return ids;
	},
	group_details_by_class: function(row, class_name){
		if(!row.length) return false;
		if(row.prev().hasClass('.'+class_name)) row = row.prevUntil('.diary-row:not(.'+class_name+')');
		var first = diary.row_details(row);
		var id = row.attr('data-reservation-id');
		var count = 1;
		while(true){
			if(row.next('.diary-row.'+class_name).length){
				row = row.next('.diary-row.'+class_name);
				count++;
			} else {
				var last = diary.row_details(row);
				break;
			}
		}
		return {id: id, start_date: first.date, end_date: last.date, slots: count, staff_id: first.staff_id, start_row:first.row}
	},
	group_details: function(row){
		if(!row.length) return false;
		if(row.prev().hasClass('.reserved')) row = row.prevUntil('.diary-row:not(.reserved), .diary-row.removing-reservation');
		var first = diary.row_details(row);
		var id = row.attr('data-reservation-id');
		var staff_id = row.closest('.diary-col').attr('staff-id');
		var count = 1;
		while(true){
			if(row.next('.diary-row.reserved:not(.removing-reservation), .diary-row.adding-reservation-'+staff_id+':not(.removing-reservation)').length){
				row = row.next('.diary-row.reserved:not(.removing-reservation), .diary-row.adding-reservation-'+staff_id+':not(.removing-reservation)');
				count++;
			} else {
				var last = diary.row_details(row);
				break;
			}
		}
		return {id: id, start_date: first.date, end_date: last.date, slots: count, staff_id: first.staff_id, start_row:first.row}
	},
	rows_by_id: function(id){
		return $('.diary-row[data-reservation-id="'+id+'"]');
	},
	remove_by_id: function(id){
		$('.reserved[data-reservation-id="'+id+'"]').removeClass('reserved');
		diary.remove.reservation(id, function(data){
			reservation.unset_by_id(id);
		}, function(data){
			$('.reserved[data-reservation-id="'+id+'"]').addClass('reserved');
		});
	},
	unset_by_id: function(id){
		var rows = reservation.rows_by_id(id);
		rows.removeClass('reserved removing-reservation').attr('data-reservation-id','');
	},
	remove_pending_by_id: function(id){
		var rows = this.rows_by_id(id);
		rows.filter('.removing-reservation').removeClass('removing-reservation').attr('data-reservation-id','');
	},
	add: function(){
		var cols = [];
		$('.diary-row.selected').each(function(){
			var staff_id = $(this).closest('.diary-col').newData('staff-id');
			if(typeof cols[staff_id] == "undefined") cols[staff_id] = [];
			$(this).addClass('reserved adding-reservation-'+staff_id);
			cols[staff_id].push($(this));
		});
		selection.clear();
		$.each(cols, function(staff_id, rows){
			if(typeof rows == "undefined") return;
			var group_details = reservation.group_details_by_class(rows[0], 'adding-reservation-'+staff_id);
			diary.add.reservation(staff_id, group_details.start_date, group_details.end_date, function(data){
				reservation.update_siblings_id(rows[0], data.entry_id);
				$('.adding-reservation-'+staff_id).removeClass('adding-reservation-'+staff_id);
			}, function(data){
			});
		});
		
	},
	clear: function (){
		var ids = reservation.selected_ids();
		this.selected_rows().removeClass('reserved').addClass('removing-reservation');	
		$.each(ids, function(index, id){
			var first = reservation.rows_by_id(id).not('.removing-reservation').first();
			var second = reservation.rows_by_id(id).filter('.removing-reservation').last().next();
			if(!first.length){
				reservation.remove_by_id(id);
				return true;
			}
			var first_details = reservation.group_details(first);
			diary.refresh.prevent = true;
			diary.update.reservation(id, first_details.start_date, first_details.end_date, function(data){
				//Success
				if(!second){
					reservation.remove_pending_by_id(id);
					diary.refresh.prevent = false;
					return true;
				}
				var second_details = reservation.group_details(second);
				diary.add.reservation(second_details.staff_id, second_details.start_date, second_details.end_date, function(data){
					//Success
					reservation.update_siblings_id(second_details.start_row, data.entry_id);
					reservation.remove_pending_by_id(id);
					diary.refresh.prevent = false;
				}, function(data){
					//Failed
					diary.refresh.items();
				});
				
			},
			function(data){
				//Failed
				diary.refresh.items();
			});
		});
		selection.clear();	
	}
	
}

$(function(){
    
	$(document).on('mousemove touchmove', function(e){
		mouse_pos.Y = e.pageY; 
		mouse_pos.X = e.pageX;
		
		if(selecting){ 
			row_collision(mouse_selection_begin.Y, mouse_pos.X, mouse_pos.Y, mouse_selection_begin.X, 'selected');
			selection_rectangle(mouse_selection_begin.X, mouse_selection_begin.Y, mouse_pos.X, mouse_pos.Y);
		} else {
			$('#selection-rectangle').remove();
		}
		
		if(!booking_move.initiated && booking_move.selected){
			if(booking_move.move_amount >= 10){
				booking_move_initiate(booking_move.object);
				booking_move_highlight_target();
			}
			booking_move.move_amount++;
		}
	}).on('mouseup touchend', function(e){
		
		if(selecting){ 
			row_collision(mouse_selection_begin.Y, mouse_pos.X, mouse_pos.Y, mouse_selection_begin.X, 'selected');
			selection_rectangle(mouse_selection_begin.X, mouse_selection_begin.Y, mouse_pos.X, mouse_pos.Y);
		} else {
			$('#selection-rectangle').remove();
		}
		
		selecting = false;
	});
});


function selection_rectangle(x1, y1, x2, y2){
	if(!selecting) return;
	if(!$('#selection-rectangle').length) $('#columns').append('<div id="selection-rectangle"></div>');
	if(x1 > x2) x1 = [x2, x2 = x1][0];
	if(y1 > y2) y1 = [y2, y2 = y1][0];
	$('#selection-rectangle').css('top', y1);
	$('#selection-rectangle').css('left', x1);
	$('#selection-rectangle').css('width', x2-x1);
	$('#selection-rectangle').css('height', y2-y1);
}

function row_collision(top, right, bottom, left, classname){
	bottom++;
	if(top > bottom) top = [bottom, bottom = top][0];
	if(left > right) left = [right, right = left][0];
	$('#columns .diary-row').removeClass('selected');
	$('#columns .diary-row').each(function(){
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

function booking_move_initiate(object){
	booking_move.move_amount = 0;
	booking_move.id = $(object).newData('id');
	booking_move.move = true;
	booking_move.move_rows = $(object).newData('length');
	$('.booking').css('pointerEvents', 'none');	
	$(object).addClass('see-through')
		.clone()
		.addClass('new')
		.addClass('mouse-follow')
		.css('width', $(object).outerWidth())
		.css('height', $(object).outerHeight())
		.css('top', mouse_pos.Y - 10 - $('#columns').offset().top)
		.css('left', mouse_pos.X - booking_move.position.X)
		.appendTo('#columns');		
	$(object).addClass('original');
	$(object).closest('.diary-row').nextAll('.diary-row').addBack().slice(0,booking_move.move_rows).removeClass('occupied');
	booking_move.initiated = true;
}

function booking_truncate_text() {
	$('.booking .content').each(function(){
		var wordArray = $(this).html().trim().split(' ');
		var outer_height = $(this).closest('.booking').outerHeight(true) - $(this).closest('.booking').find('.title-bar').outerHeight() - 2;
		while($(this).height() > outer_height) {
			wordArray.pop();
			$(this).html(wordArray.join(' ') + '...');
		}
	});
}

function booking_move_highlight_target(){
	selection.clear();
	highlight.clear();
	var invalid = false;
	$('.diary-col').each(function(){
		if(is_colliding($(this), $('.booking.new'))){
			$(this).find('.diary-row').each(function(){
				if(is_booking_in_row($(this))){
					$(this).addClass('highlight');
					if($(this).hasClass('occupied')) invalid = true;
				}
			});
		}
	});
	var rows = $('.highlight:first').nextAll('.diary-row').addBack().slice(0,booking_move.move_rows);
	rows.each(function(){
		$(this).addClass('highlight');
		if($(this).hasClass('occupied')) invalid = true;
	});
	if(invalid) $('.highlight').addClass('invalid');
}


function booking_move_complete(){
	booking_move.selected = false;
	booking_move.move = false;		
	booking_move.initiated = false;		
	$('.booking').removeClass('mouse-follow');
	if($('.highlight').length === 0 || $('.highlight:first').hasClass('invalid')) booking_move_reset(); else booking_move_confirm();
	highlight.clear();
}

function booking_move_reset(){
	$('.booking').css('pointerEvents', 'all');
	$('.booking.new').remove();
	$('.booking.original').removeClass('original see-through').closest('.diary-row').nextAll('.diary-row').addBack().slice(0,booking_move.move_rows).addClass('occupied');
}

function booking_move_confirm(){
	$('.booking').css('pointerEvents', 'all');
	$('.booking.original').remove();
	$('.booking.new').removeClass('see-through').appendTo('.diary-row.highlight:first').css('top', '').css('left', '').css('width', '').css('height', '');
	$('.booking.new').closest('.diary-row').nextAll('.diary-row').addBack().slice(0,booking_move.move_rows).addClass('occupied');
	$('.booking.new').removeClass('new');
}

function booking_move_mouse_follow(){
	setTimeout(function(){
		if($('.mouse-follow').length){
			var container = [], top = mouse_pos.Y - 10 - $('#columns').offset().top, left = mouse_pos.X - booking_move.position.X;
			container.left = 6;
			container.top = 0;
			container.right = container.left - 10 + $('#columns').outerWidth(true);
			container.bottom = container.top + $('#columns').outerHeight(true);
			if(top < container.top) top = container.top;
			if(left < container.left) left = container.left;
			if(left + $(booking_move.object).outerWidth() > container.right) left = container.right - $(booking_move.object).outerWidth();
			if(top + $(booking_move.object).outerHeight() > container.bottom) top = container.bottom - $(booking_move.object).outerHeight();		
			$('.mouse-follow').css('top', top).css('left', left);
			booking_move_highlight_target();
		}
		booking_move_mouse_follow();
	}, 12);
}




function is_booking_in_row($row){
	var row_height             = $row.outerHeight( true );
	var row_width              = $row.outerWidth( true );
	var row_top							   = $row.offset().top;
	var row_left							 = $row.offset().left;
	var row_bottom				  	 = row_top + row_height;
	var row_right							 = row_left + row_width;

	var row_midpoint = [];
	row_midpoint.X = row_left + row_width/2;
	row_midpoint.Y = row_top + row_height/2;
	
	$booking = $('.booking.new');
	var booking_height             = $booking.outerHeight( true );
	var booking_width              = $booking.outerWidth( true );
	var booking_top					  		 = $booking.offset().top;
	var booking_left					  	 = $booking.offset().left;
	var booking_bottom					   = booking_top + booking_height;
	var booking_right							 = booking_left + booking_width;

	var not_colliding = ( row_midpoint.Y < booking_top || row_midpoint.Y > booking_bottom || row_midpoint.X < booking_left || row_midpoint.X > booking_right );
	//var not_colliding = ( row_bottom < booking_top || row_top > booking_bottom || row_right < booking_left || row_left > booking_right );

	// Return whether it IS colliding
	return ! not_colliding;
}

function is_colliding( $div1, $div2 ) {
	
	var d1_offset             = $div1.offset();
	var d1_height             = $div1.outerHeight( true );
	var d1_width              = $div1.outerWidth( true );
	var d1_distance_from_top  = d1_offset.top + d1_height;
	var d1_distance_from_left = d1_offset.left + d1_width;

	var d2_offset             = $div2.offset();
	var d2_height             = $div2.outerHeight( true );
	var d2_width              = $div2.outerWidth( true );
	var d2_distance_from_top  = d2_offset.top + d2_height;
	var d2_distance_from_left = d2_offset.left + d2_width;

	var not_colliding = ( d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left );

	// Return whether it IS colliding
	return ! not_colliding;
}
