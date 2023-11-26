
//------------------NOTES------------------//

var stepNoteArray = [];
	
	
//This labels each row of the Step Sequencer with the corrent note name
//CURRENTLY ALSO APPENDS THE OCTAVE NUMBER
function buildSteps()
{
	buildCurrentScale();
	let stepTable = document.getElementById("step_sequencer_table");
}

document.getElementById("octaveinput").addEventListener("change", populateNoteNames);
document.getElementById("note").addEventListener("change", populateNoteNames);
document.getElementById("scale").addEventListener("change", populateNoteNames);

function buildCurrentScale(passedOctave, passedKey)
{
	if (passedOctave == undefined){currentOctave = document.getElementById("octaveinput").value;}
	else (currentOctave = passedOctave);
	stepNoteArray.length = 0;
	buildNoteMap();
	chosenScale = parseInt(document.getElementById("scale").value);
	if (passedKey == null){chosenKey = parseInt(document.getElementById("note").value);}
	else (chosenKey = parseInt(passedKey));
	chosenDegree = 0;
	
	var startNote;	
	startNote = chosenKey + (modeArray[chosenScale][chosenDegree]) + (currentOctave * 12);
	
	for (let i = 0; i < 8; i++)
	{
	var nextNote = parseInt(startNote) + parseInt(modeArray[chosenScale][i]);
	stepNoteArray.push(noteMap.get(nextNote));
	}
}

//CONSTRUCT STEP SEQUENCER INPUT INTERFACE
function buildStepSequencer(startingPoint)
{		
	if (startingPoint == undefined){startingPoint = 0;}
	
	buildCurrentScale();
	let stepTable = document.getElementById("step_sequencer_table");
	
	//Define and remove any previously held table
	let oldTable = stepTable.firstChild;
	stepTable.removeChild(oldTable);
	
	for (let n = 0; n < 8; n++)
	{
		let newRow = stepTable.insertRow();
		let newCell = newRow.insertCell();
		let newName = document.createTextNode(stepNoteArray[n]);
		newCell.appendChild(newName);	
		let boxNumber = 8 - n;
		newRow.id = boxNumber;

		for (let i = startingPoint; i != beatCurrentTotal; i++)
			{
			
			let newCell = newRow.insertCell();
			newCell.className = "inputbox";
			let newbox = document.createElement("input");
			newbox.type = "checkbox";
			newbox.id = "stepseq" + boxNumber + "input" + i;
			newbox.className = "inputbox";
			newCell.appendChild(newbox);
			newCell.addEventListener("change", () => testNote(boxNumber, newbox.id));
			}
			
	}
	
	buildStepSequencer_headers();
	populateNoteNames();
}

function populateNoteNames()
{
	buildCurrentScale();
	let stepTable = document.getElementById("step_sequencer_table");
	let stepTableRows = stepTable.rows;
	
	for (let n = 0; n < 8; n++)
	{
		let boxno = 8 - n;
		currentCell = stepTableRows[boxno].cells[0];
		let newName = document.createTextNode(stepNoteArray[n]);
		currentCell.innerHTML = "";
		currentCell.appendChild(newName);
	}
}
	
function buildStepSequencer_headers(){	

	let stepTable = document.getElementById("step_sequencer_table");
	
	//Append a row to hold the measure and beat numbers
	let headerRow = stepTable.insertRow(0);
	let headerCell = headerRow.insertCell();
	//Define and initialised starting points for the header numbers
	var headerBeatNumber = 1;
	var headerSubNumber = 1;
	
	for (let i = 0; i != beatCurrentTotal; i++)
		{
		//Add a new cell to the header for the beat number
		let headerCell = headerRow.insertCell();
		
		//Checks measure divisions
		let subdivisionsPerMeasure = document.getElementById("numeratorinput").value;
		
		//Inserts the current measure and beat into the header
		let headerText = document.createTextNode(headerBeatNumber + ":" + headerSubNumber);
		headerCell.appendChild(headerText);
		
		//Checks if the header has reached the end of a measure, and starts the next one if needed
		if (headerSubNumber == subdivisionsPerMeasure){headerBeatNumber++; headerSubNumber = 1;}
		else{headerSubNumber++;}
		}
}

function addStepSequencerCells()
{
	let stepTable = document.getElementById("step_sequencer_table");
	let stepTableRows = stepTable.rows;
	stepTable.deleteRow(0);
	
	let startBeat = stepTableRows[0].cells.length;
	startBeat--;
	let endBeat = parseInt(startBeat) + parseInt(numerator);
	
	for (let n = 0; n < 8; n++)
		{
			let noteNameArray = [stepNoteArray[0], stepNoteArray[1], stepNoteArray[2], stepNoteArray[3], stepNoteArray[4], stepNoteArray[5], stepNoteArray[6], stepNoteArray[7]] 
			let currentNoteName = noteNameArray[n];
			
			for (let i = startBeat; i < endBeat; i++)
			{
				let newCell = stepTableRows[n].insertCell();	
				newCell.className = "inputbox";
				newCell.label = currentNoteName + " " + i;
				let newbox = document.createElement("input");
				newbox.type = "checkbox";
				newbox.id = "stepseq" + (8 - n) + "input" + i;
				newCell.appendChild(newbox);		
		let boxNumber = 8 - n;
				newCell.addEventListener("change", () => testNote(boxNumber, newbox.id));	
			}
		}
		
		buildStepSequencer_headers()
}

function removeStepSequencerTableCells()
{
	//Define a variable with the HTML table element
	let stepTable = document.getElementById("step_sequencer_table");
	let stepTableRows = stepTable.rows;
		
		for (let n = 0; n < stepTableRows.length; n++)
		{
			for (let i = 0; i < numerator; i++)
			{
				stepTableRows[n].deleteCell(-1);
			}
		}
}

var stepSequencerArray = [];
var drumMachineArray = [];
var drumNoteArray = ["C0", "C1", "E1", "G1"];

//This function iterates through each note input, currently capped at 8 notes
//Pushes each value to a subarray in stepSequencerArray
//Order of iteration is currently NOTE 0 Beat 0, Beat 1, Beat 2,... NOTE 1, Beat 0, Beat 1,... etc.

function checkStepSequencerInputs()
{
	//Clears previously stored notes from stepSequencerArray
	stepSequencerArray.length = 0;
	buildCurrentScale();
	
	//Iterates through each note input
	for (let i = 0; i < 8; i++)
	{
		//This creates a new subarray for each note
		stepSequencerArray.push([]);
		for (let n = 0; n < beatCurrentTotal; n++)
		{
			//The HTML boxes currently start from 1, CHANGE THIS IN THE FUTURE
			let boxno = i + 1;
			let box = document.getElementById("stepseq" + boxno + "input" + n);
			if (box.checked){stepSequencerArray[i].push(stepNoteArray[i])}
			else {stepSequencerArray[i].push(null)};
		}
	}

}

//Plays the appropriate note when the user checks a box in the step sequencer
function testNote(inputID, boxID)
{	
	boxID = document.getElementById(boxID);
	if (boxID.checked){
		
	let stepTable = document.getElementById("step_sequencer_table");
	stepTable = stepTable.rows[9 - inputID].cells;
	
	const testNoteSynth = new Tone.Synth().toDestination();
	testNoteSynth.oscillator.type = document.getElementById("synth_waveshape").value.toLowerCase();
	var inputNote = stepNoteArray[inputID -1];
	testNoteSynth.triggerAttackRelease(inputNote, "4n");
		
	}
}

