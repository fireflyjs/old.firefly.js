
module.exports = function(App, Jeex) {
	App.load('MooTools').apply(this);
	
	return new Class({
		Extends: Jeex.Component,
		name: 'Tester'
	});
	
};