function queryCache(url,cache){
    return new Promise((resolve,reject) => {
        cache.get(url, (err,result) => {
            resolve(result);
        });
    });
}

function queryAPI(url, query, cache){
    if(query) {
        return query.then((resolve, reject) => {
            //Don't cache result if it contains an error message from infura
            if(resolve){
                //TODO it would be really cool if we could implement a listener to expire cache entires on a new block
                cache.set(url,JSON.stringify(resolve),'EX',30);
            }
            else{
                throw new Error(JSON.stringify(reject));
            }
            return resolve;
        }).catch(err => {
            //console.log(err);
            return new Error(err);
        });
    } else {
        return axios.get(url).then(response => {
            //Don't cache result if it contains an error message from infura
            if(!response.data.hasOwnProperty('error') && !(response.data.hasOwnProperty('result') && response.data.result === null && typeof response.data.result === "object") ){
                //TODO it would be really cool if we could implement a listener to expire cache entires on a new block
                cache.set(url,JSON.stringify(response.data),'EX',30);
            } else {
                throw new Error(JSON.stringify(response.data.error));
            }
            return response.data;
        }).catch(err => {
            //console.log(err);
            return new Error(err);
        });
    }
};

module.exports.query = (url, query, cache) => {
    return new Promise((resolve,reject) => {
        queryCache(url,cache).then((result) => {
            if(result){
                const resultJSON = JSON.parse(result);
                resolve(resultJSON);
            }
            else{
                queryAPI(url, query, cache).then(response => {
                    resolve(response);
                }).catch(err => {
                    return new Error(err);
                });
            }
        });
    });
}

