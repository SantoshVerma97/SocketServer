const client = require('../connection/database');

module.exports.GetLocationService = async (req, res) => {
    try {
        const { vehicleNumber } = req.query;
        const rawQuery = `SELECT * FROM public.vehicle_tracker WHERE vehicle_number = '${vehicleNumber}'`;
        client.query(rawQuery, (err, rows) => {
            if (err) {
                console.error('Error executing query', err.stack);
                res.status(500).json({ status: "err", message: err });
            }
            else {
                var data = JSON.parse(JSON.stringify(rows.rows));
                res.status(200).json({ status: "success", data });
            }
        })
    } catch (err) {
        res.status(500).json({ status: "err", message: err });
    }

}