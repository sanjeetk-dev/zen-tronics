import app from "./app.js";
import { config } from "./config/dotenv.js";
import {connectDB} from './db/index.js'

connectDB()
.then(()=>{
  app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
})
.catch((err) =>{
  console.error("ERROR: " ,err)
})