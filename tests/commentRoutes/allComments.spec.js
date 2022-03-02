import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { signUp } from "../helpers/auth-sign-up";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("GET /comments", () => {
  let firstUser,
    secondUser,
    firstPost,
    secondPost,
    firstComment,
    secondComment,
    requester,
    firstUserJwtToken,
    secondUserJwtToken;

  before(async () => {
    firstUserJwtToken = await signUp({
      name: "Tareq Zeadeh",
      email: "Tareq@email.com",
      password: "Tareq",
      role: "Admin",
    });
    firstUser = jwt.decode(firstUserJwtToken);

    secondUserJwtToken = await signUp({
      name: "Odai Zeadeh",
      email: "Odai@email.com",
      password: "Odai",
      role: "User",
    });
    secondUser = jwt.decode(secondUserJwtToken);

    firstPost = await postModel.create({
      userId: firstUser.id,
      body: "Hi, Im new here",
    });

    secondPost = await postModel.create({
      userId: secondUser.id,
      body: "Hallo all",
    });

    firstComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hi, your welcome",
    });

    secondComment = await commentModel.create({
      userId: secondUser.id,
      postId: firstPost.id,
      body: "Hope you enjoy with us",
    });

    requester = chai.request(app).keepOpen();
    console.log("Test Started");
  });

  after(async () => {
    await truncate(userModel);
    await truncate(postModel);
    await truncate(commentModel);
    requester.close();
    console.log("Test Ended");
  });

  describe("GET /comments", async () => {
    it("should GET all the comments in the database", async () => {
      const res = await requester.get("/comments").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });

      res.body.should.be.a("array");
      res.body.length.should.equal(2);
    });
  });

  describe("GET /comments", async () => {
    it("should return 404 code if no comments in the database", async () => {
      await truncate(commentModel);

      const res = await requester.get("/comments").set({
        Authorization: "Bearer " + firstUserJwtToken,
      });

      res.should.have.status(404);
      res.body.should.be.a("object");
      res.body.message.should.equal("No Comments Found");
    });
  });
});
