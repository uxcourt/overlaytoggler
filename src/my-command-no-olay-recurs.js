var debug;
debug=false;

export default function(){

var sketch = require('sketch');
var document = sketch.getSelectedDocument();
const overrideLayerName='o.overlay';
const fillStyle='#FF00FF20';
const borderStyle='#FF00FFFF';

var symCount=0;
//seek & destroy overlays
var layers = document.getLayersNamed('o.overlay')
if (layers.length) {
  for(var L=0;L<layers.length;L++){layers[L].remove();}
}
//if there were 0 overlays
else{
  for (var b=0;b<document.selectedPage.layers.length;b++){
    findTheSymbols(document.selectedPage.layers[b]);
  }
}
sketch.UI.message('Toggle Symbol Overlays completed. ' + symCount + ' symbols evaluated.' );

//psuedo code outline
//if the document already has o.overlay layers, delete them all and exit the function
//document.selectedPage.layers[0].layers[2].name)
//document.selectedPage.layers[0].layers[2].remove()
//if the document doesn't have any o.overlay layers, iterate through the layers and test if you're on a foreign symbol
//track the frame of the foreign symbol and create an o.overlay layer at the top of the z order with the same frame
//color the o.overlay according to opacity and color constants
//create a text layer named o.overlay, populated with the name of the symbol
//position the text layer at the upper left corner of the symbol frame
//exit the function after looking at all symbols
function findTheSymbols(layer){
	symCount=symCount+1;
  //recurse if the current layer is a group
  if(layer.layers && layer.layers.length){
    // logger('====================A GROUP=============================='');
    // logger('It has this layers.length: ' + layer.layers.length)
    //recursion
    layer.layers.forEach(function(item, x){console.log(item);findTheSymbols(item)});

  }//endif layer.layers
  //test if the current layer is a symbol
  if(layer.type=='SymbolInstance'){
    // logger('=====================NEW SYMBOL==========================');
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
}//close createOverlay function

} //close export

function logger(stuff){
  if (debug==true){
    console.log(stuff);
  }
}//close the logger function
