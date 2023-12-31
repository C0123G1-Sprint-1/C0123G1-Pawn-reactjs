import {ChartComponent} from "./Chart";
import {NavLink, useParams} from "react-router-dom"
import {Chart} from "chart.js/auto"
import React, {useEffect, useState} from "react";
import {Outlet} from "react-router";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as ProfitService from "../../service/ProfitService"
import "../../css/interest.css"
import ExportExcelButton from "./ExportExcelButton";
import * as yup from "yup"

export default function Profit() {
    const [contracts, setContract] = useState()
    const [profitType, setProfitType] = useState("interest");
    const [isActives, setIsActive] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalProfit, setTotalProfit] = useState(0);
    const [yearCurrent, setYearCurrent] = useState(" (2023) ");
    const [months, setMonths] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const params = useParams();
    const [dataProfit, setDataProfit] = useState();
    const [dateTimeProfit, setDateTimeProfit] = useState({
        startMonth: "",
        endMonth: "",
        years: ""
    })
    const [currentPage, setCurrentPage] = useState(0);
    const [statisticsStatus, setStatisticsStatus] = useState(true);

    const getContractByPage = async (startMonth, endMonth, years, page, profitType) => {
        await getContract(dateTimeProfit.startMonth, dateTimeProfit.endMonth, dateTimeProfit.years, page, params.profitType || profitType)
        setCurrentPage(page);
    }
    const pagination = () => {
        const page = [];
        for (let i = 0; i < totalPage; i++) {
            const isCurrentPage = currentPage === i;
            const pageLinkClassName = isCurrentPage ? 'page-link-active' : 'page-link-khanh';
            page.push(
                <li className="page-item" key={i}>
                    <button className={pageLinkClassName}
                            style={{border: "1px solid gray", borderRadius: "5px"}}
                            onClick={() => getContractByPage(dateTimeProfit.startMonth, dateTimeProfit.endMonth, dateTimeProfit.years, i, params.profitType || profitType)}>
                        {i + 1}
                    </button>
                </li>
            )
        }
        return page;
    }
    const getProfit = async (startMonth, endMonth, years, profitType) => {
        const res = await ProfitService.getProfit(startMonth, endMonth, years, profitType)
        if (res === null) {
            setTotalProfit(0)
        } else {
            setTotalProfit(res.data)

        }
    }

    const getDataProfit = async (startMonth, endMonth, years, profitType) => {
        const res = await ProfitService.getDataChart(startMonth, endMonth, years, profitType)
        if (res === null) {
            setDataProfit([{
                month: null,
                profit: null
            }])
        } else {
            setDataProfit(res.data)
        }
    }
    const getContract = async (startMonth, endMonth, years, page, profitType) => {
        const res = await ProfitService.getAllContract(startMonth, endMonth, years, page, profitType)
        if (res === null) {
            setTotalPage(null)
            setContract(null)
        } else {
            setTotalPage(res.data.totalPages)
            setContract(res.data.content)
        }
    }
    const setProfit = async (profitType) => {
        await setCancel()
        await setProfitType(() => profitType)
    }
    const setStartMonth = async (event) => {
        await setDateTimeProfit({
            ...dateTimeProfit,
            startMonth: event.target.value
        })
    }
    const setEndMonth = async (event) => {
        await setDateTimeProfit({
            ...dateTimeProfit,
            endMonth: event.target.value
        })
    }
    const setYears = async (event) => {
        await setDateTimeProfit({
            ...dateTimeProfit,
            years: event.target.value
        })
    }
    const setCancel = async () => {
        await setStatisticsStatus(!statisticsStatus)
        await setDateTimeProfit({
            startMonth: "",
            endMonth: "",
            years: ""
        })
        await setYearCurrent(" (2023) ")
    }
    useEffect(() => {
        document.title = "Thống kê lợi nhuận";
        const fectData = async () => {
            await setCurrentPage(0);
            await getContract("", "", "2023", 0, params.profitType || profitType)
            await getDataProfit("", "", "2023", params.profitType || profitType)
            await getProfit("", "", "2023", params.profitType || profitType)
        }
        fectData()
    }, [profitType, statisticsStatus])
    if (!dataProfit || !contracts && contracts !== null) {
        return null;
    }
    return (
        <>
            <div className="col-md-12 col-lg-9 content-profit">
                <div className="row ">
                    <div className=" col-lg-12 " align="center">
                        <ul className="d-flex nav-content justify-content-center p-0">
                            <li className="col-4"><NavLink onClick={() => {
                                setProfit("interest")
                            }}
                                                           style={({isActive}) => {
                                                               return {
                                                                   backgroundColor: isActive || isActives === true ? "#27533e" : "",
                                                                   color: isActive ? "#fff" : "",
                                                                   width: "100%",
                                                                   height: "4.2vh",
                                                                   display: "flex",
                                                                   alignItems: "center",
                                                                   justifyContent: "center",
                                                               }
                                                           }} to="/nav/info-store/profit/interest/interest"
                                                           className="btn btn-sm rounded-3  ">Lợi nhuận từ tiền
                                lãi</NavLink></li>
                            <li className="col-4"><NavLink onClick={() => {
                                setProfit("liquidation")
                                setIsActive(false)
                            }}
                                                           style={({isActive}) => {
                                                               return {
                                                                   backgroundColor: isActive ? "#27533e" : "",
                                                                   color: isActive ? "#fff" : "",
                                                                   width: "95%",
                                                                   height: "4.2vh",
                                                                   display: "flex",
                                                                   alignItems: "center",
                                                                   justifyContent: "center",
                                                               }
                                                           }} to="/nav/info-store/profit/liquidation/liquidation"
                                                           className="btn btn-sm rounded-3  ">Lợi nhuận từ thanh
                                lý</NavLink>
                            </li>
                            <li className="col-4"><NavLink onClick={() => {
                                setProfit("foresee")
                                setIsActive(false)
                            }} style={({isActive}) => {
                                return {
                                    backgroundColor: isActive ? "#27533e" : "",
                                    color: isActive ? "#fff" : "",
                                    width: "100%",
                                    height: "4.2vh",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }
                            }} to="/nav/info-store/profit/foresee/foresee" className="btn btn-sm rounded-3  ">Lợi nhuận
                                dự kiến</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="row  col-lg-12 p-0">
                        <div className="p-0 pb-2">
                            <Formik
                                initialValues={{
                                    startMonth: "",
                                    endMonth: "",
                                    years: ""
                                }}
                                validationSchema={yup.object({
                                    years: yup.string().matches(/^[0-9]+$/,'Năm phải là số').matches(/^[1-9][0-9]{3,}$/,'Năm tối thiểu 4 số')
                                })}
                                onSubmit={async (values) => {
                                    if (dateTimeProfit?.startMonth === "" && dateTimeProfit?.endMonth === "" && dateTimeProfit?.years === "" || dateTimeProfit?.years === "") {
                                        await setYearCurrent(" (2023) ")
                                    } else {
                                        await setYearCurrent(" ( " + dateTimeProfit?.years + " ) ")
                                    }

                                    // await getContract(values.startMonth, values.endMonth, values.years, 0, params.profitType || profitType)
                                    // await getDataProfit(values.startMonth, values.endMonth, values.years, params.profitType || profitType)
                                    // await getProfit(values.startMonth, values.endMonth, values.years, params.profitType || profitType)
                                    // await setStartMonth(values.startMonth);
                                    // await setEndMonth(values.endMonth);
                                    // await setYears(values.years)
                                    await getContract(dateTimeProfit?.startMonth, dateTimeProfit?.endMonth, dateTimeProfit?.years, 0, params.profitType || profitType)
                                    await getDataProfit(dateTimeProfit?.startMonth, dateTimeProfit?.endMonth, dateTimeProfit?.years, params.profitType || profitType)
                                    await getProfit(dateTimeProfit?.startMonth, dateTimeProfit?.endMonth, dateTimeProfit?.years, params.profitType || profitType)
                                }}>
                                <Form className="ps-5 col-lg-12 col-md-12 col-12" style={{boxSizing: "border-box"}}>
                                    <div
                                        className="d-flex row col-lg-12 col-md-12 col-12 justify-content-between p-0 m-0"
                                        style={{
                                            height: "4.8vh"
                                        }}>
                                        <div className="col-lg-3 col-md-3 col-6 p-0">
                                            <span style={{fontWeight: "500"}}>
                                                <Field name="startMonth"
                                                       as="select"
                                                       className="form-control text-center"
                                                       onChange={(event) => setStartMonth(event)}
                                                       value={dateTimeProfit?.startMonth}
                                                >
                                                    <option value={""}>Tháng bắt đầu</option>
                                                    {
                                                        months.map((month, index) =>
                                                            <option key={index} value={month}>Tháng {month}</option>
                                                        )
                                                    }
                                                </Field>
                                            </span>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-6">
                                            <span style={{fontWeight: "500"}}>
                                                <Field name="endMonth"
                                                       as="select"
                                                       className="form-control text-center"
                                                       onChange={(event) => setEndMonth(event)}
                                                       value={dateTimeProfit?.endMonth}
                                                >
                                                    <option value={""}>Tháng kết thúc</option>
                                                    {
                                                        months.map((month, index) =>
                                                            <option key={index} value={month}>Tháng {month}</option>
                                                        )
                                                    }
                                                </Field>
                                            </span>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-6">
                                            <span style={{fontWeight: "500"}}>
                                                <Field name="years"
                                                       type="text"
                                                       className="form-control"
                                                       onChange={(event) => setYears(event)}
                                                       value={dateTimeProfit?.years}
                                                       placeholder="Vui lòng nhập năm"
                                                />
                                                <ErrorMessage name="years" component="p" style={{color: "red"}}/>
                                            </span>
                                        </div>
                                        <div className=" col-lg-3 col-md-3 col-12 p-0 d-flex justify-content-end"
                                             style={{
                                                 displayFlex: "flex",
                                                 height: "100%",
                                                 alignItems: "center"
                                             }}>
                                            <button type="submit"
                                                    className="btn btn-sm btn-outline-success col-lg-6 col-md-6 col-6"
                                                    style={{
                                                        height: "100%",
                                                        alignItems: "center",
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}>Thống kê
                                            </button>
                                            <button type="button"
                                                    onClick={() => setCancel()}
                                                    className="btn btn-sm btn-outline-secondary col-lg-6 col-md-6 col-6 ms-1"
                                                    style={{
                                                        height: "100%",
                                                        alignItems: "center",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // border: "1px solid red"
                                                    }}>
                                                Nhập lại
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                        <label className="mt-3 p-0 ms-5" style={{color: "indianred"}}>
                            <span style={{fontWeight: "500"}}>Tổng lợi nhuận :{" "}</span>
                            <input type="text" disabled value={" " +
                            totalProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " VNĐ "
                            }/>
                        </label>
                    </div>
                    <div className="container" style={{height: "45vh"}}>
                        {
                            dataProfit ?
                                <ChartComponent data={dataProfit} title={profitType} yearCurrent={yearCurrent}/>
                                : ""
                        }
                    </div>
                </div>
            </div>
            <div className=" mt-3 container col-12">
                <div align="center">
                    <h3 style={{fontFamily: "aria"}}>DANH SÁCH HỢP ĐỒNG</h3>
                </div>
                <Outlet context={contracts}/>
                {
                    contracts ?
                        <div className="d-flex  col-lg-12 justify-content-between align-items-center">
                            <div className="col-lg-2 col-md-3 col-3 pb-3">
                                {/*<ExportExcelButton data={contracts} fileName="user_data"/>*/}
                            </div>
                            <nav aria-label="...">
                                <ul className="pagination">
                                    <li className="page-item">
                                        {
                                            currentPage !== 0 ?
                                                <button className="page-link page-link-khanhh btn-outline-secondary"
                                                        style={{border: "1px solid gray", borderRadius: "5px"}}
                                                        onClick={() => getContractByPage(dateTimeProfit.startMonth, dateTimeProfit.endMonth,dateTimeProfit.years ,currentPage - 1, params.profitType || profitType)}>
                                                    Trước
                                                </button>
                                                :
                                                ""
                                        }
                                    </li>
                                    {
                                        totalPage === 1 ? "" : pagination()
                                    }
                                    <li className="page-item">
                                        {
                                            currentPage !== totalPage - 1 ?
                                                <button className="page-link page-link-khanhh btn-outline-secondary"
                                                        style={{border: "1px solid gray", borderRadius: "5px"}}
                                                        onClick={() => getContractByPage(dateTimeProfit.startMonth, dateTimeProfit.endMonth, dateTimeProfit.years,currentPage + 1, params.profitType || profitType)}>
                                                    Sau
                                                </button>
                                                :
                                                ""
                                        }
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        :
                        ""
                }
            </div>
        </>
    )
}