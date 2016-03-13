import $ from 'jquery';
import nexus from '../node_modules/nexusui/dist/nexusUI.js';
import Tone from 'tone';
require('./sass/main.scss');
import polySynth from './components/synth';
import midiInit from './components/midi'

nx.onload = function() {
	var inputs;

	const synth = polySynth();
	const filter = new Tone.Filter(12000, "lowpass", -24);
	const freeverb = new Tone.Freeverb().toMaster();
	const lfo = new Tone.LFO(5, 400, 4000);

	lfo.connect(filter.frequency);
	synth.connect(filter);
	filter.connect(freeverb);

	const midi = midiInit(synth, dial1);

	// No reverb to start off
	freeverb.wet.value = 0;

	filter.frequency.value = 12000;
	
    nx.colorize("accent", "#1ac");

    multislider1.sliders = 4;
    multislider1.init();

    multislider1.set({
	        		0: 0.005,
	        		1: 0.1,
	        		2: 0.3,
	        		3: 1 / 8
	        	});

    dial1.set({
    	value: 1
    }, true);

    dial2.set({
    	value: .7
    });

    dial4.set({
    	value: .5
    });

    multislider1.on('*', (data) => {
    	synth.set({
    		"envelope" : {
    			"attack": data.list[0],
    			"decay": data.list[1],
    			"sustain": data.list[2],
    			"release": data.list[3] * 8
    		}
    	});
    });

    dial1.colors.fill = '#ffffff';
    dial1.draw();

    dial1.on('*', data => {
    	filter.frequency.value = data.value * 12000;
    });

    dial2.on('*', data => {
    	freeverb.roomSize.value = data.value;
    });

    dial3.on('*', data => {
    	freeverb.wet.value = data.value;
    });

    dial4.on('*', data => {
    	lfo.frequency.value = data.value * 10;
    })

    toggle1.on('*', data => {
    	if (data.value) {
    		lfo.start();
    	} else {
    		lfo.stop();
    	}
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
