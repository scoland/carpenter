export default function(synth, cutoff, state) {

	// Initialize midi config
	var inputs, input;
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

	            synth.triggerAttack(_mtof(e.data[1], state));
	            break;
	        case 141:
	            synth.triggerRelease(_mtof(e.data[1], state));
	            break;
	        case 189:
	        	cutoff.set({
	        		value: e.data[2] / 127
	        	}, true);
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