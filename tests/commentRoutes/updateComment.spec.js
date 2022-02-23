import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";
import { commentModel } from "../../dataAccess/models/commentModel";

chai.use(chaiHttp);
chai.should();

describe("PUT /comments/update-comment", () => {
  let firstUser, secondUser, firstPost, secondPost, firstComment, requester;

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
      body: "Hi",
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

  describe("PUT /comments/update-comment", async () => {
    it("should PUT (update) a comment on the post with the givin id", async () => {
      const res = await requester.put("/comments/update-comment").send({
        id: firstComment.id,
        userId: secondUser.id,
        postId: firstPost.id,
        body: "Hi, your welcome here",
      });
    });
  });

  describe("PUT /comments/update-comment", async () => {
    it("should return a 404 code if the updated comment data have missing fields", async () => {
      const res = await requester.put("/comments/update-comment").send({
        userId: secondUser.id,
        postId: firstPost.id,
      });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
    });

    it("should return a 404 code if no comment with the givin id", async () => {
      const res = await requester.put("/comments/update-comment").send({
        id: 2,
        userId: secondUser.id,
        postId: firstPost.id,
        body: "hi , how are you",
      });

      res.should.have.status(404);
      res.body.message.should.equal("Comment Not Found");
    });
  });
});
