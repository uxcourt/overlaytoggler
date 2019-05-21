var debug;
debug=false;

export default function(){
var sketch = require('sketch');
var document = sketch.getSelectedDocument();
const hiddenLayerStyleValue='invisible';
const shownLayerStyleValue='overlay';
const hiddenTextStyleValue='o.className hidden';
const shownTextStyleValue='o.className shown';
const overrideLayerName='o.overlay';
const overrideTextName='o.className';
for (var a=0;a<document.selectedPage.layers.length;a++){
  findTheSymbols(document.selectedPage.layers[a].layers);
}

function findTheSymbols(layers){
  for(var i=0;i<layers.length;i++){
    if(layers[i].type=='SymbolInstance'){
      logger('found a symbol named ' + layers[i].name);
      logger('it has ' + layers[i].overrides.length +' overrides');
      for(var j=0;j<layers[i].overrides.length;j++){
        logger('the affected layer for override '+ j + ' is ' + layers[i].overrides[j].affectedLayer.name)
        logger('before testing if the layername is o.overlay or o.classname, the value for the override is: ');
        logger(layers[i].overrides[j].value);
        //LOOK AT THE SYMBOLS WITH O.OVERLAY LAYERS
        if(layers[i].overrides[j].affectedLayer.name==overrideLayerName){
          trackSymbols(layers[i],'layerStyle', layers[i].overrides[j]);
        }//close o.overlay if
        //LOOK AT THE SYMBOLS WITH O.CLASSNAME LAYERS
        if(layers[i].overrides[j].affectedLayer.name==overrideTextName){
          //IF YOU FIND A HIDDEN TEXT CLASS, log it
          trackSymbols(layers[i], 'textStyle', layers[i].overrides[j]);
        }//o.className if
        }//j loop
      }//endif symbol instance 
  }//i loop
}//findTheSymbols

//would this be faster? var layers = sharedStyle.getAllInstancesLayers()

function trackSymbols(symbol, t, oRide){
  //FIND THE MASTER OF THE CURRENT SYMBOL
  var sMaster=symbol.master;
  logger('================================================================================')
  logger('in trackSymbols function, the master for the passed-in symbol is:')
  logger(sMaster);
  //GET THE MASTER'S LIBRARY
  var originLibrary=sMaster.getLibrary();
  logger('originLibrary: ');
  logger(originLibrary);
  logger('symbol.id: '+ symbol.id);
  logger('oRide.affectedLayer.sharedStyleId:');
  logger(oRide.affectedLayer.sharedStyleId);
  logger('oRide.value:');
  logger(oRide.value);
  if(t=='layerStyle'){
    logger('58: applying oRide.value to appliedLStyle')
    var appliedLStyle=oRide.value;
    logger(appliedLStyle);
    logger(document.getSharedLayerStyleWithID(appliedLStyle).name);
  } 
  if(t=='textStyle'){
    logger('64: applying oRide.value to appliedTStyle')
    var appliedTStyle=oRide.value;
  }
  if(oRide.property=='stringValue'){
    //go to the next oride; we don't work on text overrides
    return;
  }
  //since subsequent processing relies on these, ensure at least one of them is defined
  if((appliedTStyle==undefined) && (appliedLStyle==undefined)){
    logger('73: you found an override with no shared style!');
    logger('t='+t);
    logger('this is the symbol');
    logger(symbol);
    logger('and this is the override');
    logger(oRide);
    logger('and this is the affected layer');
    logger(oRide.affectedLayer);
    logger('and this is the affected layer sharedStyleId');
    logger(oRide.affectedLayer.sharedStyleId);
    logger('and this is the oRide.property');
    logger(oRide.property);
    return; //exit the function; can't do anything without applied_style
  }//close the if undefined block

  if(t=='layerStyle'){
    logger('89: the shared layer style associated with the current value of the current override is:')
    logger(appliedLStyle);
    logger(document.getSharedLayerStyleWithID(appliedLStyle).name);
    //CREATE STORAGE FOR HIDDEN AND SHOWN VARIANTS OF THE STYLE
    var hiddenLayerStyle;
    var shownLayerStyle;
    //STORE THE STYLE DEFINITIONS FROM THE SYMBOL'S MASTER LIBRARY
    var layerStylesReferences=originLibrary.getImportableLayerStyleReferencesForDocument(document);
    logger('the shared layer styles associated with the master of the current symbol are: ');
    //LOOP THROUGH ALL THE SHARED STYLES FOR THIS SYMBOL IN THE MASTER LIBRARY
    layerStylesReferences.forEach(function(ls){
      ls.import();//this might be redundant;  
      var sharedLStyle = document.getSharedLayerStyleWithID(ls.id);
      //SINCE ls.id FAILED AT TIMES, DIRECTLY ASSIGNING THE STYLE WORKS. Can we bypass the above line?
      if(sharedLStyle==undefined){sharedLStyle = ls};
      logger(sharedLStyle);
      if (sharedLStyle.name==shownLayerStyleValue){
        //TRAP THE SHARED STYLE FOR OVERLAY
        shownLayerStyle=sharedLStyle;
      }
      if (sharedLStyle.name==hiddenLayerStyleValue){
        //TRAP THE SHARED STYLE FOR INVISIBLE
        hiddenLayerStyle=sharedLStyle;
      }
    });//close for each layerstylereference
    //LOOK AT THE APPLIED STYLE ON THE SYMBOL YOU'RE WORKING WITH
    if(document.getSharedLayerStyleWithID(appliedLStyle).name==hiddenLayerStyleValue){
      //FLIP INVISIBLE TO OVERLAY
      logger('117: this is oRide if appliedLStyle.name==invisible');
      logger(oRide);
      logger('this is shownLayerStyle if appliedLStyle.name==invisible');
      logger(shownLayerStyle);
      symbol.setOverrideValue(oRide, shownLayerStyle.id);
      logger('after applying the shownLayerStyle on an invisible layer:');
      logger(document.getSharedLayerStyleWithID(oRide.affectedLayer.sharedStyleId));
    }
    else{
      logger('126: t=layerStyle and document.getSharedLayerStyleWithID(appliedLStyle).name !=invisible');
      logger(document.getSharedLayerStyleWithID(appliedLStyle).name);//this is still undefined some times
      logger('this is the symbol')
      logger(symbol);
      logger('this is oRide if appliedLStyle.name!=invisible')
      logger(oRide);
      if(document.getSharedLayerStyleWithID(appliedLStyle).name==shownLayerStyleValue){
        //FLIP OVERLAY TO INVISIBLE
        logger('this is shownLayerStyle if appliedLStyle.name==overlay');
        logger(shownLayerStyle);
        symbol.setOverrideValue(oRide, hiddenLayerStyle.id);
        logger('after applying the shownLayerStyle on an overlay layer:');
        logger(document.getSharedLayerStyleWithID(oRide.affectedLayer.sharedStyleId));
        };//close if applied style is shown layer style
      }//close else
    }//close if t==layerStyle
    //this is almost exactly the same code as for layer styles; potential refactoring candidate here; just get one version to work first!
    if(t=='textStyle'){
      //CREATE STORAGE FOR HIDDEN AND SHOWN VARIANTS OF THE STYLE
      var hiddenTextStyle;
      var shownTextStyle;
      //STORE THE STYLE DEFINITIONS FROM THE SYMBOL'S MASTER LIBRARY
      var textStylesReferences=originLibrary.getImportableTextStyleReferencesForDocument(document);
      logger('152: the shared text styles associated with the master of the current symbol are: '); 
      //LOOP THROUGH ALL THE SHARED STYLES FOR THIS SYMBOL IN THE MASTER LIBRARY
      textStylesReferences.forEach(function(ts){
        ts.import(); 
        var sharedTStyle = document.getSharedTextStyleWithID(ts.id);
        logger(sharedTStyle);
        //SINCE ls.id FAILED AT TIMES, DIRECTLY ASSIGNING THE STYLE WORKS. Can we bypass the above line?
        if(sharedTStyle==undefined){sharedTStyle = ls};
        logger(sharedTStyle);
        if (sharedTStyle.name==shownTextStyleValue){
          //TRAP THE SHARED STYLE FOR OVERLAY
          shownTextStyle=sharedTStyle;
        }
        if (sharedTStyle.name==hiddenTextStyleValue){
          //TRAP THE SHARED STYLE FOR INVISIBLE
          hiddenTextStyle=sharedTStyle;
        }
      });//close for each textstylereference

      if(document.getSharedTextStyleWithID(appliedTStyle).name==hiddenTextStyleValue){
        symbol.setOverrideValue(oRide, shownTextStyle.id);
      };
      if(document.getSharedTextStyleWithID(appliedTStyle).name==shownTextStyleValue){
        symbol.setOverrideValue(oRide, hiddenTextStyle.id);
      };
    }//close if t==textStyle
  }//close trackSymbols function

} close export

function logger(stuff){
  if (debug==true){
    console.log(stuff);
  }
}//close the logger function
