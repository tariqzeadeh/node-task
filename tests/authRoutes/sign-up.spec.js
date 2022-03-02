import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import jwt from "jsonwebtoken";

chai.use(chaiHttp);
chai.should();

describe("POST /auth/sign-up", () => {
  let user, requester;

  before(async () => {
    user = {
      name: "Tareq Hasan",
      email: "Tareq.Hasan@email.com",
      password: "Tareq",
      role: "Admin",
    };
    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("POST /auth/sign-up", async () => {
    it("Its should signUp a user and response with an JWT accessToken ", async () => {
      const res = await requester.post("/auth/sign-up").send(user);

      res.should.have.status(201);
      const decodedUserObj = jwt.decode(res.body.accessToken);

      decodedUserObj.should.be.a("object");
      decodedUserObj.should.have.property("name", user.name);
      decodedUserObj.should.have.property("email", user.email);
      decodedUserObj.should.have.property("role", user.role);
    });
  });

  describe("POST /auth/sign-up", async () => {
    it("Its should return 400 code if a user trying to signUp with existing email ", async () => {
      const res = await requester.post("/auth/sign-up").send(user);

      res.should.have.status(400);

      res.body.should.be.a("object");
      res.body.should.have.property(
        "message",
        "This Email Is Already Used"
      );
    });
  });
});
