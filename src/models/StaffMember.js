export class StaffMember {

    set firstName(value){
        this._firstName = value;
    }
  
    get firstName(){
      return this._firstName;
    }

    set lastName(value){
        this._lastName = value;
    }
    
    get lastName(){
      return this._lastName;
    }
    
    set id(value){
      this._id = value;
    }
    
    get id(){
      return this._id;
    }

    fullName(){
      return `${this._firstName} ${this._lastName}`;
    }

}