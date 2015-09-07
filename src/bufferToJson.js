/**
 * Created by reharik on 8/14/15.
 */


module.exports = function(logger, JSON, buffer) {
    return function bufferToJson(item) {
        if(!buffer.Buffer.isBuffer(item)){
            logger.info('item is not a buffer, returning original item');
            return item;
        }
        logger.info('item is a buffer, parsing buffer');
        return JSON.parse(item.toString('utf8'));
    }
};
