/**
 * Created by sunlong on 16/7/13.
 */
class Result{
    constructor(data="", success=true){
        if(success){
            this.data = data;
        }else{
            this.msg = data;
        }
        this.success = success;
    }
}

module.exports = Result;