/**
 * DIGIPIN Encoder and Decoder Library
 * Developed by India Post, Department of Posts
 * Released under an open-source license for public use
 *
 * This module contains two main functions:
 *  - getDigiPin(lat, lon): Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 *  - getLatLngFromDigiPin(digiPin): Decodes a DIGIPIN back into its central latitude & longitude
 */

const DIGIPIN_GRID = [
    ['F', 'C', '9', '8'],
    ['J', '3', '2', '7'],
    ['K', '4', '5', '6'],
    ['L', 'M', 'P', 'T']
  ];
  
  const BOUNDS = {
    minLat: 2.5,
    maxLat: 38.5,
    minLon: 63.5,
    maxLon: 99.5
  };
  
  function getDigiPin(lat, lon) {
    if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) throw new Error('Latitude out of range');
    if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) throw new Error('Longitude out of range');
  
    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;
  
    let digiPin = '';
  
    for (let level = 1; level <= 10; level++) {
      const latDiv = (maxLat - minLat) / 4;
      const lonDiv = (maxLon - minLon) / 4;
  
      // REVERSED row logic (to match original)
      let row = 3 - Math.floor((lat - minLat) / latDiv);
      let col = Math.floor((lon - minLon) / lonDiv);
  
      row = Math.max(0, Math.min(row, 3));
      col = Math.max(0, Math.min(col, 3));
  
      digiPin += DIGIPIN_GRID[row][col];
  
      if (level === 3 || level === 6) digiPin += '-';
  
      // Update bounds (reverse logic for row)
      maxLat = minLat + latDiv * (4 - row);
      minLat = minLat + latDiv * (3 - row);
  
      minLon = minLon + lonDiv * col;
      maxLon = minLon + lonDiv;
    }
  
    return digiPin;
  }
  
  
  function getLatLngFromDigiPin(digiPin) {
/**
* Permit users to append information to the DIGIPIN.
* Such characters could be used to include extra information over the DIGIPIN.
* An example would be inclusion of flat number in a multi apartment building.
* Instead of insisting on pre-processing to remove such user modifications,
* the function should accept such strings which may include characters not part of DIGIPIN and which may be longer than 10 digits.
* and retrieve valid DIGIPIN from it.

* Thus, even if I supply a DIGIPIN with user appended information (for example, M377C9624J.12),
* the function would use only the valid DIGIPIN (M377C9624J from the example).
*/

// define characters to exclude
    const regex = /[^23456789CFJKLMPT]/g;
// remove unallowed characters and get the first ten valid characters
    vDigiPin = vDigiPin.toUpperCase().replace(regex, '').slice(0,10)
// warn if length less than 10
    if (vDigiPin.length < 10)
        console.warn("truncated DIGIPIN")
// error if no valid characters
    if (vDigiPin.length == 0) {
        return "Invalid DIGIPIN";
        }
   
    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;
  
    for (let i = 0; i < 10; i++) {
      const char = pin[i];
      let found = false;
      let ri = -1, ci = -1;
  
      // Locate character in DIGIPIN grid
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (DIGIPIN_GRID[r][c] === char) {
            ri = r;
            ci = c;
            found = true;
            break;
          }
        }
        if (found) break;
      }
  
      if (!found) throw new Error('Invalid character in DIGIPIN');
  
      const latDiv = (maxLat - minLat) / 4;
      const lonDiv = (maxLon - minLon) / 4;
  
      const lat1 = maxLat - latDiv * (ri + 1);
      const lat2 = maxLat - latDiv * ri;
      const lon1 = minLon + lonDiv * ci;
      const lon2 = minLon + lonDiv * (ci + 1);
  
      // Update bounding box for next level
      minLat = lat1;
      maxLat = lat2;
      minLon = lon1;
      maxLon = lon2;
    }
  
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
  
    return {
      latitude: centerLat.toFixed(6),
      longitude: centerLon.toFixed(6)
    };
  }
  
  
  if (typeof module !== 'undefined') module.exports = { getDigiPin, getLatLngFromDigiPin };
