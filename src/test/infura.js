process.env.NODE_ENV = 'test';
// Required dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
describe('/GET :network/view_getTransactionsByHash', () => {
    it('Should return a valid respons and the result should be "0x50"', (done) => {
        chai.request(server)
        .get('/api/infura/v1/mainnet/view_getTransactionsByHash')
        .query({params:'["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"]'})
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(parseInt("0x50"));
            done();
        });
    });
});
describe('/GET /:network/:method', () => {
    it('Should return a valid response containing the block and it should contain transactions', (done) => {
        chai.request(server)
        .get('/api/infura/v1/mainnet/eth_getBlockByHash')
        .query({params:'["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35",false]'})
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('result');
            res.body.result.should.have.property('transactions');
            done();
        });
    });
});
