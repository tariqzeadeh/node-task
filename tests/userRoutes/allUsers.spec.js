import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users", () => {
  let firstUser, secondUser, requester;

  before(async () => {
    firstUser = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });
    secondUser = await userModel.create({
      firstName: "Hasan",
      lastName: "Zeadeh",
      email: "Hasan@email.com",
      role: "admin",
    });

    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /users", () => {
     it('should GET all users',async () =>{
        const res = await requester.get('/users');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.equal(2);    
     })

  });

  describe("GET /users", () => {
    it('should NOT GET any user (wrong url)',async () =>{
       const res = await requester.get('/user');
       res.should.have.status(404);    
    })

 });
});
