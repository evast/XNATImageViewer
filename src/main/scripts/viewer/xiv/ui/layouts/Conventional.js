/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.string');
goog.require('goog.array');

// moka
goog.require('moka.string');

// xiv
goog.require('xiv.ui.layouts.Layout');
goog.require('xiv.ui.layouts.XyzvLayout');



/**
 * xiv.ui.layouts.Conventional
 *
 * @constructor
 * @extends {xiv.ui.layouts.XyzvLayout}
 */
goog.provide('xiv.ui.layouts.Conventional');
xiv.ui.layouts.Conventional = function() { 
    goog.base(this); 
}
goog.inherits(xiv.ui.layouts.Conventional, xiv.ui.layouts.XyzvLayout);
goog.exportSymbol('xiv.ui.layouts.Conventional', xiv.ui.layouts.Conventional);



/**
 * @type {!string}
 * @public
 */
xiv.ui.layouts.Conventional.TITLE = 'Conventional';



/**
 * Event types.
 * @enum {string}
 * @public
 */
xiv.ui.layouts.Conventional.EventType = {
}



/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ui.layouts.Conventional.ID_PREFIX =  'xiv.ui.layouts.Conventional';



/**
 * @enum {string}
 * @public
 */
xiv.ui.layouts.Conventional.CSS_SUFFIX = {
    X: 'x',
    Y: 'y',
    Z: 'z',
    V: 'v',
    V_BOUNDARY: 'v-boundary'
}



/**
 * @type {!number} 
 * @const
 */
xiv.ui.layouts.Conventional.MAX_PLANE_RESIZE_PCT = .9;





/**
 * @type {!number} 
 * @private
 */
xiv.ui.layouts.Conventional.prototype.bottomPlaneWidth_ = 0;



/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.setupPlane_X = function(){
    goog.base(this, 'setupPlane_X');
    
    //
    // Set the plane resizable
    //
    this.setPlaneResizable('X', 'RIGHT');
    
    //
    // Listen for the RESIZE event.
    //
    goog.events.listen(this.Planes['X'].getResizable(), 
		       moka.ui.Resizable.EventType.RESIZE,
		       this.onPlaneResize_X.bind(this));
}



/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.setupPlane_Y = function(){
    goog.base(this, 'setupPlane_Y');

    //
    // Set the plane resizable
    //
    this.setPlaneResizable('Y', 'RIGHT');
    
    //
    // Listen for the RESIZE event.
    //
    goog.events.listen(this.Planes['Y'].getResizable(), 
		       moka.ui.Resizable.EventType.RESIZE,
		       this.onPlaneResize_Y.bind(this));
}



/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.setupPlane_Z = function(){
    goog.base(this, 'setupPlane_Z');

    // Do nothing for now
}



/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.setupPlane_V = function(){
    goog.base(this, 'setupPlane_V');

    //
    // Set the plane resizable
    //
    this.setPlaneResizable('V', 'BOTTOM');
    
    //
    // Listen for the RESIZE event.
    //
    goog.events.listen(this.Planes['V'].getResizable(), 
		       moka.ui.Resizable.EventType.RESIZE,
		       this.onPlaneResize_V.bind(this));
}



/**
 * @override
 * @param {!Event} e
 */
xiv.ui.layouts.Conventional.prototype.onPlaneResize_X = function(e){

    this.calcDims();

    var xSize = goog.style.getSize(this.Planes['X'].getElement());
    var ySize = goog.style.getSize(this.Planes['Y'].getElement());
    var zSize = goog.style.getSize(this.Planes['Z'].getElement());

    //
    // Determine delta by tallying all the sizes
    //
    var deltaX = xSize.width + ySize.width + zSize.width - this.currSize.width;

    //
    // Change both Y and Z planes at a linear rate
    //

    // Y Plane
    moka.style.setStyle(this.Planes['Y'].getElement(), {
	'width': Math.max(ySize.width - deltaX/2, 20), 
	'left': xSize.width, 
    });

    // Z Plane
    moka.style.setStyle(this.Planes['Z'].getElement(), {
	'width': Math.max(zSize.width - deltaX/2, 20), 
	'left': xSize.width + ySize.width, 
    });	
    
    this.updateStyle();
}



/**
 * @override
 * @param {!Event} e
 */
xiv.ui.layouts.Conventional.prototype.onPlaneResize_Y = function(e){

    this.calcDims();

    var xSize = goog.style.getSize(this.Planes['X'].getElement());
    var ySize = goog.style.getSize(this.Planes['Y'].getElement());
    var zSize = goog.style.getSize(this.Planes['Z'].getElement());

    //
    // Determine delta by tallying all the sizes
    //
    var deltaX = xSize.width + ySize.width + zSize.width - this.currSize.width;

    //
    // Change both Y and Z planes at a linear rate
    //

    // X Plane
    moka.style.setStyle(this.Planes['Y'].getElement(), {
	'width': Math.max(xSize.width - deltaX/2, 20), 
	'left': 0, 
    });

    // Z Plane
    moka.style.setStyle(this.Planes['Z'].getElement(), {
	'width': Math.max(zSize.width - deltaX/2, 20), 
	'left': xSize.width + ySize.width, 
    });	
    
    this.updateStyle();

}



/**
 * @override
 * @param {!Event} e
 */
xiv.ui.layouts.Conventional.prototype.onPlaneResize_V = function(e){
    this.calcDims();

    var xyzTop = parseInt(this.Planes['V'].getElement().style.height);
    var xyzHeight = this.currSize.height - xyzTop;

    goog.object.forEach(this.Planes, function(plane){
	//
	// Skip V
	//
	if (plane === this.Planes['V']) {return};

	//
	// Adjust others
	//
	moka.style.setStyle(plane.getElement(), {
	    'top': xyzTop,
	    'height': xyzHeight
	}) 
    }.bind(this))

    //
    // Update
    //
    this.updateStyle();
}




/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.updateStyle_X = function() {
    return;
    this.Planes['X'].getResizable().setMinHeight(this.resizeMargin);
    this.Planes['X'].getResizable().setMinWidth(this.resizeMargin);
    this.Planes['X'].getResizable().setBounds(
	0, this.resizeMargin, // topLeft X, topLeft Y
	this.currSize.width - this.resizeMargin*2, // botRight X
	this.currSize.height);// botRightY
    //this.Planes['X'].getResizable().showBoundaryElt();
}



/**
 * @inheritDoc
 */
xiv.ui.layouts.Conventional.prototype.updateStyle_Y = function() {
    return
    window.console.log(this.Planes);
    this.Planes['Y'].getResizable().setMinHeight(this.resizeMargin);
    this.Planes['Y'].getResizable().setMinWidth(this.resizeMargin);
    this.Planes['Y'].getResizable().setBounds(
	this.resizeMargin, this.resizeMargin, // topLeft X, topLeft Y
	this.currSize.width - this.resizeMargin, // botRight X
	this.currSize.height);// botRightY

    //this.Planes['Y'].getResizable().showBoundaryElt();
}



/**
* @private
*/
xiv.ui.layouts.Conventional.prototype.updateStyle_V = function() {


}




