

var Sticky =(function(elementid)
{
    var element = document.getElementById(elementid);    
    if(!element){
    	throw new Error("Unable to get sticker element by the id["+elementid+"]");
    }
    var hScroll = 0; 
    var vScroll = 0; 
    var oRect  =  element.getBoundingClientRect();    
    var classnames = null;
    var parent = null;
    var oTop=0;
    var isSticked =false;
 //Create a custom array with contains and remove method   
   var createCustomArray =(function(){
		var array = new Array();		
		array.contains =(function(classname){            
             if(typeof classname !="string") return true;
             for(var i=0; i < this.length ; i++){
                 var temp=  this[i];
                 if(temp == classname) return true;
             }
             return false;
		}).bind(array);		
		//Remove element from the array object
        array.remove =(function(classname){
        	if(typeof classname !="string")return false;
          for(var i=0; i < this.length; i++){
             if(this[i]==classname){
             	return this.slice(i,1);
             }
          }return false;
        }).bind(array)
     return array;
   });

/*Module private member function to add class the current selected element*/
    var  addClass = (function(classname){
      if(typeof classname === "string" && classname!==""){
         if(!element.classList.contains(classname))
         	element.classList.add(classname);
      }

    });

 /*Module private member function remove class from the selected element if exists*/
  var removeClass= (function(classname){
        if(typeof classname=="string" && classname !=null){
        	if(element.classList.contains(classname)){
        		element.classList.remove(classname);
        	}
        }
  });
  
/*Function memeber manage all the sticker classes to added to the class when stick callback is detected*/
var stickElementClasses=(function(){
      if(classnames){
      	  classnames.forEach((function(classname){
               addClass(classname);
      	  }));
      }

  });
var unStickElementClasses=(function(){
    if(classnames){
    	classnames.forEach((function(classname){
           removeClass(classname);
    	}));
    }

});

var addParentListener=(function(eventtype){

     var isString =(typeof eventtype  =="string");
	if( isString  && parent !=null){
		 if(parent.addEventListener)
		 	 parent.addEventListener(eventtype, onStickEvent, true);
		 else if(parent.attachEvent)
		 	parent.attachEvent("on"+eventtype, onStickEvent, true);		
	}

})

var onStickEvent =(function(){  
  window.requestAnimationFrame(onUpdate);
  console.log("Loog")
});

var keepWidth=(function(abool){	
   var elemParent = element.parentNode;
   var pRect = (elemParent)?elemParent.getBoundingClientRect():null;
   if(pRect){ 
   	   var pWidth = (oRect.width * 100)/ pRect.width;
   	   element.style.width=pWidth +"%";
   	   
   }
});

//update the current visibility position of the new window

var onUpdate =(function(){
	getScroll();
 	var rect = element.getBoundingClientRect();
 	var scrollAmount = ( vScroll - oTop)

 	if(vScroll >= 0){  	  	
 		if(rect.top <=0 && isSticked==false){
 			element.style.position="fixed"; 			
 		    element.style.zIndex="1";
 			isSticked = true; 
 			stickElementClasses();
 			keepWidth(true); 			
 		}
 		
 	}
    //check if finished scrolling
    if(scrollAmount <= 0  && isSticked==true){     
    	element.style.position="";
    	element.style.zIndex="";
    	isSticked=false;       
    	unStickElementClasses();
    	keepWidth(false);
    }
});

var getScroll =(function(){
	if(parent instanceof Window){
             	vScroll =  parent.scrollY || parent.pageYOffset;
             	hScroll  = parent.scrollX || parent.pageXOffset;             	
             }else if(parent instanceof HTMLElement){
             	vScroll =  parent.scrollTop  || 0;
             	hScroll  = parent.scrollLeft || 0;
             }
})
//*Private Initializer function /
var onInit =(function(){
	classnames = createCustomArray();
})();
  /*
     The Expose part of the model

  **/
   var ModuleStarted =false;
   var InnerModule=({
           getElement:(function(){
            return element;
           }),
           start:(function(aparent){
             if(!aparent)parent = window;
              if(ModuleStarted==true)return ;           
            
              getScroll();
             if(parent){

                 addParentListener("scroll");
                 addParentListener("resize");
                 oTop   =  oRect.top + vScroll;
                 ModuleStarted = true;                 
                }

           }), 
           addCssClass:(function(classname){
           	if(classnames){
           		if(!classnames.contains(classname))
           		  	 classnames.push(classname);           		
           	}
            return InnerModule;
           }),         
           clear:(function(){
              unStickElement();
              delete element;
              delete oRect; 
              delete classnames; 
              ModuleStarted=false;   
              return  InnerModule;   
           })
       
    });

   return InnerModule;

});
