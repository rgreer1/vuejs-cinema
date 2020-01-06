//this method is called in respone to a check-filter event from <movie-list> being recieved by the root instance  
//NB: values for category, title and checked come from the custom event "check-filter"
function checkFilter(category, title, checked){

    //NB: category can have a value of 'genre' or 'time'. It defines the type of filter (nothing to do with movie categories!)
    if(checked){
        // Note: this[category] is equavalent to this.genre or this.time . 
        // Category variable allows us to determine which type of filter at runtime
        this[category].push(title);  //note: "this" gets defined by "checkFilter.bind(this)" when called from main.js 
    }else{
        let index = this[category].indexOf(title);
        if (index > -1) {
            this[category].splice(index, 1); //delete (splice out) 1 item from array
        }
    }
}

export { checkFilter }; //using { } to perform an ES6 "destructured assignment" (oooh, fancy word!). Makes each element of given object or array, a property of this object 
