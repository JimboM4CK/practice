export default class StaffMember {

  constructor(data){
    this.data = data;
  }

  get id(){
    return this.data.StaffID;
  }

  fullName(){
    return `${(this.data.PreferredName ? this.data.PreferredName : this.data.FirstName)} ${this.data.LastName}`;
    //return `${this._data.FirstName} ${this._data.LastName}`;
  }

}