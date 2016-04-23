import $ from 'jquery';

export default function(synth, synth2, state) {
  const keyNotes = {
          /*a*/ 65: 261.626, // c
          /*w*/ 87: 277.183, // c#
          /*s*/ 83: 293.665, // d
          /*e*/ 69: 311.127, // d#
          /*d*/ 68: 329.628, // e
          /*f*/ 70: 349.228, // f
          /*t*/ 84: 369.994, // f#
          /*g*/ 71: 391.995, // g
          /*y*/ 89: 415.305, // g#
          /*h*/ 72: 440.000, // a
          /*u*/ 85: 466.164, // a#
          /*j*/ 74: 493.883, // b
          /*k*/ 75: 523.251, // c
          /*o*/ 79: 554.365, // c#
          /*l*/ 76: 587.330, // d
          /*p*/ 80: 622.254, // d#
          /*;*/ 186: 659.255, // e
          /*;*/ 59: 659.255, // e
          /*,*/ 222: 698.456, // f
          /*]*/ 221: 739.989, // f#
          /*enter*/ 13: 783.991 // g
      };

    const currentKeys = {};

    $(window).keydown(function(e) {
        let keyCode = e.keyCode;
        if (!currentKeys[keyCode]) {
            currentKeys[keyCode] = true;
            let hz = keyNotes[keyCode];
            if (hz) {
              e.preventDefault();
              synth.triggerAttack(hzToOctave(hz, state.synth1.octave));
              synth2.triggerAttack(hzToOctave(hz, state.synth2.octave));
            }
        }
    }).keyup(function(e) {
        let keyCode = e.keyCode;
        let hz = keyNotes[keyCode];
        synth.triggerRelease(hzToOctave(hz, state.synth1.octave));
        synth2.triggerRelease(hzToOctave(hz, state.synth2.octave));
        delete currentKeys[e.keyCode];
    });

    function hzToOctave(hz, octave) {
      return hz * Math.pow(2, octave);
    }

}