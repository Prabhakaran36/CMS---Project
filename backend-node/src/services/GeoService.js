const axios = require("axios");

class GeoService {
  constructor() {
    this.NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    this.USER_AGENT = "MyCompanyCMSApp/1.0 (contact@mycompany.com)";
  }

  /**
   * Get coordinates for an address.
   * @param {string} address
   * @returns {Promise<number[]>} [latitude, longitude]
   */
  async getCoordinates(address) {
    if (!address || !address.trim()) {
      throw new Error("Address cannot be null or blank");
    }

    try {
      let coords = await this.fetchCoordinates(address);
      if (coords) return coords;

      // Fallback: shorten the address iteratively
      let parts = address.split(",");
      while (parts.length > 1) {
        parts.pop(); // remove last part
        const shortened = parts.join(",").trim();
        coords = await this.fetchCoordinates(shortened);
        if (coords) return coords;
      }

      throw new Error(`No coordinates found for address: ${address}`);
    } catch (err) {
      console.error(`Error fetching coordinates for "${address}":`, err.message);
      throw err;
    }
  }

  async fetchCoordinates(address) {
    const url = `${this.NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: { "User-Agent": this.USER_AGENT },
    });

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    const location = response.data[0];
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    console.log(`Coordinates for "${address}" -> lat: ${lat}, lon: ${lon}`);
    return [lat, lon];
  }
}

module.exports = new GeoService();
