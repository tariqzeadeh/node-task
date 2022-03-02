import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /users/delete-user", () => {
  let firstUser, secondUser, requester, firstUserJwtToken, secondUserJwtToken;

  before(async () => {
    firstUser = {
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    };
    secondUser = {
      name: "Hasan Zeadeh",
      email: "Hasan@email.com",
      password: "Hasan",
      role: "User",
    };

    requester = chai.request(app).keepOpen();
    console.log("Test Started");

    firstUserJwtToken = await signUp(firstUser);
    secondUserJwtToken = await signUp(secondUser);
    // console.log(`firstUserJwtToken: ${firstUserJwtToken} , secondUserJwtToken: ${secondUserJwtToken}`)
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("DELETE /users/delete-user", () => {
    it("should DELETE a user with id (2)", async () => {
      const res = await requester
        .delete("/users/delete-user")
        .set({
          Authorization: 'Bearer ' + firstUserJwtToken 
        })
        .send({ id: 2 });
      res.should.have.status(200);
      res.body.should.be.an("object");
      res.body.should.have.property(
        "message",
        "User has been successfully deleted"
      );
    });
  });

  describe("DELETE /users", () => {
    it("should NOT DELETE any user (no such user in database)", async () => {
      const res = await requester
        .delete("/users/delete-user")
        .set({
          Authorization: `Bearer ${firstUserJwtToken}`,
        })
        .send({ id: 3 });
      res.should.have.status(404);
    });
  });
});
