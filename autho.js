var Autho= (function(id, options)
{
    //default settings
    var INFO    =0;
    var WARNING =1;
    var ERROR   =2;
          //major elements
    var __modal =null;
    var __form  =null;
    var __container =null;
    var __header =null;
    var __typeMessage =null;
    var __onsubmit = null;
    var __settings={};
    var __element=null;
    var __formWidget=null;


    var __dialog={
    	"close":(function(){
    		__modal.style.display="none";
    	})
    }


    var addClass =(function(el,classname)
          	{
          		if(el instanceof HTMLElement){
          			if(!el.classList.contains(classname) && (typeof classname ==="string"))
          				el.classList.add(classname);
          		}
          		return el;
          	})
          //remove a css class from the element
          var removeClass =(function(el,classname)
          {
          	if(el instanceof HTMLElement){
          		if(el.classList.contains(classname) && (typeof classname ==="string"))
          			el.classList.remove(classname);
          	}
          	return el;
          })

          var getScreenSize =(function(){

          	var sWidth =  window.screen.availWidth ;
          	var sHeight = window.screen.availHeight ;
          	return {
          		"height":sHeight,
          		"width":sWidth
          	}
          })
          var createView =(function(options,aparent){
             options.text=(options.text)?options.text:"text";

          	var view = document.createElement("div");
          	addClass(view,"section");
          	addClass(view,"view");             
              //create view controls
              if(options.label){
              	var label = document.createElement("label");
              	label.innerHTML=options.label;
              	view.appendChild(label);
              }
              if(options.type!=='select' && options.type!=='area')
              {
              	var txtview = document.createElement("input");
              	if(options.placeHolder)
              		txtview.setAttribute("placeHolder",options.placeHolder);
              	txtview.setAttribute("type",options.type);
              	view.appendChild(txtview);
              }
              if(options.value){
              	txtview.setAttribute("value",options.value);
              }
              view.control= txtview;
              if(aparent) 
              	aparent.appendChild(view);
              return view;
          })

          var createSection=(function(addclass){
          	var section = document.createElement("div");
          	addClass(section, "section");
          	if(typeof addclass ==="string")
          		addClass(section, addclass);
          	return section;
          });

          var center=(function(psize){
          	var psize = getScreenSize();
          	var hHeight = psize.height * 0.4;
          	var wWidth = psize.width  * 0.5;
          	var h= __container.offsetHeight * 0.5;
          	var y=  (hHeight - h);

          	__container.style.top= y+"px";
          })

          var onResize =(function(wsize){
          	if(__modal)
          		__modal.style.height = wsize.height +"px";
          	__modal.style.width = wsize.width +"px";

          });


          /*Create UI of the given form object*/
          var createUI=(function()
          {
          	if(!__modal)
          		__modal = createSection("modal-view");
          	__modal.style.position="absolute";
          	console.log(__modal.style.position);
          	if(!document.body)
          		document.body = document.createElement("body");
          	document.body.appendChild(__modal);

              //Create a section container
              __container = createSection("container");
              __modal.appendChild(__container);
              //add content
              var content = createSection("content");
              __container.appendChild(content);
              //create header div
              __header=  createSection("header");
              content.appendChild(__header);
              //type message
              __typeMessage =document.createElement("span");
              addClass(__typeMessage, "message");
              content.appendChild(__typeMessage)
              var elmain = __element;
              var formEl=null;
              if(elmain instanceof HTMLFormElement)
              	formEl= elmain;
              else {
              	formEl = document.createElement("form");
              	elmain.appendChild(formEl);
              }
              content.appendChild(elmain);
              //creating controls-views
              addClass(formEl,"form");
              addClass(formEl,"vertical");
              //username view
              var viewUsername = createView({type:"text","placeHolder":"Enter username"}, formEl);
              var viewPassword = createView({type:"password","placeHolder":"Enter password"}, formEl);
              var viewBtnSubmit = createView({type:"submit","value":"Log In"}, formEl);
               //create form operator
              onResize(getScreenSize());

               return{
               	"title":(function(title){
               		__header.innerHTML= (typeof title==="string")?title:"Authentication";
               	}),
               	"message":(function(message,typename){
               		__typeMessage.innerHTML=(typeof message==="string")?message:"Member Only";
               		istype = (typeof typename==="string");
               		if(!istype)return;
               		__typeMessage.setAttribute("type", typename);
               	}),
               	"center":(function(){
               		var wSize = getScreenSize();
               		center(wSize);
               	}),
               	"onResize":(function(){
               		window.requestAnimationFrame((function(){
               			onResize(getScreenSize());
               			center();
               		}));
               	}),
               	"onSubmit":(function(callback){
               		if(typeof callback ==="function")
               		{
               			if(viewBtnSubmit.addEventListener){
               				viewBtnSubmit.addEventListener("click",(function(evt)
               					{
               					 evt.preventDefault();
               					 callback(__dialog,viewUsername.control.value,viewPassword.control.value);
               				    }));
               				formEl.addEventListener("submit",(function(evt){
               					evt.preventDefault();
               					callback(__dialog,viewUsername.control.value,viewPassword.control.value);
               				}));
               			}


               		}
                })

               }


         });

       var onInit=(function(options){
       	__settings.visible=true;
       	__settings.center=true;
       	__settings.messageType="info";
       	__settings.title="Authentication";
		__settings.message="";
		__settings.visible="";
         if(options){
         __settings = options;
         __settings.visible =(options.visible===false)?false:true;
         __settings.center =(options.center===false)?false:true;
         __settings.messageType =(typeof options.messageType==='string')?options.messageType:"info";
         __settings.title =(typeof options.title==="string")?options.title:"Authentication";
         __settings.message =(typeof options.message==="string")?options.message:"";
         __settings.visible =(options.visible===false)?false:true;
         }
         
         if(typeof id==='string'){
         	__element = document.getElementById(id);
         	if(!__element)
         		throw new Error("Autho div id not found "+id);
         }
       });


     __formWidget ={
	          	"form":(function(){
	          		onInit(options);
	          		__form = createUI.bind(__element)();
	          		__form.title(__settings.title);               
	          		__form.message(__settings.message,__settings.messageType);
	          		__form.center();
	          		window.addEventListener("resize",__form.onResize.bind(__form),true);
	          		window.addEventListener("scroll",__form.onResize.bind(__form),true);
	          		return __formWidget;
	          	}),
	          	"show":(function(){
                  if(__form){
                  	__modal.style.display="block";
                  }
                  return __formWidget;
	          	}),
	          	"submit":(function(callback)
	          	{
	          	if(__form)
                    __form.onSubmit(callback);
                  return __formWidget;
	          	})

           }

  return __formWidget;

});

