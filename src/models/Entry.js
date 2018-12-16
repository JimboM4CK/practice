
export class Entry {

  get title(){
    return this._title;
  }
  
  set title(value){
    this._title = value;
  }

  get description(){
    return this._description;
  }
  
  set description(value){
    this._description = value;
  }
  
  get startTime(){
    return this._startTime;
  }

  set startTime(value){
    this._startTime = value;
  }

  get endTime(){
    return this._endTime;
  }

  set endTime(value){
    this._endTime = value;
  }

  get timeSlots(){
    return this._timeSlots;
  }

  set timeSlots(value){
    this._timeSlots = value;
  }

  get maxAttendees(){
    return this._maxAttendees;
  }
  
  set maxAttendees(value){
    this._maxAttendees = value;
  }
  
  get entryId(){
    return this._entryId;
  }

  set entryId(value){
    this._entryId = value;
  }

  get staffId(){
    return this._staffId;
  }

  set staffId(value){
    this._staffId = value;
  }

  get entryTypeId(){
    return this._entryTypeId;
  }

  set entryTypeId(value){
    this._entryTypeId = value;
  }

  get serviceId(){
    return this._serviceId;
  }

  set serviceId(value){
    this._serviceId = value;
  }

  get serviceTemplateId(){
    return this._serviceTemplateId;
  }
  
  set serviceTemplateId(value){
    this._serviceTemplateId = value;
  }

  get roomId(){
    return this._roomId;
  }
  
  set roomId(value){
    this._roomId = value;
  }

  get treatmentLocationId(){
    return this._treatmentLocationId;
  }
  
  set treatmentLocationId(value){
    this._treatmentLocationId = value;
  }

  addEntryDetail(entryDetail){
    this._entryDetails.push(entryDetail);
  }
  
  get entryDetails(){
    return this._entryDetails;
  }
}