const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app.js");
const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe("app", () => {
  describe("/api", () => {
    describe("/categories", () => {
      describe("GET: /api/categories", () => {
        test("200: responds with array of category objects", () => {
          return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body: { categories } }) => {
              expect(categories).toHaveLength(4);

              categories.forEach((category) => {
                expect(category).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  })
                );
              });
            });
        });
      });
    });
    describe("/reviews", () => {
      describe("/:review_id", () => {
        describe("GET: /api/reviews/:review_id", () => {
          test("200: responds with a review object that has given review id", () => {
            return request(app)
              .get("/api/reviews/2")
              .expect(200)
              .then(({ body: { review } }) => {
                expect(review).toEqual(
                  expect.objectContaining({
                    review_id: 2,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String),
                  })
                );
                expect(review).toEqual({
                  review_id: 2,
                  title: "Jenga",
                  designer: "Leslie Scott",
                  owner: "philippaclaire9",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Fiddly fun for all the family",
                  category: "dexterity",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 5,
                });
              });
          });
          test("400: responds with error when passed an invalid id", () => {
            return request(app)
              .get("/api/reviews/notAnId")
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe("Bad request");
              });
          });
          test("404: responds with error when passed id that does not exist", () => {
            return request(app)
              .get("/api/reviews/100")
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe("No review found with review id: 100");
              });
          });
        });
      });
    });
    describe("Universal Error Handling", () => {
      test("404: responds with error when passed a route that does not exist", () => {
        return request(app)
          .get("/api/badroute")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid route");
          });
      });
    });
  });
});