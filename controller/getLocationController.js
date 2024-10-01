const GetLocationService = require('../service/getLocationService');

module.exports.GetLocationController = async(req,res) =>{
    try{
        const response = await GetLocationService.GetLocationService(req,res);
        return response;
    }catch(err){
        throw err;
    }
}