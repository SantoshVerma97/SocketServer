const client = require('../connection/database');

module.exports.GetTripMemberService = async(req,res) =>{
    try{
        const {tripId} = req.query;
        const rawQuery = `SELECT t.id as tripId,
                            t.office_id as officeId,
                            o.geo_code as officeGeoCode,
                            e.*
                            FROM public.trips t
                            JOIN employees e 
                            ON e.email = ANY(string_to_array(t.emp_ids, ','))
                            Join client_office o
                            ON t.office_id = o.office_id
                            WHERE t.id = ${tripId};`
        client.query(rawQuery, (err, rows)=>{
            if(err){
                console.error('Error executing query', err.stack);
                res.status(500).json({ status: "err", message: err });
            }else{
                var data = JSON.parse(JSON.stringify(rows.rows));
                res.status(200).json({ status: "success", data });
            }
        })
    }catch(err){
        res.status(500).json({ status: "err", message: err });
    }
}