// function to get random number array
function getRandomArray(arrLength, min, max){
	var randArr = new Array();
	for (var i=0; i < arrLength; i++) {
		randArr.push(getRandomValue(min, max));
	}
	return randArr;
}

function getRandomValue(min, max){
	var randValue = Math.floor((Math.random() * (max - min)) + min);
	return randValue;
}
