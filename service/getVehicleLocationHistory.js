const client = require('../connection/database');

module.exports.GetVehicleLocationHistoryService = async (req, res) => {
    try {
        const { vehicleNumber } = req.query;
        const rawQuery = `SELECT * FROM public.vehicle_tracker_archive WHERE vehicle_number = '${vehicleNumber}'`;
        client.query(rawQuery, (err, rows) => {
            if (err) {
                res.status(500).json({ err });
            }
            else {
                var data = JSON.parse(JSON.stringify(rows.rows));
                res.status(200).json({ status: "success", data });
            }
        })
    } catch (err) {
        res.status(500).json({ err });
    }
}