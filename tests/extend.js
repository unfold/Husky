require('../husky.js');

var Animal = (function() {
	function Animal(color) {
		this.smell = 'zoo';
		this.color = color;
	}
	
	Animal.prototype.sniff = function() {
		console.log('It smells', this.smell);
	};
	
	return Animal;
})();

var Mammal = (function() {
	function Mammal(color, speed) {
		this.speed = speed;

		Mammal.parent.constructor.call(this, color);
	}
	
	Husky.extend(Mammal, Animal);
	
	Mammal.prototype.ride = function() {
		console.log('You ride', this.speed);
	};
	
	Mammal.prototype.mount = function() {
		console.log('You hop on');
	};
	
	return Mammal;
})();

var Horse = (function() {
	function Horse(color, speed, breed) {
		this.breed = breed || 'pony';
		
		Horse.parent.constructor.call(this, color, speed);
	}
	
	Husky.extend(Horse, Mammal);
	
	Horse.prototype.mount = function() {
		console.log('You saddle it up');

		Horse.parent.mount.call(this);
	};
	
	return Horse;
})();

var shark = new Animal('awesome');
shark.sniff();
console.log('The shark\'s color is', shark.color, '\n');

var possum = new Mammal('brownish', 'dead slow');
possum.smell = 'stale';
possum.sniff();
possum.mount();
possum.ride();
console.log('The sleepy possum is sort of', possum.color, '\n');

var blanchy = new Horse('ochre', 'like the wind');
blanchy.smell = 'stable';
blanchy.sniff();
blanchy.mount();
blanchy.ride();

console.log('The majestic horse is sort of', blanchy.color, '\n');

console.log(blanchy instanceof Horse);
console.log(blanchy instanceof Mammal);