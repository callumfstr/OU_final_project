//------------------------------------------------------//
//------------------melodymaker.js----------------------//
//------------------------------------------------------//



//BRING EVERYTHING TOGETHER INTO ONE TRANSPORT INSTANCE

function drumandstep()
{
	initaliseSynths();
	
	//Set tempo based on user's input
	var tempo = (document.getElementById("bpm").value);
	Tone.Transport.bpm.value = tempo;
	
	checkStepSequencerInputs();
	checkDrumMachineInputs();
	countMeasures();
	
	//Reset the tracked beats and measures
	resetProgress();
	
	//let chosennotevalue = document.getElementById("notevalueinput").value;
	//let currentnotevalue = noteValues[chosennotevalue];
	
	//Due to issues with user input, the note duration is currently fixed at quarter notes
	let currentnotevalue = "4n";

	if (playingFlag == 1)
	{
		stopMelodyMaker();
		playingFlag = 0;
	}

	else{
	//DRUM SEQUENCER
	//Define variables for each drum
	//KICK DRUM
	//Create synth and sequencer for the kick drum, input kickArray
	kickseq = new Tone.Sequence((time, note) => {
	kicksynth.triggerAttackRelease(note, "64n", time);},
	drumMachineArray[0], currentnotevalue).start();
	
	//HIHAT

	hihatseq = new Tone.Sequence((time, note) => {
	hihatsynth.triggerAttackRelease("64n", time);},
	drumMachineArray[4], currentnotevalue).start();
	
	//CRASH CYMBAL (RENAME)

	crashcymbalseq = new Tone.Sequence((time, note) => {
	crashcymbalsynth.triggerAttackRelease("64n", time); },
	drumMachineArray[3], currentnotevalue).start();	
	
	//MID TOM DRUM

	//Create synth and sequencer for the tom drum, input tomArray
	midtomseq = new Tone.Sequence((time, note) => {
	midtomsynth.triggerAttackRelease(note, "64n", time); },
	drumMachineArray[2], currentnotevalue).start();
	
	//LOW TOM DRUM/SNARE DRUM
	
	//Create synth and sequencer for the tom drum, input tomArray
	//THIS CURRENTLY HOSTS THE SNARE
	lowtomseq = new Tone.Sequence((time, note) => {
	lowtomsynth.triggerAttackRelease(note, "64n", time);
	snaresynth.triggerAttackRelease("64n", time);
	}, drumMachineArray[1], currentnotevalue).start();
	
//SYNTHESIZERS FOR THE STEP SEQUENCER

let chosenWave = document.getElementById("synth_waveshape").value.toLowerCase();

//Step sequencer 1
	
	stepSynth1 = new Tone.Synth().toDestination();
	stepSynth1.oscillator.type = chosenWave;
	stepSeq1 = new Tone.Sequence((time, note) => {
	stepSynth1.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[0], currentnotevalue).start();
	
//Step sequencer 2
	
	stepSynth2 = new Tone.Synth().toDestination();
	stepSynth2.oscillator.type = chosenWave;
	stepSeq2 = new Tone.Sequence((time, note) => {
	stepSynth2.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[1], currentnotevalue).start();
	
	
	//Step sequencer 3
	
	stepSynth3 = new Tone.Synth().toDestination();
	stepSynth3.oscillator.type = chosenWave;
	stepSeq3 = new Tone.Sequence((time, note) => {
	stepSynth3.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[2], currentnotevalue).start();
	
	//Step sequencer 4

	stepSynth4 = new Tone.Synth().toDestination();
	stepSynth4.oscillator.type = chosenWave;
	stepSeq4 = new Tone.Sequence((time, note) => {
	stepSynth4.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[3], currentnotevalue).start();
	
	//Step sequencer 5
	
	stepSynth5 = new Tone.Synth().toDestination();
	stepSynth5.oscillator.type = chosenWave;
	stepSeq5 = new Tone.Sequence((time, note) => {
	stepSynth5.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[4], currentnotevalue).start();
	
		//Step sequencer 6
	
	stepSynth6 = new Tone.Synth().toDestination();
	stepSynth6.oscillator.type = chosenWave;
	stepSeq6 = new Tone.Sequence((time, note) => {
	stepSynth6.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[5], currentnotevalue).start();
	
	//Step sequencer 7
	
	stepSynth7 = new Tone.Synth().toDestination();
	stepSynth7.oscillator.type = chosenWave;
	stepSeq7 = new Tone.Sequence((time, note) => {
	stepSynth7.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[6], currentnotevalue).start();	
	
	//Step sequencer 8
	
	stepSynth8 = new Tone.Synth().toDestination();
	stepSynth8.oscillator.type = chosenWave;
	stepSeq8 = new Tone.Sequence((time, note) => {
	stepSynth8.triggerAttackRelease(note, currentnotevalue, time);},
	stepSequencerArray[7], currentnotevalue).start();	
	
	//TIMEKEEPER SEQUENCE
	//This synth exists to count along
	//It has no output and it must count
	
	const timeKeeper = new Tone.Synth();
	const timeKeeperSeq = new Tone.Sequence((time, note) => {
	timeKeeper.triggerAttackRelease(note, currentnotevalue, time); test(); trackProgress();},
	["C1"], currentnotevalue).start();	
	
	
	Tone.Transport.start();
	playingFlag = 1;
	document.getElementById("melodymakerStartButton").innerHTML="&#10073&#10073 Pause";
}}

getNumerator();
updateMeasureValue();
addMeasure();
buildDrumMachine();
buildStepSequencer();

//Settings synths to null seems to alleviate sound issues when playing for long periods of time
function initaliseSynths()
{	var kicksynth = null;	var kickseq = null;
	var hihatsynth = null; 	var hihatseq = null;
	var crashcymbalsynth = null; var crashcymbalseq = null;
	var lowtomsynth = null; var lowtomseq = null;

	var stepSynth1 = null;	var stepSeq1 = null;
	var stepSynth2 = null;	var stepSeq2 = null;
	var stepSynth3 = null;	var stepSeq3 = null;
	var stepSynth4 = null;	var stepSeq4 = null;
	var stepSynth5 = null;	var stepSeq5 = null;
	var stepSynth6 = null;	var stepSeq6 = null;
	var stepSynth7 = null;	var stepSeq7 = null;
	var stepSynth8 = null;	var stepSeq8 = null;
	
	
}