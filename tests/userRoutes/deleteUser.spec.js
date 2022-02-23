import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /users/delete-user/:id", () => {
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

  describe("DELETE /users/delete-user/1", () => {
     it('should DELETE a user with id (1)',async () =>{
        const res = await requester.delete('/users/delete-user/1');
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property("message","User has been successfully deleted")    
     })

  });

  describe("DELETE /users", () => {
    it('should NOT DELETE any user (no such user in database)',async () =>{
       const res = await requester.delete('/users/delete-user/3');;
       res.should.have.status(404);    
    })

 });
});
