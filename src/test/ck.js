process.env.NODE_ENV = 'test';
// Required dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
describe('/GET :network/kitties/:id/:block', () => {
    it('Should return a valid response object with genes: "457849305451122794903585758459448676010482976302081674570064376741933484".', (done) => {
        chai.request(server)
        .get('/api/cached-kitties/v1/ropsten/kitties/12/6303417')
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.genes.should.be.eql("457849305451122794903585758459448676010482976302081674570064376741933484");
            done();
        });
    });
});
describe('/GET :network/kitties/:id', () => {
    it('Should return a valid response object with genes: "457849305451122794903585758459448676010482976302081674570064376741933484"', (done) => {
        chai.request(server)
        .get('/api/cached-kitties/v1/ropsten/kitties/12')
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.genes.should.be.eql("457849305451122794903585758459448676010482976302081674570064376741933484");
            done();
        });
    });
});
describe('/GET /:network/getKittiesSoldByBlock/:fromBlock/:toBlock', () => {
    it('Should return a valid response array of length 1 and returnValue.winner:"0xFAC9991178a0dE67dAa90c104AD4e722BAbea035"', (done) => {
        chai.request(server)
        .get('/api/cached-kitties/v1/ropsten/getKittiesSoldByBlock/6303970/6303973')
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            res.body[0].should.have.property('returnValues');
            res.body[0].returnValues.should.have.property('winner');
            res.body[0].returnValues.winner.should.be.eql('0xFAC9991178a0dE67dAa90c104AD4e722BAbea035');
            done();
        });
    });
});
