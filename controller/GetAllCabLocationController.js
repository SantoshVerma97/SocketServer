const getAllCabLocationService = require('../service/getAllCabLocationService');

module.exports.getAllCabLocationController = async(req,res) =>{
    try{
        const response = await getAllCabLocationService.GetAllCabLocationService(req,res);
        return response;
    }catch(err){
        throw err;
    }
}