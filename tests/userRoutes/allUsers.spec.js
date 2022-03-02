import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import { userModel } from "../../dataAccess/models/userModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users", () => {
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
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /users", () => {
    it("should GET all users", async () => {
      const res = await requester
        .get("/users")
        .set({ Authorization: "Bearer " + firstUserJwtToken });
      res.should.have.status(200);
      res.body.should.be.an("array");
      res.body.length.should.equal(2);
    });
  });

  describe("GET /users", () => {
    it("should NOT GET any user (empty database)", async () => {
      await truncate(userModel);
      const res = await requester.get("/users").set({ Authorization: "Bearer " + firstUserJwtToken });;
      res.should.have.status(404);
      res.body.message.should.equal('NO Users Found');
    });
  });
});
