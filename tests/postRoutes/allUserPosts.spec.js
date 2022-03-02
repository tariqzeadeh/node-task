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

describe("GET /users/all-user-post", () => {
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

  describe("GET /posts/all-user-post", async () => {
    it("should GET a post with the id (1) in database", async () => {
      const res = await requester
        .get("/posts/all-user-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: 1 });

      res.should.have.status(200);
      res.body.should.be.a("array");
      res.body.length.should.equal(2);
      res.body[1].userId.should.equal(user.id);
      res.body[1].id.should.equal(1);
      res.body[1].body.should.equal(firstPost.body);
    });
  });

  describe("GET /posts/all-user-post", async () => {
    it("should return 404 code with user id is not found in the database", async () => {
      const res = await requester
        .get("/posts/all-user-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ userId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code if the user do not have posts", async () => {
      await truncate(postModel);

      const res = await requester
        .get("/posts/all-user-post")
        .set({
          Authorization: "Bearer " + firstUserJwtToken,
        })
        .send({ id: 3, userId: 1 });

      res.should.have.status(404);
      res.body.message.should.equal("The user dont have posts");
    });
  });
});
