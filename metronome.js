//PLAYING FLAG
//Flag used to determine if the metronome is currently playing 
//This is used to set button behaviour

playingFlag = 0;

function stopMetronome()
{
	stop();
	playingFlag = 0;
	document.getElementById("startbutton").innerHTML = "START";
	document.getElementById("altstartbutton").innerHTML = "Begin Exercise";
	document.getElementById("alttempostartbutton").innerHTML = "Begin Exercise";
	document.getElementById("subdivisionstartbutton").innerHTML = "Begin Exercise";
	document.getElementById("bpm").disabled = false;
	let boxes = document.getElementById("emphasisboxes").querySelectorAll("input");
	for (let i = 0; i < boxes.length; i++){boxes[i].disabled = false;}
	document.getElementById("numeratorinput").disabled = false;
}

function setPlayingFlag()
{
	playingFlag = 1;
	document.getElementById("startbutton").innerHTML = "STOP";
	document.getElementById("altstartbutton").innerHTML = "End Exercise";
	document.getElementById("alttempostartbutton").innerHTML = "End Exercise";
	document.getElementById("subdivisionstartbutton").innerHTML = "End Exercise";
	document.getElementById("bpm").disabled = true;
	let boxes = document.getElementById("emphasisboxes").querySelectorAll("input");
	for (let i = 0; i < boxes.length; i++){boxes[i].disabled = true;}
	document.getElementById("numeratorinput").disabled = true;
}
 
//NUMERATOR, THIS IS CURRENTLY COPIED FROM java.js

var numerator;
//Check what the user has entered for the time signature's numerator

function getNumerator()
{
	numerator = document.getElementById("numeratorinput").value;
}

//METRONOME

//Define and populate the metronome array
var metronomeArray;


//This builds a series of checkboxes for the user to set emphasised beats
function buildEmphasisBoxes()
{
	getNumerator();
	document.getElementById("emphasisboxes").innerHTML = "";
	
	for (let i = 0; i < numerator; i++)
	{
		document.getElementById("emphasisboxes").innerHTML += '<div><label><input type="checkbox" id="emphasis' + (i) + '">' + '<br>' + i + '</label></div>';
	}
}

buildEmphasisBoxes();
document.getElementById("numeratorinput").addEventListener("input", buildEmphasisBoxes);

function populateMetronome()
{	
	//Check how many beats are in a measure
	getNumerator();
	metronomeArray.length = 0;
	
	//The first beat is handled by check(), this populates remaining beats
	for (let i = 0; i < numerator; i++)
	{
		var box = document.getElementById("emphasis" + i).checked;
		if(box) {metronomeArray.push("C2");}
		else {metronomeArray.push("C1");}
	}
}

//WORKING METRONOME FUNCTION
function metronome()
{
	//Check user tempo input and update Transport BPM
	var tempo = (document.getElementById("bpm").value);
	Tone.Transport.bpm.value = tempo;
	
	if (playingFlag == 1)
	{stopMetronome();}
	
	else {
	//Stop currently running metronome
	stopMetronome();
	
	
	//Check whether the first note of each beat should be emphasised
	//then populate the metronomeArray as appropriate
	metronomeArray = [];
	populateMetronome();
	
	//Synthesizer for the metronome
	const metronomeSynth = new Tone.MembraneSynth().toDestination();
	metronomeSynth.envelope.release = 0.02;
	const metronomeSeq = new Tone.Sequence((time, note) => {tempo = (document.getElementById("bpm").value);
	Tone.Transport.bpm.value = tempo;
	metronomeSynth.triggerAttackRelease(note, "32n", time); },
	metronomeArray, "4n").start();
	
	//Set playing flag and update start/stop button
	setPlayingFlag();
	
	Tone.Transport.start();
	}
}

function incrementalTempo(increment)
{
	Tone.Transport.bpm.value = parseInt(parseInt(document.getElementById("bpm").value) + increment);
	document.getElementById("bpm").value = parseInt(Tone.Transport.bpm.value);
}

//Initialise variables used in multiple functions
var timeArray = [];
var timeIs = 0;
var startTime = 0;
var tappedTime = 0;
var deltaTime;
var tapCount = 0;
var tapTimeout;

//TAP TEMPO
function tapTempo()
{
	
	//Reset BPM on first tap
	var bpm = 0;
	
	//Define the startTime and derive the deltaTime between taps
	//This order is important to push the correct delta each time
	startTime = new Date().getTime();
	deltaTime = startTime - timeIs;
	timeArray.push(deltaTime);
	timeIs = new Date().getTime();
	
	//The first time value is a regular time output, the second tap pushes that initial value out
	if (tapCount == 1) {timeArray.shift();}
	
	//Ensures the average is only taken from the previous 10 taps
	if (timeArray.length > 10) {timeArray.shift();}
	
	//Increment tap count
	tapCount++
	
	//Loops through the array of deltas and sets bpm to the sum of these values
	
	for (let iTap = 0; iTap < timeArray.length; iTap++)
		{
			bpm = bpm + timeArray[iTap];
		}
	
	
	//Derive the average time delta
	bpm = bpm / timeArray.length;
	
	//Calculate BPM from the average delta and change the BPM value on the page
	bpm = 60 / bpm;
	bpm = bpm * 1000;
	if (tapCount> 1){document.getElementById("bpm").value = Math.trunc(bpm);}
	
}

function resetTap(){tapCount = 0; timeArray.length = 0; timeIs = 0; startTime = 0; tappedTime = 0; console.log("IT'S HAPPENING");}

function tapTimer(){ 
clearTimeout(tapTimeout);
tapTimeout = setTimeout(resetTap, 3000);}

//PROGRAMMABLE METRONOME FUNCTIONS

//ALTERNATING OFF AND ON

function altMetronome()
{
		if (playingFlag == 1)
	{
		stopMetronome();
	}
	
	else
	{
	//Stop previous iteration of metronome
	stop();
	
	//Get the tempo, numerator
	var tempo = (document.getElementById("bpm").value / 2);
	Tone.Transport.bpm.value = tempo;

	
	//Finds out how many measures should be played
	var measuresToPlay = document.getElementById("measuresToPlay").value;
	var measuresToMute = document.getElementById("measuresToMute").value;
	
	//Ensure the metronomeArray is empty
	metronomeArray = [];
	
	//Populate the metronomeArray array based on user inputs
	for (let i = 0; i < measuresToPlay; i++)
	{
	
		for (let n = 0; n < numerator; n++)
		{
			var box = document.getElementById("emphasis" + n).checked;
			if(box) {metronomeArray.push("C2");}
			else {metronomeArray.push("C1");}
		}
	}
	
	for (let i = 0; i < measuresToMute; i++)
	{
		
		for (let n = 0; n < numerator; n++)
		{
			metronomeArray.push(null);
		}
	}
	
	//Synth to play the metronome
	const metronomeSynth = new Tone.MembraneSynth().toDestination();
	const metronomeSeq = new Tone.Sequence((time, note) => {
	metronomeSynth.envelope.release = 0.02;
	metronomeSynth.triggerAttackRelease(note, "64n", time); },
	metronomeArray).start(0);
	
	setPlayingFlag();
	
	Tone.Transport.start();	
	}
}

function altTempoMetronome()
{
	if (playingFlag == 1){stopMetronome();}
	
	else
	{
	stop();
	var tempo = parseInt((document.getElementById("bpm").value));
	Tone.Transport.bpm.value = tempo;
	var check;
	metronomeArray = [];
	populateMetronome();
	
	var tempoIncrement = document.getElementById("altTempoIncrement").value;
	var endTempo = document.getElementById("altTempoFinish").value;
	var totalMeasures = document.getElementById("altMeasures").value;
	var notesPlayed = 0;
	const metronomeSynth = new Tone.MembraneSynth().toDestination();
	const metronomeSeq = new Tone.Sequence((time, note) => {
	metronomeSynth.envelope.release = 0.02;
	if (notesPlayed == (numerator * totalMeasures) && (Tone.Transport.bpm.value) < endTempo)
		{Tone.Transport.bpm.value = (parseFloat(Tone.Transport.bpm.value) + parseFloat(tempoIncrement));
		notesPlayed = 0; document.getElementById("bpm").value = parseInt((Tone.Transport.bpm.value));}
	metronomeSynth.triggerAttackRelease(note, "64n", time);
	notesPlayed++;
	},
	metronomeArray, "4n").start(0);
	
	setPlayingFlag();
	
	Tone.Transport.start();	
	}
}

function subPyramid()
{

	if (playingFlag == 1)
	{
		stopMetronome();
		
	}
	else
	{
		
	//Define subdivisions for subPyramid
	var metronomeArray = [];

	//Define the beats used for each subdivision
	const pyrSingle = ["C2", null, null, null];
	const pyrTuplet = ["C2", null, "C1", null];
	const pyrTriplet = ["C2", "C1", "C1"];
	const pyrQuadruplet = ["C2", "C1", "C1", "C1"];
	const pyrQuintuplet = ["C2", "C1", "C1", "C1", "C1"];
	const pyrSextuplet = ["C2", "C1", "C1", "C1", "C1", "C1"];
	const pyrSeptuplet = ["C2", "C1", "C1", "C1", "C1", "C1", "C1"];
	const pyrOctuplet = ["C2", "C1", "C1", "C1", "C1", "C1", "C1", "C1"];
	
	//This array is used as a reference when building the metronome array
	const subdivisionArray = [pyrSingle, pyrTuplet, pyrTriplet, pyrQuadruplet, pyrQuintuplet, pyrSextuplet, pyrSeptuplet, pyrOctuplet];
	
	var pyrRepeats = document.getElementById("pyrRepeats").value;
	
	for (let i = 0; i < 8; i++)
	{
		var currentElement = document.getElementById("pyr" + i);
		
		if (currentElement.checked){
			for (let n = 0; n < pyrRepeats; n++)
			{
				metronomeArray.push(subdivisionArray[i]);
				console.log(currentElement + " is checked!");
			}
		}
	}
	//This var calculates how many entries are needed when building the descending side of the pyramid
	let arrayLength = metronomeArray.length - pyrRepeats;
	console.log(arrayLength);
	
	for (arrayLength; arrayLength > pyrRepeats; arrayLength--)
	{
		metronomeArray.push(metronomeArray[arrayLength-1]);
	}
	
	console.log(metronomeArray);
	
	//Cancel any ongoing transport
	stop();
	
	var tempo = parseInt(document.getElementById("bpm").value);	
	document.getElementById("startbutton").innerHTML = "STOP";
	Tone.Transport.bpm.value = tempo;
	
	const metronomeSynth = new Tone.MembraneSynth().toDestination();
	const metronomeSeq = new Tone.Sequence((time, note) => {
	metronomeSynth.envelope.release = 0.02;
	metronomeSynth.triggerAttackRelease(note, "64n", time); },
	metronomeArray, "4n").start(0);
	
	setPlayingFlag();
	
	Tone.Transport.start();	
	}
}