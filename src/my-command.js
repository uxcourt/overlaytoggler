var debug;
debug=false;

export default function(){
logger('Starting symbol-overlay-toggler: '+Date.now());
var sketch = require('sketch');
var document = sketch.getSelectedDocument();
const overrideLayerName='o.overlay';
const fillStyle='#FF00FF20';
const borderStyle='#FF00FFFF';

var symCount=0;
//seek & destroy overlays
var layers = document.getLayersNamed(overrideLayerName)
logger('Detected '+layers.length+ ' overlay layers');
if (layers.length) {
  for(var L=0;L<layers.length;L++){layers[L].remove();}
}

else{//if there were 0 overlays
  //299 seconds
  //this gets symbol masters
  var symbolS=document.getSymbols();
  for (var b=0;b<symbolS.length;b++){
    //this gets instances of those symbols; only instances have parents and frames
    //and it takes a ridiculous amount of time
    var sM=symbolS[b].getAllInstances();
    for(var sMc=0;sMc<sM.length;sMc++){
      //limit the script to the current page just to save time
      //if a symbol has no parentpage, it is not placed on a non-symbol page: skip it
      if(sM[sMc].getParentPage()==undefined){return};
      if(sM[sMc].getParentPage().id==document.selectedPage.id){
        findTheSymbols(sM[sMc]);
      }
    }  
    logger('Layer #'+ b);
  }
}
sketch.UI.message('Toggle Symbol Overlays completed. ' + symCount + ' symbols evaluated.' );
logger('Ending symbol-overlay-toggler: '+ Date.now());

function findTheSymbols(layer){
	symCount=symCount+1;
  // //recurse if the current layer is a group
  // if(layer.layers && layer.layers.length){
  //   logger('====================A GROUP==============================');
  //   // logger('It has this layers.length: ' + layer.layers.length)
  //   //recursion
  //   layer.layers.forEach(function(item, x){console.log(item);findTheSymbols(item)});

  // }//endif layer.layers
  //test if the current layer is a symbol
  if(layer.type=='SymbolInstance'){
    logger('=====================NEW SYMBOL==========================');
    // logger('=========================================================')
    var sMaster=layer.master;
    var originLibrary=sMaster.getLibrary();
    if(originLibrary==undefined){return}//you're on a local symbol, so exit the function
    //you're not on a group, nor a local symbol, so proceed
    createOverlay(layer);
  }//endif symbol instance  
}//findTheSymbols


function createOverlay(layer){
  var Shape = require('sketch/dom').Shape;
  new Shape({
    name: 'o.overlay',
    parent:layer.parent,
    frame:layer.frame,
      style: {
          fills: [fillStyle],
          borders: [borderStyle],}
  })
  var Text = require('sketch/dom').Text
  var text = new Text({
    text: layer.name,
    name: 'o.overlay',
    alignment: Text.Alignment.center,
    parent:layer.parent,
    frame:layer.frame
  })
  //text.style.verticalAlignment='center';
  text.style.textColor=borderStyle;
  logger('Created overlays for '+layer);
}//close createOverlay function

} //close export

function logger(stuff){
  if (debug==true){
    console.log(stuff);
  }
}//close the logger function
