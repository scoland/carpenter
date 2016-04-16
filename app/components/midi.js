export default function(synth, synth2, cutoff, lfo, verb, ping, state) {

	// Initialize midi config
	let inputs, input;
	navigator.requestMIDIAccess()
		.then(function(midi) {
			inputs = midi.inputs.values();
			for (input = inputs.next(); input && !input.done; input = inputs.next()) {
	            input.value.onmidimessage = onmidimessage;
	        }
		})
		.then(null, console.error.bind(console))

	function onmidimessage(e) {
	    /**
	    * e.data is an array
	    * e.data[0] = on (157) / off (141) / detune (224)
	    * e.data[1] = midi note
	    * e.data[2] = velocity || detune
	    */
	    switch(e.data[0]) {
	        case 157:
	            synth.triggerAttack(_mtof(e.data[1], state.synth1));
	            synth2.triggerAttack(_mtof(e.data[1], state.synth2));
	            break;
	        case 141:
	            synth.triggerRelease(_mtof(e.data[1], state.synth1));
	            synth2.triggerRelease(_mtof(e.data[1], state.synth2));
	            break;
	        case 189:
	        	// For the knobs on Akai MPK Mini
	        	if (e.data[1] === 1) {
		        	cutoff.set({
		        		value: e.data[2] / 127
		        	}, true);
	        	}
	        	if (e.data[1] === 2) {
	        		lfo.set({
		        		value: e.data[2] / 127
		        	}, true);
	        	}
	        	if (e.data[1] === 3) {
	        		verb.set({
		        		value: e.data[2] / 127
		        	}, true);
	        	}
	        	if (e.data[1] === 4) {
	        		ping.set({
		        		value: e.data[2] / 127
		        	}, true);
	        	}
	        	if (e.data[1] === 5) {
	        		ping.set({
		        		value: e.data[2] / 127
		        	}, true);
	        	}
		        break;
	    }
	}

	// Convert midi note to frequency
	function _mtof(note, state) {
	    let hz = 440 * Math.pow(2, (note - 69) / 12);
	    hz = hz * Math.pow(2, state.octave);
	    return hz;
	}
}