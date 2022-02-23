import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("DELETE /posts/delete-all-posts", () => {
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

  describe("DELETE /posts/delete-all-posts", async () => {
    it("should DELETE all posts for userId (1)", async () => {
      const res = await requester
        .delete("/posts/delete-all-posts")
        .send({ userId: user.id });

      res.should.have.status(200);
      res.body.message.should.equal("All posts successfully deleted");
    });
  });

  describe("DELETE /posts/delete-all-posts", async () => {

    it("should return 404 code if the user is not found in the database", async () => {
      const res = await requester
        .delete("/posts/delete-all-posts")
        .send({ userId: 2 });

      res.should.have.status(404);
      res.body.message.should.equal("User Not Found");
    });

    it("should return 404 code if the user do not have posts", async () => {
      await truncate(postModel);

      const res = await requester
        .delete("/posts/delete-all-posts")
        .send({ userId: user.id });

      res.should.have.status(404);
      res.body.message.should.equal("The User Dont Have Any Post Yet");
    });
  });
});
