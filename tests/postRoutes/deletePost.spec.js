import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /posts/delete-post", () => {
  let user, firstPost, secondPost, requester;

  before(async () => {
    user = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    firstPost = await postModel.create({
      userId: user.id,
      body: "Hi all",
    });

    secondPost = await postModel.create({
      userId: user.id,
      body: "Hallo...",
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

  describe("DELETE /posts/delete-post", async () => {
    it("should DELETE a post for the id (2) and userId (1)", async () => {
        
      const res = await requester
        .delete("/posts/delete-post")
        .send({ id: secondPost.id, userId: user.id });

      res.should.have.status(200);
      res.body.message.should.equal("Post successfully deleted");
    });
  });

  describe("DELETE /posts/delete-post", async () => {
    it("should return 404 code if the post is not found in the database", async () => {

      const res = await requester
        .delete("/posts/delete-post")
        .send({ id: 3, userId: user.id });

      res.should.have.status(404);
      res.body.message.should.equal("Post Not Found");
    });

    it("should return 404 code if the user is not found in the database", async () => {

      const res = await requester
        .delete("/posts/delete-post")
        .send({ id: secondPost.id, userId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code if post data that will be deleted is missing some fields", async () => {

      const res = await requester
        .delete("/posts/delete-post")
        .send({ id: secondPost.id });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
    });
  });
});
