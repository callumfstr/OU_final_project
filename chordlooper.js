//------------------------------------------------------//
//------------------chordlooper.js----------------------//
//------------------------------------------------------//
	//This function is called when defining each note in a chord
	//THIS SHOULD NOT OTHERWISE BE INVOKED
	function findNote(i)
	{
		//Handle notes that are an octave or more above the root
		var newNote;
		if (i > 6)
		{
			//Handles anything 2 octaves above the root
			if (i >= 14)
			{
			i = i - 14;
			newNote = stepNoteArray[i];
			let prevOctave = String(newNote).slice(-1);
			newNote = (String(newNote).slice(0, -1));
			newNote = String(newNote + (parseInt(prevOctave) + 2));	
			}
			
			//Handles anything 1 octave above the root
			else{
			i = i - 7;
			newNote = stepNoteArray[i];
			let prevOctave = String(newNote).slice(-1);
			newNote = (String(newNote).slice(0, -1));
			newNote = String(newNote + (parseInt(prevOctave) + 1));
			}
		}
		
		else (newNote = stepNoteArray[i]);
		
		return newNote;
	}

//Array of all chords built by user
var chordArray = [];

//CURRENT CHORD ARRAY ANATOMY - 
//[0: NOTE DURATION, 1: FIRST, 2: THIRD, 3: FIFTH, 4: SEVENTH, NINTH or NULL, 
//5: EXTENSION AS STRING, 6: INVERSION AS STRING, 
//7: CHORD MEASURE, 8: CHORD BEAT, 9: ID DERIVED FROM MEASURE + BEAT VALUES
//10: ROOT NOTE INTERVAL, TO BE USED WHEN TRANSPOSING, 11: ROOT ROMAN NUMERAL FOR TABLE]
	
	
//-------------CHORD BUILDER-----------------//
function addChord()
{	
	//Resets the current chord array
	var currentChordArray = [];
	currentChordArray.length = 0;
	
	let chordtableref = document.getElementById("chordtable");
	
	//Builds the scale to find the chord
	//NOTE: THE CURRENT SCALE IS CALLED "STEPNOTEARRAY". A LITTLE CONFUSING BUT IT WORKS.
	buildCurrentScale(3, document.getElementById("chord_root_note").value);

	//------------------------------DEFINE CHORD
	//Define the chord duration and push to currentChordArray
	let chordDuration = document.getElementById("chord_duration").value;
	currentChordArray.push(chordDuration);
	
	//Define the intervals of a triad and find their notes
	let root = document.getElementById("chord_root").value;
	let rootNote = stepNoteArray[root];
	currentChordArray.push(rootNote);
	
	let third = parseInt(root) + 3;
	let thirdNote = findNote(third);
	currentChordArray.push(thirdNote);
	
	let fifth = parseInt(root) + 5;
	let fifthNote = findNote(fifth);
	currentChordArray.push(fifthNote);
	
	//Define and build 7th chords
	if (document.getElementById("chord_extension").value == 1){var seventh = parseInt(root) + 7; var seventhNote = findNote(seventh); currentChordArray.push(seventhNote);}
	//Define and build 9th chords
	else if (document.getElementById("chord_extension").value == 2){var ninth = parseInt(root) + 9; var	ninthNote = findNote(ninth); currentChordArray.push(ninthNote);}
	//Build a triad
	else {currentChordArray.push(null);
	}
	
	//Define and store the chord's duration, extension, and inversion
	
	let chordExtension = extensionNameArray[document.getElementById("chord_extension").value];
	currentChordArray.push(chordExtension);
	
	//This is currently not in use
	let chordInversion = null;
	currentChordArray.push(chordInversion);
	
	
	let chord_measure = document.getElementById("chord_measure").value;
	currentChordArray.push(chord_measure);
	
	let chord_beat = document.getElementById("chord_beat").value;
	currentChordArray.push(chord_beat);
	
	let chord_id = parseInt(chord_beat) + parseInt(((chord_measure - 1) * numerator));
	currentChordArray.push(chord_id);
	
	let selectedRoot = document.getElementById("chord_root");
	currentChordArray.push(selectedRoot[selectedRoot.value].value);
	currentChordArray.push(selectedRoot[selectedRoot.value].text);
	
	//PUSH THE BUILT CHORD TO THE EMPTY CHORD ARRAY
	if (chordArray.length == 0)
	{
		chordArray.push(currentChordArray);
	}
	
	//IF CHORD ARRAY ISN'T EMPTY, ITERATE THROUGH AND LOOK FOR CHORDS AT THE SPECIFIC BEAT
	else{
		var checkFlag = false;
		var flaggedIndex = null;
		for (let i = 0; i < chordArray.length; i++)
		{
			if (chordArray[i][9] == currentChordArray[9])
				{
					checkFlag = true;
					flaggedIndex = i;
				}
		}
		
		if (checkFlag == false) {chordArray.push(currentChordArray);}
		
		else
		{
			if(confirm("Replace the existing chord at this beat?"))
			{
				chordArray.splice(flaggedIndex, 1);
				chordArray.push(currentChordArray);
			}
			
		}
	}
	
	//Prevents chordArray being polluted with duplicate references
	currentChordArray = null;
	updateChordArrayTable();
}

function updateChordArrayTable()
{
	var chordArrayTable = document.getElementById("chordtable");
	var chordArrayTableRows = chordArrayTable.rows;
	
	while (chordArrayTableRows.length > 1){chordArrayTable.deleteRow(1);}	//Clear previously existing chord table
	chordArray.sort(function(a, b){return a[9] - b[9]});					//Sort the chord array before populating new table

	for (let i = 0; i < chordArray.length; i++)
	{
		let newRow = chordArrayTable.insertRow();
		
		for (let n = 0; n < 6; n++)
		{
			var newCell = newRow.insertCell();
		}
		
		newRow.cells[0].append(chordArray[i][11] + " - ");
		newRow.cells[0].append(chordArray[i][1]);
		newRow.cells[1].append(chordArray[i][0]);
		newRow.cells[2].append(chordArray[i][5]);
		newRow.cells[3].append(chordArray[i][7]);
		newRow.cells[4].append(chordArray[i][8]);
		newRow.cells[5].append(chordArray[i][9]);
	}
	
	//Add the "delete" button to each chord in the table
	//This had to be separated from the previous loop, as the eventlistener was
	//taking the ID from a reference rather than the existing button
	//This caused all eventlisteners to have the same ID
	for (let i = 1; i < chordArrayTableRows.length; i++)
	{
		let chosenRow = chordArrayTableRows;		//Find the current row
		let chosenCell = chosenRow[i].cells[5];		//Find the ID cell
		let storedID = chosenCell.innerHTML;		//Store the chord ID
		chosenCell.innerHTML = "";					//Clear the ID text for the coming button
		
		//Create the delete button
		let newbutton = document.createElement("button");
		newbutton.innerText = "Delete";
		
		let buttonID = storedID;
		newbutton.id = buttonID;
		newbutton.addEventListener("click", removeChord);
		chosenCell.append(newbutton);
	}
}


//Deletes the chord associated with the button clicked
function removeChord()
{	
	let chordToSplice_ID = this.id;
	let chordToSplice_Index;
	for (let i = 0; i < chordArray.length; i++)
	{
		if (chordArray[i][9] == chordToSplice_ID){chordToSplice_Index = i; break;}
	}
	
	chordArray.splice(chordToSplice_Index, 1);
	updateChordArrayTable();
}

//Update the select menu for chord measure placement
function updateChordMeasureSelect()
{
	var chordMeasureSelector = document.getElementById("chord_measure");
	var currentMeasures = (beatCurrentTotal / numerator);
	
	while (chordMeasureSelector.length > 0){chordMeasureSelector.remove(0);}
	
	for (let i = 0; i < currentMeasures; i++)
	{
		let option = new Option("" + (i + 1))
		chordMeasureSelector.add(option);
	}
}

//Update the select menu for chord beat placement
function updateChordBeatSelect()
{
	var chordBeatSelector = document.getElementById("chord_beat");
	
	while (chordBeatSelector.length > 0){chordBeatSelector.remove(0);}
	
	for (let i = 0; i < numerator; i++)
	{
		let option = new Option("" + (i + 1))
		chordBeatSelector.add(option);
	}
}


function testChord()
{
	//Builds the current scale for chords, ensures the correct octave is used
	buildCurrentScale(3);
	
	const synth = new Tone.PolySynth().toDestination();
	
	//Volume control
	synth.options.oscillator.type = document.getElementById("chord_waveshape").value.toLowerCase();
	synth.volume.value = document.getElementById("chord_volume").value;
	
	//Reverb
	const chordReverb = new Tone.Reverb();
	synth.chain(Tone.Destination);
	
	//Test chord builder
	var testChordArray = [];
	let chordDuration = document.getElementById("chord_duration").value;
	testChordArray.push(chordDuration);
	
	let root = document.getElementById("chord_root_note").value;
	let rootNote = stepNoteArray[root];
	testChordArray.push(rootNote);
	
	let third = parseInt(root) + 3;
	let thirdNote = findNote(third);
	testChordArray.push(thirdNote);
	
	let fifth = parseInt(root) + 5;
	let fifthNote = findNote(fifth);
	testChordArray.push(fifthNote);
	
	//Define and build 7th chords
	if (document.getElementById("chord_extension").value == 1){var seventh = parseInt(root) + 7; var seventhNote = findNote(seventh); testChordArray.push(seventhNote);}
	//Define and build 9th chords
	else if (document.getElementById("chord_extension").value == 2){var ninth = parseInt(root) + 9; var	ninthNote = findNote(ninth); testChordArray.push(ninthNote);}
	//Build a triad
	else {testChordArray.push(null);
	}
	
	synth.triggerAttackRelease([testChordArray[1], testChordArray[2], testChordArray[3], testChordArray[4]], chordDuration);
}

updateChordMeasureSelect();
updateChordBeatSelect();