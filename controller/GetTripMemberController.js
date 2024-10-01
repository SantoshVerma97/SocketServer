const GetTripMemberService = require('../service/getTripMemberService');

module.exports.GetTripMemberController = async (req, res) => {
    try {
        const response = await GetTripMemberService.GetTripMemberService(req, res);
        return response;
    } catch (err) {
        return err;
    }
}