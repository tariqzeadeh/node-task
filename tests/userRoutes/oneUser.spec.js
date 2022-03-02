import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users/user", () => {
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
    // console.log(
    //   `firstUserJwtToken: ${firstUserJwtToken} , secondUserJwtToken: ${secondUserJwtToken}`
    // );
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /users/user", () => {
    it("should get a user with the id of (1) from database", async () => {
      const res = await requester.get("/users/user/1").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });
      const user = jwt.decode(firstUserJwtToken);
      res.should.have.status(200);
      res.body.should.be.an("object");
      res.body.should.have.property("id", user.id);
      res.body.should.have.property("name", user.name);
      res.body.should.have.property("email", user.email);
      res.body.should.have.property("role", user.role);
    });
  });

  describe("GET /users/user", () => {
    it("should NOT GET any user (there no such user in database)", async () => {
      const res = await requester.get("/users/user/3").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });
      res.should.have.status(404);
    });
  });
});
