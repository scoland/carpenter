import $ from 'jquery';
import nexus from '../node_modules/nexusui/dist/nexusUI.js';
import Tone from 'tone';
require('./sass/main.scss');
import polySynth from './components/synth';
import midiInit from './components/midi'

nx.onload = function() {
	const state = {
		synth1: {
			octave: 0,
			detune: 0
		},
		synth2: {
			octave: 0,
			detune: 0
		}
	};

	const first = '#2C2D34';
	const second = '#E94822';
	const third = '#F2910A';
	const fourth = '#EFD510';

    ampdial.colors.accent = second;
    amp2dial.colors.fill = first;
    amp2dial.init();
    ampdial.init();

    cutoffdial.colors.accent = first;
	cutoffdial.init();

	var inputs;

	const synth = polySynth();
	const synth2 = polySynth();
	const filter = new Tone.Filter(12000, "lowpass", -24);
	const pingPong = new Tone.PingPongDelay();
	const freeverb = new Tone.Freeverb();
	const crusher = new Tone.BitCrusher(4).toMaster();
	// const dist = new Tone.Distortion(0.8).toMaster();
	const lfo = new Tone.LFO(5, 400, 4000);

	lfo.connect(filter.frequency);

	synth.connect(filter);
	synth2.connect(filter);
	filter.connect(pingPong);
	pingPong.connect(freeverb);
	freeverb.connect(crusher);

	synth.set({
    		"envelope" : {
    			"attack": .1
    		}
    	});

	const midi = midiInit(synth, synth2, cutoffdial, lforate, state);

	// No reverb to start off
	freeverb.wet.value = 0;
	pingPong.wet.value = 0;
	crusher.wet.value = 0;

	filter.frequency.value = 12000;
	

    envadsr.sliders = 4;
    envadsr.colors.accent = first;
    envadsr.init();

    verbroom.colors.accent = '#E6E6E6';
    verbroom.colors.fill = first;
    verbwet.colors.accent = '#E6E6E6';
    verbwet.colors.fill = first;
    verbroom.init();
    verbwet.init();

    pingfb.colors.fill = first;
    pingwet.colors.fill = first;
    pingfb.init();
    pingwet.init();

    lfotoggle.colors.accent = first;
    lfotoggle.init();

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

    amp2dial.set({
    	value: .75
    }, true);

    ampdial.on('*', data => {
    	synth.set({
    		"oscillator": {
    			volume: scaleRange(data.value, -40, 16)
    		}
    	})
    });

    amp2dial.on('*', data => {
    	synth2.set({
    		"oscillator": {
    			volume: scaleRange(data.value, -40, 16)
    		}
    	})
    });

    crushbits.on('*', data => {
    	crusher.bits = Math.floor(data.value * 8);
    });

    crushwet.on('*', data => {
    	crusher.wet.value = data.value;
    });

    envadsr.on('*', data => {
    	synth.set({
    		"envelope" : {
    			"attack": data.list[0],
    			"decay": data.list[1],
    			"sustain": data.list[2],
    			"release": data.list[3] * 8
    		}
    	});
    });

    verbwet.on('*', data => {
    	freeverb.wet.value = data.value;
    });

    verbroom.on('*', data => {
    	freeverb.roomSize.value = data.value;
    });

    pingfb.on('*', data => {
    	pingPong.feedback.value = data.value;
    });

    pingwet.on('*', data => {
    	pingPong.wet.value = data.value;
    });

    lforate.on('*', data => {
    	lfo.frequency.value = data.value * 10;
    })

    lfotoggle.on('*', data => {
    	if (data.value) {
    		lfo.start();
    	} else {
    		lfo.stop();
    	}
    });

    cutoffdial.on('*', data => {
    	filter.frequency.value = data.value * 12000;
    });

    $('.octave-contain').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-octave')) {
    		state.synth1.octave--;
    		$('.octave-contain .octave-num').text(state.synth1.octave);
    	} else {
    		state.synth1.octave++
    		$('.octave-contain .octave-num').text(state.synth1.octave);
    	}
    });

    $('.octave-contain-2').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-octave')) {
    		state.synth2.octave--;
    		$('.octave-contain-2 .octave-num').text(state.synth2.octave);
    	} else {
    		state.synth2.octave++
    		$('.octave-contain-2 .octave-num').text(state.synth2.octave);
    	}
    });

    $('.detune-contain').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-detune')) {
    		state.synth1.detune--;
    		$('.detune-contain .detune-num').text(state.synth1.detune);
    	} else {
    		state.synth1.detune++
    		$('.detune-contain .detune-num').text(state.synth1.detune);
    	}

    	synth.set({
    		"oscillator": {
    			"detune": state.synth1.detune
    		}
    	});
    });

    $('.detune-contain-2').on('click', 'a', function(event) {
    	if ($(this).hasClass('dec-detune')) {
    		state.synth2.detune--;
    		$('.detune-contain-2 .detune-num').text(state.synth2.detune);
    	} else {
    		state.synth2.detune++
    		$('.detune-contain-2 .detune-num').text(state.synth2.detune);
    	}

    	synth.set({
    		"oscillator": {
    			"detune": state.synth2.detune
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

    $('.waves-2').on('click', 'button', function(event) {
    	$('.waves-2 button').removeClass('active');
    	$(this).addClass('active');

    	synth2.set({
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

    $('.osc2-up').click(function(test) {
    	$('.osc-2-contain').removeClass('slide-down');
    	$('.osc-2-contain').addClass('slide-up');
    });

    $('.osc1-up').click(function(test) {
    	$('.osc-2-contain').removeClass('slide-up');
    	$('.osc-2-contain').addClass('slide-down');
    })

};

var scaleRange = function(input, min, max) {
	let xMin = min;
	let xMax = max;

	let yMin = 0;
	let yMax = 1;

	let percent = (input - yMin) / (yMax - yMin);
	return percent * (xMax - xMin) + xMin;
};
