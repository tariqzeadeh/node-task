import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("PUT /users/update-user", () => {
  let firstUser, requester, firstUserJwtToken;

  before(async () => {
    firstUser = {
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    };

    requester = chai.request(app).keepOpen();
    console.log("Test Started");

    firstUserJwtToken = await signUp(firstUser);
    // console.log(`firstUserJwtToken: ${firstUserJwtToken}`);
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("PUT /users/update-user", () => {
    it("should update the first name and last name for a user with the id of (1)", async () => {
      const user = jwt.decode(firstUserJwtToken);
      const updatedData = {
        id: user.id,
        name: "Tariq Hawamdeh",
      };
      const res = await requester
        .put("/users/update-user")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send(updatedData);
      console.log(res.body);
      res.should.have.status(200);
      res.body.should.be.an("object");
      res.body.should.have.property("id", user.id);
      res.body.should.have.property("name", updatedData.name);
      res.body.should.have.property("email", user.email);
      res.body.should.have.property("role", user.role);
    });
  });

  describe("PUT /update-user", () => {
    it("should NOT GET any user (there no such user in database)", async () => {
      const res = await requester
        .put("/users/update-user")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ id: 2 });
      res.should.have.status(404);
    });
  });
});
