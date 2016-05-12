/**
@Description 
 A simple javascript  Function that monitor and keep dom element always visible.

 @Param {element} its take an element or element id

 @Author Obaro I. Johnson

*/

var Sticky =(function(elementOrId)
{
	this.initTop=0;
	if(elementOrId instanceof HTMLElement){
		this.element= elementOrId;	
	}else if(typeof elementOrId =="string"){
		this.element = document.getElementById(elementOrId);
	}
	if(!this.element) throw new Error("No Element with the given id exist");
	var scrollInit = window.scrollY || window.pageYOffset;

	this.initTop  = this.element.getBoundingClientRect().top + (scrollInit);   
    //add class private method
    var addClass=(function(classname){
    	if(typeof classname !="string" || classname=="") return ;       	
    	if(!this.element.classList.contains(classname))
    		this.element.classList.add(classname);
    }).bind(this);
 //remove class
 var removeClass =(function(classname){
 	if(this.element.classList.contains(classname)){
 		this.element.classList.remove(classname);
 	}
 	
 }).bind(this);

 var addSticky=(function()
 {
 	if(!this.stickyclasses)this.stickyclasses=createArray();
 	if(!this.unstickyclasses)this.unstickyclasses=createArray();
 	this.stickyclasses.forEach(function(classname){ 					
 		addClass(classname); 		
 	});         	//add the unstick class now
 	this.unstickyclasses.forEach(function(classname){
 		removeClass(classname);
 	});

 })


 var removeSticky=(function()
 {
 	if(!this.unstickyclasses)this.unstickyclasses=createArray();
 	if(!this.stickyclasses)this.stickyclasses=createArray();
 	this.unstickyclasses.forEach(function(classname){
 		addClass(classname);

 	}) 			
 	this.stickyclasses.forEach(function(classname){
 		removeClass(classname);
 	});
 })
 var onUpdate =(function()
 {
 	yScroll = window.scrollY || window.pageYOffset ;
 	var rect = this.element.getBoundingClientRect();
 	this.scrollAmount = ( yScroll - this.initTop)

 	if(yScroll >= 0){  	  	
 		if(rect.top <=0){
 			this.element.style.position="fixed";
 			this.element.style.zIndex="1";
 			this.sticked=true; 
 			addSticky();
 		}
 	}
    //check if finished scrolling
    if(this.scrollAmount <= 0  && this.sticked==true){     
    	this.element.style.position="";
    	this.element.style.zIndex="";
    	this.sticked=false;       
    	removeSticky();
    }

});
 var createArray=(function()
 {
 	var array = [];
 	array.contains=(function(element)
 	{
 		for(var i=0; i < this.length; i++)
 		{
 			if(this[i]==element)return true;
 		}
 		return false;

 	}).bind(array);

 	array.remove=(function(classname)
 	{
 		for(var i=0; i< this.length ; i++){
 			if(this[i]==classname){
 				return this.slice(i,1);
 			}
 		}
 	}).bind(array);


 	return array;

 }).bind(this);

 var attachEvent=(function(element, eventtype, callback, aflag){

 	if(element instanceof HTMLElement || element instanceof Window){
 		element.addEventListener = element.addEventListener || element.attachEvent;
 		if(element.addEventListener){
 			if(typeof eventtype=="string")
 				element.addEventListener(eventtype,callback,aflag);

 		}
 	}
 }).bind(this);


 var onScrollEvent=(function()
 {


    //update the information on the window when the window is ready to draw
    window.requestAnimationFrame (onUpdate.bind(this));
}).bind(this);
//Initialised function that will added events listener to the window 
var onInit =(function()
{
	if(window){	
		attachEvent(window,"scroll",onScrollEvent.bind(this),true);
		attachEvent(window,"resize",onScrollEvent.bind(this),true);
	}	
}).bind(this)();
this.fn= {
		 	//The function get the first element of the selection
		 	first:(function()
		 	{
		 		if(this.isList) return this.elements[0];
		 		return null;
		 	}).bind(this),
		 	/*
             Interface to provided addition information when the onStickEvent is called

             */
             sticky:(function(){
             	return {
             		addClass:(function(classname){
             			if(!this.stickyclasses) 
             				this.stickyclasses= createArray();
             			if(!this.stickyclasses.contains(classname))
             				this.stickyclasses.push(classname);
             			return this.fn;
             		}).bind(this),

             		removeClass:(function(classname)
             		{
             			if(!this.stickyclasses) 
             				this.stickyclasses= createArray();
             			if(this.stickyclasses.contains(classname)){
             				this.stickyclasses.remove(classname);
             			}
             			return this.fn;
             		}).bind(this)
             	}
             }).bind(this)()

         }

         return this.fn;

     });



