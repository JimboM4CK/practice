<template>
    <div :id="'diary'">
        <div v-if="loading" class="loading"></div>
        <div v-if="error" class="error"></div>
        <div v-if="practice && staffMembers && entries" class="content">
            <div :id="'diary-headers'">
                <div v-for="(staffMember, index) in staffMembers" :key="index" class="diary-col">
                    <div class="title">{{ staffMember.fullName() }}</div>
                </div>
            </div>
            <div :id="'diary-content'">
                <div :id="'time'">
                    <div class="diary-col">
                        <div v-for="(timeSlot,index) in slots" 
                            :key="index" 
                            :data-hour="timeSlot.hour" 
                            :data-minute="timeSlot.minute | formattedMinute" 
                            class="diary-row"
                        >
                            <span v-if="timeSlot.minute == 0" class="hour">{{ timeSlot.hour }}</span>
                            <span class="minutes">{{ timeSlot.minute | formattedMinute }}</span>
                        </div>
                    </div>
                </div>
                <div :id="'staff'">
                    <div v-for="(staffMember, index) in staffMembers" :key="index" class="diary-col" :data-staff-id="staffMember.id">
                        <div v-for="(timeSlot,index) in slots" 
                            :key="index" 
                            :data-hour="timeSlot.hour" 
                            :data-minute="timeSlot.minute | formattedMinute" 
                            class="diary-row"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { StaffMember } from '@/models/StaffMember.js' 
import { Entry } from '@/models/Entry.js' 
import { EntryDetail } from '@/models/EntryDetail.js'

export default {
    name: 'Diary',
    props: ['staffMembers', 'diaryEntries'],

    data(){
        return {
            date: new Date(),
            diary: null,
            error: null,
            loading: false,
            timer: null,
        }
    },
    computed: {
        totalHours: function(){
            return this.endHour - this.startHour;
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
        }
    },
    watch: {
        date: 'fetchData',
    },
    methods: {
        fetchData(){
            this.practice = this.staffMembers = this.entries = this.error = null;
            this.loading = true;
            
            //fetch diary data for date this.date
            
            this.$api.get('practice', {}, (error, data) => {
                if(error) return this.error = this.error ? this.error : error;
                this.practice = data;
            });

            this.$api.get('staffMembers', {}, (error, data) => {
                if(error) return this.error = this.error ? this.error : error;
                data.staffMembers.forEach((staffMember, index) => {
                    let staffMemberObject = new StaffMember();
                    staffMember.forEach((value, index) => { staffMemberObject.index = value; });
                    diary.staffMembers.push(staffMemberObject);
                });
            });

            this.$api.get('diary', {date: this.date}, (error, data) => {
                if(error) return this.error = this.error ? this.error : error;
                data.staffMembers.forEach((staffMember, index) => {
                    let staffMemberObject = new StaffMember();
                    staffMember.forEach((value, index) => { staffMemberObject.index = value; });
                    diary.staffMembers.push(staffMemberObject);
                });
            });
            

            //set loaded diary objects to component data: diary
            this.diary = diary;
            this.loading = false;
            this.loaded = true;
        }
    },
    filters: {
        formattedMinute(value){
            return value.length > 1 ? value : `${value}0`;
        }
    },
    created (){
        this.fetchData();
        this.timer = setInterval(this.fetchData, 5000);
    },
}
</script>
