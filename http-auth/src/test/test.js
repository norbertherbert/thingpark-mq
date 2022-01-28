
import chai from 'chai';
import chaiHttp from 'chai-http';

import { app } from '../index.js';


chai.use(chaiHttp);
chai.should();
const expect = chai.expect;


describe('lua script authentication tests:', () => {

    const requester = chai.request(app).keepOpen();
    after(() => requester.close());


    it('should authenticate super user', async () => {
        
        const response = await requester
            .post('/vmq/lua')
            .set('Content-Type', 'application/json')
            .send({
                username: process.env.MQTT_SUPER_USER,
                password: process.env.MQTT_SUPER_PASSWD
            });

        response.should.have.status(200);
        expect(response.body).to.eql({ 
            result: 'ok', 
            publish_acl: [
                { pattern: '#' }
            ],
            subscribe_acl: [
                { pattern: '#' }
            ]
        });

        // after(() => console.log(response.body));

    });


    it('should authenticate B2B user', async() => {
        
        const response = await requester
            .post('/vmq/lua')
            .set('Content-Type', 'application/json')
            .send({
                username: process.env.B2B_USERNAME,
                password: process.env.B2B_PASSWORD
            });

        response.should.have.status(200);
        expect(response.body).to.eql({
            result: 'ok',
            publish_acl: [
                { pattern: `${process.env.B2B_OPERATORID}|${process.env.B2B_SUBSCRIBERID}/#` }
            ],
            subscribe_acl: [
                { pattern: `${process.env.B2B_OPERATORID}|${process.env.B2B_SUBSCRIBERID}/#` }
            ]
        });

        // after(() => console.log(response.body));

    });


    it('should authenticate B2C user', async() => {
        
        const response = await requester
            .post('/vmq/lua')
            .set('Content-Type', 'application/json')
            .send({
                username: process.env.B2C_USERNAME,
                password: process.env.B2C_PASSWORD
            });

        response.should.have.status(200);
        expect(response.body).to.eql({
            result: 'ok',
            publish_acl: [
                { pattern: `${process.env.B2C_OPERATORID}|${process.env.B2C_SUBSCRIBERID}|${process.env.B2C_REALM}|${process.env.B2C_USERID}/#` }
            ],
            subscribe_acl: [
                { pattern: `${process.env.B2C_OPERATORID}|${process.env.B2C_SUBSCRIBERID}|${process.env.B2C_REALM}|${process.env.B2C_USERID}/#` }
            ]
        });

        // after(() => console.log(response.body));

    });

});
