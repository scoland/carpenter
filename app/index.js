import $ from 'jquery';
import nexus from '../node_modules/nexusui/dist/nexusUI.js';
import Tone from 'tone';
require('./sass/main.scss');
import polySynth from './components/synth';
import midiInit from './components/midi'

nx.onload = function() {
	var inputs;

	const synth = polySynth();
	console.log(synth);
	const midi = midiInit(synth);

	select1.choices = ["sine", "square", "triangle", "sawtooth", "pwm", "pulse"];
	select1.init();
	
    nx.colorize("accent", "#1ac");

    multislider1.sliders = 4;
    multislider1.init();

    multislider1.on('*', (data) => {
    	synth.set({
    		"envelope" : {
    			"attack": data.list[0] * 8,
    			"decay": data.list[1] * 10,
    			"sustain": data.list[2],
    			"release": data.list[3] * 10
    		}
    	});
    });

    select1.on('*', function(data) {
    	synth.oscillator.type = data.text;
    });

    $('.waves').on('click', 'button', function(event) {
    	$('.waves button').removeClass('active');
    	$(this).addClass('active');

    	synth.set({
    		"oscillator" : {
    			"type" : $(this).data('wave')
    		}
    	});
    });

};
