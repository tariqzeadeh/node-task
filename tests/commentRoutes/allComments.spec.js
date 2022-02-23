import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
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
    requester;

  before(async () => {
    firstUser = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    secondUser = await userModel.create({
      firstName: "Odai",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

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
      const res = await requester.get("/comments");

      res.body.should.be.a("array");
      res.body.length.should.equal(2);
    });
  });

  describe("GET /comments", async () => {
    it("should return 404 code if no comments in the database", async () => {
      await truncate(commentModel);

      const res = await requester.get("/comments");

      res.should.have.status(404);
      res.body.should.be.a("object");
      res.body.message.should.equal("No Comments Found");
      
    });
  });
});
