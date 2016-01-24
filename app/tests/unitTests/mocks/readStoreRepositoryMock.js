/**
 * Created by parallels on 9/7/15.
 */
module.exports = function(_fantasy){
    return {
        getById(id,table){
            return {};
        },

        save(table, document, id){
        },

        checkIdempotency(originalPosition, eventHandlerName){
            return _fantasy.Future((rej, ret)=> {
                    ret({isIdempotent:true});
            });
        },

        recordEventProcessed(originalPosition, eventHandlerName){
            return _fantasy.Future((rej, ret)=> {
                    ret('Success');
            });
        }
    }
};
