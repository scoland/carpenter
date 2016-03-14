import $ from 'jquery';
import nexus from '../node_modules/nexusui/dist/nexusUI.js';
import Tone from 'tone';
require('./sass/main.scss');
import polySynth from './components/synth';
import midiInit from './components/midi'

nx.onload = function() {
	const state = {
		octave: 0,
		detune: 0
	};

	const first = '#2C2D34';
	const second = '#E94822';
	const third = '#F2910A';
	const fourth = '#EFD510';

    ampdial.colors.accent = second;
    ampdial.init();

    cutoffdial.colors.accent = first;
	cutoffdial.init();

	var inputs;

	const synth = polySynth();
	const filter = new Tone.Filter(12000, "lowpass", -24);
	const freeverb = new Tone.Freeverb();
	const dist = new Tone.Distortion(0.8).toMaster();
	const lfo = new Tone.LFO(5, 400, 4000);

	lfo.connect(filter.frequency);

	synth.connect(filter);
	filter.connect(freeverb);
	freeverb.connect(dist);

	synth.set({
    		"envelope" : {
    			"attack": .1
    		}
    	});

	const midi = midiInit(synth, cutoffdial, state);

	// No reverb to start off
	freeverb.wet.value = 0;

	filter.frequency.value = 12000;
	

    envadsr.sliders = 4;
    envadsr.colors.accent = first;
    envadsr.init();

    lfotoggle.colors.accent = second;
    lfotoggle.init();

    verbtoggle.colors.accent = first;

    envadsr.set({
	        		0: 0.1,
	        		1: 0.1,
	        		2: 0.3,
	        		3: 1 / 8
	        	});
   	cutoffdial.set({
   	    	value: 1
   	    });

    ampdial.set({
    	value: .75
    }, true);

    ampdial.on('*', data => {
    	synth.set({
    		"oscillator": {
    			volume: scaleRange(data.value, -40, 16)
    		}
    	})
    });

 //    dial2.set({
 //    	value: .7
 //    });

 //    dial4.set({
 //    	value: .5
 //    });

    envadsr.on('*', (data) => {
    	synth.set({
    		"envelope" : {
    			"attack": data.list[0],
    			"decay": data.list[1],
    			"sustain": data.list[2],
    			"release": data.list[3] * 8
    		}
    	});
    });

 //    dial1.colors.fill = '#ffffff';
 //    dial1.draw();


 //    dial2.on('*', data => {
 //    	freeverb.roomSize.value = data.value;
 //    });

 //    dial3.on('*', data => {
 //    	freeverb.wet.value = data.value;
 //    });

 //    dial4.on('*', data => {
 //    	lfo.frequency.value = data.value * 10;
 //    })

    // toggle1.on('*', data => {
    // 	if (data.value) {
    // 		lfo.start();
    // 	} else {
    // 		lfo.stop();
    // 	}
    // });

    cutoffdial.on('*', data => {
    	console.log(filter.frequency.value);
    	filter.frequency.value = data.value * 12000;
    });

    $('.octave-contain').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-octave')) {
    		state.octave--;
    		$('.octave-num').text(state.octave);
    	} else {
    		state.octave++
    		$('.octave-num').text(state.octave);
    	}
    });

    $('.detune-contain').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-detune')) {
    		state.detune--;
    		$('.detune-num').text(state.detune);
    	} else {
    		state.detune++
    		$('.detune-num').text(state.detune);
    	}

    	synth.set({
    		"oscillator": {
    			"detune": state.detune
    		}
    	});
    });

    $('.waves').on('click', 'button', function(event) {
    	$('.waves button').removeClass('active');
    	$(this).addClass('active');

    	synth.set({
    		"oscillator": {
    			"type": $(this).data('wave')
    		}
    	})
    });

    $('.filters').on('click', 'button', function(event) {
    	$('.filters button').removeClass('active');
    	$(this).addClass('active');

    	filter.type = $(this).data('filter');
    });

};

var scaleRange = function(input, min, max) {
	let xMin = min;
	let xMax = max;

	let yMin = 0;
	let yMax = 1;

	let percent = (input - yMin) / (yMax - yMin);
	return percent * (xMax - xMin) + xMin;
};
