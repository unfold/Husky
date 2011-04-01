var hasProp = Object.prototype.hasOwnProperty;
var extend = function(child, parent) {
	for (var key in parent) {
		if (hasProp.call(parent, key)) {
			child[key] = parent[key];
		}
	}
	
	var boa = function() {
		this.constructor = child;
	};
  
	c.prototype = parent.prototype;
  
	child.prototype = new boa();
	child.parent = parent.prototype;

	return child;
};