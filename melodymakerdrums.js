//------------------DRUMS------------------//

//KICK DRUM
const kicksynth = new Tone.MembraneSynth().toDestination();

//SNARE DRUM
const lowtomsynth = new Tone.MembraneSynth().toDestination();
	lowtomsynth.envelope.attack= 0.001;
	lowtomsynth.envelope.decay= 0.2;
	lowtomsynth.envelope.sustain= 1;
	lowtomsynth.envelope.release= 0.2;
	lowtomsynth.volume.value = -5;
	
//This noise synth simulates the snare wires resonating in a snare drum
//Currently attached to lowtomsynth
	const snaresynth = new Tone.NoiseSynth().toDestination();
	snaresynth.envelope.attack= 0.001;
	snaresynth.envelope.decay= 0.1;
	snaresynth.envelope.sustain= .05;
	snaresynth.envelope.release= 0.15;
	snaresynth.noise.type = "white";
	snaresynth.volume.value = -2;


//TOM DRUM
const midtomsynth = new Tone.MembraneSynth().toDestination();
	midtomsynth.envelope.attack= 0.001;
	midtomsynth.envelope.decay= 0.2;
	midtomsynth.envelope.sustain= 1;
	midtomsynth.envelope.release= 0.2;
	

//CRASH CYMBAL
const crashfilter = new Tone.Filter(1500, "highpass").toDestination();
const crashcymbalsynth = new Tone.NoiseSynth().connect(crashfilter);
	crashcymbalsynth.envelope.attack;
	crashcymbalsynth.envelope.decay;
	crashcymbalsynth.envelope.sustain= 0.8;
	crashcymbalsynth.envelope.release = 1;
	crashcymbalsynth.volume.value = -10;
	

const hihatfilter = new Tone.Filter(2000, "highpass").toDestination();
const hihatsynth = new Tone.NoiseSynth().connect(hihatfilter);	crashcymbalsynth.envelope.attack;
	hihatsynth.envelope.decay;
	hihatsynth.envelope.sustain= 0.05;
	hihatsynth.envelope.release = 0.05;
	hihatsynth.volume.value = -14;
	
	
//CONSTRUCT DRUMLOOP INPUT interface
function buildDrumMachine(startingPoint)
{	
	if (startingPoint == undefined){startingPoint = 0;}

	//Define a variable with the HTML table element
	let drumTable = document.getElementById("drum_machine_table");
	
	//Define and remove any previously held table
	let oldTable = drumTable.firstChild;
	drumTable.removeChild(oldTable);
	
	//These arrays contain the names of each drum piece as displayed on screen, and as used in the following loop
	let drumNames = ["High Hat", "Crash Cymbal", "Tom Drum", "Snare Drum", "Kick Drum"];
	let drumVarNames = ["hihat", "crashcymbal", "midtom", "lowtom", "kickdrum"];
	
	//This loop checks how many drums are defined, then builds a table of checkboxes to hold their inputs
	for (let n = 0; n < drumNames.length; n++)
	{	
		let newRow = drumTable.insertRow();
		let newCell = newRow.insertCell();
		let newName = document.createTextNode(drumNames[n]);
		newCell.appendChild(newName);
		
		for (let i = startingPoint; i != beatCurrentTotal; i++)
		{
			let newCell = newRow.insertCell();
			newCell.className = "inputbox";
			let newbox = document.createElement("input");
			newbox.type = "checkbox";
			newbox.className = "inputbox";
			newbox.id = drumVarNames[n] + "input" + i;
			newCell.appendChild(newbox);
		}
	}
	
	buildDrumMachine_headers();
}

function buildDrumMachine_headers()
{		
	
	//Define a variable with the HTML table element
	let drumTable = document.getElementById("drum_machine_table");
	
//Append a row to hold the measure and beat numbers
	var headerRow = drumTable.insertRow(0);
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

	
function addDrumTableCells()
	{
		//Define a variable with the HTML table element
		let drumTable = document.getElementById("drum_machine_table");
		let drumTableRows = drumTable.rows;
		drumTable.deleteRow(0);
		
		//These arrays contain the names of each drum piece as displayed on screen, and as used in the following loop
		let drumNames = ["High Hat", "Crash Cymbal", "Tom Drum", "Snare Drum", "Kick Drum"];
		let drumVarNames = ["hihat", "crashcymbal", "midtom", "lowtom", "kickdrum"];
		
		let startBeat = drumTableRows[0].cells.length;
		startBeat--;
		let endBeat = parseInt(startBeat) + parseInt(numerator);
		
		for (let n = 0; n < drumNames.length; n++)
		{
			for (let i = startBeat; i < endBeat; i++)
				{
				let newCell = drumTableRows[n].insertCell();	
				newCell.className = "inputbox";
				let newbox = document.createElement("input");
				newbox.type = "checkbox";
				newbox.id = drumVarNames[n] + "input" + i;
				newCell.appendChild(newbox);		
			}
		}
		buildDrumMachine_headers()
	}

function removeDrumTableCells()
{
		//Define a variable with the HTML table element
		let drumTable = document.getElementById("drum_machine_table");
		let drumTableRows = drumTable.rows;
		
		for (let n = 0; n < drumTableRows.length; n++)
		{
			for (let i = 0; i < numerator; i++)
			{
				drumTableRows[n].deleteCell(-1);
			}
		}
}

//This function iterates through each drum input, the names of which are stored in arrayOfDrumInputs
//Pushes each value to a subarray in drumMachineArray
//NEW DRUMS MUST BE ADDED TO arrayOfDrumInputs FOR THIS TO WORK

function checkDrumMachineInputs()
{
	drumMachineArray.length = 0;
	let arrayOfDrumInputs = ["kickdruminput", "lowtominput", "midtominput", "crashcymbalinput", "hihatinput"]
	
	//Because this loop is based on the length of arrayOfDrumInputs, it should adapt to new drums being added
	for (let i = 0; i < arrayOfDrumInputs.length; i++)
	{
		//This creates a new subarray for each drum
		drumMachineArray.push([]);
		
		for (let n = 0; n < beatCurrentTotal; n++)
		{
			let box = document.getElementById(arrayOfDrumInputs[i]+ n);
			if (box.checked){drumMachineArray[i].push(drumNoteArray[i])}
			else {drumMachineArray[i].push(null)};
		}
		
	}
}