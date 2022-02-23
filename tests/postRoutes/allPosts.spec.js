import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";
import { truncate } from "../helpers/truncate";
import { userModel } from "../../dataAccess/models/userModel";
import { postModel } from "../../dataAccess/models/postModel";

chai.use(chaiHttp);
chai.should();

describe("GET /users", () => {
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
        body: 'Hi, Im new here'
    });
    secondPost = await postModel.create({
        userId: user.id,
        body: 'Hallo all'
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


  describe('GET /posts', async ()=>{
      it('should GET all posts in database',async ()=>{
          const res = await requester.get('/posts');

          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.equal(2);
          res.body[1].should.be.a("object");
          res.body[1].userId.should.equal(user.id);
          res.body[1].id.should.equal(1);
          res.body[1].body.should.equal(firstPost.body);

      })    
  })
  describe('GET /posts', async ()=>{
    it('should NOT GET posts in database (wrong url)',async ()=>{
        const res = await requester.get('/post');

        res.should.have.status(404);
    
    })    
})
});
