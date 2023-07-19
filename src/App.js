
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profit from "./component/profit/Profit";
import Interest from "./component/profit/Interest";
import React from "react";
import Liquidation from "./component/profit/Liquidation";
import Foresee from "./component/profit/Foresee";
import Navbars from "./component/navbar/Navbars";
import InfoStore from "./component/profit/InfoStore";
import EmployeeList from "./component/employee/ListEmployee";
import { CreateEmployee } from "./component/employee/CreateEmployee";
import CustomerList from "./component/customer/CustomerList";
import { LoginHome } from "./component/account/LoginHome";
import { LoginForm } from "./component/account/LoginForm";
import { ForgotPassword } from "./component/account/ForgotPassword";
import { ConfirmCode } from "./component/account/ConfirmCode";
import { NewPassword } from "./component/account/NewPassword";

function App() {
  return (
    <>
      <div align="center" id="header">
        <h1>Header</h1>
      </div>
      <Routes>
        <Route path='/loginHome' element={<LoginHome />} />
        <Route path={"/login"} element={<LoginHome />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/forgot" element={<ForgotPassword />} />
          <Route path="/login/confirmCode" element={<ConfirmCode />} />
          <Route path="/login/newPassword" element={<NewPassword />} />
        </Route>
        <Route path={""} element={<Navbars />}>
          <Route path={"/info-store"} element={<InfoStore/>}>
            <Route path={"/info-store/profit"} element={<Profit />}>
              <Route path="/info-store/profit/:type" element={<Interest />} />
              <Route path="/info-store/profit/:type" element={<Liquidation />} />
              <Route path="/info-store/profit/:type" element={<Foresee />} />
            </Route>
            <Route path={"/info-store/transaction-history"} element={<TransactionHistoryList />}>
            </Route>
            <Route path={"/info-store/transaction-history/detail/:id"} element={<TransactionHistoryDetail />}></Route>

            {/*   Đây là component về thông tin cửa hàng
                     Mọi người muốn truyền tới component của mình thì có thể làm theo mẫu
                        <Route path={"/url"} element={<Component/>}/>
                    */}
          </Route>
          <Route path="/api/employee" element={<EmployeeList />} />
          <Route path="/api/employee/create-employee" element={<CreateEmployee />} />
          <Route path={"/contract/create-contract"} element={<CreateContracts/>}></Route>
          {/*    Đây là các component khác trên thanh navbar
                    <Route path={"/url các navbar"} element={<Component/>}>
                */}
        </Route>
      </Routes>
      {/*<div align="center" id="footer">*/}
      {/*    <h1>Footer</h1>*/}
      {/*</div>*/}
    </>
  );
}

export default App;
