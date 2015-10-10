/**
 * Created by reharik on 8/14/15.
 */


module.exports = function(logger, JSON, buffer) {
    return function bufferToJson(item) {
        if(buffer.Buffer.isBuffer(item)){
            logger.info('item is a buffer, parsing buffer');
            console.log('buffer to parse')
            console.log(item.toString())
            return JSON.parse(item.toString('utf8'));
        }
        logger.info('item is not a buffer, returning original item');
        return item;

    }
};
