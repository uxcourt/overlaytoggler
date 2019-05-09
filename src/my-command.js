var debug;
debug=true;

export default function(){
var sketch = require('sketch');
var document = sketch.getSelectedDocument();
var pages=document.pages;
var Artboard = pages[0].layers;
var layers=Artboard[0].layers; //here's your array of symbols+

var layerStylesArray=[];
var layerNamesToIds=[];
var hiddenOrideOverlay;
var shownOrideOverlay;
var shownOrideTextClass;
var hiddenOrideTextClass;


//FIND THE SHARED STYLES PRESENT IN THE CURRENT DOCUMENT 
document.sharedLayerStyles.forEach(function(sharedLayerStyle){
  layerStylesArray.push(`${sharedLayerStyle.name}: ${sharedLayerStyle.id}`);
});
document.sharedTextStyles.forEach(function(sharedLayerStyle){
  layerStylesArray.push(`${sharedLayerStyle.name}: ${sharedLayerStyle.id}`);
});
logger('raw array:' + layerStylesArray);

//PARSE THE SHARED STYLES INTO AN ARRAY OF JUST THE STYLES YOU NEED
for (var s=0;s<layerStylesArray.length;s++){
	logger('layerStylesArray['+s+'] is' + layerStylesArray[s]);
	logger(layerStylesArray[s].indexOf('invisible'));
  if (layerStylesArray[s].indexOf('invisible')==0){
    layerNamesToIds.push(layerStylesArray[s].split(': '));
    hiddenOrideOverlay=layerNamesToIds[s][1];
    logger('hiddenOrideOverlay =' + hiddenOrideOverlay);
  }
  if (layerStylesArray[s].indexOf('overlay')==0){
    layerNamesToIds.push(layerStylesArray[s].split(': '));
    shownOrideOverlay=layerNamesToIds[s][1];
    logger('shownOrideOverlay =' + shownOrideOverlay);
  } 
  if (layerStylesArray[s].indexOf('o.className shown')==0){
    layerNamesToIds.push(layerStylesArray[s].split(': '));
    shownOrideTextClass=layerNamesToIds[s][1];
    logger('shownOrideTextClass =' + shownOrideTextClass);
  } 
  if (layerStylesArray[s].indexOf('o.className hidden')==0){
    layerNamesToIds.push(layerStylesArray[s].split(': '));
    hiddenOrideTextClass=layerNamesToIds[s][1];
    logger('hiddenOrideTextClass =' + hiddenOrideTextClass);
  }    
}
logger('filtered array:' + layerNamesToIds);

//LOOP THROUGH ALL THE SYMBOLS AND TEST IF THEY HAVE SPECIFICALLY NAMED OVERRIDES
var i;
for(i=0;i<layers.length;i++){
  if(layers[i].type=='SymbolInstance'){
    logger('found a symbol named ' + layers[i].name);
    logger('it has ' + layers[i].overrides.length +' overrides')
    var j;
    for(j=0;j<layers[i].overrides.length;j++){
      logger('the affected layer for override '+ j + ' is ' + layers[i].overrides[j].affectedLayer.name)
      logger('before the if test, the value for the override is: ' + layers[i].overrides[j].value);
      //LOOK AT THE SYMBOLS WITH O.OVERLAY LAYERS
      if(layers[i].overrides[j].affectedLayer.name=='o.overlay'){
        logger(layers[i].overrides[j].value)
        //IF YOU FIND A HIDDEN OVERLAY, MAKE IT SHOWN
        if(layers[i].overrides[j].value==hiddenOrideOverlay){
          logger('found a hidden overlay style in ' + layers[i].name + ' and i=' + i + ', and override j=' + j);
          logger('VALUE before update: '+ layers[i].overrides[j].value);
          layers[i].setOverrideValue(layers[i].overrides[j], shownOrideOverlay);
          logger('after update: '+ layers[i].overrides[j].value);
         }
        else{
          //IF YOU FIND A SHOWN OVERLAY, MAKE IT HIDDEN
          if(layers[i].overrides[j].value==shownOrideOverlay){
            logger('found a shown overlay style in ' + layers[i].name + ', and i=' + i + ', and override j=' + j);
            logger('VALUE before update: '+ layers[i].overrides[j].value);
            layers[i].setOverrideValue(layers[i].overrides[j], hiddenOrideOverlay);
            logger('after update: '+ layers[i].overrides[j].value);
          }//close if shownOride
        }//close else
      }//close o.overlay loop
      //LOOK AT THE SYMBOLS WITH O.CLASSNAME LAYERS
      if(layers[i].overrides[j].affectedLayer.name=='o.className'){
      	//IF YOU FIND A HIDDEN TEXT CLASS, MAKE IT SHOWN
        if(layers[i].overrides[j].value==hiddenOrideTextClass){
          logger('found a hidden text style in ' + layers[i].name + ' and i=' + i + ', and override j=' + j);
          logger('VALUE before update: '+ layers[i].overrides[j].value);
          layers[i].setOverrideValue(layers[i].overrides[j], shownOrideTextClass);
          logger('after update: '+ layers[i].overrides[j].value);
         }
        else{
          //IF YOU FIND A SHOWN TEXT CLASS, MAKE IT HIDDEN
          if(layers[i].overrides[j].value==shownOrideTextClass){
            logger('found a shown text style in ' + layers[i].name + ', and i=' + i + ', and override j=' + j);
            logger('VALUE before update: '+ layers[i].overrides[j].value);
            layers[i].setOverrideValue(layers[i].overrides[j], hiddenOrideTextClass);
            logger('after update: '+ layers[i].overrides[j].value);
          }//close if shownOride
         }//close else

      }//o.className if
      }//j loop
    }//endif symbol instance 
}//i loop
}// close the default export function
function logger(stuff){
	if (debug==true){
		console.log(stuff);
	}
}//close the logger function