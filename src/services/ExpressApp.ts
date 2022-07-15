
import express, {Application} from "express";
import {
  AdminRoute,
  VandorRoute,
  ShoppingRoute,
  CustomerRoute,
} from "../routes";
import path from "path";




export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
   // app.use("images", express.static(path.join(__dirname, "images")));
    app.use("images", express.static(path.join(__dirname, "../images")));

    app.use("/admin", AdminRoute);
    app.use("/vandor", VandorRoute);
    app.use(ShoppingRoute);
    app.use("/customer", CustomerRoute);
 return app;
}

