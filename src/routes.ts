import controller from "./controller";
import middleware from "./middleware";
import { Express, Request, Response } from "express";

function routes(app: Express) {
  /************* GET Routes (READ)******************/
  app.get("/find/one", middleware.authentication, controller.find.findOne);
  // Users
  app.get(
    "/users/find/one",
    middleware.authentication,
    controller.find.findOneUser
  );

  app.get("/find/many", middleware.authentication, controller.find.findMany);
  /************* POST Routes (CREATE)******************/
  app.post(
    "/create/one",
    middleware.limiter,
    middleware.authentication,
    controller.create.createOne
  );
  app.post(
    "/create/many",
    middleware.authentication,
    controller.create.createMany
  );
  /************* PUT Routes (UPDATE)******************/
  app.put(
    "/update/one",
    middleware.authentication,
    controller.update.updateOne
  );
  app.put(
    "/update/many",
    middleware.authentication,
    controller.update.updateMany
  );
  /************* DELETE Routes (REMOVE)******************/

  app.delete(
    "/remove/one",
    middleware.authentication,
    controller.remove.removeOne
  );
  app.delete(
    "/remove/many",
    middleware.authentication,
    controller.remove.removeMany
  );

  /********************** Special Routes *************************/
  app.post("/login", middleware.limiter, controller.find.login);
  app.post("/client/login", controller.find.clientLogin);

  app.post("/join", controller.find.join);

  app.get(
    "/healthcheck",

    (req: Request, res: Response) => res.sendStatus(200)
  );

  app.get("/authcheck", middleware.authentication, (req: any, res: Response) =>
    res.json({ message: "Authenticated" })
  );

  /************* Pins Routes******************/

  app.post(
    "/pins/create/one",
    middleware.authentication,
    controller.create.createPin
  );
  app.put(
    "/pins/update/one",
    middleware.authentication,
    controller.update.updatePin
  );
  app.get(
    "/pins/find/many",
    middleware.authentication,
    controller.find.findPins
  );

  app.get("/pins/find/one", middleware.authentication, controller.find.findPin);
  app.delete(
    "/pins/slides/delete/one",
    middleware.authentication,
    controller.remove.removeSlide
  );
}
export default routes;
