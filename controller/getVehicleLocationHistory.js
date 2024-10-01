const GetVehicleLocationHistoryService = require('../service/getVehicleLocationHistory');

module.exports.GetVehicleLocationHistoryController = async (req, res) => {
    try {
        const response = await GetVehicleLocationHistoryService.GetVehicleLocationHistoryService(req, res);
        return response;
    } catch (err) {
        return err;
    }
}