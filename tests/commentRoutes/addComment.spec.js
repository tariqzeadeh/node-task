import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("POST /comments/new-comment", () => {
  let firstUser, secondUser, firstPost, secondPost, requester;

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

  describe("POST /comments/new-comment", async () => {
    it("should POST (add) a new comment on the post with the givin id's", async () => {
      const res = await requester.post("/comments/new-comment").send({
        userId: secondUser.id,
        postId: firstPost.id,
        body: "Hi, your welcome here",
      });

      res.body.should.be.a("object");
      res.body.should.have.property("id", 1);
      res.body.should.have.property("userId", secondUser.id);
      res.body.should.have.property("postId", firstPost.id);
      res.body.should.have.property("body", "Hi, your welcome here");
    });
  });

  describe("POST /comments/new-comment", async () => {
    it("should return a 404 code if the new comment data have missing fields", async () => {
      const res = await requester.post("/comments/new-comment").send({
        userId: secondUser.id,
        postId: firstPost.id,
      });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
     
    });
  });
});
