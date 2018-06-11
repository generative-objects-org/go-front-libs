/* eslint-disable */
/*!
   Adapted by T. Villaren from Math.uuid.js (v1.4)
   http://www.broofa.com
   mailto:robert@broofa.com

   Copyright (c) 2010 Robert Kieffer

   Initially dual licensed under the MIT and GPL licenses.
   Used under the MIT License
*/

import MersenneTwister from 'MersenneTwister';

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

// Initialize a new "random" number generator for the current session
// We use MersenneTwister, which seems to be faster and safer than the browser's default 
// https://medium.com/@betable/tifu-by-using-math-random-f1c308c4fd9d
let m = new MersenneTwister();

// This method generates a version 4 UUID (see https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random))
export function newGuid() {

    // Math.uuid = function () {
    var chars = CHARS, uuid = new Array(36), rnd = 0, r;
    for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            uuid[i] = '-';
        } else if (i == 14) {
            uuid[i] = '4'; // Version 4
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (m.random() * 0x1000000) | 0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
    // };
}

export function isGuid(data) {
    var reg = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return data === EMPTY_GUID || reg.test(data);
}

export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';