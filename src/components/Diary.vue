<template>
    <div id="diary">
        <div v-if="loading" class="loading">loading animation</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="staffMembers.length && !loading" class="content">
            <div id="diary-headers">
                <div v-for="(staffMember, index) in staffMembers" :key="index" class="diary-col">
                    <div class="title">{{ staffMember.fullName() }}</div>
                </div>
            </div>
            <div id="diary-content">
                <ContextMenu :type="contextMenuType"></ContextMenu>
                <div id="time">
                    <div class="diary-col">
                        <div v-for="(slot,index) in slots" 
                            :key="index" 
                            :data-hour="slot.hour | formattedHour" 
                            :data-minute="slot.minute | formattedMinute" 
                            class="diary-row"
                            :class="{'current-time' : checkTime(slot.hour, slot.minute) }"
                        > 
                            <span v-if="slot.minute == 0" class="hour">{{ slot.hour }}</span>
                            <span class="minutes">{{ slot.minute | formattedMinute }}</span>
                        </div>
                    </div>
                </div>
                <div id="staff">
                    <div v-for="(staffMember, index) in staffMembers" :key="index" class="diary-col" :data-staff-id="staffMember.id">
                        <div v-for="(slot,index) in slots" 
                            :key="index" 
                            :data-hour="slot.hour" 
                            :data-minute="slot.minute | formattedMinute" 
                            class="diary-row"
                            :class="{ 
                                'reserved' : isReserved(staffMember.id, slot.hour, slot.minute),
                                'unrostered' : !isRostered(staffMember.id, slot.hour, slot.minute),
                                'occupied' : isAppointment(staffMember.id, slot.hour, slot.minute),
                                'current-time' : checkTime(slot.hour, slot.minute) 
                            }"
                            @contextmenu="contextMenu($event)"
                            v-on:click="selectRow"
                        >
                            <div v-for="(appointment, index) in findExactAppointment(staffMember.id, slot.hour, slot.minute)" :key="index" class="booking" :class="'blue lighten-3'" :data-length="appointment.TimeSlots">
								<div class="content">
                                    <div class="title">{{ appointment.Title }}</div>
                                    <div class="description">{{ appointment.Description }}</div>
                                </div>
							</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
require('@/assets/css/practice.css');
//require('@/assets/js/diary.js')

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


import ContextMenu from './ContextMenu.vue'

export default {
    name: 'Diary',
    components: {
		ContextMenu
	},
    data(){
        return {
            time: null,
            loading: true,
            error: null,
            timer: {},
            startHour: 0,
            endHour: 0,
            slotMinutes: 0,
            contextMenuType: ''
        }
    },
    computed: {
        diaryDateIso: function(){
            return this.$store.getters.diaryDateIso;
        },
        diaryData: function(){
            return this.$store.getters.diaryData
        },
        staffMembers: function(){
            return this.diaryData.staffMembers
        },
        entries: function(){
            return this.diaryData.entries
        },
        date: function(){
            return this.diaryData.date;
        },
        companyInfo: function(){
            return this.$store.getters.companyInfo
        },
        diaryAction: function(){
            return this.$store.getters.diaryAction
        },
        slotsPerHour: function(){
            return 60 / this.slotMinutes;
        },
        slots: function(){
            var slots = [];
            for(var i = parseInt(this.startHour); i < parseInt(this.endHour); i++){
                for(var j = 0; j <= this.slotsPerHour-1; j++){
                    slots.push({hour: i, minute: j});
                }
            }
            return slots;
        },
        
    },
    watch: {
        date: 'fetchData',
        diaryAction: 'executeAction'
    },
    methods: {
        selectRow(e){
             if($(e.target).hasClass('diary-row')){
                 $('.diary-row.selected').removeClass('selected');
                 $(e.target).addClass('selected');
             }
        },
        contextMenu(e){
            e.preventDefault();
            let $el = $(e.target);
            if($el.hasClass('diary-row')){
                if(!$el.hasClass('selected')){
                    $('.diary-row.selected').removeClass('selected');
                    $el.addClass('selected');
                }
                if($el.hasClass('reserved')) this.contextMenuType = 'diaryRowReserved';
                else this.contextMenuType = 'diaryRowEmpty';

                $el.addClass('has-popup');
                $el.popup({
                    popup: '.context-menu',
                    boundery: '#staff',
                    hoverable: true,
                    position: 'top center',
                    on: 'manual',
                    onHidden: function(){
                        $el.removeClass('has-popup');
                    }
                }).popup('show');
            }
        },
        findExactAppointment(staffId, hour, minute){
            let type = 'Appointment';
            if(typeof this.entries[staffId] === 'undefined') return [];
            if(typeof this.entries[staffId][type] === 'undefined') return [];
            let slotTime = new Date(this.date);
            slotTime.setHours(hour);
            slotTime.setMinutes(this.$options.filters.formattedMinute(minute));
            slotTime.setSeconds(0,0);
            
            let obj = this.entries[staffId][type].find(o => {
                let startTime = new Date(o.StartTime);
                return slotTime.valueOf() === startTime.valueOf();
            });
            let result = [];
            if(obj){
                result.push(obj);
            }
            return result;
        },
        findEntries(type, staffId, hour, minute){
            if(typeof this.entries[staffId] === 'undefined') return [];
            if(typeof this.entries[staffId][type] === 'undefined') return [];
            let slotTime = new Date(this.date);
            slotTime.setHours(hour);
            slotTime.setMinutes(this.$options.filters.formattedMinute(minute));
            slotTime.setSeconds(0,0);
            let obj = this.entries[staffId][type].find(o => {
                let startTime = new Date(o.StartTime);
                let endTime = new Date(o.EndTime);
                return slotTime >= startTime && slotTime < endTime;
            });
            let result = [];
            if(obj) result.push(obj);
            return result;
        },
        isReserved(staffId, hour, minute){ 
            return !!this.findEntries('Reservation', staffId, hour, minute).length;
        },
        isRostered(staffId, hour, minute){ 
            return !!this.findEntries('Staff Roster', staffId, hour, minute).length;
        },
        isAppointment(staffId, hour, minute){ 
            return !!this.findEntries('Appointment', staffId, hour, minute).length;
        },

        fetchData(){
            // do something?
        },
        updateTime(){
            var current_time = this.$moment.tz(this.companyInfo.Timezone);
			var hours = current_time.format('H');
            var minutes = (Math.floor(current_time.format('m') / 10) * 10);
            this.time = `${hours}:${this.$options.filters.formattedMinute(minutes)}`;
        },
        checkTime(hour, minute){
            return this.time == `${hour}:${this.$options.filters.formattedMinute(minute)}`;
        },

        async executeAction() {
            if(this.diaryAction == '') return;
            $('.diary-row.has-popup').popup('hide');
            this[`action${this.diaryAction}`]();
            this.$store.commit('setDiaryAction', {action: ''});
        },

        async actionReserve(){
            let columns = $('.diary-row.selected').closest('.diary-col');
            await Promise.all(columns.map(async (key, column) => {
                let reservation = {};
                let selection = $(column).find('.diary-row.selected');
                let first = $(selection[0]);
                let last = $(selection[selection.length-1]);
                reservation.startTime = new Date(`${this.diaryDateIso} ${first.data('hour')}:${first.data('minute')}:00`);
                let tempEndTime = new Date(`${this.diaryDateIso} ${last.data('hour')}:${last.data('minute')}:00`);
                reservation.endTime = new Date(tempEndTime.getTime() + this.slotMinutes * 60000); //Add slot minutes to end time
                reservation.staffId = first.closest('.diary-col').data('staff-id');
                selection.addClass('reserved');
                selection.removeClass('selected');
                try {
                    await this.$store.dispatch('diaryAddReservation', reservation);
                    Promise.resolve();
                } catch(err){
                    selection.removeClass('reserved');
                    Promise.reject(err);
                    //TODO: toast error ('could not add reservation: reason');       
                }
            }));
            return Promise.resolve();
        },

        async actionClearSelection(){
            let columns = $('.diary-row.selected.reserved').closest('.diary-col');
            await Promise.all(columns.map(async (key, column) => {
                let reservation = {};
                let selection = $(column).find('.diary-row.selected');
                let first = $(selection[0]);
                let last = $(selection[selection.length-1]);
                reservation.startTime = new Date(`${this.diaryDateIso} ${first.data('hour')}:${first.data('minute')}:00`);
                let tempEndTime = new Date(`${this.diaryDateIso} ${last.data('hour')}:${last.data('minute')}:00`);
                reservation.endTime = new Date(tempEndTime.getTime() + this.slotMinutes * 60000); //Add slot minutes to end time
                reservation.staffId = first.closest('.diary-col').data('staff-id');
                selection.removeClass('reserved selected');
                try {
                    await this.$store.dispatch('diaryRemoveReservation', reservation);
                    Promise.resolve();
                } catch(err){
                    selection.addClass('reserved');
                    Promise.reject(err);
                    //TODO: toast error ('could not add reservation: reason');       
                }
            }));
            return Promise.resolve();
        },

        async actionClearReservation(){
            let columns = $('.diary-row.selected.reserved').closest('.diary-col');
            await Promise.all(columns.map(async (key, column) => {
                let reservation = {};
                let selection = $('.diary-row.selected.reserved').first()
                .prevUntil('.diary-row:not(.reserved)').addBack()
                .nextUntil('.diary-row:not(.reserved)').addBack()
                .nextUntil('.diary-row:not(.selected)').addBack()
                .nextUntil('.diary-row:not(.reserved)').addBack();
                //This should get all reservations... may need revisinglet first = $(selection[0]);
                let first = $(selection[0]);
                let last = $(selection[selection.length-1]);
                reservation.startTime = new Date(`${this.diaryDateIso} ${first.data('hour')}:${first.data('minute')}:00`);
                let tempEndTime = new Date(`${this.diaryDateIso} ${last.data('hour')}:${last.data('minute')}:00`);
                reservation.endTime = new Date(tempEndTime.getTime() + this.slotMinutes * 60000); //Add slot minutes to end time
                reservation.staffId = first.closest('.diary-col').data('staff-id');
                selection.removeClass('reserved selected');
                try {
                    await this.$store.dispatch('diaryRemoveReservation', reservation);
                    Promise.resolve();
                } catch(err){
                    selection.addClass('reserved');
                    Promise.reject(err);
                    //TODO: toast error ('could not add reservation: reason');       
                }
            }));
            return Promise.resolve();
        }
    },
    filters: {
        formattedMinute(value){
            value = '' + value;
            return value.length > 1 ? value : `${value}0`;
        },
        formattedHour(value){
            value = '' + value;
            return value.length > 1 ? value : `0${value}`;
        }
    },
    async created (){
        //TODO: CREATE LOGIN PAGE
        
        try {
            await this.$store.dispatch('login', {email: "james.mackay@gmail.com", password: "Test"});
            await this.$store.dispatch('diaryData', {date: this.diaryDateIso});
            let startTime = new Date('1970-01-01T' + this.companyInfo.TimeOpen + 'Z');
            let endTime = new Date('1970-01-01T' + this.companyInfo.TimeClose + 'Z');
            this.startHour = startTime.getUTCHours();
            this.endHour = endTime.getUTCHours();
            this.slotMinutes = this.companyInfo.SlotMinutes;  

        } catch( error ) {
            this.error = error;
        }

        this.loading = false;

        this.fetchData();
        this.updateTime();

        this.timer.fetchData = setInterval(this.fetchData, 10000);
        this.timer.updateTime = setInterval(this.updateTime, 5000);
    },
}
</script>
