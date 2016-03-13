import $ from 'jquery';
import nexus from '../node_modules/nexusui/dist/nexusUI.js';
import Tone from 'tone';
require('./sass/main.scss');
import polySynth from './components/synth';
import midiInit from './components/midi'

nx.onload = function() {
	var inputs;

	const synth = polySynth();
	const filter = new Tone.Filter().toMaster();
	synth.connect(filter);
	const midi = midiInit(synth, dial1);
	
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

    dial1.colors.fill = '#ffffff';
    dial1.draw();

    dial1.on('*', data => {
    	filter.frequency.value = data.value * 12000 + 80;
    })

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
