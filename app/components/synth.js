import Tone from 'tone';

export default function(opt) {
	let poly = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
	poly.set({
		"oscillator" : {
			"type" : "sine"
		},
		"envelope" : {
			"attack" : 0.25
		},
		"volume": -15
	});
	return poly;
}