import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { dbConnection } from "./db.js";
//router
import { userRouter } from "./routes/user.routes.js";
import { patientRouter } from "./routes/patient.routes.js";
import { clinicRouter } from "./routes/clinic.routes.js";
import { doctorRouter } from "./routes/on-boarding.routes.js";
import { accountsManagementRouter } from "./routes/account-management/medi-store.routes.js";
import { purchaseBillRouter } from "./routes/purchase-bill-creation.routes.js";
import { salesBillRouter} from "./routes/sale-bill-creation.routes.js";
import {productBrandRouter} from "./routes/product-brands.routes.js";
import {supplierRouter} from "./routes/supplier.routes.js";
import { countersRouter } from "./routes/counters.routes.js";
// authentication
import {isAuthenticated} from "./controllers/auth.js";
import { isDoctorAuthenticated} from "./controllers/doctorAuth.js";
// configuring env 
dotenv.config(); 

const app = express();
const PORT = process.env.PORT;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// middleware
app.use(express.json());
app.use(cors());
// db connection
dbConnection();

//routes

app.use("/users", userRouter);
app.use("/on-boarding", doctorRouter);
app.use("/account-management",isDoctorAuthenticated,accountsManagementRouter);
app.use("/clinics",isAuthenticated, clinicRouter);
app.use("/patients",isDoctorAuthenticated, patientRouter);
app.use("/purchase-invoice",isDoctorAuthenticated, purchaseBillRouter);
app.use("/sale-invoice",isDoctorAuthenticated, salesBillRouter);
app.use("/supplier",isDoctorAuthenticated,supplierRouter);
app.use("/product-brands",isDoctorAuthenticated,productBrandRouter);
app.use("/counters",isDoctorAuthenticated,countersRouter);

if(process.env.NODE_ENV == 'production'){
    app.use(express.static(path.join('..','hopevet-angular','dist','billing-software')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve('..','hopevet-angular','dist','billing-software','index.html'))
    })
}

//server connection
app.listen(PORT, ()=>console.log(`server running in port ${PORT}`))

