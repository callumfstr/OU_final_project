//------------------------------------------------------//
//------------------helperfunctions.js------------------//
//------------------------------------------------------//

//TEST FUNCTION
//TO BE USED FOR WHATEVER
function test()
{
	console.log(progressIndex);
	
var tableNameArray = ["drum_machine_table", "step_sequencer_table"];
	
	for (let x = 0; x < tableNameArray.length; x++)
	{
		
	var toChange = document.getElementById(tableNameArray[x]);
	
	for (let i = 1; i < toChange.rows.length; i++) //
	{
		
		for (let n = 1; n < parseInt(beatCurrentTotal + 1); n++)
		{
			let thisBoxCSSRoot = toChange.rows[i].cells[n];
			let boxref = toChange.rows[i].cells[n].childNodes[0];
			let thisBoxID = boxref.id;
			let thisBoxValue = boxref.checked;
			
			
			let matches = thisBoxID.match(/(\d+)/g);
			thisBoxID = matches.slice(-1);

			if ((thisBoxValue) && (progressIndex - 1 == thisBoxID))
			{
				thisBoxCSSRoot.style.backgroundColor = "red";
			}
			
			else {thisBoxCSSRoot.style.backgroundColor = "initial";}
			
		}
	}
	}	
}

function clearInputHighlights()
{
	var tableNameArray = ["drum_machine_table", "step_sequencer_table"];
	
	for (let x = 0; x < tableNameArray.length; x++)
	{
		
	var toChange = document.getElementById(tableNameArray[x]);
	
	
	for (let i = 1; i < toChange.rows.length; i++) //
	{
		
		for (let n = 1; n < toChange.rows[1].cells.length; n++)
		{
			var thisBoxCSSRoot = toChange.rows[i].cells[n];
			var thisBoxValue = toChange.rows[i].cells[n].childNodes[0].checked;
			var thisBoxID = toChange.rows[i].cells[n].childNodes[0].id;
			thisBoxID = thisBoxID.charAt(thisBoxID.length -1);
			
			thisBoxCSSRoot.style.backgroundColor = "initial";
			
		}
	}
	}
}

//------------------NOTES, MODES, AND LENGTHS------------------//


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

const inversionNameArray = ["None", "First", "Second", "Third"];

//Dictionary assigning numerical values to note lengths as used by tone.js
//We can get the fraction of a measure each beat takes up with 1 / key
//In theory this could be removed by setting the option values to these lengths
//But the breaks Firefox for some reason
const noteValues = 
{1:"1m",
2:"2n",
4:"4n",
8:"8n"};


//PLAY ETC.

	function play()
	{
		chordLooper();
		insertRest();
	}

//OCTAVE CONTROL

var playingFlag = 0;

//------------------MEASURE CONTROLLERS------------------//

//NUMERATOR

var numerator;

//Check what the user has entered for the time signature's numerator

function getNumerator()
{
	numerator = document.getElementById("numeratorinput").value;
	Tone.Transport.timeSignature = numerator;
}

//Updates the numerator and, for stability's sake, updates practically everything
function numeratorChangeUpdates()
{
	if(confirm("This will clear current inputs, continue?"))
	{
	getNumerator();
	updateMeasureValue();
	beatCurrentTotal = 0;
	addMeasure();
	buildSteps();
	buildStepSequencer();
	buildDrumMachine();
	updateChordBeatSelect();
	stopMelodyMaker();
	}
	

}

//Defining and updating measures

var measureValue;
var beatCurrentTotal = 0;

function updateMeasureValue()
{
	getNumerator();
	measureValue = 1 * numerator;
	
}

//Add a measure to the running total, update appropriate inputs
function addMeasure()
{
	beatCurrentTotal = beatCurrentTotal + measureValue;
}

//Remove a measure as well as the inputs on the page
function removeMeasure()
{
	beatCurrentTotal = beatCurrentTotal - measureValue;
}

//Orchestrates all of the required actions when the user clicks the "Add measure" button
function orchestrate_addMeasure()
{
	addMeasure();
	addDrumTableCells();
	addStepSequencerCells();
	updateInterface();
}

function orchestrate_removeMeasure()
{
	countMeasures();
	if (measureCount != 1)
	{
		measureCount = countMeasures();
		removeMeasure();
		removeDrumTableCells();
		removeStepSequencerTableCells();
		updateInterface();
	}
	
	else (alert("Cannot remove final remaining measure"));
}

//measureCount and countMeasures are used by the helper synth that tracks progress
var measureCount;

function countMeasures()
{
	measureCount = beatCurrentTotal / numerator;
}

//Track the current progress of the melody maker
var currentMeasure = 1;
var currentBeat = 1;
var progressIndex = 1;

function resetProgress()
{
	currentMeasure = 1;
	currentBeat = 1;
	progressIndex = 1;
}

//Track the current position of the melody maker
function trackProgress()
{	
	chordChecker();
	progressIndex++;

	if (currentMeasure == measureCount && currentBeat == numerator)
	{	
		currentMeasure = 1;
		currentBeat = 1;
		progressIndex = 1;
	}
	else if (currentBeat == numerator)
	{
		currentMeasure++;
		currentBeat = 1;
	}
	
	else {currentBeat++;}
}

function chordChecker()
{
	for (let i = 0; i < chordArray.length; i++)
	{		
		if (chordArray[i][9] == progressIndex)
		{
			const synth = new Tone.PolySynth();
			synth.options.oscillator.type = document.getElementById("chord_waveshape").value.toLowerCase();
			synth.volume.value = document.getElementById("chord_volume").value;
			const chordReverb = new Tone.Reverb();
			synth.chain(Tone.Destination);
			
			
			synth.triggerAttackRelease([chordArray[i][1], chordArray[i][2], chordArray[i][3], chordArray[i][4]],  chordArray[i][0]);
		}
	}
}

//------------------STOP MELODY MAKER------------------//

//STOP
//This is a brute force "stop everything" button.
function stop()
{
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
	document.getElementById("melodymakerStartButton").innerHTML="&#9658 Play";
	clearInputHighlights();
}

//This orchestrates all of the UI updates when changes are made
//This should remain non-destructive
//Cannot be called before fully loaded
function updateInterface()
{
	getNumerator();
	updateMeasureValue();
	updateChordMeasureSelect();
	updateChordBeatSelect();
}

//------------------INPUT VALIDATION------------------//

//Ensure the BPM is a number between 1 and 240 BPM
//Checking for a number ensures non-number characters are invalid
function validate_bpm()
{
	let input = document.getElementById("bpm");
	if (input.value <= 0 || input.value >= 241)
	{
		alert("BPM value must be a number between 1 and 240");
		input.value = 120;
	}
}

//Ensure the time signature numerator is a number between 1 and 18
function validate_numerator()
{
	let input = document.getElementById("numeratorinput");
	if (input.value <= 0 || input.value >= 19)
	{
		alert("Numerator must be a number between 1 and 18");
		input.value = 4;
	}
}

//Adds event listeners to inputs that require validation
document.getElementById("bpm").addEventListener("change", validate_bpm);
document.getElementById("numeratorinput").addEventListener("change", validate_numerator);

//------------------INFO BOXES------------------//

var info_degree = document.getElementById("info_degree");


//------------------INFO BOXES------------------//

document.onkeyup = function(hotkey) {
	if (hotkey.altKey && hotkey.which == 80)
	{drumandstep()}
	
	if (hotkey.altKey && hotkey.which == 67)
	{orchestrate_addMeasure()}

	if (hotkey.altKey && hotkey.which == 88)
	{orchestrate_removeMeasure()}

	if (hotkey.altKey && hotkey.which == 77)
	{document.getElementById("bpm").focus();}

	if (hotkey.altKey && hotkey.which == 75)
	{document.getElementById("hihatinput0").focus();}

	if (hotkey.altKey && hotkey.which == 76)
	{document.getElementById("stepseq8input0").focus();}
}
