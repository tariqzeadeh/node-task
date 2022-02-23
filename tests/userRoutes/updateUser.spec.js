import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("PUT /users/update-user/:id", () => {
  let firstUser, requester;

  before(async () => {
    firstUser = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
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

  describe("PUT /users/update-user/1", () => {
    it("should update the first name and last name for a user with the id of (1)", async () => {
      const updatedData = {
        firstName: "Tariq",
        lastName: "Hawamdeh",
        email: "Tareq@email.com",
        role: "admin",
      };
      const res = await requester.put("/users/update-user/1").send(updatedData);
      console.log(res.body);
      res.should.have.status(200);
      res.body.should.be.an("object");
      res.body.should.have.property("id", firstUser.id);
      res.body.should.have.property("firstName", updatedData.firstName);
      res.body.should.have.property("lastName", updatedData.lastName);
      res.body.should.have.property("email", updatedData.email);
      res.body.should.have.property("role", updatedData.role);
    });
  });

  describe("PUT /update-user/2", () => {
    it("should NOT GET any user (there no such user in database)", async () => {
      const res = await requester.put("/users/update-user/2");
      res.should.have.status(404);
    });
  });
});
