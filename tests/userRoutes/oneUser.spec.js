import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users/user/:id", () => {
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
  
    describe("GET /users/user/1", () => {
       it('should get a user with the id of (1) from database',async () =>{
          const res = await requester.get('/users/user/1');
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property("id", firstUser.id);    
          res.body.should.have.property('firstName', firstUser.firstName);    
          res.body.should.have.property('lastName', firstUser.lastName);    
          res.body.should.have.property('email', firstUser.email);    
          res.body.should.have.property('role', firstUser.role);    
       })
  
    });
  
    describe("GET /users/user/3", () => {
      it('should NOT GET any user (there no such user in database)',async () =>{
         const res = await requester.get('/users/user/3');
         res.should.have.status(404);      
      })
  
   });
  });
  