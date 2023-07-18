import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profit from "./component/profit/Profit";
import Interest from "./component/profit/Interest";
import React from "react";
import Liquidation from "./component/profit/Liquidation";
import Foresee from "./component/profit/Foresee";
import Navbars from "./component/navbar/Navbars";
import InfoStore from "./component/profit/InfoStore";
import EmployeeList from "./component/employee/ListEmployee";
import {CreateEmployee} from "./component/employee/CreateEmployee";

function App() {
    return (
        <>
            <div align="center" id="header">
                <h1>Header</h1>
            </div>
            <Routes>
                <Route path={""} element={<Navbars/>}>
                    <Route path={"/info-store"} element={<InfoStore/>}>
                        <Route path={"/info-store/profit"} element={<Profit/>}>
                            <Route path="/info-store/profit" element={<Interest/>}/>
                            <Route path="/info-store/profit/interest" element={<Interest/>}/>
                            <Route path="/info-store/profit/liquidation" element={<Liquidation/>}/>
                            <Route path="/info-store/profit/foresee" element={<Foresee/>}/>
                        </Route>
                        {/*   Đây là component về thông tin cửa hàng
                     Mọi người muốn truyền tới component của mình thì có thể làm theo mẫu
                        <Route path={"/url"} element={<Component/>}/>
                    */}
                    </Route>
                    <Route path="/api/employee" element={<EmployeeList />} />
                    <Route path="/api/employee/create-employee" element={<CreateEmployee />} />
                    {/*    Đây là các component khác trên thanh navbar
                    <Route path={"/url các navbar"} element={<Component/>}>
                */}
                    <Route path="/employee-manager" />
                </Route>
            </Routes>
            {/*<div align="center" id="footer">*/}
            {/*    <h1>Footer</h1>*/}
            {/*</div>*/}
        </>
    );
}

export default App;
