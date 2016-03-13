import Tone from 'tone';

export default function(opt) {
	let poly = new Tone.PolySynth(6, Tone.SimpleSynth);
	poly.set({
		"oscillator" : {
			"type" : "sine"
		},
	});
	return poly;
}