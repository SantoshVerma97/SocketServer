const GetCalculateDistanceService = require('../service/getCalculateDistanceService');

module.exports.GetCalculateDistanceController = async(req, res) =>{
    try{
        const response = await GetCalculateDistanceService.GetCalculateDistanceService(req, res);
        return response;
    }catch(err){
        throw err;
    }
}