import { Request, Response, NextFunction } from "express";
import { adController } from "../controllers/adController";
import * as multer from "multer";

// multer configuration
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

var upload = multer({
  storage
});

export class Routes {
  public adController: adController = new adController();

  public routes(app): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "GET request successfulll!!!!"
      });
    });

    // Ad

    app
      .route("/ads")
      .get((req: Request, res: Response, next: NextFunction) => {
        // middleware

        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      }, this.adController.getAds)

      // POST endpoint

      .post(upload.single("file"), this.adController.addNewAd);

    // Image endpoint

    app
      .route("/ads/images")
      .post(upload.single("file"), this.adController.addNewImage)
      .get((req: Request, res: Response) => {
        res.send({ message: "Imaes route is Working" });
      });

    // Ad detail

    app
      .route("/ads/:adId")
      // get specific Ad

      .get(this.adController.getAdWithID)
      .put(this.adController.updateAd)
      .delete(this.adController.deleteAd);
  }
}