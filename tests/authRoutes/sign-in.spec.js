import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import { userModel } from "../../dataAccess/models/userModel";
import jwt from "jsonwebtoken";

chai.use(chaiHttp);
chai.should();

describe("POST /auth/sign-in", () => {
  let user, loggingUser, requester;

  before(async () => {
    user = {
      name: "Tareq Hasan",
      email: "Tareq.Hasan@email.com",
      password: "Tareq",
      role: "Admin",
    };
    await signUp(user);

    loggingUser = {
      email: "Tareq.Hasan@email.com",
      password: "Tareq",
    };
    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    requester.close();
    console.log("Test Ended");
  });
  user;
  describe("POST /auth/sign-in", async () => {
    it("Its should signIn a user and response with an JWT accessToken ", async () => {
      const res = await requester.post("/auth/sign-in").send(loggingUser);

      res.should.have.status(200);
      const decodedUserObj = jwt.decode(res.body.accessToken);

      decodedUserObj.should.be.a("object");
      decodedUserObj.should.have.property("name", user.name);
      decodedUserObj.should.have.property("email", user.email);
      decodedUserObj.should.have.property("role", user.role);
    });
  });

  describe("POST /auth/sign-in", async () => {
    it("Its should return 400 code if a user trying to signIn with email not existing in database (the user is not in database)", async () => {
      const u = {
        email: "Tareq@email.com",
        password: "Tareq",
      };

      const res = await requester.post("/auth/sign-in").send(u);
      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property(
        "message",
        "User Not Found, Check Your Email"
      );
    });
  });

  describe("POST /auth/sign-in", async () => {
    it("Its should return 403 code if a user trying to signIn with wrong password", async () => {
      const u = {
        email: "Tareq.Hasan@email.com",
        password: "Tare",
      };

      const res = await requester.post("/auth/sign-in").send(u);
      res.should.have.status(403);
      res.body.should.be.a("object");
      res.body.should.have.property("message", "Wrong Password");
    });
  });
});
