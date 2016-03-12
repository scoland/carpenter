export default function(synth) {

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
	            console.log('Note on, note: ', _mtof(e.data[1]));
	            synth.triggerAttack(_mtof(e.data[1]));
	            break;
	        case 141:
	            console.log('Note off, note: ', _mtof(e.data[1]));
	            synth.triggerRelease(_mtof(e.data[1]));
	            break;
	    }
	}

	// Convert midi note to frequency
	function _mtof(note) {
	    return 440 * Math.pow(2, (note - 69) / 12);
	}
}