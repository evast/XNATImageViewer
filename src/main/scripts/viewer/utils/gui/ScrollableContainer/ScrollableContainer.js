/**
 * @author sunilk@mokacreativellc.com
 */

/**
 * Google closure indcludes
 */
goog.require('goog.ui.AnimatedZippy');

/**
 * utils indcludes
 */
goog.require('utils.dom');
goog.require('utils.gui.GenericSlider');




/**
 * utils.gui.ScrollableContainer allows the user to input
 * contents to create a scrollable div.  It's a compound object
 * that uses goog.ui.AnimatedZippy (for condensing contents and 
 * creating folders) and utils.gui.genericSlider for scrolling
 * through the contents.
 *
 * @param {Object=}
 * @constructor
 */
goog.provide('utils.gui.ScrollableContainer');
utils.gui.ScrollableContainer = function (opt_args) {
    var that = this;    
    var parent = opt_args && opt_args['parent'] ? opt_args['parent'] : document.body;
    
   

    //------------------
    // Initialize the elements.
    //------------------
    this._element = utils.dom.makeElement("div", parent, "ScrollableContainer");
    this.scrollArea_ = utils.dom.makeElement("div", this._element, "ScrollArea");
    this._Slider = new utils.gui.GenericSlider({ 'parent': this._element, 'orientation' : 'vertical'});


    
    //------------------
    // Set Slider UI and callbacks
    //------------------
    this._Slider.addSlideCallback(that.mapSliderToContents, that);  
    this._Slider.bindToMouseWheel(that._element);

    

    //------------------
    // Set style - the container.
    //------------------
    goog.dom.classes.set(this._element, utils.gui.ScrollableContainer.ELEMENT_CLASS);
    goog.dom.classes.set(this.scrollArea_, utils.gui.ScrollableContainer.SCROLL_AREA_CLASS);



    //------------------
    // Set style - Slider
    //------------------
    this._Slider.addClassToThumb(utils.gui.ScrollableContainer.SLIDER_THUMB_CLASS);
    this._Slider.addClassToWidget(utils.gui.ScrollableContainer.SLIDER_ELEMENT_CLASS);
    this._Slider.addClassToTrack(utils.gui.ScrollableContainer.SLIDER_TRACK_CLASS);
    this._Slider.setHoverClass(utils.gui.ScrollableContainer.SLIDER_THUMB_HOVERED_CLASS);



    //------------------
    // reset scrollables
    //------------------
    this.scrollables_ = {};



    //------------------
    // Update style
    //------------------
    this.updateStyle();

}
goog.exportSymbol('utils.gui.ScrollableContainer', utils.gui.ScrollableContainer)




utils.gui.ScrollableContainer.CSS_CLASS_PREFIX = /**@type {string} @const*/ goog.getCssName('utils-gui-scrollablecontainer');
utils.gui.ScrollableContainer.ELEMENT_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, '');
utils.gui.ScrollableContainer.SCROLL_AREA_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'scrollarea');
utils.gui.ScrollableContainer.SLIDER_ELEMENT_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'slider-widget');
utils.gui.ScrollableContainer.SLIDER_THUMB_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'slider-thumb');
utils.gui.ScrollableContainer.SLIDER_THUMB_HOVERED_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'slider-thumb-hovered');
utils.gui.ScrollableContainer.SLIDER_TRACK_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'slider-track');
utils.gui.ScrollableContainer.ZIPPY_HEADER_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyheader');
utils.gui.ScrollableContainer.ZIPPY_HEADER_SUB_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyheader-sub');
utils.gui.ScrollableContainer.ZIPPY_HEADER_LABEL_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyheaderlabel');
utils.gui.ScrollableContainer.ZIPPY_HEADER_LABEL_SUB_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyheaderlabel-sub');
utils.gui.ScrollableContainer.ZIPPY_ICON_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyexpandicon');
utils.gui.ScrollableContainer.ZIPPY_ICON_SUB_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyexpandicon-sub');
utils.gui.ScrollableContainer.ZIPPY_CONTENT_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippycontent');
utils.gui.ScrollableContainer.ZIPPY_CONTENT_SUB_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippycontent-sub');
utils.gui.ScrollableContainer.ZIPPY_HEADER_MOUSEOVER_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyheader-mouseover');
utils.gui.ScrollableContainer.ZIPPY_ICON_MOUSEOVER_CLASS = /**@type {string} @const*/ goog.getCssName(utils.gui.ScrollableContainer.CSS_CLASS_PREFIX, 'zippyexpandicon-mouseover');




/**
 * @type {?Element}
 */	    
utils.gui.ScrollableContainer.prototype._element = null;




/**
 * @type {?Element}
 */	
utils.gui.ScrollableContainer.prototype.scrollArea_ = null;




/**
 * @type {?utils.gui.GenericSlider}
 * @expose
 */
utils.gui.ScrollableContainer.prototype._Slider = null;




/**
 * @type {Object}
 * @private
 */	
utils.gui.ScrollableContainer.prototype.scrollables_ = {};




/**
 * Refits the sliders track range to suit the height
 * of all of the contents, which is 'scrollArea_'.
 *
 * @type {function(utils.gui.GenericSlider, utils.gui.ScrollableContainer)}
 */
utils.gui.ScrollableContainer.prototype.mapSliderToContents = function (Slider, that) {
    that = that ? that : this;
    Slider = Slider ? Slider: this._Slider;



    //------------------
    // Get the widget height
    //------------------
    var widgetHeight = utils.style.dims(that._element, 'height');



    //------------------
    // Get the scroll area height
    //------------------
    var scrollAreaHeight = utils.convert.toInt(utils.style.getComputedStyle(that.scrollArea_, 'height'));



    //------------------
    // Get the Slider range (a function of the height of widget);
    //------------------
    var beforeRange = [Slider.getMinimum(), Slider.getMaximum()];



    //------------------
    // Get the new Slider range
    //------------------
    var afterRange = [0, scrollAreaHeight - widgetHeight];



    //------------------
    // Get the slider thumnail for resizing
    //------------------
    var sliderThumb = Slider.getThumb();



    //------------------
    // If there's the scrollArea (contents) is greater
    // than the height of the container element, then we 
    // enable the slider and reposition the contents so it
    // can be slideable...
    //------------------
    if (widgetHeight < scrollAreaHeight) {

	//
	// The slider thumbnail's height is a function of
	// how much scroll area is hidden.  Want to make sure the height
	// is proportional to the contents.
	//
	utils.style.setStyle(sliderThumb, {
	    'opacity': 1,
	    'height': widgetHeight * (widgetHeight / scrollAreaHeight)
	});
	

	//
	// Enable the slider
	//
	Slider.setEnabled(true);
	

	//
	// Move the scroll area to the top (as the slider's thumbnail
	// is at the top).
	//
	var sendVal = Math.abs(Slider.getValue() - 100);
	var remap = utils.convert.remap1D(sendVal, beforeRange, afterRange);
	var t = remap.newVal;
	utils.style.setStyle( that.scrollArea_, {'top': -t});	



    //------------------
    // Otherwise we hide and disable the slider.
    //------------------	
    }
    else {
	utils.style.setStyle(sliderThumb, { 'opacity': 0});
	Slider.setEnabled(false);
	Slider.setValue(100);
    }	
}




/**
 * @return {Element}
 */
utils.gui.ScrollableContainer.prototype.getScrollArea = function () {
    return this.scrollArea_;
}



/**
 * Generic updateStyle method. 
 *
 * @param {Object=}
 */
utils.gui.ScrollableContainer.prototype.updateStyle = function (opt_args) {
    if (opt_args) { utils.style.setStyle(this._element, opt_args) }
}




/**
 * Expand the zippy folder within the contents.
 *
 * @param {!string}
 * @expose
 */
utils.gui.ScrollableContainer.prototype.expandZippy = function(zKey) {
    this.scrollables_[zKey]['zippy'].setExpanded(true);
}




/**
 * Expands all zippy folders within the contents.
 *
 * @param {boolean=}
 * @expose
 */
utils.gui.ScrollableContainer.prototype.expandZippys = function(expand) {
    for (zKey in this.scrollables_){
	this.scrollables_[zKey]['zippy'].setExpanded((expand === false) ? false : true);
    }
}




/**
 * Returns the scrollables, which are the categorized contents
 * of a given slider. 
 *
 * @type {function(!number, !number)}
 */
utils.gui.ScrollableContainer.prototype.getScrollables = function(a, b) {	
    return this.scrollables_[a][b];	
}




/**
 * Allows user to programitcally scroll to a position within
 * the scrollableContainer.
 *
 * @param {!number|!string}
 */
utils.gui.ScrollableContainer.prototype.scrollTo = function(val) {

    if (typeof val === 'string'){
	val = val.toLowerCase();
	if (val === 'top') {this._Slider.setValue(this._Slider.getMaximum());}
	else if (val === 'bottom') {this._Slider.setValue(this._Slider.getMinimum());}
    } else {
	this._Slider.setValue(val);
    }
}




/**
 * Checks if a given zippy exists within the contents.
 *
 * @param {!string}
 * @return {boolean}
 */
utils.gui.ScrollableContainer.prototype.zippyExists = function(zKey) {
   return zKey in this.scrollables_;
}




/**
 * Adds a zippy to the contents of the main element.
 *
 * @param {!string, Element=}
 * @return {goog.ui.AnimatedZippy}
 */
utils.gui.ScrollableContainer.prototype.addZippy = function(zKey, opt_parent) {
    var that = this;
    var header, headerLabel, expandIcon, content, zippy;		



    //------------------
    // Set the parent to the scroll area or to the optional parent.
    //------------------
    opt_parent = opt_parent ? opt_parent : this.scrollArea_



    //------------------
    // Zippy header
    //------------------
    var counter = 0;
    for (var key in this.scrollables_) { counter++; }



    //------------------
    // Return if zippy exists
    //------------------
    if (this.scrollables_[zKey] !== undefined) { return;}



    //------------------
    // Otherwise initialize the scrollables key in the 
    // scrollables object.
    //------------------
    else { this.scrollables_[zKey] = {}}



    //------------------
    // Zippy header margins need to be differentiated between the top one and others.
    // because the top one needs to be at the top of the contents and others need
    // to have a margin.
    //------------------
    header = utils.dom.makeElement("div", opt_parent, "ZippyHeader_" + zKey);
    if (!counter) header.style.marginTop = '0px'; 
    header.key = zKey;
    this.scrollables_[zKey]['header'] = header;



    //------------------
    // Set the zippy label.
    //------------------
    headerLabel = utils.dom.makeElement("div", header, "ZippyHeaderLabel_" + zKey);
    headerLabel.innerHTML = zKey;
    this.scrollables_[zKey]['headerLabel'] = headerLabel;
    


    //------------------
    // Shorten the innerHTML if too long.
    //------------------
    var maxLabelLength = 30;
    if (headerLabel.innerHTML.length > maxLabelLength){
	headerLabel.innerHTML = headerLabel.innerHTML.substring(0, maxLabelLength - 3) + '...';
    }

    

    //------------------
    // Add the Zippy expand icon
    //------------------
    expandIcon = utils.dom.makeElement("div", header, "ZippyExpandIcon_" + zKey);
    expandIcon.innerHTML = "+";
    this.scrollables_[zKey]['expandIcon'] = expandIcon;
    


    //------------------
    // Add Zippy content
    //------------------
    content = utils.dom.makeElement("div", opt_parent, "ZippyContent_" + zKey);
    this.scrollables_[zKey]['content'] = content;

    
    
    //------------------
    // Create goog.ui.AnimatedZippy
    //------------------
    zippy = new goog.ui.AnimatedZippy(header, content, true);
    this.scrollables_[zKey]['zippy'] = zippy;


    
    //------------------
    // Set Expand content event.
    //------------------
    var EVENTS = goog.object.getValues(goog.ui.Zippy.Events);
    goog.events.listen(zippy, EVENTS, function(e) { 		
	
	//
	// Create a map that allows the slider to move
	// the contents in proportion to the slider.
	//
	that.mapSliderToContents(that._Slider, that);		
	

	//
	// Change expand icon to '+' or '-'
	//
	if (e.target.isExpanded()) {
	    expandIcon.innerHTML =  "-";
	    utils.style.setStyle(expandIcon, { 'margin-left': '-1em' })
	} else {
	    expandIcon.innerHTML =  "+";
	    utils.style.setStyle(expandIcon, { 'margin-left': '-1.1em' })				
	}
    });
    
    
    
    //------------------
    // Define Hover function (style change)
    //------------------
    function applyHover(cssObj, e) {
	(e.target == e.currentTarget) ? utils.style.setStyle(e.target, cssObj) : utils.style.setStyle(goog.dom.getAncestorByClass(e.target, utils.gui.ScrollableContainer.ZIPPY_HEADER_CLASS), cssObj)	
	utils.style.setStyle(expandIcon, cssObj['iconColor']);  
    }


    
    //------------------
    // Apply general CSS
    //------------------
    goog.dom.classes.add(header, utils.gui.ScrollableContainer.ZIPPY_HEADER_CLASS);
    goog.dom.classes.add(headerLabel, utils.gui.ScrollableContainer.ZIPPY_HEADER_LABEL_CLASS);
    goog.dom.classes.add(expandIcon, utils.gui.ScrollableContainer.ZIPPY_ICON_CLASS);
    goog.dom.classes.add(content, utils.gui.ScrollableContainer.ZIPPY_CONTENT_CLASS);



    //------------------
    // Apply Zippy indentation in container div (CSS)
    //------------------
    var depthCount = 0;
    var parentNode = header.parentNode;
    while (parentNode) {
	if (parentNode.className && parentNode.className.indexOf(utils.gui.ScrollableContainer.ZIPPY_CONTENT_CLASS) > -1){ depthCount++;}
	parentNode = parentNode.parentNode;
    }
    if (depthCount > 0){
	goog.dom.classes.add(header, utils.gui.ScrollableContainer.ZIPPY_HEADER_SUB_CLASS);
	goog.dom.classes.add(headerLabel, utils.gui.ScrollableContainer.ZIPPY_HEADER_LABEL_SUB_CLASS);
	goog.dom.classes.add(expandIcon, utils.gui.ScrollableContainer.ZIPPY_ICON_SUB_CLASS);
	goog.dom.classes.add(content, utils.gui.ScrollableContainer.ZIPPY_CONTENT_SUB_CLASS);
    }



    //------------------
    // Define Mouseover, Mouseout functions.
    //------------------
    goog.events.listen(header, goog.events.EventType.MOUSEOVER, function(){
	goog.dom.classes.add(header, utils.gui.ScrollableContainer.ZIPPY_HEADER_MOUSEOVER_CLASS);
	goog.dom.classes.add(expandIcon, utils.gui.ScrollableContainer.ZIPPY_ICON_MOUSEOVER_CLASS);
    });
    goog.events.listen(header, goog.events.EventType.MOUSEOUT, function(){
	goog.dom.classes.remove(header, utils.gui.ScrollableContainer.ZIPPY_HEADER_MOUSEOVER_CLASS);
	goog.dom.classes.remove(expandIcon, utils.gui.ScrollableContainer.ZIPPY_ICON_MOUSEOVER_CLASS);
    });	   
    


    //------------------
    // Return the zippy.
    //------------------
    return zippy;
}









/**
 * Semi-recursive contents adder for programatically adding
 * contents to the container, where the contents have a hierarchy.
 * (i.e. there are main zippys, main contents, and sub-zippys and
 * sub-contents).
 *
 * For instance, say you want the contents to resemble this:
 *
 * MAIN_ZIPPY:
 *   |- (main contents)
 *   |- SUB_ZIPPY_1
 *      |- (sub contents 1)
 *   |- SUB_ZIPPY_2
 *      |- (sub contents 2)
 *
 * @param {!Element|!Objects|!Array, Element=, String=}
 */
utils.gui.ScrollableContainer.prototype.addContents = function (contents, opt_parent, opt_parentKey) {
    var that = this;
    var expanded = true;



    //------------------
    // Set the parent element to the 'scrollArea' (main contents div)
    // if none is provided.
    //------------------
    opt_parent =  opt_parent ? opt_parent : this.scrollArea_;



    //------------------
    // For 'contents' Elements...
    //------------------
    if (goog.dom.isElement(contents)) {


	//
	// Add element to the parent Element
	//
	goog.dom.appendChild(opt_parent, contents);


	//
	// When there's no zippy parent folder, we set the hieght
	// of the main _element to the scroll area.
	//
	if (utils.style.dims(that._element, 'height') === 0 && opt_parent === that.scrollArea_){
	    utils.style.setStyle(that._element, {'height': utils.style.dims(that.scrollArea_, 'height')});
	}


	//
	// Allows user to move the contents when sliding the slider.
	//
	that.mapSliderToContents(that._Slider, that);


	//
	// Do we expand the zippy?
	//
	//this.expandZippy(opt_parentKey);
    	


    //------------------
    // For 'contents'  arrays, call this function again, but
    // with each array element.
    //------------------
    } else if (goog.isArray(contents)){
	for (var i=0, len = contents.length; i < len; i++) {
	    that.addContents(contents[i], opt_parent, opt_parentKey);
	}
    	


    //------------------
    // For 'contents' objects, loop through objects and recurse
    // accordingly.
    //------------------
    } else if (goog.isObject(contents)){
	for (var key in contents) {
	    //
	    // NOTE: The below conditional is oncase you want to put 
	    // the contained object in the 
            // parent folder.  This is because
	    // each tree level has to be of the same type.
	    //
	    // Invalid: 
	    // contents[parent] = [Elts] <- creates errors
	    // contents[parent][subfolder] = [subElts]
	    //
	    // Valid: 
	    // contents[parent]['parentFolder'] = [Elts] <- puts elts in contents[parent]
	    // contents[parent][subfolder] = [subElts]
	    //
	    if (key === 'parentFolder'){
		this.addContents(contents[key], this.scrollables_[opt_parentKey]['content'], opt_parentKey);
	    }
	    else {
		//
		// Keep root folders expanded, but sub-folders closed.
		// expanded = (opt_parent === this.scrollArea_) ? true : false;
		//
		this.addZippy(key, opt_parent);
		this.addContents(contents[key], this.scrollables_[key]['content'], key);	
	    }
	}
    }
}