import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("PUT /users/update-post", () => {
  let user, post, requester;

  before(async () => {
    user = await userModel.create({
      firstName: "Tareq",
      lastName: "Zeadeh",
      email: "Tareq@email.com",
      role: "admin",
    });

    post = await postModel.create({
      userId: user.id,
      body: "Hi all",
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

  describe("PUT /posts/update-post", async () => {
      
    it("should PUT (update) a post in database", async () => {
      const res = await requester
        .put("/posts/update-post")
        .send({ id: 1, userId: user.id, body: "Hi all,i'm new here" });

      res.body.should.be.a("object");
      res.body.should.have.property("id", post.id);
      res.body.should.have.property("userId", user.id);
      res.body.should.have.property("body", "Hi all,i'm new here");
    });
  });

  describe("PUT /posts/update-post", async () => {

    it("should return 404 code if updated post data has some missing fields (body)", async () => {
      const res = await requester
        .put("/posts/update-post")
        .send({ id: post.id, userId: user.id });

      res.should.have.status(404);
      res.body.message.should.equal("Something went wrong");
    });

    it("should return 404 code if the user id is not found in the database", async () => {
      const res = await requester
        .put("/posts/update-post")
        .send({ id: post.id, userId: 2, body: "Hi all, i'm new here" });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code if the post id is not found in the database", async () => {
      const res = await requester
        .put("/posts/update-post")
        .send({ id: 2, userId: user.id, body: "Hi all,i'm new here" });

      res.should.have.status(404);
      res.body.message.should.equal("Post Not Found");
    });
  });
});
