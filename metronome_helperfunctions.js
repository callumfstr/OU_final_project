//------------------------------------------------------//
//------------------helperfunctions.js------------------//
//------------------------------------------------------//

//TEST FUNCTION
//TO BE USED FOR WHATEVER
function test()
{
	//console.log("Ich bin zurzeit arbeitslos!");
	console.log("Current number of beats = " + measureCurrentTotal);
	console.log("Current number of measures = " + (measureCurrentTotal / numerator));
}

//------------------NOTES, MODES, AND LENGTHS------------------//

//Commonly used variables for note control
var noteIndex;
var chosenScale;
var chosenDegree;
var chosenKey;
var chosenExtension;
var currentNote;
var currentInterval;

//MAP OF ALL NOTES

//An array holding the 12 chromatic notes for future reference
//Sharps could be transposed to flats where appropriate, but not really essential
const noteArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", ]

//An array containing the 12-tone chromatic scale
const noteMap = new Map();

//Build a map containing musical notes for use
//Beginning note is C2, final note is B6
//C4 is at index 24, A4 is at index 33
//THIS IS DESTRUCTIVE, RUNNING THE FUNCTION CLEARS THE OLD MAP
function buildNoteMap()
{
	var noteIndex = 0;
	var assignOctave = 0;
	for (let o = 0; o < 7; o++)
		{
			for (let i = 0; i < 12; i++)
				{
					noteMap.set(noteIndex, noteArray[i] + assignOctave);
					noteIndex++;
				}
			assignOctave++;
		}
}

//MODE
//Current stored mode
var currentMode;

//Array holding number of semitones to the next note in each mode
//Root == 0
//Semitone += 1
//Wholetone += 2
//All but 0 (Ionian/Major scale) and 5 (Aeolian/Minor scale) are blank for now
const modeArray = [[0, 2, 4, 5, 7, 9, 11, 12],[0, 2, 3, 5, 7, 9, 10, 12],[0, 1, 3, 5, 7, 8, 10, 12],[0, 2, 4, 6, 7, 9, 11, 12],[0, 2, 4, 5, 7, 9, 10, 12],[0, 2, 3, 5, 7, 8, 10, 12],[0, 1, 3, 5, 6, 8, 10, 12]];

//Array holding chord qualities for triads in each mode
//0 == Major
//1 == Minor
//2 == Diminished

const modeQualityArray = [[0,1,1,0,0,1,2]]

//-------------------EXTENSIONS-----------------------//

//Holds the names of each supported extension
//The name in each index corresponds to the intervals in the same index of extensionIntervals
const extensionNameArray = ["Triad", "7th", "9th"];

//Array holding chord extensions
//0 == Triad
//1 == 7th
//2 == 9th
const extensionIntervals = [[0, 2, 2], [0, 2, 2, 2], [0, 2, 2, 2, 2]];

//Dictionary assigning numerical values to note lengths as used by tone.js
const noteValues = 
{1:"1m",
2:"2n",
4:"4n",
8:"8n"};

var currentLength;

function getLength()
{
	currentLength = document.getElementById("length").value;
	return currentLength;
}


//PLAY ETC.

	function play()
	{
		chordLooper();
		insertRest();
	}


var playingFlag = 0;

//------------------MEASURE CONTROLLERS------------------//

//NUMERATOR

var numerator;

//Check what the user has entered for the time signature's numerator

function getNumerator()
{
	numerator = document.getElementById("numeratorinput").value;
}

function getNoteValue()
{
	chosenNoteLength = document.getElementById("notevalueinput").value;
}

function numeratorChangeUpdates()
{
	if(confirm("This will clear current inputs, continue?"))
	{
	
		let drumBoxes = document.getElementById("drum_machine").querySelectorAll("div");
		for (let i = 0; i < drumBoxes.length; i++)
			{
				for (let n = measureCurrentTotal; n > 0; n--)
				{
					let e = drumBoxes[i].lastElementChild;
					e.remove();
				
				}
			}
	
	
	let stepBoxes = document.getElementById("step_sequencer").querySelectorAll("div");
	for (let i = 0; i < stepBoxes.length; i++)
	{
		for (let n = measureCurrentTotal; n > 0; n--)
		{
			let e = stepBoxes[i].lastElementChild;
			e.remove();
		}
	}
	getNumerator();
	updateMeasureValue();
	measureCurrentTotal = 0;
	buildSteps();
	buildStepSequencer();
	buildDrumMachine();
	addMeasure();
	stopMelodyMaker();
	}
}

//Defining and updating measures

var measureValue;
var measureCurrentTotal = 0;
var measureRemaining;


function updateMeasureValue()
{
	getNumerator();
	getNoteValue()
	measureValue = chosenNoteLength * numerator;
	
}

function addMeasure()
{
	measureCurrentTotal = measureCurrentTotal + measureValue;
}

//Remove a measure as well as the inputs on the page
function removeMeasure()
{
	let drumBoxes = document.getElementById("drum_machine").querySelectorAll("div");
	for (let i = 0; i < drumBoxes.length; i++)
	{
		for (let n = measureCurrentTotal; n > (measureCurrentTotal - measureValue); n--)
		{
			let e = drumBoxes[i].lastElementChild;
			e.remove();
		}
	}
	
	let stepBoxes = document.getElementById("step_sequencer").querySelectorAll("div");
	for (let i = 0; i < stepBoxes.length; i++)
	{
		for (let n = measureCurrentTotal; n > (measureCurrentTotal - measureValue); n--)
		{
			let e = stepBoxes[i].lastElementChild;
			e.remove();
		}
	}
	measureCurrentTotal = measureCurrentTotal - measureValue;
}

//------------------STOP MELODY MAKER------------------//

//STOP
//This is a brute force "stop everything" button.
function stop()
{
	console.log("Hi");
	Tone.Transport.pause();
	Tone.Transport.cancel();
	Tone.Transport.clear();
	Tone.Transport.stop();
}

//Calls the stop() function, handles UI changes, resets the playing flag
function stopMelodyMaker()
{
	playingFlag = 0;
	stop();
	document.getElementById("melodymakerStartButton").innerHTML="Play!";
}