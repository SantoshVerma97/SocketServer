const UpdateLocationService = require('../service/UpdateLocationService');

module.exports.UpdateLocationController = async(req,res) =>{
    try{
        const response = await UpdateLocationService.UpdateLocation(req,res);
        return response;
    }catch(err){
        throw err;
    }
}