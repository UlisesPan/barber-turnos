import { Router } from "express";

import routerUser from "./userRoutes";
import routerAppointments from "./appointmentsRoutes";
import routerCategories from "./categoriesRoutes";

const router: Router = Router();

router.use("/users", routerUser);
router.use("/appointments", routerAppointments);
router.use("/categories", routerCategories);
router.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;