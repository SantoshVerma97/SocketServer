const axios = require('axios');

module.exports.GetCalculateDistanceService = async (req, res) => {
    try {
        const { coordA, coordB } = req.body;
        const apiKey = 'AIzaSyC3XA5d-1ff6W3bK_NDxqKSb05ovVtQk68';

        console.log(coordA, coordB);

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${coordA}&destinations=${coordB}&key=${apiKey}`;

        // Make the request to Google Distance Matrix API
        const response = await axios.get(url);

        let distanceText = response.data.rows[0].elements[0].distance.text;
        const duration = response.data.rows[0].elements[0].duration.text;

        // Convert distance to kilometers if necessary
        let distanceValue = response.data.rows[0].elements[0].distance.value; // This gives distance in meters
        let distanceInKm = (distanceValue / 1000).toFixed(2); // Convert meters to kilometers, rounded to 2 decimal places

        // Send the distance and duration back to the frontend
        res.status(200).json({
            distance: `${distanceInKm} km`,
            duration
        });
    } catch (err) {
        res.status(500).json({ message: 'Error calculating distance', err });
    }
};
