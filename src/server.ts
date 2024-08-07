import "dotenv/config";
import { app } from "./App";
import { run } from "./database";

import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";

const PORT = Number(process.env.PORT) ?? 3333;

run()
  .then(() => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🔥`);
    });
  })
  .catch((error) => console.log(error));
