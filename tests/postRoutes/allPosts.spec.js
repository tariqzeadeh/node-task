import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users", () => {
  let firstUser, firstPost, secondPost, requester, firstUserJwtToken, user;

  before(async () => {
    firstUser = {
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    };

    firstUserJwtToken = await signUp(firstUser);
    user = jwt.decode(firstUserJwtToken);

    firstPost = await postModel.create({
      userId: user.id,
      body: "Hi, Im new here",
    });
    
    secondPost = await postModel.create({
      userId: user.id,
      body: "Hallo all",
    });

    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    await truncate(postModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /posts", async () => {
    it("should GET all posts in database", async () => {
      const res = await requester.get("/posts").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });

      res.should.have.status(200);
      res.body.should.be.a("array");
      res.body.length.should.equal(2);
      res.body[1].should.be.a("object");
      res.body[1].userId.should.equal(user.id);
      res.body[1].id.should.equal(1);
      res.body[1].body.should.equal(firstPost.body);
    });
  });
  describe("GET /posts", async () => {
    it("should NOT GET posts in database (no posts in database)", async () => {
      await truncate(postModel);
      const res = await requester.get("/posts").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });

      res.should.have.status(404);
    });
  });
});
